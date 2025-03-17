
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, Home, Layers, Video, Award } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Airdrops', path: '/airdrops', icon: <Award className="w-4 h-4 mr-2" /> },
    { name: 'Videos', path: '/videos', icon: <Video className="w-4 h-4 mr-2" /> },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <Settings className="w-4 h-4 mr-2" /> });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${scrolled ? 'bg-crypto-black/90 backdrop-blur-md shadow-md' : 'bg-crypto-black'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-crypto-green" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">iShow</span>
              <span className="text-crypto-green">Crypto</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md transition-all ${
                  location.pathname === link.path
                    ? 'text-crypto-green bg-crypto-gray'
                    : 'text-gray-300 hover:text-crypto-green hover:bg-crypto-gray/50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu / Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-crypto-lightGray bg-crypto-gray hover:bg-crypto-lightGray">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {user.username}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-crypto-gray border-crypto-lightGray">
                  <DropdownMenuItem className="text-gray-200">
                    <User className="w-4 h-4 mr-2" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300 focus:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen hover:translate-y-[-1px] transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 p-4 bg-crypto-gray/90 backdrop-blur-md rounded-lg animate-slideDownAndFade">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-all ${
                    location.pathname === link.path
                      ? 'text-crypto-green bg-crypto-black'
                      : 'text-gray-300 hover:text-crypto-green hover:bg-crypto-black/60'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="px-4 py-3 text-gray-400 border-t border-crypto-lightGray/30">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-crypto-black/60 rounded-md transition-all"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 text-crypto-black bg-crypto-green hover:bg-crypto-darkGreen rounded-md transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
