import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  styled, 
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Grid,
  Paper
} from '@mui/material';
// Import visualizer components from the dedicated file
import { 
  ArraysVisualizer, 
  LinkedListsVisualizer, 
  TreesVisualizer, 
  HeapVisualizer, 
  HashingVisualizer, 
  GraphsVisualizer,
  StaticArrayVisualizer,
  SortedArrayVisualizer,
  DynamicArrayVisualizer,
  SinglyLinkedListVisualizer,
  DoublyLinkedListVisualizer,
  CircularLinkedListVisualizer,
  StackVisualizer,
  QueueVisualizer,
  PriorityQueueVisualizer,
  BinarySearchTreeVisualizer,
  BalancedTreeVisualizer,
  DictionaryVisualizer,
  HashTableVisualizer,
  ADTVisualizer,
  BagVisualizer
} from './VisualizerComponents';

// Style the tabs to prevent movement on hover
const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: '48px',
  padding: '12px 16px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.3s'
  }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ds-tabpanel-${index}`}
      aria-labelledby={`ds-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `ds-tab-${index}`,
    'aria-controls': `ds-tabpanel-${index}`,
  };
};

// Definition of data structure categories
const dataStructureCategories = [
  {
    name: "Arrays",
    description: "Collections of elements stored in contiguous memory locations",
    structures: [
      { name: "Static Arrays", component: StaticArrayVisualizer },
      { name: "Sorted Arrays", component: SortedArrayVisualizer },
      { name: "Dynamic Arrays", component: DynamicArrayVisualizer }
    ]
  },
  {
    name: "Linked Lists",
    description: "Sequential collections of nodes with references between them",
    structures: [
      { name: "Singly Linked Lists", component: SinglyLinkedListVisualizer },
      { name: "Doubly Linked Lists", component: DoublyLinkedListVisualizer },
      { name: "Circular Linked Lists", component: CircularLinkedListVisualizer }
    ]
  },
  {
    name: "Abstract Data Types",
    description: "High-level description of operations without implementation details",
    structures: [
      { name: "ADT Concept", component: ADTVisualizer },
      { name: "Bag", component: BagVisualizer }
    ]
  },
  {
    name: "Stack & Queues",
    description: "Restricted access collections with specific order of operations",
    structures: [
      { name: "Stack", component: StackVisualizer },
      { name: "Queue", component: QueueVisualizer },
      { name: "Priority Queue", component: PriorityQueueVisualizer },
      { name: "Heap", component: HeapVisualizer }
    ]
  },
  {
    name: "Trees",
    description: "Hierarchical data structures with parent-child relationships",
    structures: [
      { name: "Binary Search Trees", component: BinarySearchTreeVisualizer },
      { name: "Balanced Trees", component: BalancedTreeVisualizer },
      { name: "Tree Traversals", component: TreesVisualizer }
    ]
  },
  {
    name: "Dictionaries & Hash Tables",
    description: "Key-value pair data structures for efficient lookups",
    structures: [
      { name: "Dictionary ADT", component: DictionaryVisualizer },
      { name: "Hash Tables", component: HashTableVisualizer },
      { name: "Hashing Techniques", component: HashingVisualizer }
    ]
  },
  {
    name: "Graphs",
    description: "Networks of vertices connected by edges",
    structures: [
      { name: "Graph Representations", component: GraphsVisualizer }
    ]
  }
];

const DataStructuresVisualizer: React.FC = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [structureIndex, setStructureIndex] = useState(0);
  
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setCategoryIndex(newValue);
    setStructureIndex(0); // Reset structure index when changing category
  };

  const handleStructureSelect = (index: number) => {
    setStructureIndex(index);
  };

  // Main view that shows all categories
  const MainCategoryView = () => (
    <Grid container spacing={3}>
      {dataStructureCategories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} key={category.name}>
          <CategoryCard 
            elevation={3} 
            onClick={() => setCategoryIndex(index)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {category.description}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="caption" color="primary">
                {category.structures.length} structure{category.structures.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </CategoryCard>
        </Grid>
      ))}
    </Grid>
  );

  // Selected category with its structures
  const CategoryView = () => {
    const category = dataStructureCategories[categoryIndex];
    const SelectedComponent = category.structures[structureIndex].component;
    
    return (
      <Grid container spacing={3}>
        {/* Sidebar with structure list */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={2} sx={{ height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              {category.name}
            </Typography>
            <List component="nav" dense>
              {category.structures.map((structure, index) => (
                <React.Fragment key={structure.name}>
                  <ListItemButton
                    selected={structureIndex === index}
                    onClick={() => handleStructureSelect(index)}
                  >
                    <ListItemText primary={structure.name} />
                  </ListItemButton>
                  {index < category.structures.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={12} sm={8} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <SelectedComponent />
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={categoryIndex} 
            onChange={handleCategoryChange} 
            variant="scrollable" 
            scrollButtons="auto" 
            aria-label="data structures categories"
          >
            {dataStructureCategories.map((category, index) => (
              <StyledTab key={category.name} label={category.name} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        {categoryIndex === -1 ? <MainCategoryView /> : <CategoryView />}
      </CardContent>
    </Card>
  );
};

export default DataStructuresVisualizer; 