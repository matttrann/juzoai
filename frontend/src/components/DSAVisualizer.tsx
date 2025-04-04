import React, { useState, useEffect, useRef } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';

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

// TreesVisualizer component
const TreesVisualizer: React.FC = () => {
  const theme = useTheme();
  const [treeValues, setTreeValues] = useState<number[]>([]);
  const [nodeValue, setNodeValue] = useState<string>('');
  const [treeOperation, setTreeOperation] = useState<string>('insert');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Start by inserting values into the binary search tree.');
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to clean up timers
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  // Create a tree from the values
  class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    id: number;
    x: number;
    y: number;
    
    constructor(val: number, id: number, level: number = 0, position: number = 0) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.id = id;
      this.x = position;
      this.y = level * 70; // Vertical spacing between levels
    }
  }

  // Build the BST from the values array
  const buildTree = (values: number[]): TreeNode | null => {
    if (values.length === 0) return null;
    
    let root: TreeNode | null = null;
    let nodeId = 0;
    
    // Insert values one by one to create a BST
    for (const value of values) {
      root = insertNode(root, value, nodeId);
      nodeId++;
    }
    
    // Assign horizontal positions to create a balanced visual tree
    if (root) {
      computeNodePositions(root);
    }
    
    return root;
  };

  // Insert a node into the BST
  const insertNode = (
    node: TreeNode | null, 
    value: number, 
    nodeId: number, 
    level: number = 0, 
    position: number = 0
  ): TreeNode => {
    if (node === null) {
      return new TreeNode(value, nodeId, level, position);
    }
    
    if (value < node.val) {
      node.left = insertNode(node.left, value, nodeId, level + 1, position - 1);
    } else if (value > node.val) {
      node.right = insertNode(node.right, value, nodeId, level + 1, position + 1);
    }
    
    return node;
  };

  // Compute horizontal positions for a balanced visual layout
  const computeNodePositions = (root: TreeNode): void => {
    const nodePositions = new Map<number, number>(); // Map to store horizontal positions
    const minMaxX = { min: 0, max: 0 };
    
    // First pass: compute relative positions
    calculateInitialPositions(root, 0, nodePositions, minMaxX);
    
    // Normalize positions to be centered
    const totalWidth = minMaxX.max - minMaxX.min;
    const center = (minMaxX.min + minMaxX.max) / 2;
    
    // Second pass: apply normalized positions
    applyNormalizedPositions(root, nodePositions, center, totalWidth);
  };

  // Calculate initial relative positions
  const calculateInitialPositions = (
    node: TreeNode | null, 
    level: number, 
    positions: Map<number, number>,
    minMaxX: { min: number, max: number }
  ): number => {
    if (!node) return 0;
    
    const leftWidth = calculateInitialPositions(node.left, level + 1, positions, minMaxX);
    const rightWidth = calculateInitialPositions(node.right, level + 1, positions, minMaxX);
    
    // Current node's position is based on its children
    const nodePosition = node.left ? positions.get(node.left.id)! + 1 : 
                           (positions.size > 0 ? Math.min(...Array.from(positions.values())) - 1 : 0);
    
    positions.set(node.id, nodePosition);
    node.y = level * 70;
    
    // Update min and max horizontal positions
    minMaxX.min = Math.min(minMaxX.min, nodePosition);
    minMaxX.max = Math.max(minMaxX.max, nodePosition);
    
    return leftWidth + 1 + rightWidth;
  };

  // Apply normalized positions for visual balance
  const applyNormalizedPositions = (
    node: TreeNode | null, 
    positions: Map<number, number>,
    center: number,
    totalWidth: number
  ): void => {
    if (!node) return;
    
    // Normalize the position to be between 0 and 1, then scale to desired width
    const normalizedPosition = (positions.get(node.id)! - center) / (totalWidth || 1);
    node.x = normalizedPosition * 300; // Scale to visual width
    
    applyNormalizedPositions(node.left, positions, center, totalWidth);
    applyNormalizedPositions(node.right, positions, center, totalWidth);
  };

  // Find a node in the BST
  const findNode = (root: TreeNode | null, value: number, path: number[] = []): number[] | null => {
    if (!root) return null;
    
    path.push(root.id);
    
    if (root.val === value) {
      return path;
    }
    
    if (value < root.val && root.left) {
      return findNode(root.left, value, path);
    } else if (value > root.val && root.right) {
      return findNode(root.right, value, path);
    }
    
    return path; // Return the path even if node not found (to show search path)
  };

  // Traversal algorithms
  const inOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (!root) return result;
    
    inOrderTraversal(root.left, result);
    result.push(root.id);
    inOrderTraversal(root.right, result);
    
    return result;
  };

  const preOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (!root) return result;
    
    result.push(root.id);
    preOrderTraversal(root.left, result);
    preOrderTraversal(root.right, result);
    
    return result;
  };

  const postOrderTraversal = (root: TreeNode | null, result: number[] = []): number[] => {
    if (!root) return result;
    
    postOrderTraversal(root.left, result);
    postOrderTraversal(root.right, result);
    result.push(root.id);
    
    return result;
  };

  const levelOrderTraversal = (root: TreeNode | null): number[] => {
    const result: number[] = [];
    if (!root) return result;
    
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.id);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  };

  // Handle tree operations
  const handleOperation = () => {
    const value = parseInt(nodeValue);
    
    if (isNaN(value)) {
      setStatusMessage('Please enter a valid number.');
      return;
    }
    
    if (treeOperation === 'insert') {
      if (treeValues.includes(value)) {
        setStatusMessage(`Value ${value} already exists in the tree.`);
        return;
      }
      
      setTreeValues([...treeValues, value]);
      setStatusMessage(`Value ${value} has been inserted.`);
      setNodeValue('');
    } else if (treeOperation === 'search') {
      setNodeValue('');
      animateSearch(value);
    } else if (treeOperation === 'traversal') {
      animateTraversal(value);
    }
  };

  // Handle random tree generation
  const generateRandomTree = () => {
    if (isAnimating) return;
    
    const uniqueValues = new Set<number>();
    const numberOfNodes = Math.floor(Math.random() * 6) + 5; // 5-10 nodes
    
    while (uniqueValues.size < numberOfNodes) {
      uniqueValues.add(Math.floor(Math.random() * 100));
    }
    
    setTreeValues(Array.from(uniqueValues));
    setStatusMessage(`Generated a random tree with ${numberOfNodes} nodes.`);
    setActiveNodes([]);
    setVisitedNodes([]);
    setHighlightedPath([]);
    setTraversalOrder([]);
  };

  // Handle clearing the tree
  const clearTree = () => {
    if (isAnimating) return;
    
    setTreeValues([]);
    setNodeValue('');
    setActiveNodes([]);
    setVisitedNodes([]);
    setHighlightedPath([]);
    setTraversalOrder([]);
    setStatusMessage('Tree cleared. Start by inserting values.');
  };

  // Animate the search operation
  const animateSearch = (value: number) => {
    if (isAnimating) return;
    
    const tree = buildTree(treeValues);
    if (!tree) {
      setStatusMessage('Tree is empty. Please insert values first.');
      return;
    }
    
    const searchPath = findNode(tree, value);
    if (!searchPath || searchPath.length === 0) {
      setStatusMessage(`Value ${value} not found in the tree.`);
      return;
    }
    
    setIsAnimating(true);
    setActiveNodes([]);
    setVisitedNodes([]);
    setHighlightedPath([]);
    setStatusMessage(`Searching for ${value}...`);
    
    // Animate search path
    let step = 0;
    const animateStep = () => {
      if (step < searchPath.length) {
        setActiveNodes([searchPath[step]]);
        setHighlightedPath(searchPath.slice(0, step + 1));
        
        const node = getNodeById(tree, searchPath[step]);
        if (node) {
          if (node.val === value) {
            setStatusMessage(`Found ${value} at node ID ${searchPath[step]}!`);
          } else if (value < node.val) {
            setStatusMessage(`${value} < ${node.val}, moving to left child...`);
          } else {
            setStatusMessage(`${value} > ${node.val}, moving to right child...`);
          }
        }
        
        step++;
        animationTimerRef.current = setTimeout(animateStep, 1000);
      } else {
        const lastNode = getNodeById(tree, searchPath[searchPath.length - 1]);
        if (lastNode && lastNode.val !== value) {
          setStatusMessage(`Value ${value} not found in the tree.`);
        }
        setIsAnimating(false);
      }
    };
    
    animateStep();
  };

  // Get a node by its ID
  const getNodeById = (root: TreeNode | null, id: number): TreeNode | null => {
    if (!root) return null;
    if (root.id === id) return root;
    
    const leftResult = getNodeById(root.left, id);
    if (leftResult) return leftResult;
    
    return getNodeById(root.right, id);
  };

  // Animate the traversal operation
  const animateTraversal = (traversalType: number) => {
    if (isAnimating) return;
    
    const tree = buildTree(treeValues);
    if (!tree) {
      setStatusMessage('Tree is empty. Please insert values first.');
      return;
    }
    
    setIsAnimating(true);
    setActiveNodes([]);
    setVisitedNodes([]);
    setHighlightedPath([]);
    
    let traversalPath: number[] = [];
    let traversalName = '';
    
    // Get the traversal path based on the selected type
    switch (traversalType) {
      case 1: // In-order
        traversalPath = inOrderTraversal(tree);
        traversalName = 'In-order';
        break;
      case 2: // Pre-order
        traversalPath = preOrderTraversal(tree);
        traversalName = 'Pre-order';
        break;
      case 3: // Post-order
        traversalPath = postOrderTraversal(tree);
        traversalName = 'Post-order';
        break;
      case 4: // Level-order
        traversalPath = levelOrderTraversal(tree);
        traversalName = 'Level-order';
        break;
      default:
        traversalPath = inOrderTraversal(tree);
        traversalName = 'In-order';
    }
    
    setTraversalOrder(traversalPath);
    setStatusMessage(`${traversalName} traversal: Starting...`);
    
    // Animate traversal
    let step = 0;
    const animateStep = () => {
      if (step < traversalPath.length) {
        const nodeId = traversalPath[step];
        setActiveNodes([nodeId]);
        setVisitedNodes(prev => [...prev, nodeId]);
        
        const node = getNodeById(tree, nodeId);
        if (node) {
          setStatusMessage(`${traversalName} traversal: Visiting node with value ${node.val}`);
        }
        
        step++;
        animationTimerRef.current = setTimeout(animateStep, 1000);
      } else {
        // Create value sequence for the traversal
        const valueSequence = traversalPath.map(id => {
          const node = getNodeById(tree, id);
          return node ? node.val : null;
        }).filter(val => val !== null);
        
        setStatusMessage(
          `${traversalName} traversal complete. Order: [${valueSequence.join(', ')}]`
        );
        setActiveNodes([]);
        setIsAnimating(false);
      }
    };
    
    animateStep();
  };

  // Render the tree
  const renderTree = () => {
    const tree = buildTree(treeValues);
    if (!tree) return null;
    
    // Collect all nodes for rendering
    const nodes: TreeNode[] = [];
    const edges: { from: TreeNode, to: TreeNode }[] = [];
    
    // Traverse the tree to collect nodes and edges
    const collectNodes = (node: TreeNode | null) => {
      if (!node) return;
      
      nodes.push(node);
      
      if (node.left) {
        edges.push({ from: node, to: node.left });
        collectNodes(node.left);
      }
      
      if (node.right) {
        edges.push({ from: node, to: node.right });
        collectNodes(node.right);
      }
    };
    
    collectNodes(tree);
    
    // Calculate the tree dimensions
    const maxY = Math.max(...nodes.map(n => n.y)) + 70;
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const width = Math.max(600, maxX - minX + 200);
    
    return (
      <Box sx={{ 
        position: 'relative', 
        height: maxY,
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Render edges */}
        {edges.map((edge, index) => {
          const fromX = edge.from.x + width / 2;
          const fromY = edge.from.y + 20;
          const toX = edge.to.x + width / 2;
          const toY = edge.to.y;
          
          // Check if this edge is part of the highlighted path
          const isHighlighted = highlightedPath.includes(edge.from.id) && 
                               highlightedPath.includes(edge.to.id) &&
                               Math.abs(highlightedPath.indexOf(edge.from.id) - 
                                       highlightedPath.indexOf(edge.to.id)) === 1;
          
          return (
            <Box 
              key={`edge-${index}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
                zIndex: 1
              }}
            >
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={isHighlighted ? theme.palette.error.main : theme.palette.text.secondary}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeDasharray={isHighlighted ? "none" : "none"}
                />
              </svg>
            </Box>
          );
        })}
        
        {/* Render nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.includes(node.id);
          const isVisited = visitedNodes.includes(node.id);
          const isInPath = highlightedPath.includes(node.id);
          
          // Calculate animation index for traversal
          const traversalIndex = traversalOrder.indexOf(node.id);
          
          let bgColor = theme.palette.primary.main;
          if (isActive) {
            bgColor = theme.palette.error.main;
          } else if (isVisited) {
            bgColor = theme.palette.success.main;
          } else if (isInPath) {
            bgColor = theme.palette.warning.main;
          }
          
          return (
            <Box
              key={`node-${node.id}`}
              sx={{
                position: 'absolute',
                top: node.y,
                left: `calc(50% + ${node.x}px - 20px)`,
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: bgColor,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                zIndex: 2,
                boxShadow: isActive || isInPath ? 4 : 1,
                transition: 'all 0.3s ease-in-out',
                border: isActive ? `2px solid ${theme.palette.error.light}` : 'none'
              }}
            >
              {node.val}
              {traversalIndex !== -1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: theme.palette.secondary.main,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {traversalIndex + 1}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Trees</Typography>
      <Typography variant="body1" paragraph>
        Trees are hierarchical data structures with a root value and subtrees of children with a parent node.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Binary Search Tree Visualizer</Typography>
        
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="operation-select-label">Operation</InputLabel>
            <Select
              labelId="operation-select-label"
              id="operation-select"
              value={treeOperation}
              label="Operation"
              onChange={(e) => setTreeOperation(e.target.value)}
              disabled={isAnimating}
            >
              <MenuItem value="insert">Insert</MenuItem>
              <MenuItem value="search">Search</MenuItem>
              <MenuItem value="traversal">Traversal</MenuItem>
            </Select>
          </FormControl>
          
          {treeOperation === 'traversal' ? (
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="traversal-select-label">Traversal Type</InputLabel>
              <Select
                labelId="traversal-select-label"
                id="traversal-select"
                value={nodeValue || '1'}
                label="Traversal Type"
                onChange={(e) => setNodeValue(e.target.value)}
                disabled={isAnimating}
              >
                <MenuItem value="1">In-order</MenuItem>
                <MenuItem value="2">Pre-order</MenuItem>
                <MenuItem value="3">Post-order</MenuItem>
                <MenuItem value="4">Level-order</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Node Value"
              variant="outlined"
              value={nodeValue}
              onChange={(e) => setNodeValue(e.target.value)}
              type="number"
              disabled={isAnimating}
              sx={{ width: 150 }}
            />
          )}
          
          <Button
            variant="contained"
            onClick={handleOperation}
            disabled={
              isAnimating || 
              (treeOperation !== 'traversal' && !nodeValue) || 
              (treeOperation === 'search' && treeValues.length === 0)
            }
          >
            {treeOperation === 'insert' ? 'Insert' : 
              treeOperation === 'search' ? 'Search' : 'Start Traversal'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={generateRandomTree}
            disabled={isAnimating}
          >
            Random Tree
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearTree}
            disabled={isAnimating || treeValues.length === 0}
          >
            Clear Tree
          </Button>
        </Box>
        
        <Paper 
          elevation={1}
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: theme.palette.background.default,
            minHeight: '50px'
          }}
        >
          <Typography variant="body1">{statusMessage}</Typography>
        </Paper>
        
        <Box 
          sx={{ 
            height: 350, 
            p: 2, 
            display: 'flex', 
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: 1,
            overflow: 'auto'
          }}
        >
          {treeValues.length > 0 ? (
            renderTree()
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1" color="text.secondary">
                Tree is empty. Insert nodes or generate a random tree.
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Legend:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.primary.main, mr: 1 }}></Box>
              <Typography variant="body2">Regular Node</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.error.main, mr: 1 }}></Box>
              <Typography variant="body2">Current Node</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.warning.main, mr: 1 }}></Box>
              <Typography variant="body2">Path Node</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: theme.palette.success.main, mr: 1 }}></Box>
              <Typography variant="body2">Visited Node</Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Binary Search Tree Operations</Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 1 }}>
            <Box sx={{ flex: { xs: '1', md: '0 0 48%' } }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Insertion:</strong> O(log n) average, O(n) worst case
              </Typography>
              <Typography variant="body2" paragraph>
                Nodes are added based on their value - smaller values go left, larger values go right.
                This creates an ordered tree where in-order traversal gives sorted values.
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1', md: '0 0 48%' } }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Traversal Types:</strong>
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  <li><strong>In-order:</strong> Left → Root → Right (gives sorted order)</li>
                  <li><strong>Pre-order:</strong> Root → Left → Right (useful for copying a tree)</li>
                  <li><strong>Post-order:</strong> Left → Right → Root (useful for deletion)</li>
                  <li><strong>Level-order:</strong> Visit nodes by level, from top to bottom</li>
                </ul>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Tree Data Structure Properties</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: { xs: '1', md: '0 0 31%' } }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Binary Search Tree</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              • Each node has at most 2 children<br />
              • Left child is less than parent<br />
              • Right child is greater than parent<br />
              • Allows for efficient searching, insertion and deletion<br />
              • Search: O(log n) average case
            </Typography>
          </Box>
          <Box sx={{ flex: { xs: '1', md: '0 0 31%' } }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Balanced vs Unbalanced</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              • Balanced trees maintain O(log n) operations<br />
              • Unbalanced trees degrade to O(n) in worst case<br />
              • Self-balancing trees (AVL, Red-Black) maintain balance<br />
              • Balancing adds overhead but guarantees performance
            </Typography>
          </Box>
          <Box sx={{ flex: { xs: '1', md: '0 0 31%' } }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Other Tree Types</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              • AVL Tree: Strictly balanced BST<br />
              • Red-Black Tree: Nearly balanced BST<br />
              • B-Tree: Multi-way search tree (databases)<br />
              • Trie: Digital tree for strings<br />
              • Heap: Complete binary tree (priority queue)
            </Typography>
          </Box>
        </Box>
      </Paper>
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
  const [recursionType, setRecursionType] = useState<string>('factorial');
  const [inputValue, setInputValue] = useState<number>(5);
  const [maxDepth, setMaxDepth] = useState<number>(10);
  
  // Implement factorial function
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };
  
  // Implement fibonacci function
  const fibonacci = (n: number): number => {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };
  
  // Calculate recursive result
  const calculateResult = (): number => {
    if (recursionType === 'factorial') {
      return factorial(inputValue);
    } else {
      return fibonacci(inputValue);
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Recursion</Typography>
      <Typography variant="body1" paragraph>
        Recursion is a method of solving problems where a function calls itself as a subroutine.
      </Typography>
      
      {/* Recursion Type Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="recursion-type-label">Recursion Type</InputLabel>
        <Select
          labelId="recursion-type-label"
          id="recursion-type"
          value={recursionType}
          label="Recursion Type"
          onChange={(e) => {
            setRecursionType(e.target.value);
            setInputValue(e.target.value === 'factorial' ? 5 : 6);
          }}
        >
          <MenuItem value="factorial">Factorial</MenuItem>
          <MenuItem value="fibonacci">Fibonacci</MenuItem>
        </Select>
      </FormControl>
      
      {/* Factorial Section */}
      {recursionType === 'factorial' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Factorial Recursion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="body1" paragraph>
                <strong>Base case:</strong> factorial(0) = 1
                <br />
                <strong>Recursive case:</strong> factorial(n) = n × factorial(n-1) for n {'>'} 0
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                  <Typography variant="subtitle1" gutterBottom>Factorial Calculation:</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Select value for n:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Slider
                        value={inputValue}
                        onChange={(_, value) => setInputValue(value as number)}
                        step={1}
                        marks
                        min={0}
                        max={10}
                        valueLabelDisplay="auto"
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body1" sx={{ width: 40 }}>{inputValue}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body1">
                      <strong>Result: factorial({inputValue}) = {factorial(inputValue)}</strong>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                  <Typography variant="subtitle1" gutterBottom>Recursive Call Stack:</Typography>
                  <Box sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    maxHeight: '240px',
                    overflow: 'auto',
                    borderRadius: '4px'
                  }}>
                    {Array.from({ length: inputValue + 1 }).map((_, index) => {
                      const n = inputValue - index;
                      return (
                        <Box key={index} sx={{
                          p: 1.5,
                          borderBottom: index < inputValue ? `1px solid ${theme.palette.divider}` : 'none',
                          bgcolor: index === 0 
                            ? theme.palette.primary.main 
                            : index === inputValue 
                              ? theme.palette.success.light
                              : theme.palette.primary.dark,
                          color: 'white',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}>
                          {index === 0 ? (
                            <Box>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                factorial({n})
                              </Typography>
                              <Typography variant="body2" component="span" sx={{ opacity: 0.8, ml: 1 }}>
                                // Initial call
                              </Typography>
                            </Box>
                          ) : index === inputValue ? (
                            <Box>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                factorial(0) = 1
                              </Typography>
                              <Typography variant="body2" component="span" sx={{ opacity: 0.8, ml: 1 }}>
                                // Base case reached
                              </Typography>
                            </Box>
                          ) : (
                            <Box>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                factorial({n}) = {n} × factorial({n-1})
                              </Typography>
                              <Typography variant="body2" component="span" sx={{ opacity: 0.8, ml: 1 }}>
                                = {n} × {factorial(n-1)} = {factorial(n)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Fibonacci Section */}
      {recursionType === 'fibonacci' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Fibonacci Recursion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="body1" paragraph>
                <strong>Base cases:</strong> fib(0) = 0, fib(1) = 1
                <br />
                <strong>Recursive case:</strong> fib(n) = fib(n-1) + fib(n-2) for n {'>'}1
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                  <Typography variant="subtitle1" gutterBottom>Fibonacci Calculation:</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Select value for n:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Slider
                        value={inputValue}
                        onChange={(_, value) => setInputValue(value as number)}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body1" sx={{ width: 40 }}>{inputValue}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body1">
                      <strong>Result: fibonacci({inputValue}) = {fibonacci(inputValue)}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Fibonacci Sequence: {Array.from({ length: inputValue + 1 }).map((_, i) => fibonacci(i)).join(', ')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: '1 1 100%', minWidth: '300px', maxWidth: { xs: '100%', md: '45%' } }}>
                  <Typography variant="subtitle1" gutterBottom>Problems with Simple Recursion:</Typography>
                  <Typography variant="body2" paragraph>
                    Computing the Fibonacci sequence using simple recursion has <strong>exponential time complexity</strong> (O(2ⁿ)) because:
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2">
                        <strong>Redundant calculations:</strong> fib(n-2) is computed multiple times
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>Deep recursion:</strong> For larger values of n, the recursion tree grows very large
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <strong>Solution:</strong> Dynamic Programming (memoization) optimizes to O(n)
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Try n = 40 with simple recursion vs. memoization to see the difference!
                  </Typography>
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

// Sorting Visualizer component
const SortingVisualizer: React.FC = () => {
  const theme = useTheme();
  const [array, setArray] = useState<number[]>([]);
  const [sortingSpeed, setSortingSpeed] = useState<number>(50);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sortingAlgorithm, setSortingAlgorithm] = useState<string>('insertion');
  const [animations, setAnimations] = useState<any[]>([]);
  const [animationIndex, setAnimationIndex] = useState<number>(0);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number>(-1); // For quicksort pivot visualization
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array on component mount and when reset is clicked
  useEffect(() => {
    resetArray();
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  // Effect to handle animations
  useEffect(() => {
    if (isSorting && !isPaused && animations.length > 0 && animationIndex < animations.length) {
      const animation = animations[animationIndex];
      
      // Apply the current animation step
      if (animation.type === 'compare') {
        setComparingIndices(animation.indices);
        setSwappingIndices([]);
        setPivotIndex(animation.pivot !== undefined ? animation.pivot : -1);
      } else if (animation.type === 'swap') {
        setComparingIndices([]);
        setSwappingIndices(animation.indices);
        setPivotIndex(animation.pivot !== undefined ? animation.pivot : -1);
        setCurrentArray([...animation.array]);
      } else if (animation.type === 'sorted') {
        setSortedIndices(prev => [...prev, ...animation.indices]);
        setComparingIndices([]);
        setSwappingIndices([]);
      } else if (animation.type === 'final') {
        setCurrentArray([...animation.array]);
        setSortedIndices(Array.from({ length: animation.array.length }, (_, i) => i));
        setComparingIndices([]);
        setSwappingIndices([]);
        setPivotIndex(-1);
      }

      // Schedule next animation step
      const speed = 110 - sortingSpeed; // Invert speed (higher value = faster)
      animationTimerRef.current = setTimeout(() => {
        setAnimationIndex(animationIndex + 1);
        if (animationIndex === animations.length - 1) {
          setIsSorting(false);
          setAnimationIndex(0);
          setAnimations([]);
        }
      }, speed);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [isSorting, isPaused, animations, animationIndex, sortingSpeed]);

  const resetArray = () => {
    stopSorting();
    const newArray = [];
    for (let i = 0; i < 15; i++) { // Reduce to 15 elements for clearer visualization
      newArray.push(Math.floor(Math.random() * 80) + 10); // Random numbers between 10 and 90
    }
    setArray(newArray);
    setCurrentArray(newArray);
    setSortedIndices([]);
  };

  const handleAlgorithmChange = (event: SelectChangeEvent) => {
    if (!isSorting) {
      setSortingAlgorithm(event.target.value);
      resetArray();
    }
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setSortingSpeed(newValue as number);
  };

  const startSorting = () => {
    if (isSorting && isPaused) {
      // Resume sorting
      setIsPaused(false);
      return;
    }
    
    if (!isSorting) {
      setIsSorting(true);
      setIsPaused(false);
      setSortedIndices([]);
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotIndex(-1);
      
      // Generate animations based on the selected algorithm
      let sortAnimations: any[] = [];
      switch (sortingAlgorithm) {
        case 'insertion':
          sortAnimations = getInsertionSortAnimations([...array]);
          break;
        case 'merge':
          sortAnimations = getMergeSortAnimations([...array]);
          break;
        case 'quick':
          sortAnimations = getQuickSortAnimations([...array]);
          break;
        case 'bucket':
          sortAnimations = getBucketSortAnimations([...array]);
          break;
        default:
          sortAnimations = getInsertionSortAnimations([...array]);
      }
      
      setAnimations(sortAnimations);
      setAnimationIndex(0);
    }
  };

  const pauseSorting = () => {
    setIsPaused(true);
  };

  const stopSorting = () => {
    setIsSorting(false);
    setIsPaused(false);
    setAnimationIndex(0);
    setAnimations([]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setCurrentArray([...array]);
    setPivotIndex(-1);
  };

  // Animation generators for each algorithm
  const getInsertionSortAnimations = (arr: number[]): any[] => {
    const animations: any[] = [];
    const arrayCopy = [...arr];
    
    for (let i = 1; i < arrayCopy.length; i++) {
      const current = arrayCopy[i];
      
      // Add animation to show the current element we're placing
      animations.push({ 
        type: 'compare', 
        indices: [i],
        description: `Selecting element ${current} at index ${i} to insert into sorted portion`
      });
      
      let j = i - 1;
      while (j >= 0 && arrayCopy[j] > current) {
        // Compare current element with element at j
        animations.push({ 
          type: 'compare', 
          indices: [i, j],
          description: `Comparing ${current} with ${arrayCopy[j]} at index ${j}`
        });
        
        // Shift element to the right
        arrayCopy[j + 1] = arrayCopy[j];
        animations.push({ 
          type: 'swap', 
          indices: [j, j + 1],
          array: [...arrayCopy],
          description: `Shifting ${arrayCopy[j]} to the right`
        });
        
        j--;
      }
      
      // Place current element in its correct position
      arrayCopy[j + 1] = current;
      animations.push({ 
        type: 'swap', 
        indices: [j + 1],
        array: [...arrayCopy],
        description: `Placing ${current} at correct position (index ${j + 1})`
      });
      
      // Mark first i+1 elements as sorted
      animations.push({ 
        type: 'sorted', 
        indices: [j + 1],
        description: `Element ${current} is now in sorted position`
      });
    }
    
    animations.push({ 
      type: 'final', 
      array: arrayCopy,
      description: 'Array is fully sorted'
    });
    
    return animations;
  };

  const getMergeSortAnimations = (arr: number[]): any[] => {
    const animations: any[] = [];
    const arrayCopy = [...arr];
    const auxArray = [...arr];
    
    mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1, auxArray, animations);
    
    animations.push({ 
      type: 'final', 
      array: arrayCopy,
      description: 'Array is fully sorted'
    });
    
    return animations;
  };

  const mergeSortHelper = (
    mainArray: number[], 
    start: number, 
    end: number, 
    auxArray: number[], 
    animations: any[]
  ) => {
    if (start === end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    // Add an animation to show the split points
    if (end - start > 1) {
      animations.push({
        type: 'compare',
        indices: [start, mid, end],
        description: `Dividing array from index ${start} to ${end} at midpoint ${mid}`
      });
    }
    
    mergeSortHelper(auxArray, start, mid, mainArray, animations);
    mergeSortHelper(auxArray, mid + 1, end, mainArray, animations);
    
    // Add an animation to show we're about to merge
    animations.push({
      type: 'compare',
      indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      description: `Merging subarrays from index ${start} to ${end}`
    });
    
    merge(mainArray, start, mid, end, auxArray, animations);
  };

  const merge = (
    mainArray: number[], 
    start: number, 
    mid: number, 
    end: number, 
    auxArray: number[], 
    animations: any[]
  ) => {
    let k = start;
    let i = start;
    let j = mid + 1;
    
    // Add animation to show the two arrays we're merging
    animations.push({
      type: 'compare',
      indices: [...Array.from({ length: mid - start + 1 }, (_, idx) => start + idx), 
                ...Array.from({ length: end - mid }, (_, idx) => mid + 1 + idx)],
      description: `Comparing elements from left subarray (${start}-${mid}) and right subarray (${mid+1}-${end})`
    });
    
    while (i <= mid && j <= end) {
      // Compare values
      animations.push({ 
        type: 'compare', 
        indices: [i, j],
        description: `Comparing ${auxArray[i]} and ${auxArray[j]}`
      });
      
      if (auxArray[i] <= auxArray[j]) {
        // Overwrite value at k in the original array with value at i in the auxiliary array
        mainArray[k] = auxArray[i];
        animations.push({ 
          type: 'swap', 
          indices: [k],
          array: [...mainArray],
          description: `Placing ${auxArray[i]} at position ${k}`
        });
        i++;
      } else {
        // Overwrite value at k in the original array with value at j in the auxiliary array
        mainArray[k] = auxArray[j];
        animations.push({ 
          type: 'swap', 
          indices: [k],
          array: [...mainArray],
          description: `Placing ${auxArray[j]} at position ${k}`
        });
        j++;
      }
      k++;
    }
    
    while (i <= mid) {
      // Copy remaining elements from left side
      animations.push({ 
        type: 'compare', 
        indices: [i],
        description: `Copying remaining element ${auxArray[i]} from left side`
      });
      
      mainArray[k] = auxArray[i];
      animations.push({ 
        type: 'swap', 
        indices: [k],
        array: [...mainArray],
        description: `Placing ${auxArray[i]} at position ${k}`
      });
      i++;
      k++;
    }
    
    while (j <= end) {
      // Copy remaining elements from right side
      animations.push({ 
        type: 'compare', 
        indices: [j],
        description: `Copying remaining element ${auxArray[j]} from right side`
      });
      
      mainArray[k] = auxArray[j];
      animations.push({ 
        type: 'swap', 
        indices: [k],
        array: [...mainArray],
        description: `Placing ${auxArray[j]} at position ${k}`
      });
      j++;
      k++;
    }
    
    // Mark sorted region
    if (end - start > 0) {
      animations.push({ 
        type: 'sorted', 
        indices: Array.from({ length: end - start + 1 }, (_, i) => start + i),
        description: `Subarray from index ${start} to ${end} is now merged and sorted`
      });
    }
  };

  const getQuickSortAnimations = (arr: number[]): any[] => {
    const animations: any[] = [];
    const arrayCopy = [...arr];
    
    quickSortHelper(arrayCopy, 0, arrayCopy.length - 1, animations);
    
    animations.push({ 
      type: 'final', 
      array: arrayCopy,
      description: 'Array is fully sorted'
    });
    
    return animations;
  };

  const quickSortHelper = (
    array: number[], 
    low: number, 
    high: number, 
    animations: any[]
  ) => {
    if (low < high) {
      // Add animation to show the current partition range
      animations.push({ 
        type: 'compare', 
        indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        pivot: high,
        description: `Partitioning subarray from index ${low} to ${high} with pivot ${array[high]}`
      });
      
      const pivotIndex = partition(array, low, high, animations);
      
      // Mark pivot as in correct final position
      animations.push({ 
        type: 'sorted', 
        indices: [pivotIndex],
        description: `Pivot ${array[pivotIndex]} is now in its correct sorted position at index ${pivotIndex}`
      });
      
      // Recursively sort left and right partitions
      if (low < pivotIndex - 1) {
        animations.push({ 
          type: 'compare', 
          indices: Array.from({ length: pivotIndex - low }, (_, i) => low + i),
          description: `Sorting left subarray from index ${low} to ${pivotIndex - 1}`
        });
      }
      
      quickSortHelper(array, low, pivotIndex - 1, animations);
      
      if (pivotIndex + 1 < high) {
        animations.push({ 
          type: 'compare', 
          indices: Array.from({ length: high - pivotIndex }, (_, i) => pivotIndex + 1 + i),
          description: `Sorting right subarray from index ${pivotIndex + 1} to ${high}`
        });
      }
      
      quickSortHelper(array, pivotIndex + 1, high, animations);
    } else if (low === high) {
      // Single element is always sorted
      animations.push({ 
        type: 'sorted', 
        indices: [low],
        description: `Single element ${array[low]} at index ${low} is inherently sorted`
      });
    }
  };

  const partition = (
    array: number[], 
    low: number, 
    high: number, 
    animations: any[]
  ): number => {
    const pivot = array[high];
    animations.push({ 
      type: 'compare', 
      indices: [high],
      pivot: high,
      description: `Selected pivot element: ${pivot}`
    });
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      animations.push({ 
        type: 'compare', 
        indices: [j, high],
        pivot: high,
        description: `Comparing element ${array[j]} with pivot ${pivot}`
      });
      
      if (array[j] <= pivot) {
        i++;
        
        // Only add swap animation if indices are different
        if (i !== j) {
          // Swap array[i] and array[j]
          [array[i], array[j]] = [array[j], array[i]];
          animations.push({ 
            type: 'swap', 
            indices: [i, j],
            pivot: high,
            array: [...array],
            description: `Swapping ${array[i]} and ${array[j]} since ${array[i]} ≤ ${pivot}`
          });
        } else {
          animations.push({ 
            type: 'compare', 
            indices: [i],
            pivot: high,
            description: `Element ${array[i]} is already in correct position relative to pivot`
          });
        }
      }
    }
    
    // Only add swap animation if indices are different
    if (i + 1 !== high) {
      // Swap pivot into its final position
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      animations.push({ 
        type: 'swap', 
        indices: [i + 1, high],
        pivot: i + 1, // Pivot is now at i+1
        array: [...array],
        description: `Moving pivot ${pivot} to its correct position at index ${i + 1}`
      });
    }
    
    return i + 1;
  };

  const getBucketSortAnimations = (arr: number[]): any[] => {
    const animations: any[] = [];
    const arrayCopy = [...arr];
    const bucketCount = 4; // Reduced for clarity
    
    if (arrayCopy.length <= 1) {
      animations.push({ 
        type: 'final', 
        array: arrayCopy,
        description: 'Array with 0 or 1 elements is already sorted'
      });
      return animations;
    }
    
    // Find min and max values
    const minValue = Math.min(...arrayCopy);
    const maxValue = Math.max(...arrayCopy);
    animations.push({ 
      type: 'compare', 
      indices: [],
      description: `Finding min (${minValue}) and max (${maxValue}) values for bucket distribution`
    });
    
    const range = maxValue - minValue;
    
    // Create buckets visualization
    const buckets: number[][] = Array(bucketCount)
      .fill(null)
      .map(() => []);
    
    // Show empty buckets
    animations.push({ 
      type: 'compare', 
      indices: [],
      description: `Created ${bucketCount} empty buckets for distribution`
    });
    
    // Distribute values into buckets
    for (let i = 0; i < arrayCopy.length; i++) {
      animations.push({ 
        type: 'compare', 
        indices: [i],
        description: `Processing element ${arrayCopy[i]} for bucket placement`
      });
      
      // Calculate bucket index
      const num = arrayCopy[i];
      let bucketIndex: number;
      
      if (range === 0) {
        bucketIndex = 0;
        animations.push({ 
          type: 'compare', 
          indices: [i],
          description: `All elements are equal, placing in bucket 0`
        });
      } else {
        bucketIndex = Math.min(
          Math.floor(((num - minValue) / range) * bucketCount),
          bucketCount - 1
        );
        animations.push({ 
          type: 'compare', 
          indices: [i],
          description: `Placing ${num} in bucket ${bucketIndex}`
        });
      }
      
      // Add element to appropriate bucket
      buckets[bucketIndex].push(num);
    }
    
    // Sort individual buckets
    let sortedIndex = 0;
    for (let b = 0; b < buckets.length; b++) {
      if (buckets[b].length > 0) {
        animations.push({ 
          type: 'compare', 
          indices: [],
          description: `Sorting bucket ${b} with elements: [${buckets[b].join(', ')}]`
        });
        
        // Sort this bucket (using simple sort for visualization)
        const bucket = buckets[b].sort((a, b) => a - b);
        
        // Show sorted bucket
        animations.push({ 
          type: 'compare', 
          indices: [],
          description: `Bucket ${b} after sorting: [${bucket.join(', ')}]`
        });
        
        // Place sorted elements back in the array
        for (let i = 0; i < bucket.length; i++) {
          arrayCopy[sortedIndex] = bucket[i];
          
          animations.push({ 
            type: 'swap', 
            indices: [sortedIndex],
            array: [...arrayCopy],
            description: `Placing ${bucket[i]} from bucket ${b} at position ${sortedIndex} in the final array`
          });
          
          // Mark as sorted
          animations.push({ 
            type: 'sorted', 
            indices: [sortedIndex],
            description: `Element ${bucket[i]} is now in its sorted position`
          });
          
          sortedIndex++;
        }
      }
    }
    
    animations.push({ 
      type: 'final', 
      array: arrayCopy,
      description: 'Array is fully sorted'
    });
    
    return animations;
  };

  // Bar color logic
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return theme.palette.success.main;
    }
    if (pivotIndex === index) {
      return theme.palette.error.dark; // Pivot is bright red
    }
    if (swappingIndices.includes(index)) {
      return theme.palette.error.main;
    }
    if (comparingIndices.includes(index)) {
      return theme.palette.warning.main;
    }
    return theme.palette.primary.main;
  };

  // Get current animation description
  const getCurrentDescription = () => {
    if (!isSorting || animations.length === 0 || animationIndex >= animations.length) {
      return "Select an algorithm and press Start to begin visualization";
    }
    return animations[animationIndex].description || "";
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
              disabled={isSorting && !isPaused}
            />
          </Box>
          <Box sx={{ flex: { xs: '1', sm: '0 0 40%' } }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                startIcon={<RestartAltIcon />}
                onClick={resetArray}
                disabled={isSorting && !isPaused}
              >
                Reset Array
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isSorting && !isPaused ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={isSorting && !isPaused ? pauseSorting : startSorting}
              >
                {isSorting && !isPaused ? 'Pause' : 'Start'}
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<StopIcon />}
                onClick={stopSorting}
                disabled={!isSorting}
              >
                Stop
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Visualization Panel - Shared across all algorithms */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom align="center">
          {sortingAlgorithm.charAt(0).toUpperCase() + sortingAlgorithm.slice(1)} Sort Visualization
        </Typography>
        
        {/* Animation Description */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: theme.palette.background.default, 
            mb: 3,
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body1" align="center">
            {getCurrentDescription()}
          </Typography>
        </Paper>
        
        {/* Array Visualization */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center', 
            height: '240px', 
            mt: 2,
            mb: 3,
            position: 'relative',
            mx: 'auto',
            width: '100%'
          }}
        >
          {(isSorting ? currentArray : array).map((value, index) => (
            <Box 
              key={index}
              sx={{ 
                width: `${80 / array.length}%`,
                maxWidth: '50px',
                height: `${value * 2}px`,
                bgcolor: getBarColor(index),
                mx: 0.5,
                borderRadius: '2px 2px 0 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pb: 0.5,
                color: 'white',
                fontSize: array.length <= 15 ? '0.8rem' : '0',
                fontWeight: 'bold',
                transition: 'height 0.3s ease, background-color 0.3s ease'
              }}
            >
              {array.length <= 15 ? value : ''}
            </Box>
          ))}
        </Box>
        
        {/* Animation Legend */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Legend:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.primary.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Unsorted</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.warning.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Comparing</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.error.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Swapping</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.error.dark, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Pivot (Quick Sort)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.success.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Sorted</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Insertion Sort Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Insertion Sort</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Insertion sort builds the final sorted array one item at a time.
          It iterates through an array, consuming one input element at each repetition,
          and growing a sorted output list.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Time Complexity:</strong> O(n²) average and worst case
          <br />
          <strong>Space Complexity:</strong> O(1)
          <br />
          <strong>Stable:</strong> Yes
        </Typography>
      </Paper>
      
      {/* Merge Sort Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Merge Sort</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Merge sort is an efficient, stable, comparison-based, divide and conquer algorithm.
          It divides the input array into two halves, recursively sorts them, and then merges the sorted halves.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Time Complexity:</strong> O(n log n)
          <br />
          <strong>Space Complexity:</strong> O(n)
          <br />
          <strong>Stable:</strong> Yes
        </Typography>
      </Paper>
      
      {/* Quick Sort Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Quick Sort</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Quick sort is a highly efficient sorting algorithm that uses a divide-and-conquer strategy.
          It works by selecting a 'pivot' element and partitioning the array around the pivot.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Time Complexity:</strong> O(n²) worst case, O(n log n) average case
          <br />
          <strong>Space Complexity:</strong> O(log n)
          <br />
          <strong>Stable:</strong> No
        </Typography>
      </Paper>
      
      {/* Bucket Sort Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Bucket Sort</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bucket sort is a distribution sort that distributes elements into buckets,
          then sorts each bucket individually, either using a different sorting algorithm or by recursively applying bucket sort.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Time Complexity:</strong> O(n²) worst case, O(n+k) average case where k is the number of buckets
          <br />
          <strong>Space Complexity:</strong> O(n+k)
          <br />
          <strong>Stable:</strong> Yes
        </Typography>
      </Paper>
    </Box>
  );
};

// Binary Search Visualizer component
const BinarySearchVisualizer: React.FC = () => {
  const theme = useTheme();
  const [array, setArray] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<number>(50);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStep, setSearchStep] = useState<number>(0);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [currentLow, setCurrentLow] = useState<number>(0);
  const [currentHigh, setCurrentHigh] = useState<number>(0);
  const [currentMid, setCurrentMid] = useState<number>(-1);
  const [searchSteps, setSearchSteps] = useState<
    Array<{
      low: number;
      high: number;
      mid: number;
      found?: boolean;
      notFound?: boolean;
    }>
  >([]);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a sorted array on component mount
  useEffect(() => {
    generateSortedArray();
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const generateSortedArray = () => {
    const newArray = [];
    for (let i = 0; i < 15; i++) {
      newArray.push(Math.floor(Math.random() * 100));
    }
    // Sort the array for binary search
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setFoundIndex(-1);
    setSearchStep(0);
    setSearchSteps([]);
  };

  const startSearch = () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setFoundIndex(-1);
    setSearchStep(0);
    
    // Generate all the search steps beforehand
    const steps = [];
    let low = 0;
    let high = array.length - 1;
    let found = false;
    let notFound = false;
    
    while (low <= high && !found && !notFound) {
      const mid = Math.floor((low + high) / 2);
      
      steps.push({ low, high, mid });
      
      if (array[mid] === searchValue) {
        found = true;
        steps.push({ low, high, mid, found: true });
      } else if (array[mid] < searchValue) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      
      // Check if value not found
      if (low > high && !found) {
        notFound = true;
        steps.push({ low, high, mid: -1, notFound: true });
      }
    }
    
    setSearchSteps(steps);
    setCurrentLow(0);
    setCurrentHigh(array.length - 1);
    
    // Start the animation
    animateSearch(steps, 0);
  };

  const animateSearch = (steps: any[], stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setIsSearching(false);
      return;
    }
    
    const step = steps[stepIndex];
    setCurrentLow(step.low);
    setCurrentHigh(step.high);
    setCurrentMid(step.mid);
    
    if (step.found) {
      setFoundIndex(step.mid);
    }
    
    setSearchStep(stepIndex);
    
    // Schedule next step
    searchTimerRef.current = setTimeout(() => {
      animateSearch(steps, stepIndex + 1);
    }, 1000);
  };

  const stopSearch = () => {
    setIsSearching(false);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    setSearchStep(0);
    setFoundIndex(-1);
  };

  const getBarColor = (index: number) => {
    if (foundIndex === index) {
      return theme.palette.success.main;
    }
    if (currentMid === index) {
      return theme.palette.warning.main;
    }
    if (index >= currentLow && index <= currentHigh) {
      return theme.palette.primary.main;
    }
    return theme.palette.grey[400];
  };

  const getStepDescription = () => {
    if (searchSteps.length === 0 || searchStep >= searchSteps.length) {
      return "Click 'Start Search' to begin";
    }
    
    const step = searchSteps[searchStep];
    
    if (step.found) {
      return `Found ${searchValue} at index ${step.mid}!`;
    }
    
    if (step.notFound) {
      return `Value ${searchValue} not found in the array`;
    }
    
    if (step.mid !== -1) {
      const comparisonResult = 
        array[step.mid] === searchValue ? "equals" :
        array[step.mid] < searchValue ? "less than" : "greater than";
        
      return `Step ${searchStep + 1}: Checking middle element at index ${step.mid} (value ${array[step.mid]}). 
              It's ${comparisonResult} the search value ${searchValue}.
              ${comparisonResult === "equals" ? "Found it!" : 
                comparisonResult === "less than" ? "Search in right half" : "Search in left half"}`;
    }
    
    return "Determining search area...";
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Binary Search</Typography>
      <Typography variant="body1" paragraph>
        Binary search is an efficient algorithm for finding a target value within a sorted array.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <Box sx={{ flex: { xs: '1', sm: '0 0 30%' }, mb: { xs: 2, sm: 0 } }}>
            <Button 
              variant="contained" 
              startIcon={<RestartAltIcon />}
              onClick={generateSortedArray}
              disabled={isSearching}
              sx={{ mr: 1 }}
            >
              New Array
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SearchIcon />}
              onClick={startSearch}
              disabled={isSearching}
              sx={{ mr: 1 }}
            >
              Start Search
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<StopIcon />}
              onClick={stopSearch}
              disabled={!isSearching}
            >
              Stop
            </Button>
          </Box>
          <Box sx={{ flex: { xs: '1', sm: '0 0 30%' }, mb: { xs: 2, sm: 0 } }}>
            <Typography id="search-value-slider-label" gutterBottom>Search Value: {searchValue}</Typography>
            <Slider
              value={searchValue}
              onChange={(e, newValue) => setSearchValue(newValue as number)}
              aria-labelledby="search-value-slider-label"
              min={0}
              max={100}
              disabled={isSearching}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Binary Search Visualization */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom align="center">
          Binary Search Visualization
        </Typography>
        
        {/* Animation Description */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: theme.palette.background.default, 
            mb: 3,
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body1" align="center">
            {getStepDescription()}
          </Typography>
        </Paper>
        
        {/* Array Visualization */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center', 
            height: '240px', 
            mt: 2,
            mb: 3,
            position: 'relative',
            mx: 'auto',
            width: '100%'
          }}
        >
          {array.map((value, index) => (
            <Box 
              key={index}
              sx={{ 
                width: `${80 / array.length}%`,
                maxWidth: '50px',
                height: `${value * 2}px`,
                bgcolor: getBarColor(index),
                mx: 0.5,
                borderRadius: '2px 2px 0 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pb: 0.5,
                color: 'white',
                fontSize: array.length <= 15 ? '0.8rem' : '0',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {value}
            </Box>
          ))}
        </Box>
        
        {/* Legend */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Legend:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.primary.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Current Search Range</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.warning.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Mid Element (Being Compared)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.success.main, mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Found Element</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, bgcolor: theme.palette.grey[400], mr: 1, borderRadius: '2px' }}></Box>
              <Typography variant="body2">Outside Search Range</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
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