import { Utensils, Menu as MenuIcon, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

interface LayoutProps {
  onLogout?: () => void;
  showAdminLink?: boolean;
}

export const Navbar = ({ onLogout, showAdminLink = true }: { onLogout?: () => void; showAdminLink?: boolean }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background-dark/90 backdrop-blur-sm border-b border-primary/20">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0 hover:opacity-80 transition-opacity">
          <Utensils className="text-primary w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
          <span className="hidden sm:inline text-lg sm:text-xl font-bold tracking-tight text-slate-100 whitespace-nowrap truncate">Eastern Oriental</span>
          <span className="sm:hidden text-base font-bold tracking-tight text-slate-100">EO</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`text-sm font-medium transition-colors ${isActive('/menu') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Menu
          </Link>
          <Link 
            to="/gallery" 
            className={`text-sm font-medium transition-colors ${isActive('/gallery') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Gallery
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Information
          </Link>
          <Link 
            to="/reservations" 
            className="bg-primary text-background-dark px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all"
          >
            Reserve Now
          </Link>
        </div>
        <button className="md:hidden text-primary flex-shrink-0" onClick={() => setMobileOpen(!mobileOpen)}>
          <MenuIcon className="w-6 h-6" />
        </button>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background-dark/95 backdrop-blur-md border-b border-primary/20"
          >
            <div className="flex flex-col items-center gap-4 py-6 px-4">
              <Link 
                to="/" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/menu" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/menu') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/gallery" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/gallery') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                to="/about" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/about') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Information
              </Link>
              <Link 
                to="/reservations" 
                className="bg-primary text-background-dark px-6 py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all w-full text-center" 
                onClick={() => setMobileOpen(false)}
              >
                Reserve Now
              </Link>
              {showAdminLink && (
                <Link 
                  to="/login" 
                  className="text-slate-400 hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => (
  <footer className="bg-background-dark border-t border-primary/10 py-12 px-6 lg:px-12">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-3">
        <Utensils className="text-primary w-6 h-6" />
        <span className="text-lg font-bold tracking-tight text-slate-100">Eastern Oriental</span>
      </div>
      <div className="flex gap-8 text-slate-400 text-sm">
        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a className="hover:text-primary transition-colors" href="#">Press Kit</a>
      </div>
      <div className="flex gap-4">
        <a href="#" className="text-slate-400 cursor-pointer hover:text-primary w-5 h-5 transition-colors">f</a>
        <a href="#" className="text-slate-400 cursor-pointer hover:text-primary w-5 h-5 transition-colors">ig</a>
        <a href="#" className="text-slate-400 cursor-pointer hover:text-primary w-5 h-5 transition-colors">tw</a>
      </div>
    </div>
    <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
      © 2023 Eastern Oriental Gastronomy Group. All Rights Reserved.
    </p>
  </footer>
);

export const Layout: React.FC<LayoutProps> = ({ onLogout, showAdminLink }) => (
  <>
    <Navbar onLogout={onLogout} showAdminLink={showAdminLink} />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);
