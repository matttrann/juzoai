import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  useTheme,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useProblemProgress } from '../contexts/ProblemProgressContext';
import InfoIcon from '@mui/icons-material/Info';
// Import Matter.js using CommonJS require with TypeScript type assertion
// @ts-ignore
const Matter = require('matter-js');

// Define TypeScript interfaces for Matter.js types
interface CollisionEvent {
  pairs: Array<{
    bodyA: Matter.Body;
    bodyB: Matter.Body;
  }>;
}

// Define custom body properties as separate interface
interface CustomBodyProps {
  multiplier?: number;
  index?: number;
}

// Use type assertion approach instead of extending interfaces
type PlinkoBody = Matter.Body & CustomBodyProps;

// Physics constants for the plinko game
const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 580;
const PIN_RADIUS = 5;
const BALL_RADIUS = 10;

// Number of balls in the auto mode
const NUM_BALLS_AUTO = 5;

// Default rows - set to minimum
const DEFAULT_ROWS = 8;

// Default risk level - fixed to low
const DEFAULT_RISK = 'low';

// XP Multiplier values for the bins based on risk level
const MULTIPLIERS = {
  low: [1.05, 1.1, 1.15, 1.2, 1.3, 1.4, 1.3, 1.2, 1.15, 1.1, 1.05],
  medium: [1.1, 1.2, 1.3, 1.5, 1.8, 2.0, 1.8, 1.5, 1.3, 1.2, 1.1],
  high: [1.2, 1.5, 2.0, 3.0, 4.0, 5.0, 4.0, 3.0, 2.0, 1.5, 1.2]
};

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

interface XPBoosterPlinkoProps {
  open: boolean;
  onClose: () => void;
  levelUp: number; // The level the user just achieved
}

