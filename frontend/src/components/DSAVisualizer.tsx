import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Divider,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dsa-tabpanel-${index}`}
      aria-labelledby={`dsa-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `dsa-tab-${index}`,
    'aria-controls': `dsa-tabpanel-${index}`,
  };
};

// Arrays visualization component with subsections
const ArraysVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Arrays</Typography>
      <Typography variant="body1" paragraph>
        Arrays are one of the most fundamental data structures. They store elements in contiguous memory locations.
      </Typography>
      
      {/* RAM Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Random Access Memory (RAM)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Random Access Memory (RAM) is the foundation for array data structures. It provides:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <strong>Constant-time access:</strong> Direct access to any memory address in O(1) time
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Contiguous storage:</strong> Elements stored in sequential memory locations
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Fixed addressing:</strong> Enables efficient array indexing using base address + offset
                </Typography>
              </li>
            </ul>
            
            {/* RAM Visualization */}
            <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" gutterBottom>Memory Addresses and Values</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} sx={{ display: 'flex' }}>
                    <Box sx={{ 
                      width: '100px', 
                      p: 1, 
                      bgcolor: theme.palette.grey[800], 
                      color: 'white',
                      borderRadius: '4px 0 0 4px',
                      textAlign: 'center'
                    }}>
                      0x{(0x1000 + i * 4).toString(16).toUpperCase()}
                    </Box>
                    <Box sx={{ 
                      width: '100px', 
                      p: 1, 
                      bgcolor: i < 4 ? theme.palette.primary.main : theme.palette.background.paper,
                      color: i < 4 ? 'white' : theme.palette.text.primary,
                      borderRadius: '0 4px 4px 0',
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      {i < 4 ? Math.floor(Math.random() * 100) : ''}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                RAM allows each memory address to be accessed in constant time, regardless of location.
              </Typography>
            </Paper>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Static Arrays Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Static Arrays</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Static arrays have a fixed size determined at creation time.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Fixed size:</strong> Size cannot change after creation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Direct access:</strong> O(1) access to any element by index
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Memory efficiency:</strong> Minimal overhead as size is known at compile time
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Memory allocation:</strong> Typically allocated on the stack in many languages
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Static Array [5]</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    {[42, 17, 89, 36, 71].map((value, index) => (
                      <Box key={index} sx={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        border: `1px solid ${theme.palette.divider}`,
                        position: 'relative'
                      }}>
                        {value}
                        <Box sx={{ 
                          position: 'absolute',
                          top: '-20px',
                          fontSize: '0.75rem'
                        }}>
                          index: {index}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    A static array with 5 elements. Size is fixed at creation.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Dynamic Arrays Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Dynamic Arrays</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Dynamic arrays (like ArrayList in Java or vector in C++) automatically resize as elements are added.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Flexible size:</strong> Can grow or shrink as needed
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Direct access:</strong> O(1) access to any element by index
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Amortized insertion:</strong> O(1) amortized time for append operations
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Memory allocation:</strong> Allocated on the heap with extra capacity
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Dynamic Array Resizing</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Array before resizing */}
                    <Box>
                      <Typography variant="body2">Before adding element (capacity: 4)</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        {[23, 45, 67, 89].map((value, index) => (
                          <Box key={index} sx={{
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            border: `1px solid ${theme.palette.divider}`
                          }}>
                            {value}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Array after resizing */}
                    <Box>
                      <Typography variant="body2">After adding element (capacity doubled: 8)</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        {[23, 45, 67, 89, 12, '', '', ''].map((value, index) => (
                          <Box key={index} sx={{
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: index < 5 ? theme.palette.primary.main : theme.palette.background.paper,
                            color: index < 5 ? 'white' : theme.palette.text.secondary,
                            border: `1px solid ${theme.palette.divider}`
                          }}>
                            {value}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    When the array reaches capacity, a new larger array is created (typically 2x size),
                    and all elements are copied over.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Stacks Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Stacks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              A stack is a LIFO (Last In, First Out) data structure often implemented using arrays.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Stack Operations:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Push:</strong> Add an element to the top (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Pop:</strong> Remove and return the top element (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Peek/Top:</strong> View the top element without removing it (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>isEmpty:</strong> Check if the stack has no elements
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Stack Visualization</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column-reverse',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '4px',
                    height: '250px',
                    position: 'relative',
                    my: 2
                  }}>
                    {[42, 89, 23, 67].map((value, index) => (
                      <Box key={index} sx={{
                        width: '100%',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: index === 0 ? theme.palette.secondary.main : theme.palette.primary.main,
                        color: 'white',
                        borderTop: index > 0 ? `1px solid ${theme.palette.divider}` : 'none',
                        position: 'relative'
                      }}>
                        {value}
                        <Box sx={{ 
                          position: 'absolute',
                          right: '8px',
                          fontSize: '0.75rem'
                        }}>
                          {index === 0 ? '← Top' : ''}
                        </Box>
                      </Box>
                    ))}
                    <Box sx={{
                      position: 'absolute',
                      top: '-30px',
                      width: '100%',
                      textAlign: 'center'
                    }}>
                      <Typography variant="caption">Push/Pop operations happen here</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    A stack with 4 elements. Only the top element (42) can be accessed directly.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Binary Search Tree Visualizer component placeholder
const BSTVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Binary Search Tree Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Binary Search Tree visualization will be implemented in a future update.
        </Typography>
      </Paper>
    </Box>
  );
};

// Linked Lists visualization component with subsections
const LinkedListsVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Linked Lists</Typography>
      <Typography variant="body1" paragraph>
        Linked lists are linear data structures where elements are stored in nodes, and each node points to the next node in the sequence.
      </Typography>
      
      {/* Singly Linked Lists Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Singly Linked Lists</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              A singly linked list consists of nodes where each node contains data and a reference to the next node in the sequence.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Dynamic size:</strong> Grows and shrinks as needed
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Traversal:</strong> One-directional (forward) from head to tail
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Insertion:</strong> O(1) time at the head or with a reference to the previous node
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Deletion:</strong> O(1) time with a reference to the node to delete
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Search:</strong> O(n) time as list must be traversed from the head
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Singly Linked List Visualization</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      overflowX: 'auto',
                      py: 2
                    }}>
                      {/* Head pointer */}
                      <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body2">Head</Typography>
                        <Box sx={{ 
                          height: '30px',
                          width: '2px',
                          bgcolor: theme.palette.text.primary
                        }}></Box>
                        <Box sx={{ 
                          height: '0px',
                          width: '0px',
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: `6px solid ${theme.palette.text.primary}`
                        }}></Box>
                      </Box>
                      
                      {/* Nodes with arrows */}
                      {[23, 45, 67, 89, 12].map((value, index) => (
                        <React.Fragment key={index}>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '80px'
                          }}>
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              border: `1px solid ${theme.palette.primary.main}`,
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                p: 1,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                textAlign: 'center'
                              }}>
                                {value}
                              </Box>
                              <Box sx={{
                                p: 1,
                                bgcolor: theme.palette.background.paper,
                                textAlign: 'center',
                                fontSize: '0.75rem'
                              }}>
                                {index === 4 ? 'null' : 'next →'}
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Arrow to next node */}
                          {index < 4 && (
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mx: 1
                            }}>
                              <Box sx={{ 
                                width: '20px',
                                height: '2px',
                                bgcolor: theme.palette.text.secondary
                              }}></Box>
                              <Box sx={{ 
                                width: '0px',
                                height: '0px',
                                borderTop: '5px solid transparent',
                                borderBottom: '5px solid transparent',
                                borderLeft: `5px solid ${theme.palette.text.secondary}`
                              }}></Box>
                            </Box>
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    A singly linked list with 5 nodes. Each node points to the next node, with the last node pointing to null.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Doubly Linked Lists Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Doubly Linked Lists</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              A doubly linked list has nodes with references to both the next and previous nodes, allowing bidirectional traversal.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Bidirectional:</strong> Can be traversed both forward and backward
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Memory usage:</strong> More memory per node (additional prev pointer)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Deletion:</strong> O(1) time with reference to the node (no need to find previous node)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Reverse traversal:</strong> Can easily traverse backward from tail to head
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Doubly Linked List Visualization</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2, 
                    my: 2,
                    overflowX: 'auto'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      pb: 2
                    }}>
                      {/* Head pointer */}
                      <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body2">Head</Typography>
                        <Box sx={{ 
                          height: '30px',
                          width: '2px',
                          bgcolor: theme.palette.text.primary
                        }}></Box>
                        <Box sx={{ 
                          height: '0px',
                          width: '0px',
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: `6px solid ${theme.palette.text.primary}`
                        }}></Box>
                      </Box>
                      
                      {/* Nodes with bidirectional arrows */}
                      {[42, 17, 89, 36].map((value, index) => (
                        <React.Fragment key={index}>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '100px'
                          }}>
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              border: `1px solid ${theme.palette.primary.main}`,
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                p: 1,
                                bgcolor: theme.palette.grey[800],
                                color: 'white',
                                textAlign: 'center',
                                fontSize: '0.75rem'
                              }}>
                                {index === 0 ? 'null' : '← prev'}
                              </Box>
                              <Box sx={{
                                p: 1,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                textAlign: 'center'
                              }}>
                                {value}
                              </Box>
                              <Box sx={{
                                p: 1,
                                bgcolor: theme.palette.grey[800],
                                color: 'white',
                                textAlign: 'center',
                                fontSize: '0.75rem'
                              }}>
                                {index === 3 ? 'null' : 'next →'}
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Bidirectional arrows */}
                          {index < 3 && (
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: '100px',
                              mx: 1
                            }}>
                              {/* Forward arrow (next) */}
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <Box sx={{ 
                                  width: '20px',
                                  height: '2px',
                                  bgcolor: theme.palette.primary.light
                                }}></Box>
                                <Box sx={{ 
                                  width: '0px',
                                  height: '0px',
                                  borderTop: '5px solid transparent',
                                  borderBottom: '5px solid transparent',
                                  borderLeft: `5px solid ${theme.palette.primary.light}`
                                }}></Box>
                              </Box>
                              
                              {/* Backward arrow (prev) */}
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row-reverse'
                              }}>
                                <Box sx={{ 
                                  width: '20px',
                                  height: '2px',
                                  bgcolor: theme.palette.secondary.light
                                }}></Box>
                                <Box sx={{ 
                                  width: '0px',
                                  height: '0px',
                                  borderTop: '5px solid transparent',
                                  borderBottom: '5px solid transparent',
                                  borderRight: `5px solid ${theme.palette.secondary.light}`
                                }}></Box>
                              </Box>
                            </Box>
                          )}
                        </React.Fragment>
                      ))}
                      
                      {/* Tail pointer */}
                      <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="body2">Tail</Typography>
                        <Box sx={{ 
                          height: '30px',
                          width: '2px',
                          bgcolor: theme.palette.text.primary
                        }}></Box>
                        <Box sx={{ 
                          height: '0px',
                          width: '0px',
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: `6px solid ${theme.palette.text.primary}`
                        }}></Box>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    A doubly linked list with 4 nodes. Each node has both next and previous pointers.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Queues Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Queues</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              A queue is a FIFO (First In, First Out) data structure often implemented using linked lists.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Queue Operations:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Enqueue:</strong> Add an element to the back of the queue (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Dequeue:</strong> Remove and return the front element (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Peek/Front:</strong> View the front element without removing it (O(1))
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>isEmpty:</strong> Check if the queue has no elements
                    </Typography>
                  </li>
                </ul>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Implementation Options:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Linked List:</strong> Most natural implementation with O(1) enqueue and dequeue
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Array:</strong> Circular array implementation for efficiency
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Queue Visualization</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    my: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Front (Dequeue)</Typography>
                      <Typography variant="body2">Back (Enqueue)</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      width: '100%', 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '4px',
                      position: 'relative',
                      height: '60px'
                    }}>
                      {['A', 'B', 'C', 'D', 'E'].map((value, index) => (
                        <Box key={index} sx={{
                          width: '20%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: index === 0 
                            ? theme.palette.secondary.main
                            : index === 4 
                              ? theme.palette.primary.main 
                              : theme.palette.primary.dark,
                          color: 'white',
                          borderRight: index < 4 ? `1px solid ${theme.palette.divider}` : 'none',
                          position: 'relative'
                        }}>
                          {value}
                          <Box sx={{ 
                            position: 'absolute',
                            top: '-25px',
                            fontSize: '0.75rem'
                          }}>
                            {index === 0 ? 'Front' : index === 4 ? 'Back' : ''}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 3 }}>
                    A queue with 5 elements. 'A' is at the front and will be the next item dequeued,
                    while new items would be enqueued after 'E' at the back.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Additional placeholder components for new visualization sections
const ArraysAndStringsVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Arrays and Strings Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Arrays and Strings visualizations will be implemented in a future update.
          Topics will include common operations, searching, pattern matching, and string manipulation algorithms.
        </Typography>
      </Paper>
    </Box>
  );
};

const HashingVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Hashing Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Hashing visualizations will be implemented in a future update.
          Topics will include hash functions, collision resolution strategies, and hash table operations.
        </Typography>
      </Paper>
    </Box>
  );
};

const StacksQueuesVisualizer: React.FC = () => {
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Stacks and Queues Visualization
        </Typography>
        <Typography variant="body1" sx={{ mt: 8 }}>
          Stack and Queue visualizations will be implemented in a future update.
          Topics will include push/pop operations, enqueue/dequeue operations, and real-world applications.
        </Typography>
      </Paper>
    </Box>
  );
};

const TreesVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Trees</Typography>
      <Typography variant="body1" paragraph>
        Trees are hierarchical data structures with a root value and subtrees of children nodes.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Binary Tree</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Binary Tree visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Binary Search Tree</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Binary Search Tree visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">BST Insert and Remove</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              BST insertion and removal visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Depth-First Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Depth-First Search visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Breadth-First Search</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Breadth-First Search visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">BST Sets and Maps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              BST Sets and Maps visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const BacktrackingVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Backtracking</Typography>
      <Typography variant="body1" paragraph>
        Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Tree Maze</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Tree Maze visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const HeapVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Heap / Priority Queue</Typography>
      <Typography variant="body1" paragraph>
        Heaps are specialized tree-based data structures that satisfy the heap property.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Heap Properties</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Heap Properties visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Push and Pop Operations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Heap Push and Pop operations visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Heapify</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Heapify algorithm visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const GraphsVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Graphs</Typography>
      <Typography variant="body1" paragraph>
        Graphs are collections of nodes (vertices) and connections between them (edges).
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Introduction to Graphs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Introduction to Graphs visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Matrix DFS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Matrix Depth-First Search visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Matrix BFS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Matrix Breadth-First Search visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Adjacency List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Adjacency List visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const DynamicProgrammingVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Dynamic Programming</Typography>
      <Typography variant="body1" paragraph>
        Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">1D Dynamic Programming</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              1D Dynamic Programming visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">2D Dynamic Programming</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              2D Dynamic Programming visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

const BitManipulationVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Bit Manipulation</Typography>
      <Typography variant="body1" paragraph>
        Bit manipulation is the act of algorithmically manipulating bits or other pieces of data.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Bit Operations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ p: 3, minHeight: '300px', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mt: 8 }}>
              Bit Operations visualization will be implemented in a future update.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Recursion Visualizer component
const RecursionVisualizer: React.FC = () => {
  const theme = useTheme();
  const [factorialInput, setFactorialInput] = useState<number>(5);
  const [fibonacciInput, setFibonacciInput] = useState<number>(6);
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Recursion</Typography>
      <Typography variant="body1" paragraph>
        Recursion is a method where the solution depends on solutions to smaller instances of the same problem.
        It involves a function calling itself until it reaches a base case.
      </Typography>
      
      {/* Factorial Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Factorial</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Recursive Definition:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Base case:</strong> 0! = 1
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Recursive case:</strong> n! = n × (n-1)!
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Recursive Code:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def factorial(n):
    # Base case
    if n == 0 or n == 1:
        return 1
    
    # Recursive case
    return n * factorial(n - 1)`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Factorial Call Stack Visualization</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Enter n:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Slider
                        value={factorialInput}
                        onChange={(_, value) => setFactorialInput(value as number)}
                        step={1}
                        marks
                        min={0}
                        max={8}
                        valueLabelDisplay="auto"
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body1" sx={{ width: 40 }}>{factorialInput}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 2
                  }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Call Stack (grows downward):</Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '4px'
                    }}>
                      {Array.from({ length: factorialInput + 1 }).map((_, index) => {
                        const n = factorialInput - index;
                        return (
                          <Box key={index} sx={{
                            p: 1.5,
                            borderBottom: index < factorialInput ? `1px solid ${theme.palette.divider}` : 'none',
                            bgcolor: index === 0 
                              ? theme.palette.primary.main 
                              : index === factorialInput 
                                ? theme.palette.success.light
                                : theme.palette.primary.dark,
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <Typography variant="body2">
                              {index === factorialInput 
                                ? 'factorial(0) = 1' 
                                : `factorial(${n}) = ${n} × factorial(${n-1})`}
                            </Typography>
                            <Typography variant="body2">
                              {index === factorialInput 
                                ? '→ 1' 
                                : `→ ${n} × ${Array(n).fill(0).map((_, i) => n-i-1 > 0 ? n-i-1 : 1).reduce((a, b) => a * b, 1)} = ${factorial(n)}`}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">Result: {factorialInput}! = </Typography>
                    <Typography variant="h6" color="primary">{factorial(factorialInput)}</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Fibonacci Sequence Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Fibonacci Sequence</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, 
              usually starting with 0 and 1.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Recursive Definition:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Base cases:</strong> fib(0) = 0, fib(1) = 1
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Recursive case:</strong> fib(n) = fib(n-1) + fib(n-2) for n {'>'}1
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Recursive Code:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def fibonacci(n):
    # Base cases
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)`}
                    </pre>
                  </Paper>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Problems with simple recursion:</Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">
                        <strong>Exponential time complexity:</strong> O(2^n) due to repeated subproblems
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        <strong>Redundant calculations:</strong> fib(n-2) is calculated multiple times
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        <strong>Solution:</strong> Dynamic programming (memoization) can optimize this to O(n)
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Fibonacci Sequence Visualization</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Enter n:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Slider
                        value={fibonacciInput}
                        onChange={(_, value) => setFibonacciInput(value as number)}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body1" sx={{ width: 40 }}>{fibonacciInput}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>Fibonacci sequence (first {fibonacciInput+1} terms):</Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 1,
                      justifyContent: 'center'
                    }}>
                      {Array.from({ length: fibonacciInput + 1 }).map((_, index) => (
                        <Box key={index} sx={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: index === fibonacciInput 
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                          color: 'white',
                          borderRadius: '4px',
                          position: 'relative'
                        }}>
                          {fibonacci(index)}
                          <Box sx={{ 
                            position: 'absolute',
                            top: '-20px',
                            fontSize: '0.75rem'
                          }}>
                            fib({index})
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Recursive Tree for fib({fibonacciInput > 5 ? 5 : fibonacciInput}):</Typography>
                    <Typography variant="caption" paragraph>
                      (Showing a simplified tree - the actual tree grows exponentially)
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      minHeight: '200px',
                      mt: 3
                    }}>
                      {/* Root node */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: theme.palette.secondary.main,
                        color: 'white',
                        borderRadius: '50%',
                        boxShadow: 1,
                        zIndex: 1
                      }}>
                        fib({fibonacciInput > 5 ? 5 : fibonacciInput})
                      </Box>
                      
                      {fibonacciInput > 1 && fibonacciInput <= 5 && (
                        <>
                          {/* Left branch connector */}
                          <Box sx={{
                            position: 'absolute',
                            top: '40px',
                            left: 'calc(50% - 40px)',
                            width: '40px',
                            height: '20px',
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          {/* Right branch connector */}
                          <Box sx={{
                            position: 'absolute',
                            top: '40px',
                            right: 'calc(50% - 40px)',
                            width: '40px',
                            height: '20px',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          {/* First level nodes */}
                          <Box sx={{
                            position: 'absolute',
                            top: '60px',
                            left: 'calc(50% - 70px)',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1
                          }}>
                            fib({fibonacciInput > 5 ? 4 : fibonacciInput - 1})
                          </Box>
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '60px',
                            right: 'calc(50% - 70px)',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1
                          }}>
                            fib({fibonacciInput > 5 ? 3 : fibonacciInput - 2})
                          </Box>
                        </>
                      )}
                      
                      {fibonacciInput > 2 && fibonacciInput <= 5 && (
                        <>
                          {/* Second level connectors - left side */}
                          <Box sx={{
                            position: 'absolute',
                            top: '95px',
                            left: 'calc(50% - 90px)',
                            width: '30px',
                            height: '20px',
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '95px',
                            left: 'calc(50% - 60px)',
                            width: '30px',
                            height: '20px',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          {/* Second level connectors - right side */}
                          <Box sx={{
                            position: 'absolute',
                            top: '95px',
                            right: 'calc(50% - 90px)',
                            width: '30px',
                            height: '20px',
                            borderLeft: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '95px',
                            right: 'calc(50% - 60px)',
                            width: '30px',
                            height: '20px',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }} />
                          
                          {/* Second level nodes */}
                          <Box sx={{
                            position: 'absolute',
                            top: '115px',
                            left: 'calc(50% - 110px)',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.dark,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1,
                            fontSize: '0.75rem'
                          }}>
                            fib({fibonacciInput > 5 ? 3 : fibonacciInput - 2})
                          </Box>
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '115px',
                            left: 'calc(50% - 50px)',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.dark,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1,
                            fontSize: '0.75rem'
                          }}>
                            fib({fibonacciInput > 5 ? 2 : fibonacciInput - 3})
                          </Box>
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '115px',
                            right: 'calc(50% - 110px)',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.dark,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1,
                            fontSize: '0.75rem'
                          }}>
                            fib({fibonacciInput > 5 ? 2 : fibonacciInput - 3})
                          </Box>
                          
                          <Box sx={{
                            position: 'absolute',
                            top: '115px',
                            right: 'calc(50% - 50px)',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: theme.palette.primary.dark,
                            color: 'white',
                            borderRadius: '50%',
                            boxShadow: 1,
                            fontSize: '0.75rem'
                          }}>
                            fib({fibonacciInput > 5 ? 1 : (fibonacciInput - 4 > 0 ? fibonacciInput - 4 : 1)})
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Result: fib({fibonacciInput}) = {fibonacci(fibonacciInput)}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                      Notice how the number of recursive calls grows exponentially, showing why simple 
                      recursive Fibonacci is inefficient for large inputs.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Sorting Visualizer component
const SortingVisualizer: React.FC = () => {
  const theme = useTheme();
  const [array, setArray] = useState<number[]>([]);
  const [sortingSpeed, setSortingSpeed] = useState<number>(50);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [sortingAlgorithm, setSortingAlgorithm] = useState<string>('insertion');

  // Generate random array on component mount and when reset is clicked
  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = [];
    for (let i = 0; i < 20; i++) {
      newArray.push(Math.floor(Math.random() * 80) + 10); // Random numbers between 10 and 90
    }
    setArray(newArray);
  };

  const handleAlgorithmChange = (event: SelectChangeEvent) => {
    setSortingAlgorithm(event.target.value);
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setSortingSpeed(newValue as number);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Sorting</Typography>
      <Typography variant="body1" paragraph>
        Sorting algorithms are methods for reorganizing a list of items into a specific order.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: { xs: '1', sm: '0 0 30%' }, mb: { xs: 2, sm: 0 } }}>
            <FormControl fullWidth>
              <InputLabel id="sorting-algorithm-label">Algorithm</InputLabel>
              <Select
                labelId="sorting-algorithm-label"
                id="sorting-algorithm"
                value={sortingAlgorithm}
                label="Algorithm"
                onChange={handleAlgorithmChange}
                disabled={isSorting}
              >
                <MenuItem value="insertion">Insertion Sort</MenuItem>
                <MenuItem value="merge">Merge Sort</MenuItem>
                <MenuItem value="quick">Quick Sort</MenuItem>
                <MenuItem value="bucket">Bucket Sort</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: { xs: '1', sm: '0 0 30%' }, mb: { xs: 2, sm: 0 } }}>
            <Typography id="speed-slider-label" gutterBottom>Speed</Typography>
            <Slider
              value={sortingSpeed}
              onChange={handleSpeedChange}
              aria-labelledby="speed-slider-label"
              min={10}
              max={100}
              disabled={isSorting}
            />
          </Box>
          <Box sx={{ flex: { xs: '1', sm: '0 0 40%' } }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<RestartAltIcon />}
                onClick={resetArray}
                disabled={isSorting}
              >
                Reset Array
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isSorting ? <PauseIcon /> : <PlayArrowIcon />}
                disabled={true} // Enabled once implementations are added
              >
                {isSorting ? 'Pause' : 'Start'}
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<StopIcon />}
                disabled={!isSorting}
              >
                Stop
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Insertion Sort Section */}
      <Accordion defaultExpanded={sortingAlgorithm === 'insertion'}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Insertion Sort</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Insertion sort builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Time Complexity:</strong> O(n²) in worst and average case
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Space Complexity:</strong> O(1) - in-place sorting
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Stability:</strong> Stable sort algorithm
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Adaptive:</strong> O(n) time when array is nearly sorted
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code Implementation:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def insertion_sort(arr):
    # Create a copy of the input array
    sorted_arr = arr.copy()
    
    for i in range(1, len(sorted_arr)):
        current = sorted_arr[i]
        j = i - 1
        
        # Shift elements that are greater than current
        # to one position ahead of their current position
        while j >= 0 and sorted_arr[j] > current:
            sorted_arr[j + 1] = sorted_arr[j]
            j -= 1
        
        sorted_arr[j + 1] = current
    
    return sorted_arr`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '200px', mt: 2 }}>
                    {array.map((value, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: `${100 / array.length}%`,
                          maxWidth: '30px',
                          height: `${value * 2}px`,
                          bgcolor: theme.palette.primary.main,
                          mx: 0.5,
                          borderRadius: '2px 2px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', textAlign: 'center' }}>
                    Insertion sort will be animated in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Merge Sort Section */}
      <Accordion defaultExpanded={sortingAlgorithm === 'merge'}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Merge Sort</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Merge sort is an efficient, stable, divide-and-conquer sorting algorithm that divides the input array into two halves, 
              recursively sorts them, and then merges the sorted halves.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Time Complexity:</strong> O(n log n) in all cases
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Space Complexity:</strong> O(n) - requires additional space
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Stability:</strong> Stable sort algorithm
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Divide and Conquer:</strong> Splits, sorts, and merges sub-arrays
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code Implementation:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    # Compare elements from both halves and add smaller one to result
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '200px', mt: 2 }}>
                    {array.map((value, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: `${100 / array.length}%`,
                          maxWidth: '30px',
                          height: `${value * 2}px`,
                          bgcolor: theme.palette.primary.main,
                          mx: 0.5,
                          borderRadius: '2px 2px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', textAlign: 'center' }}>
                    Merge sort will be animated in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Quick Sort Section */}
      <Accordion defaultExpanded={sortingAlgorithm === 'quick'}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Quick Sort</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Quick sort is a highly efficient sorting algorithm that uses a divide-and-conquer strategy with a pivot element to partition the array.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Time Complexity:</strong> O(n log n) average, O(n²) worst case
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Space Complexity:</strong> O(log n) due to recursion stack
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Stability:</strong> Not stable without modifications
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>In-place:</strong> Typically implemented as in-place sorting
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code Implementation:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            # Swap arr[i] and arr[j]
            arr[i], arr[j] = arr[j], arr[i]
    
    # Swap pivot into its final sorted position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '200px', mt: 2 }}>
                    {array.map((value, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: `${100 / array.length}%`,
                          maxWidth: '30px',
                          height: `${value * 2}px`,
                          bgcolor: theme.palette.primary.main,
                          mx: 0.5,
                          borderRadius: '2px 2px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', textAlign: 'center' }}>
                    Quick sort will be animated in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Bucket Sort Section */}
      <Accordion defaultExpanded={sortingAlgorithm === 'bucket'}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Bucket Sort</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Bucket sort divides the array into a number of buckets, sorts each bucket individually, and then concatenates the results.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Time Complexity:</strong> O(n + k) average case, O(n²) worst case
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Space Complexity:</strong> O(n + k) for n elements and k buckets
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Stability:</strong> Stable if the underlying sort is stable
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Distribution:</strong> Works best with uniform distributions
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code Implementation:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def bucket_sort(arr, bucket_count=5):
    if len(arr) <= 1:
        return arr
    
    # Create buckets
    buckets = [[] for _ in range(bucket_count)]
    
    # Find min and max values
    min_value = min(arr)
    max_value = max(arr)
    value_range = max_value - min_value
    
    # Distribute values into buckets
    for num in arr:
        # Handle edge case where all values are the same
        if value_range == 0:
            bucket_index = 0
        else:
            bucket_index = min(
                int(((num - min_value) / value_range) * bucket_count),
                bucket_count - 1
            )
        buckets[bucket_index].append(num)
    
    # Sort individual buckets and concatenate
    result = []
    for bucket in buckets:
        result.extend(sorted(bucket))
    
    return result`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '200px', mt: 2 }}>
                    {array.map((value, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          width: `${100 / array.length}%`,
                          maxWidth: '30px',
                          height: `${value * 2}px`,
                          bgcolor: theme.palette.primary.main,
                          mx: 0.5,
                          borderRadius: '2px 2px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', textAlign: 'center' }}>
                    Bucket sort will be animated in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Binary Search Visualizer component
const BinarySearchVisualizer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Binary Search</Typography>
      <Typography variant="body1" paragraph>
        Binary search is an efficient algorithm for finding a target value within a sorted array.
      </Typography>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Search Array</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Binary search works by repeatedly dividing the search interval in half, comparing the middle element with the target value.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Characteristics:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Time Complexity:</strong> O(log n)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Space Complexity:</strong> O(1) for iterative implementation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Requires:</strong> Sorted array
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Efficiency:</strong> Much faster than linear search for large datasets
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code Implementation:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found target at index mid
        
        if arr[mid] < target:
            left = mid + 1  # Target is in the right half
        else:
            right = mid - 1  # Target is in the left half
    
    return -1  # Target not found`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Typography variant="body1" sx={{ mt: 8, textAlign: 'center' }}>
                    Binary Search Array visualization will be implemented in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Search Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="body1" paragraph>
              Binary search can also be used to find the bounds of a range where a certain condition is met.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Typography variant="subtitle1" gutterBottom>Applications:</Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      <strong>Lower Bound:</strong> Find first occurrence of a value
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Upper Bound:</strong> Find last occurrence of a value
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <strong>Search Space:</strong> Can be used on answer ranges, not just arrays
                    </Typography>
                  </li>
                </ul>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Code (Lower Bound):</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <pre style={{ margin: 0, overflow: 'auto' }}>
                      {`def lower_bound(arr, target):
    left = 0
    right = len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] >= target:
            if arr[mid] == target:
                result = mid  # Potential result found
            right = mid - 1  # Continue searching left
        else:
            left = mid + 1
    
    return result`}
                    </pre>
                  </Paper>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom>Visualization</Typography>
                  <Typography variant="body1" sx={{ mt: 8, textAlign: 'center' }}>
                    Binary Search Range visualization will be implemented in a future update.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// Helper functions for the visualizations
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Main DSA Visualizer component
const DSAVisualizer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: { xs: 2, sm: 4 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1"
          align="center"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Data Structures & Algorithms Visualizer
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="dsa visualizer tabs"
              >
                <Tab label="Arrays" {...a11yProps(0)} />
                <Tab label="Linked Lists" {...a11yProps(1)} />
                <Tab label="Recursion" {...a11yProps(2)} />
                <Tab label="Sorting" {...a11yProps(3)} />
                <Tab label="Binary Search" {...a11yProps(4)} />
                <Tab label="Trees" {...a11yProps(5)} />
                <Tab label="Backtracking" {...a11yProps(6)} />
                <Tab label="Heap/Priority Queue" {...a11yProps(7)} />
                <Tab label="Hashing" {...a11yProps(8)} />
                <Tab label="Graphs" {...a11yProps(9)} />
                <Tab label="Dynamic Programming" {...a11yProps(10)} />
                <Tab label="Bit Manipulation" {...a11yProps(11)} />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <ArraysVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <LinkedListsVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <RecursionVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <SortingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <BinarySearchVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={5}>
              <TreesVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={6}>
              <BacktrackingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={7}>
              <HeapVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={8}>
              <HashingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={9}>
              <GraphsVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={10}>
              <DynamicProgrammingVisualizer />
            </TabPanel>
            
            <TabPanel value={tabValue} index={11}>
              <BitManipulationVisualizer />
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DSAVisualizer; 