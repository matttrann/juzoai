import React, { useState, useEffect } from 'react';
import { 
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import StyleIcon from '@mui/icons-material/Style';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import authService, { User } from '../services/authService';
import { useLoadingOnRouteChange } from '../utils/loadingUtils';
import { useAppLoadingBar } from '../contexts/LoadingBarContext';
import Footer from './Footer';

// Drawer width for desktop view
const drawerWidth = 240;

interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Layout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Use the loading bar on route changes
  useLoadingOnRouteChange();
  
  // Get the loading bar for manual control if needed
  const loadingBar = useAppLoadingBar();
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsLoggedIn(isAuth);
      
      if (isAuth) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
    };
    
    checkAuth();
    
    // Add event listener for storage changes (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setAnchorEl(null);
    navigate('/');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems: NavItem[] = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Decks', path: '/decks', icon: <StyleIcon /> },
    { text: 'Performance Dashboard', path: '/performance', icon: <EmojiEventsIcon /> },
    { text: 'DSA Visualizer', path: '/dsa-visualizer', icon: <CodeIcon /> },
    { text: 'Coding Problems', path: '/problems', icon: <AssignmentIcon /> }
  ];

  const handleNavigation = (path: string) => {
    // Start loading bar animation
    loadingBar.start();
    
    // Navigate to the path
    navigate(path);
    
    // Mobile drawer handling
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Check if the current route is active
  const isActiveRoute = (item: { path: string }): boolean => {
    return (
      (item.path === '/' && location.pathname === '/') ||
      (item.path === '/decks' && location.pathname.startsWith('/decks')) ||
      (item.path === '/performance' && location.pathname.startsWith('/performance')) ||
      (item.path === '/dsa-visualizer' && location.pathname.startsWith('/dsa-visualizer')) ||
      (item.path === '/problems' && location.pathname.startsWith('/problems'))
    );
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={isActiveRoute(item)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Juzo.AI
          </Typography>
          {isLoggedIn && user && (
            <>
              <IconButton
                onClick={handleUserMenuOpen}
                size="small"
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    cursor: 'pointer',
                    bgcolor: 'primary.main'
                  }}
                  src={user.avatar}
                  alt={user.name || user.username}
                >
                  {(user.name || user.username).charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user.email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer - permanent */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // AppBar height
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)', // Viewport height minus AppBar
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout; 