const XPBoosterPlinko: React.FC<XPBoosterPlinkoProps> = ({ open, onClose, levelUp }) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addXp } = useProblemProgress();
  
  // Game state - fixed to manual mode
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [result, setResult] = useState<{multiplier: number, xpBoost: number} | null>(null);
  
  // Game settings - fixed
  const rows = DEFAULT_ROWS;
  const riskLevel = DEFAULT_RISK;
  
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
  
  // Calculate multipliers based on risk level
  const getMultipliers = useCallback(() => {
    return MULTIPLIERS[riskLevel];
  }, [riskLevel]);

  // Function to get color based on multiplier value
  const getMultiplierColor = useCallback((multiplier: number): string => {
    const maxMultiplier = Math.max(...getMultipliers());
    const normalizedValue = (multiplier - 1) / (maxMultiplier - 1); // 0 to 1 scale
    
    if (normalizedValue > 0.8) return theme.palette.error.main; // Highest - Red
    if (normalizedValue > 0.6) return theme.palette.warning.main; // High - Orange
    if (normalizedValue > 0.4) return '#90caf9'; // Medium - Blue
    if (normalizedValue > 0.2) return theme.palette.success.light; // Low-medium - Light Green
    return theme.palette.success.main; // Low - Green
  }, [theme, getMultipliers]);
  
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
    console.log('Canvas dimensions:', canvasRef.current.width, 'x', canvasRef.current.height);
    
    // Clean up any existing physics engine
    cleanupPhysics();
    
    try {
      // Create engine with proper gravity
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1 }, // Increase gravity for better movement
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
          background: theme.palette.background.paper,
          pixelRatio: window.devicePixelRatio || 1, // Ensure proper scaling on all devices
        }
      });
      
      console.log('Render created:', render);
      renderRef.current = render;
      
      // Create world
      const world = engine.world;
      worldRef.current = world;
      
      // Calculate number of bins based on multipliers
      const numBins = getMultipliers().length;
      
      // Pin arrangement
      const pins: PlinkoBody[] = [];
      const pinSpacing = BOARD_WIDTH / (rows + 1);
      
      for (let row = 0; row < rows; row++) {
        const numPins = row + 1;
        const rowWidth = numPins * pinSpacing;
        const startX = (BOARD_WIDTH - rowWidth) / 2 + pinSpacing / 2;
        
        for (let pin = 0; pin < numPins; pin++) {
          const pinX = startX + pin * pinSpacing;
          const pinY = (row + 1) * pinSpacing + 80;
          
          const pinBody = Matter.Bodies.circle(pinX, pinY, PIN_RADIUS, {
            isStatic: true,
            restitution: 0.5,
            friction: 0.05,
            render: {
              fillStyle: theme.palette.grey[300],
            },
            label: 'pin',
          });
          
          pins.push(pinBody as PlinkoBody);
        }
      }
      
      pinBodiesRef.current = pins;
      
      // Walls
      const wallThickness = 20;
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
      
      // Create bins at the bottom
      const bins: PlinkoBody[] = [];
      const binWidth = BOARD_WIDTH / numBins;
      const binHeight = 60;
      const binY = BOARD_HEIGHT - binHeight/2;
      
      const multipliers = getMultipliers();
      
      for (let i = 0; i < numBins; i++) {
        const binX = i * binWidth + binWidth/2;
        const binColor = getMultiplierColor(multipliers[i]);
        
        // Add a border to the bin for better visibility
        const bin = Matter.Bodies.rectangle(binX, binY, binWidth - 2, binHeight, {
          isStatic: true,
          isSensor: true,
          render: {
            fillStyle: binColor,
            strokeStyle: theme.palette.grey[800],
            lineWidth: 1,
          },
          label: `bin-${i}`,
        });
        
        // Add custom properties after creation
        (bin as PlinkoBody).multiplier = multipliers[i];
        (bin as PlinkoBody).index = i;
        
        bins.push(bin as PlinkoBody);
      }
      
      binBodiesRef.current = bins;
      
      // Add collision event listener
      Matter.Events.on(engine, 'collisionStart', (event: CollisionEvent) => {
        const pairs = event.pairs;
        
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          
          // Determine which body is the ball and which is the bin
          let ballBody: Matter.Body | null = null;
          let binBody: PlinkoBody | null = null;
          
          // Play sound when ball hits pin
          if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'pin') ||
              (pair.bodyB.label === 'ball' && pair.bodyA.label === 'pin')) {
            playPinHitSound();
          }
          
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
              
              // Calculate the XP boost 
              const baseXpBoost = levelUp * 10;
              const finalXpBoost = Math.floor(baseXpBoost * multiplier);
              
              // Play bin landing sound
              playBinLandSound(multiplier);
              
              // Create result object
              const resultObj = {
                multiplier,
                xpBoost: finalXpBoost
              };
              
              // Update drop history
              setResult(resultObj);
              
              // Update total boost
              addXp(finalXpBoost, 'Medium');
              
              // In manual mode, set the result and end the game
              if (gameState === 'ready') {
                setTimeout(() => {
                  setResult(resultObj);
                  setGameState('ended');
                }, 500);
              }
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
      
      console.log('Physics engine initialized successfully');
      
    } catch (error) {
      console.error('Error initializing physics engine:', error);
    }
  }, [theme, rows, getMultipliers, getMultiplierColor, addXp, levelUp, gameState, cleanupPhysics]);
  
  // Fallback visualization in case Matter.js doesn't render properly
  const renderFallbackGame = () => {
    if (!canvasRef.current || renderRef.current) return;
    
    console.log('Rendering fallback game visualization');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw background
    ctx.fillStyle = theme.palette.background.paper;
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw pins
    ctx.fillStyle = theme.palette.grey[300];
    const pinSpacing = BOARD_WIDTH / (rows + 1);
    
    for (let row = 0; row < rows; row++) {
      const numPins = row + 1;
      const rowWidth = numPins * pinSpacing;
      const startX = (BOARD_WIDTH - rowWidth) / 2 + pinSpacing / 2;
      
      for (let pin = 0; pin < numPins; pin++) {
        const pinX = startX + pin * pinSpacing;
        const pinY = (row + 1) * pinSpacing + 80;
        
        ctx.beginPath();
        ctx.arc(pinX, pinY, PIN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw bins
    const numBins = getMultipliers().length;
    const binWidth = BOARD_WIDTH / numBins;
    const binHeight = 60;
    const binY = BOARD_HEIGHT - binHeight;
    
    const multipliers = getMultipliers();
    
    for (let i = 0; i < numBins; i++) {
      const binX = i * binWidth;
      const binColor = getMultiplierColor(multipliers[i]);
      
      ctx.fillStyle = binColor;
      ctx.fillRect(binX, binY, binWidth, binHeight);
      
      // Add border
      ctx.strokeStyle = theme.palette.grey[800];
      ctx.lineWidth = 1;
      ctx.strokeRect(binX, binY, binWidth, binHeight);
    }
  };
  
  // Update the useEffect to check if Matter.js rendering failed
  useEffect(() => {
    console.log('XPBoosterPlinko mounted, open:', open);
    
    if (open) {
      console.log('Dialog opened, setting up canvas');
      
      // Check if canvas is available
      if (!canvasRef.current) {
        console.error('Canvas ref is not available when dialog opened');
      } else {
        console.log('Canvas is available');
        
        // Render fallback immediately to ensure something is visible
        renderFallbackGame();
        
        // Then try to initialize the physics engine
        console.log('Initializing physics with delay');
        setTimeout(() => {
          try {
            initPhysics();
            
            // Check if Matter.js renderer was created successfully
            setTimeout(() => {
              if (!renderRef.current || !worldRef.current) {
                console.warn('Matter.js renderer not created or failed, using fallback');
                renderFallbackGame();
              }
            }, 100);
          } catch (error) {
            console.error('Error in delayed physics initialization:', error);
            renderFallbackGame();
          }
        }, 300); // Increased delay for better reliability
      }
    }
    
    // Clean up on unmount
    return () => {
      console.log('Cleaning up physics engine');
      cleanupPhysics();
    };
  }, [open, initPhysics, cleanupPhysics, renderFallbackGame]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    // In this version, we don't reset the game - only one attempt allowed
    onClose();
  }, [onClose]);
  
  // Add fallback for ball drop
  const dropBall = useCallback(() => {
    if (gameState !== 'ready') return;
    
    if (!worldRef.current) {
      console.warn('World ref not available, using fallback drop');
      
      // Fallback drop animation using canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Set game state to playing
          setGameState('playing');
          setResult(null);
          
          // Draw a ball and animate it falling
          const ball = {
            x: BOARD_WIDTH / 2,
            y: 50,
            radius: BALL_RADIUS,
            vx: (Math.random() - 0.5) * 1,
            vy: 0
          };
          
          let lastTime = Date.now();
          let multiplier = MULTIPLIERS[riskLevel][Math.floor(MULTIPLIERS[riskLevel].length / 2)];
          
          const animate = () => {
            const now = Date.now();
            const dt = Math.min(32, now - lastTime) / 16; // Cap at 60fps equivalent
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
            ctx.fillStyle = theme.palette.secondary.main;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Check if ball reached bottom
            if (ball.y > BOARD_HEIGHT - 70) {
              // Calculate which bin based on x position
              const binWidth = BOARD_WIDTH / MULTIPLIERS[riskLevel].length;
              const binIndex = Math.min(
                Math.floor(ball.x / binWidth),
                MULTIPLIERS[riskLevel].length - 1
              );
              multiplier = MULTIPLIERS[riskLevel][binIndex];
              
              const baseXpBoost = levelUp * 10;
              const finalXpBoost = Math.floor(baseXpBoost * multiplier);
              
              const resultObj = {
                multiplier,
                xpBoost: finalXpBoost
              };
              
              // Add XP and show result
              addXp(finalXpBoost, 'Medium');
              
              setTimeout(() => {
                setResult(resultObj);
                setGameState('ended');
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
    
    // If Matter.js is available, use it
    // Set game state to playing
    setGameState('playing');
    setResult(null);
    
    // Create a ball
    const ball = Matter.Bodies.circle(
      BOARD_WIDTH / 2 + (Math.random() * 10 - 5), // Small random x-offset for variety
      50, 
      BALL_RADIUS, 
      {
        restitution: 0.6,
        friction: 0.05,
        frictionAir: 0.001,
        density: 0.002,
        render: {
          fillStyle: theme.palette.secondary.main,
        },
        label: 'ball',
      }
    );
    
    // Add a small random force to make the game more interesting
    const randomForce = (Math.random() - 0.5) * 0.0005;
    Matter.Body.applyForce(ball, ball.position, { x: randomForce, y: 0 });
    
    // Add the ball to the world
    Matter.World.add(worldRef.current, ball);
    ballsRef.current.push(ball as PlinkoBody);
    activeBallsRef.current.add(ball as PlinkoBody);
  }, [worldRef, gameState, theme, levelUp, riskLevel, addXp]);
  
  // Handle the close event
  const handleClose = () => {
    // If game is still in progress, wait
    if (gameState === 'playing' && !result) return;
    
    onClose();
  };
  
  // Get the result text
  const getResultText = () => {
    if (result) {
      return `You got a ${result.multiplier}x multiplier! +${result.xpBoost} XP bonus!`;
    }
    return '';
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          maxWidth: '450px',
          width: '100%',
          overflow: 'hidden',
          bgcolor: theme.palette.background.default
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Level {levelUp} XP Booster!
        </Typography>
        <Tooltip title="Drop the ball through the pins to get an XP multiplier. You have one attempt!">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" textAlign="center" mb={2}>
          Congratulations on reaching Level {levelUp}! 
          Drop the ball to get an XP boost. You only have one attempt!
        </Typography>
        
        {/* Game board */}
        <Box
          sx={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: theme.shadows[5],
            border: `2px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper, // Ensure there's a background color
          }}
        >
          <canvas 
            ref={canvasRef} 
            width={BOARD_WIDTH} 
            height={BOARD_HEIGHT}
            style={{ 
              display: 'block',
              backgroundColor: theme.palette.background.paper, 
            }}
          />
          
          {/* Multiplier labels at the bottom */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 15,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              zIndex: 1000,
              px: 0.5,
            }}
          >
            {getMultipliers().map((multiplier, index) => (
              <Typography
                key={index}
                variant="caption"
                fontWeight="bold"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '1px 3px',
                  borderRadius: '3px',
                  textShadow: '0px 0px 2px rgba(255,255,255,0.7)',
                  transform: 'scale(0.9)',
                  fontSize: '10px',
                }}
              >
                {multiplier}x
              </Typography>
            ))}
          </Box>
          
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
              }}
            >
              <Typography variant="h6" component="div" gutterBottom>
                {getResultText()}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={handleClose}
                sx={{ mt: 1 }}
              >
                Close
              </Button>
            </Paper>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={dropBall}
          disabled={gameState !== 'ready'}
          size="large"
          sx={{ minWidth: 150 }}
        >
          {gameState === 'ready' ? 'Drop Ball (One Attempt!)' : gameState === 'playing' ? 'Ball in motion...' : 'Game Over'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default XPBoosterPlinko; 