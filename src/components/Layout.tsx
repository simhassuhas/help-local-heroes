
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, Map, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span>ResourceHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.role === 'ngo' && (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/ngo/map"><Map size={18} className="mr-2" /> Resource Map</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/ngo/dashboard"><BarChart3 size={18} className="mr-2" /> Dashboard</Link>
                    </Button>
                  </>
                )}
                {currentUser.role === 'citizen' && (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/requests/new">Request Resources</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to="/requests">My Requests</Link>
                    </Button>
                  </>
                )}
                <div className="flex items-center ml-4">
                  <span className="mr-4 text-sm">
                    {currentUser.name} {currentUser.organization ? `(${currentUser.organization})` : ''}
                  </span>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link to="/requests/new">Request Help</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 bg-primary border-t border-primary-foreground/10">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              {currentUser ? (
                <>
                  <div className="py-2 border-b border-primary-foreground/10">
                    <span className="text-sm font-medium">
                      Signed in as {currentUser.name}
                    </span>
                  </div>
                  {currentUser.role === 'ngo' && (
                    <>
                      <Link to="/ngo/map" className="py-2 flex items-center" onClick={toggleMenu}>
                        <Map size={18} className="mr-2" /> Resource Map
                      </Link>
                      <Link to="/ngo/dashboard" className="py-2 flex items-center" onClick={toggleMenu}>
                        <BarChart3 size={18} className="mr-2" /> Dashboard
                      </Link>
                    </>
                  )}
                  {currentUser.role === 'citizen' && (
                    <>
                      <Link to="/requests/new" className="py-2" onClick={toggleMenu}>
                        Request Resources
                      </Link>
                      <Link to="/requests" className="py-2" onClick={toggleMenu}>
                        My Requests
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" className="justify-start px-0" onClick={() => { handleLogout(); toggleMenu(); }}>
                    <LogOut size={18} className="mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 flex items-center" onClick={toggleMenu}>
                    <User size={18} className="mr-2" /> Login
                  </Link>
                  <Link to="/requests/new" className="py-2" onClick={toggleMenu}>
                    Request Help
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ResourceHub. All rights reserved.</p>
            <p className="mt-1">Connecting needs with resources efficiently.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
