import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Alert,
} from '@mui/material';
import { useProblemProgress } from '../contexts/ProblemProgressContext';
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

const PlinkoGame: React.FC = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { level, addXp } = useProblemProgress();
  
  // Game state
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [result, setResult] = useState<{multiplier: number, xpBoost: number} | null>(null);
  const [canPlay, setCanPlay] = useState<boolean>(true);
  
  // Game settings
  const [rows, setRows] = useState<number>(DEFAULT_ROWS);
  const [betAmount] = useState<number>(10); // Fixed bet amount, removed setter
  const [riskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium'); // Fixed risk level, removed setter
  
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
    
    if (multiplier >= 3) return '#0d47a1'; // Highest - Deep blue
    if (multiplier >= 1.5) return '#1565c0'; // High - Medium blue
    if (multiplier >= 1.0) return '#1976d2'; // Medium - Blue
    if (multiplier >= 0.5) return '#2196f3'; // Low-medium - Light blue
    return '#64b5f6'; // Low - Lighter blue
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
        gravity: { x: 0, y: 0.5 }, // Lower gravity for smoother motion
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
          background: theme.palette.mode === 'dark' ? '#1a2027' : '#f5f5f5',
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
              fillStyle: theme.palette.mode === 'dark' ? '#2196f3' : '#1976d2',
              strokeStyle: theme.palette.mode === 'dark' ? '#64b5f6' : '#0d47a1',
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
          render: { fillStyle: theme.palette.grey[800] },
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
          render: { fillStyle: theme.palette.grey[800] },
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
          render: { fillStyle: theme.palette.grey[800] },
          label: 'ground',
        }
      );
      
      wallBodiesRef.current = [leftWall, rightWall, ground] as PlinkoBody[];
      
      // Create bins at the bottom - sized to match multiplier count
      const bins: PlinkoBody[] = [];
      const numBins = MULTIPLIERS.length;
      const binWidth = BOARD_WIDTH / numBins;
      const binHeight = 60; // Slightly taller bins for better visibility
      const binY = BOARD_HEIGHT - binHeight/2;
      
      for (let i = 0; i < numBins; i++) {
        const binX = i * binWidth + binWidth/2;
        const binColor = getMultiplierColor(MULTIPLIERS[i]);
        
        // Add a border to the bin for better visibility
        const bin = Matter.Bodies.rectangle(binX, binY, binWidth - 2, binHeight, {
          isStatic: true,
          isSensor: true,
          render: {
            fillStyle: binColor,
            strokeStyle: theme.palette.grey[700],
            lineWidth: 1,
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
          if (ballBody && binBody) {
            // Only process if this ball is active and at the bottom of the board
            if (activeBallsRef.current.has(ballBody as PlinkoBody) && 
                ballBody.position.y > BOARD_HEIGHT - binHeight - BALL_RADIUS) {
              // Remove from active balls to prevent multiple bin hits
              activeBallsRef.current.delete(ballBody as PlinkoBody);
              
              // Get the multiplier for this bin
              const multiplier = binBody.multiplier || 1;
              
              // Calculate the XP boost - fixed formula of level * 10 * multiplier
              const baseXpBoost = level * 10;
              const finalXpBoost = Math.floor(baseXpBoost * multiplier);
              
              // Play bin landing sound
              playBinLandSound(multiplier);
              
              // Create result object
              const resultObj = {
                multiplier,
                xpBoost: finalXpBoost
              };
              
              // Update result and end game
              setTimeout(() => {
                setResult(resultObj);
                setGameState('ended');
                
                // Add the XP
                addXp(finalXpBoost, getRiskAsDifficulty(riskLevel));
                
                // Player can't play again until next level
                setCanPlay(false);
                localStorage.setItem('lastPlinkoLevel', level.toString());
              }, 500);
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
      
      // Draw multiplier labels with better styling
      setTimeout(() => {
        if (renderRef.current?.canvas?.getContext) {
          const ctx = renderRef.current.canvas.getContext('2d');
          if (ctx) {
            MULTIPLIERS.forEach((mult, i) => {
              const binWidth = BOARD_WIDTH / MULTIPLIERS.length;
              const binX = i * binWidth + binWidth/2;
              const binY = BOARD_HEIGHT - binHeight/2;
              
              // Draw multiplier text with background for better visibility
              ctx.font = 'bold 16px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Draw a semi-transparent background circle
              ctx.beginPath();
              ctx.arc(binX, binY, 18, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
              ctx.fill();
              
              // Draw outline
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw multiplier text
              ctx.fillStyle = '#ffffff';
              ctx.fillText(`${mult}×`, binX, binY);
            });
          }
        }
      }, 200);
      
      console.log('Physics engine initialized successfully');
      
    } catch (error) {
      console.error('Error initializing physics engine:', error);
      renderFallbackGame();
    }
  }, [theme, getMultiplierColor, level, addXp, rows, MULTIPLIERS, riskLevel]);
  
  // Fallback visualization
  const renderFallbackGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    console.log('Rendering fallback game visualization');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw background
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#1a2027' : '#f5f5f5';
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw pins in pyramid pattern
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#2196f3' : '#1976d2';
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#64b5f6' : '#0d47a1';
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
    
    // Draw bins
    const numBins = MULTIPLIERS.length;
    const binWidth = BOARD_WIDTH / numBins;
    const binHeight = 60; // Slightly taller bins
    const binY = BOARD_HEIGHT - binHeight;
    
    for (let i = 0; i < numBins; i++) {
      const binX = i * binWidth;
      const binColor = getMultiplierColor(MULTIPLIERS[i]);
      
      // Draw bin
      ctx.fillStyle = binColor;
      ctx.fillRect(binX, binY, binWidth, binHeight);
      
      // Add border
      ctx.strokeStyle = theme.palette.grey[800];
      ctx.lineWidth = 1;
      ctx.strokeRect(binX, binY, binWidth, binHeight);
      
      // Add multiplier text with better styling
      const centerX = binX + binWidth / 2;
      const centerY = binY + binHeight / 2;
      
      // Draw circle background
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fill();
      
      // Draw circle border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${MULTIPLIERS[i]}×`, centerX, centerY);
    }
  }, [theme, getMultiplierColor, rows, MULTIPLIERS]);
  
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
            
            // Update position with gravity
            ball.vy += 0.2 * dt;
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
            if (ball.y > BOARD_HEIGHT - 90) {
              // Calculate which bin based on x position
              const binWidth = BOARD_WIDTH / MULTIPLIERS.length;
              const binIndex = Math.min(
                Math.floor(ball.x / binWidth),
                MULTIPLIERS.length - 1
              );
              multiplier = MULTIPLIERS[binIndex];
              
              const baseXpBoost = level * 10;
              const finalXpBoost = Math.floor(baseXpBoost * multiplier);
              
              const resultObj = {
                multiplier,
                xpBoost: finalXpBoost
              };
              
              // Add XP and show result
              addXp(finalXpBoost, getRiskAsDifficulty('Medium'));
              
              setTimeout(() => {
                setResult(resultObj);
                setGameState('ended');
                setCanPlay(false);
                localStorage.setItem('lastPlinkoLevel', level.toString());
              }, 500);
              
              return; // Stop animation
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
          strokeStyle: theme.palette.mode === 'dark' ? '#1976d2' : '#1565c0',
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
  }, [worldRef, gameState, theme, level, addXp, canPlay, getRiskAsDifficulty]);
  
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
    
    // But keep the game ended since we don't allow replays
    setGameState('ended');
  }, []);
  
  // Get the result text
  const getResultText = () => {
    if (result) {
      return `You got a ${result.multiplier}x multiplier! +${result.xpBoost} XP bonus!`;
    }
    return '';
  };

  return (
    <Container maxWidth="lg" sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Current Balance */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ mr: 1 }}>
          Level {level} XP:
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ color: '#2196f3' }}>
          {level * 100}
        </Typography>
      </Box>
      
      <Paper 
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Simple Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          textAlign: 'center'
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
              backgroundColor: theme.palette.mode === 'dark' ? '#1a2027' : '#f5f5f5',
              width: '100%',
              height: 'auto',
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
                width: '60%',
                zIndex: 20,
              }}
            >
              <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
                {result.multiplier}x Multiplier!
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                +{result.xpBoost} XP Boost!
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={reset}
                size="medium"
              >
                Clear Board
              </Button>
            </Paper>
          )}
        </Box>
        
        {/* Drop Ball Button */}
        <Box sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={dropBall}
            disabled={gameState !== 'ready' || !canPlay}
            size="large"
            sx={{ 
              minWidth: 180, 
              py: 1, 
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#2196f3',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#1976d2'
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
      <Paper sx={{ mt: 2, p: 2, width: '100%', maxWidth: 600, borderRadius: 1 }}>
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