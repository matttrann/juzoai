import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import { useProblemProgress } from '../contexts/ProblemProgressContext';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
const Matter = require('matter-js');

// Define TypeScript interfaces for Matter.js types
interface CollisionEvent {
  pairs: Array<{
    bodyA: Matter.Body;
    bodyB: Matter.Body;
  }>;
}

// Define custom body properties
interface CustomBodyProps {
  multiplier?: number;
  index?: number;
}

// Use type assertion approach 
type PlinkoBody = Matter.Body & CustomBodyProps;

// Physics constants - adjusted for better viewing
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 600; // Slightly reduced height
const PIN_RADIUS = 5; // Slightly smaller pins
const BALL_RADIUS = 10; // Slightly smaller ball

// Use 8 rows as default
const DEFAULT_ROWS = 8; // Reduced from 14 to 8

// Removed static MULTIPLIERS array - now generated dynamically based on risk level

// Sound effects
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

const playPinHitSound = () => {
  try {
    const context = createAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, context.currentTime);
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  } catch (e) {
    console.error('Error playing pin hit sound:', e);
  }
};

const playBinLandSound = (multiplier: number) => {
  try {
    const context = createAudioContext();
    // Higher multiplier = higher pitch sound
    const frequency = 300 + (multiplier * 200);
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.8);
  } catch (e) {
    console.error('Error playing bin land sound:', e);
  }
};

// Add these constants at the top of the file, after other constants
const XP_PER_LEVEL = 50; // Match the value from ProblemProgressContext
const MAX_XP_BOOST_PERCENTAGE = 0.8; // Maximum 80% of XP needed for a level up

const PlinkoGame: React.FC = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { level, addXp } = useProblemProgress();
  const navigate = useNavigate();
  
  // Game state
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [result, setResult] = useState<{multiplier: number, xpBoost: number} | null>(null);
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [binLandingProcessed, setBinLandingProcessed] = useState<boolean>(false);
  
  // Game settings
  const [rows, setRows] = useState<number>(DEFAULT_ROWS);
  const [betAmount] = useState<number>(10); // Fixed bet amount, removed setter
  const [riskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium'); // Fixed risk level, removed setter
  
  // Function to calculate XP boost for a given multiplier
  const calculateXpBoost = useCallback((multiplier: number): number => {
    const maxXpForNoLevelUp = Math.floor(XP_PER_LEVEL * MAX_XP_BOOST_PERCENTAGE);
    const baseXpBoost = level * 5; // Base value scales with player level
    let finalXpBoost = Math.floor(baseXpBoost * multiplier);
    
    // Only cap the actual awarded XP to prevent level-up, not the displayed values
    // This allows for variable displays but controlled rewards
    return finalXpBoost;
  }, [level]);
  
  // Apply cap only when actually awarding XP, not when displaying values
  const applyBoostCap = useCallback((xpBoost: number): number => {
    const maxXpForNoLevelUp = Math.floor(XP_PER_LEVEL * MAX_XP_BOOST_PERCENTAGE);
    return Math.min(xpBoost, maxXpForNoLevelUp);
  }, []);
  
  // Physics engine refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const pinBodiesRef = useRef<PlinkoBody[]>([]);
  const wallBodiesRef = useRef<PlinkoBody[]>([]);
  const binBodiesRef = useRef<PlinkoBody[]>([]);
  const ballsRef = useRef<PlinkoBody[]>([]);
  const activeBallsRef = useRef<Set<PlinkoBody>>(new Set());

  // Update multipliers based on risk level
  const getMultipliers = useCallback((): number[] => {
    switch (riskLevel) {
      case 'Low':
        return [0.3, 0.5, 0.8, 1.0, 1.5, 2.0, 1.5, 1.0, 0.8, 0.5, 0.3];
      case 'High':
        return [0.2, 0.3, 0.5, 0.8, 1.5, 10.0, 1.5, 0.8, 0.5, 0.3, 0.2];
      case 'Medium':
      default:
        return [0.2, 0.4, 0.6, 1.0, 1.5, 3.0, 1.5, 1.0, 0.6, 0.4, 0.2];
    }
  }, [riskLevel]);

  const MULTIPLIERS = useMemo(() => getMultipliers(), [getMultipliers]);

  // Function to get color based on multiplier value
  const getMultiplierColor = useCallback((multiplier: number): string => {
    // Find min and max multipliers in current set
    const minMultiplier = Math.min(...MULTIPLIERS);
    const maxMultiplier = Math.max(...MULTIPLIERS);
    
    // Normalize the multiplier value on a 0-1 scale
    const normalizedValue = (multiplier - minMultiplier) / (maxMultiplier - minMultiplier);
    
    if (multiplier >= 3) return '#90caf9'; // Highest - Deep blue
    if (multiplier >= 1.5) return '#90caf9'; // High - Medium blue
    if (multiplier >= 1.0) return '#90caf9'; // Medium - Blue
    if (multiplier >= 0.5) return '#90caf9'; // Low-medium - Light blue
    return '#90caf9'; // Low - Lighter blue
  }, [theme, MULTIPLIERS]);
  
  // Clean up physics engine
  const cleanupPhysics = useCallback(() => {
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (renderRef.current) Matter.Render.stop(renderRef.current);
    
    // Clear references
    engineRef.current = null;
    renderRef.current = null;
    runnerRef.current = null;
    worldRef.current = null;
    pinBodiesRef.current = [];
    wallBodiesRef.current = [];
    binBodiesRef.current = [];
    ballsRef.current = [];
    activeBallsRef.current.clear();
  }, []);
  
  // Initialize physics engine
  const initPhysics = useCallback(() => {
    if (!canvasRef.current) {
      console.error('Canvas ref is not available in initPhysics');
      return;
    }
    
    console.log('Initializing physics engine');
    
    // Clean up any existing physics engine
    cleanupPhysics();
    
    try {
      // Create engine with proper gravity
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 0.3 }, // Lower gravity for slower ball motion
        enableSleeping: false,
      });
      
      engineRef.current = engine;
      
      // Create renderer with proper settings
      const render = Matter.Render.create({
        canvas: canvasRef.current,
        engine: engine,
        options: {
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          wireframes: false,
          background: 'transparent',
          pixelRatio: window.devicePixelRatio || 1,
        }
      });
      
      renderRef.current = render;
      
      // Create world
      const world = engine.world;
      worldRef.current = world;
      
      // Pin arrangement in a proper pyramid pattern
      const pins: PlinkoBody[] = [];
      const pinSpacing = BOARD_WIDTH / (Math.max(rows, 8) + 2);
      
      // Start with three pins at top row (row 0 is not rendered)
      for (let row = 0; row < rows; row++) {
        // Start with 3 pins in the first visible row (row 2 in the array)
        const pinsInRow = row + 3;
        
        // Calculate the starting X position to center the pins
        const startX = (BOARD_WIDTH - (pinsInRow - 1) * pinSpacing) / 2;
        
        // Create pins for this row
        for (let pin = 0; pin < pinsInRow; pin++) {
          const pinX = startX + pin * pinSpacing;
          const pinY = 80 + row * pinSpacing;
          
          const pinBody = Matter.Bodies.circle(pinX, pinY, PIN_RADIUS, {
            isStatic: true,
            restitution: 0.5,
            friction: 0.05,
            render: {
              fillStyle: theme.palette.mode === 'dark' ? '#90caf9' : '#90caf9',
              strokeStyle: theme.palette.mode === 'dark' ? '#90caf9' : '#90caf9',
              lineWidth: 1,
            },
            label: 'pin',
          });
          
          pins.push(pinBody as PlinkoBody);
        }
      }
      
      pinBodiesRef.current = pins;
      
      // Walls - made thinner and less visible
      const wallThickness = 10;
      const leftWall = Matter.Bodies.rectangle(
        -wallThickness/2, 
        BOARD_HEIGHT/2, 
        wallThickness, 
        BOARD_HEIGHT, 
        { 
          isStatic: true,
          render: { fillStyle: 'transparent' },
          label: 'wall',
        }
      );
      
      const rightWall = Matter.Bodies.rectangle(
        BOARD_WIDTH + wallThickness/2, 
        BOARD_HEIGHT/2, 
        wallThickness, 
        BOARD_HEIGHT, 
        { 
          isStatic: true,
          render: { fillStyle: 'transparent' },
          label: 'wall',
        }
      );
      
      const ground = Matter.Bodies.rectangle(
        BOARD_WIDTH/2, 
        BOARD_HEIGHT + wallThickness/2, 
        BOARD_WIDTH, 
        wallThickness, 
        { 
          isStatic: true,
          render: { fillStyle: 'transparent' },
          label: 'ground',
        }
      );
      
      wallBodiesRef.current = [leftWall, rightWall, ground] as PlinkoBody[];
      
      // Create bins at the bottom - sized to match multiplier count
      const bins: PlinkoBody[] = [];
      const numBins = MULTIPLIERS.length;
      const binWidth = BOARD_WIDTH / numBins;
      const binHeight = 40; // Smaller, more square-like bins
      const binY = BOARD_HEIGHT - binHeight/2; // Center of the bin rectangle
      
      for (let i = 0; i < numBins; i++) {
        const binX = i * binWidth + binWidth/2; // Center of the bin rectangle
        // Use a consistent blue color
        const binColor = '#90caf9'; 
        
        // Create a rectangle with rounded corners using chamfer
        const bin = Matter.Bodies.rectangle(binX, binY, binWidth - 4, binHeight, {
          isStatic: true,
          isSensor: true,
          chamfer: { radius: 8 }, // Add rounded corners
          render: {
            fillStyle: binColor,
            strokeStyle: 'rgba(0, 0, 0, 0.3)',
            lineWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          label: `bin-${i}`,
        });
        
        // Add custom properties after creation
        (bin as PlinkoBody).multiplier = MULTIPLIERS[i];
        (bin as PlinkoBody).index = i;
        
        bins.push(bin as PlinkoBody);
      }
      
      binBodiesRef.current = bins;
      
      // Add collision event listener
      Matter.Events.on(engine, 'collisionStart', (event: CollisionEvent) => {
        const pairs = event.pairs;
        
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          
          // Play sound when ball hits pin
          if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'pin') ||
              (pair.bodyB.label === 'ball' && pair.bodyA.label === 'pin')) {
            playPinHitSound();
          }
          
          // Determine which body is the ball and which is the bin
          let ballBody: Matter.Body | null = null;
          let binBody: PlinkoBody | null = null;
          
          if (pair.bodyA.label === 'ball') {
            ballBody = pair.bodyA;
            if (pair.bodyB.label?.startsWith('bin-')) {
              binBody = pair.bodyB as PlinkoBody;
            }
          } else if (pair.bodyB.label === 'ball') {
            ballBody = pair.bodyB;
            if (pair.bodyA.label?.startsWith('bin-')) {
              binBody = pair.bodyA as PlinkoBody;
            }
          }
          
          // If we found a ball and bin collision
          if (ballBody && binBody && !binLandingProcessed) {
            // Only process if this ball is active and at the bottom of the board
            if (activeBallsRef.current.has(ballBody as PlinkoBody) && 
                ballBody.position.y > BOARD_HEIGHT - binHeight - BALL_RADIUS) {
              // Mark bin landing as processed to prevent multiple hits
              setBinLandingProcessed(true);
              
              // Remove from active balls to prevent multiple bin hits
              activeBallsRef.current.delete(ballBody as PlinkoBody);
              
              // Get the multiplier for this bin
              const multiplier = binBody.multiplier || 1;
              
              // Calculate the XP boost 
              const xpBoost = calculateXpBoost(multiplier);
              
              // Play bin landing sound
              playBinLandSound(multiplier);

              // Animate the bin - move it down and then back up
              const binOriginalPosition = { ...binBody.position };
              let animationStep = 0;
              const totalSteps = 15; // Total steps for down and up animation
              
              const animateBin = () => {
                if (binBody === null) return;
                
                if (animationStep < totalSteps / 2) {
                  // Moving down
                  Matter.Body.setPosition(binBody, {
                    x: binBody.position.x,
                    y: binOriginalPosition.y + (animationStep * 1.5)
                  });
                } else if (animationStep < totalSteps) {
                  // Moving back up
                  Matter.Body.setPosition(binBody, {
                    x: binBody.position.x,
                    y: binOriginalPosition.y + ((totalSteps - animationStep) * 1.5)
                  });
                } else {
                  // Reset to original position
                  Matter.Body.setPosition(binBody, binOriginalPosition);
                  return; // End animation
                }
                
                animationStep++;
                setTimeout(animateBin, 20);
              };
              
              // Start bin animation
              animateBin();
              
              // Create result object
              const resultObj = {
                multiplier,
                xpBoost: xpBoost // Keep this uncapped for display
              };
              
              // Make the ball slowly disappear into the bin
              const shrinkBall = () => {
                // Get the current radius
                if (ballBody === null) return;
                
                const currentRadius = (ballBody as any).circleRadius;
                
                if (currentRadius > 1) {
                  // Shrink the ball by scaling it down
                  const scale = 0.9; // 10% smaller each time
                  Matter.Body.scale(ballBody, scale, scale);
                  
                  // Also move it down slightly to create a "sinking" effect
                  const currentY = ballBody.position.y;
                  Matter.Body.setPosition(ballBody, { 
                    x: ballBody.position.x, 
                    y: currentY + 0.5 
                  });
                  
                  // Continue shrinking
                  setTimeout(shrinkBall, 50);
                } else {
                  // Remove the ball when it's small enough
                  if (worldRef.current) {
                    Matter.World.remove(worldRef.current, ballBody);
                  }
                  
                  // Update result and end game
                  setTimeout(() => {
                    setResult(resultObj);
                    setGameState('ended');
                    
                    // Add the XP
                    addXp(applyBoostCap(xpBoost), getRiskAsDifficulty(riskLevel));
                    
                    // Player can't play again until next level
                    setCanPlay(false);
                    localStorage.setItem('lastPlinkoLevel', level.toString());
                  }, 200);
                }
              };
              
              // Start the shrinking animation after bin animation has moved down
              // This creates the effect of the bin "swallowing" the ball
              setTimeout(shrinkBall, 150);
            }
          }
        }
      });
      
      // Add all bodies to the world
      Matter.World.add(world, [...pins, ...bins, ...wallBodiesRef.current] as Matter.Body[]);
      
      // Start the renderer and runner
      Matter.Render.run(render);
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
      runnerRef.current = runner;
      
      // Use afterRender event to ensure multiplier text is drawn on every frame
      Matter.Events.on(render, 'afterRender', () => {
        if (renderRef.current?.canvas?.getContext) {
          const ctx = renderRef.current.canvas.getContext('2d');
          if (ctx) {
            MULTIPLIERS.forEach((mult, i) => {
              const binWidth = BOARD_WIDTH / MULTIPLIERS.length;
              const binX = i * binWidth + binWidth/2;
              const binY = BOARD_HEIGHT - binHeight/2;
              
              // Calculate the XP boost to display
              const xpBoost = calculateXpBoost(mult);
              
              // Save context state
              ctx.save();
              
              // Draw XP text with high contrast
              ctx.font = 'bold 16px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Text shadow for depth
              ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
              ctx.shadowBlur = 3;
              ctx.shadowOffsetX = 1;
              ctx.shadowOffsetY = 1;
              
              // White text with black outline for maximum visibility
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 3;
              ctx.strokeText(`+${xpBoost}`, binX, binY);
              
              // Remove shadow for the fill to make it crisp
              ctx.shadowColor = 'transparent';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(`+${xpBoost}`, binX, binY);
              
              // Restore context state
              ctx.restore();
            });
          }
        }
      });
      
      console.log('Physics engine initialized successfully');
      
    } catch (error) {
      console.error('Error initializing physics engine:', error);
      renderFallbackGame();
    }
  }, [theme, getMultiplierColor, level, addXp, rows, MULTIPLIERS, riskLevel, calculateXpBoost, applyBoostCap]);
  
  // Fallback visualization
  const renderFallbackGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    console.log('Rendering fallback game visualization');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Use transparent background
    // No background fill - leave transparent
    
    // Draw pins in pyramid pattern
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#90caf9' : '#90caf9';
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#90caf9' : '#90caf9';
    ctx.lineWidth = 1;
    
    const pinSpacing = BOARD_WIDTH / (Math.max(rows, 8) + 2);
    
    // Create pyramid pattern - starting with 3 pins
    for (let row = 0; row < rows; row++) {
      // Start with 3 pins in first row
      const pinsInRow = row + 3;
      
      // Calculate the starting X position to center the pins
      const startX = (BOARD_WIDTH - (pinsInRow - 1) * pinSpacing) / 2;
      
      for (let pin = 0; pin < pinsInRow; pin++) {
        const pinX = startX + pin * pinSpacing;
        const pinY = 80 + row * pinSpacing;
        
        ctx.beginPath();
        ctx.arc(pinX, pinY, PIN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    
    // Draw bins with rounded corners
    const numBins = MULTIPLIERS.length;
    const binWidth = BOARD_WIDTH / numBins;
    const binHeight = 40; // Smaller, more square-like bins
    const binY = BOARD_HEIGHT - binHeight;
    
    for (let i = 0; i < numBins; i++) {
      const binX = i * binWidth;
      const binColor = '#90caf9'; // Consistent blue color
      const cornerRadius = 8;
      
      // Calculate the XP boost to display
      const xpBoost = calculateXpBoost(MULTIPLIERS[i]);
      
      // Save the current context state
      ctx.save();
      
      // Create shadow for depth effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Set the bin fill color
      ctx.fillStyle = binColor;
      
      // Draw rounded rectangle for the bin
      ctx.beginPath();
      ctx.moveTo(binX + cornerRadius, binY);
      ctx.lineTo(binX + binWidth - cornerRadius, binY);
      ctx.quadraticCurveTo(binX + binWidth, binY, binX + binWidth, binY + cornerRadius);
      ctx.lineTo(binX + binWidth, binY + binHeight - cornerRadius);
      ctx.quadraticCurveTo(binX + binWidth, binY + binHeight, binX + binWidth - cornerRadius, binY + binHeight);
      ctx.lineTo(binX + cornerRadius, binY + binHeight);
      ctx.quadraticCurveTo(binX, binY + binHeight, binX, binY + binHeight - cornerRadius);
      ctx.lineTo(binX, binY + cornerRadius);
      ctx.quadraticCurveTo(binX, binY, binX + cornerRadius, binY);
      ctx.closePath();
      ctx.fill();
      
      // Add border
      ctx.shadowColor = 'transparent'; // Remove shadow for the stroke
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add XP text directly on the bin
      const centerX = binX + binWidth / 2;
      const centerY = binY + binHeight / 2;
      
      // Draw text with high visibility
      ctx.shadowColor = 'transparent'; // Remove shadow for text
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`+${xpBoost}`, centerX, centerY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`+${xpBoost}`, centerX, centerY);
      
      // Restore the context state
      ctx.restore();
    }
  }, [theme, getMultiplierColor, rows, MULTIPLIERS, level, calculateXpBoost]);
  
  // Map risk level to difficulty for addXp function
  const getRiskAsDifficulty = useCallback((risk: 'Low' | 'Medium' | 'High'): 'Easy' | 'Medium' | 'Hard' => {
    switch (risk) {
      case 'Low': return 'Easy';
      case 'High': return 'Hard';
      case 'Medium':
      default: return 'Medium';
    }
  }, []);
  
  // Initialize on component mount
  useEffect(() => {
    // Check if user can play Plinko (only once per level)
    const lastPlayedLevel = localStorage.getItem('lastPlinkoLevel');
    if (lastPlayedLevel && parseInt(lastPlayedLevel) === level) {
      setCanPlay(false);
    } else {
      setCanPlay(true);
    }
    
    // Fix rows at 8
    setRows(8);
    
    // Render the game board
    if (canvasRef.current) {
      // Try to initialize physics engine
      try {
        initPhysics();
        
        // If Matter.js fails, fall back to canvas rendering
        setTimeout(() => {
          if (!renderRef.current || !worldRef.current) {
            console.warn('Matter.js renderer not created or failed, using fallback');
            renderFallbackGame();
          }
        }, 500);
      } catch (error) {
        console.error('Error initializing physics:', error);
        renderFallbackGame();
      }
    }
    
    // Clean up on unmount
    return () => {
      cleanupPhysics();
    };
  }, [initPhysics, cleanupPhysics, renderFallbackGame, level]);
  
  // Drop ball function - update to match reference site behavior
  const dropBall = useCallback(() => {
    if (gameState !== 'ready' || !canPlay) return;
    
    // Reset bin landing processed flag
    setBinLandingProcessed(false);
    
    if (!worldRef.current) {
      console.warn('World ref not available, using fallback drop');
      
      // Fallback drop animation using canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          setGameState('playing');
          
          // Draw a ball and animate it falling
          const ball = {
            x: BOARD_WIDTH / 2 + (Math.random() * 6 - 3), // Reduced randomness
            y: 40, // Start higher
            radius: BALL_RADIUS,
            vx: (Math.random() - 0.5) * 1.2, // Reduced horizontal velocity
            vy: 0
          };
          
          let lastTime = Date.now();
          let multiplier = MULTIPLIERS[Math.floor(MULTIPLIERS.length / 2)];
          
          const animate = () => {
            const now = Date.now();
            const dt = Math.min(32, now - lastTime) / 16;
            lastTime = now;
            
            // Clear ball area
            ctx.clearRect(
              ball.x - ball.radius - 2, 
              ball.y - ball.radius - 2, 
              ball.radius * 2 + 4, 
              ball.radius * 2 + 4
            );
            
            // Update position with gravity (reduced for slower motion)
            ball.vy += 0.12 * dt;
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;
            
            // Bounce off walls
            if (ball.x < ball.radius || ball.x > BOARD_WIDTH - ball.radius) {
              ball.vx *= -0.8;
              if (ball.x < ball.radius) ball.x = ball.radius;
              if (ball.x > BOARD_WIDTH - ball.radius) ball.x = BOARD_WIDTH - ball.radius;
            }
            
            // Draw ball
            ctx.fillStyle = theme.palette.mode === 'dark' ? '#bbdefb' : '#e3f2fd';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Check if ball reached bottom
            if (ball.y > BOARD_HEIGHT - 90 && !binLandingProcessed) {
              // Mark bin landing as processed
              setBinLandingProcessed(true);
              
              // Calculate which bin based on x position
              const binWidth = BOARD_WIDTH / MULTIPLIERS.length;
              const binHeight = 40; // Match the binHeight used elsewhere
              const binIndex = Math.min(
                Math.floor(ball.x / binWidth),
                MULTIPLIERS.length - 1
              );
              multiplier = MULTIPLIERS[binIndex];
              
              // Calculate XP boost using the utility function
              const finalXpBoost = calculateXpBoost(multiplier);
              
              const resultObj = {
                multiplier,
                xpBoost: finalXpBoost // Uncapped for display
              };
              
              // Redraw the board before starting the shrink animation
              ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
              renderFallbackGame();
              
              // Lock the ball position in the center of the bin
              ball.x = binIndex * binWidth + binWidth / 2;
              ball.y = BOARD_HEIGHT - binHeight; // Position at the top of the bin
              ball.vx = 0;
              ball.vy = 0;
              
              // Save the bin position and dimensions for animation
              const binRect = {
                x: binIndex * binWidth,
                y: BOARD_HEIGHT - binHeight,
                width: binWidth,
                height: binHeight
              };
              
              // Animate the bin moving down and up
              let binAnimStep = 0;
              const binTotalSteps = 15;
              
              const animateBin = () => {
                // Clear the entire canvas and redraw background
                ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
                renderFallbackGame();
                
                // Calculate current offset
                let yOffset = 0;
                if (binAnimStep < binTotalSteps / 2) {
                  // Moving down
                  yOffset = binAnimStep * 1.5;
                } else if (binAnimStep < binTotalSteps) {
                  // Moving back up
                  yOffset = (binTotalSteps - binAnimStep) * 1.5;
                }
                
                // Clear just the specific bin we're animating
                ctx.clearRect(
                  binRect.x, 
                  binRect.y - 2, 
                  binRect.width, 
                  binRect.height + 30
                );
                
                // Draw the bin at the new position
                const cornerRadius = 8;
                
                ctx.save();
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
                ctx.fillStyle = '#90caf9';
                
                // Draw rounded rectangle for the bin with offset
                ctx.beginPath();
                ctx.moveTo(binRect.x + cornerRadius, binRect.y + yOffset);
                ctx.lineTo(binRect.x + binRect.width - cornerRadius, binRect.y + yOffset);
                ctx.quadraticCurveTo(binRect.x + binRect.width, binRect.y + yOffset, binRect.x + binRect.width, binRect.y + yOffset + cornerRadius);
                ctx.lineTo(binRect.x + binRect.width, binRect.y + yOffset + binRect.height - cornerRadius);
                ctx.quadraticCurveTo(binRect.x + binRect.width, binRect.y + yOffset + binRect.height, binRect.x + binRect.width - cornerRadius, binRect.y + yOffset + binRect.height);
                ctx.lineTo(binRect.x + cornerRadius, binRect.y + yOffset + binRect.height);
                ctx.quadraticCurveTo(binRect.x, binRect.y + yOffset + binRect.height, binRect.x, binRect.y + yOffset + binRect.height - cornerRadius);
                ctx.lineTo(binRect.x, binRect.y + yOffset + cornerRadius);
                ctx.quadraticCurveTo(binRect.x, binRect.y + yOffset, binRect.x + cornerRadius, binRect.y + yOffset);
                ctx.closePath();
                ctx.fill();
                
                // Add border
                ctx.shadowColor = 'transparent';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw multiplier text
                const centerX = binRect.x + binRect.width / 2;
                const centerY = binRect.y + yOffset + binRect.height / 2;
                
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 3;
                ctx.strokeText(`+${finalXpBoost}`, centerX, centerY);
                
                ctx.shadowColor = 'transparent';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`+${finalXpBoost}`, centerX, centerY);
                
                // Draw the ball
                ctx.fillStyle = theme.palette.mode === 'dark' ? '#bbdefb' : '#e3f2fd';
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
                
                // Continue animation if not done
                if (binAnimStep < binTotalSteps) {
                  binAnimStep++;
                  requestAnimationFrame(animateBin);
                } else {
                  // Start the shrinking animation after bin animation is complete
                  shrinkBall();
                }
              };
              
              // Animate the ball shrinking and disappearing into the bin
              const shrinkBall = () => {
                // Redraw the background where the ball was
                ctx.clearRect(
                  ball.x - BALL_RADIUS - 2, 
                  ball.y - BALL_RADIUS - 2, 
                  BALL_RADIUS * 2 + 4, 
                  BALL_RADIUS * 2 + 4
                );
                
                // Shrink the ball
                ball.radius *= 0.8;
                
                // Move the ball down slightly
                ball.y += 1;
                
                // Draw the ball at its new size
                if (ball.radius > 1) {
                  ctx.fillStyle = theme.palette.mode === 'dark' ? '#bbdefb' : '#e3f2fd';
                  ctx.beginPath();
                  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                  ctx.fill();
                  
                  // Continue shrinking
                  requestAnimationFrame(shrinkBall);
                } else {
                  // Ball has disappeared, finish the game
                  const resultObj = {
                    multiplier,
                    xpBoost: finalXpBoost
                  };
                  
                  // Add XP and show result (apply cap here)
                  addXp(applyBoostCap(finalXpBoost), getRiskAsDifficulty('Medium'));
                  
                  setTimeout(() => {
                    setResult(resultObj);
                    setGameState('ended');
                    setCanPlay(false);
                    localStorage.setItem('lastPlinkoLevel', level.toString());
                  }, 200);
                }
              };
              
              // Start bin animation
              animateBin();
              
              return; // Stop the main animation
            }
            
            requestAnimationFrame(animate);
          };
          
          animate();
          return;
        }
      }
    }
    
    // Set game state to playing
    setGameState('playing');
    
    // Create a ball
    const ball = Matter.Bodies.circle(
      BOARD_WIDTH / 2 + (Math.random() * 6 - 3), // Reduced randomness
      40, // Start higher 
      BALL_RADIUS, 
      {
        restitution: 0.5, // Less bounce for more predictable paths
        friction: 0.03, // Moderate friction
        frictionAir: 0.001,
        density: 0.002,
        render: {
          fillStyle: theme.palette.mode === 'dark' ? '#bbdefb' : '#e3f2fd',
          strokeStyle: theme.palette.mode === 'dark' ? '#90caf9' : '#90caf9',
          lineWidth: 1,
        },
        label: 'ball',
      }
    );
    
    // Add a tiny random force - reduced randomness
    const randomForce = (Math.random() - 0.5) * 0.0003;
    Matter.Body.applyForce(ball, ball.position, { x: randomForce, y: 0 });
    
    // Add the ball to the world
    Matter.World.add(worldRef.current, ball);
    ballsRef.current.push(ball as PlinkoBody);
    activeBallsRef.current.add(ball as PlinkoBody);
  }, [worldRef, gameState, theme, level, addXp, canPlay, getRiskAsDifficulty, setBinLandingProcessed, calculateXpBoost, applyBoostCap]);
  
  // Reset function - just for visual reset, doesn't allow replaying
  const reset = useCallback(() => {
    // Only clean up the board visually
    if (worldRef.current) {
      ballsRef.current.forEach(ball => {
        Matter.World.remove(worldRef.current!, ball as Matter.Body);
      });
    }
    
    ballsRef.current = [];
    activeBallsRef.current.clear();
    
    // Reset bin landing processed flag
    setBinLandingProcessed(false);
    
    // But keep the game ended since we don't allow replays
    setGameState('ended');
  }, [setBinLandingProcessed]);
  
  // Get the result text
  const getResultText = () => {
    if (result) {
      return `You got a ${result.multiplier}x multiplier! +${result.xpBoost} XP bonus!`;
    }
    return '';
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 0
      }}
    >
      {/* Current Balance */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          Level {level} XP:
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ color: '#90caf9' }}>
          {level * 100}
        </Typography>
      </Box>
      
      <Paper 
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }}
      >
        {/* Simple Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 'none', 
          textAlign: 'center',
          backgroundColor: 'transparent',
        }}>
          <Typography variant="h6">
            XP Booster Plinko
          </Typography>
        </Box>
          
        {/* Game Board */}
        <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
          <canvas 
            ref={canvasRef} 
            width={BOARD_WIDTH} 
            height={BOARD_HEIGHT}
            style={{ 
              display: 'block',
              backgroundColor: 'transparent',
              width: '100%',
              height: 'auto',
              zIndex: 1,
              position: 'relative'
            }}
          />
          
          {/* Result overlay */}
          {result && (
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
                textAlign: 'center',
                width: '80%',
                zIndex: 20,
              }}
            >
              <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
                {result.multiplier}x Multiplier!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                +{result.xpBoost} XP Boost!
              </Typography>
              
              <Stack spacing={2} direction="column" sx={{ mb: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/problems')}
                  size="medium"
                  sx={{ fontWeight: 'bold' }}
                >
                  Go to Coding Problems
                </Button>
                
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={() => navigate('/problem-roulette')}
                  size="medium"
                  sx={{ fontWeight: 'bold' }}
                >
                  Try Problem Roulette
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
        
        {/* Drop Ball Button */}
        <Box sx={{ 
          p: 2, 
          textAlign: 'center', 
          borderTop: 'none', 
          backgroundColor: 'transparent' 
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={dropBall}
            disabled={gameState !== 'ready' || !canPlay}
            size="large"
            sx={{ 
              minWidth: 180, 
              py: 1, 
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#90caf9',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#90caf9'
              }
            }}
          >
            {!canPlay 
              ? 'Already Played' 
              : gameState === 'ready' 
                ? 'Drop Ball' 
                : gameState === 'playing' 
                  ? 'Ball in motion...' 
                  : 'Game Over'}
          </Button>
        </Box>
      </Paper>
      
      {/* Status Message */}
      <Paper sx={{ 
        mt: 2, 
        p: 2, 
        width: '100%', 
        maxWidth: 600, 
        borderRadius: 1,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}>
        {canPlay ? (
          <Alert severity="info" sx={{ mb: 0 }}>
            <Typography variant="body2">
              You've reached Level {level}! Drop the ball to earn bonus XP. 
              Each level allows one play.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 0 }}>
            <Typography variant="body2">
              You've already used your Plinko drop for Level {level}. 
              Return when you reach Level {level + 1}.
            </Typography>
          </Alert>
        )}
      </Paper>
      

    </Container>
  );
};

export default PlinkoGame; 