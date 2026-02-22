import { Utensils, Menu as MenuIcon, LayoutDashboard, LogOut, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { settingsApi, type SettingsData } from '../api';

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
            to="/about-us" 
            className={`text-sm font-medium transition-colors ${isActive('/about-us') ? 'text-primary' : 'hover:text-primary'}`}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-primary' : 'hover:text-primary'}`}
          >
            Contact
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
                to="/about-us" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/about-us') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`text-base font-medium transition-colors w-full text-center py-2 ${isActive('/contact') ? 'text-primary' : 'hover:text-primary'}`} 
                onClick={() => setMobileOpen(false)}
              >
                Contact
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

export const Footer = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getAll();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load footer settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-background-dark border-t border-primary/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          
          {/* Left Section - Opening Hours */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Monday</span>
                <span className="text-slate-400">CLOSED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Tuesday - Thursday</span>
                <span className="text-slate-400">{loading ? '...' : settings?.hours_mon_thu || 'Hours TBA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Friday - Saturday</span>
                <span className="text-slate-400">{loading ? '...' : settings?.hours_fri_sat || 'Hours TBA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 font-semibold">Sunday</span>
                <span className="text-slate-400">{loading ? '...' : settings?.hours_sun || 'Hours TBA'}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 italic pt-2">
              Please note that last orders will be taken 15 minutes prior to closing time.
            </p>
          </div>

          {/* Center Section - Bookings & Social */}
          <div className="space-y-3 flex flex-col items-center">
            {/* Hygiene Rating Badge */}
            <div className="w-32 h-32 bg-primary/10 border-4 border-primary rounded-lg flex flex-col items-center justify-center p-2">
              <div className="text-center">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Food Hygiene</p>
                <p className="text-3xl font-black text-primary">5</p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-0.5">EXCELLENT</p>
              </div>
            </div>

            {/* Online Bookings Button */}
            <Link
              to="/reservations"
              className="border-2 border-primary/40 text-primary px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-background-dark transition-all duration-300"
            >
              Online Bookings
            </Link>

            {/* Social Icons */}
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" title="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" title="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Section - Contact & Links */}
          <div className="space-y-3">
            {/* Contact Info */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Contact</h3>
              <div className="space-y-2 text-sm">
                <a href={`tel:${settings?.phone || ''}`} className="flex items-start gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <span>{loading ? '...' : settings?.phone || 'Phone TBA'}</span>
                </a>
                <a href={`mailto:${settings?.email || ''}`} className="flex items-start gap-3 text-slate-300 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <span>{loading ? '...' : settings?.email || 'Email TBA'}</span>
                </a>
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                  <div>
                    {loading ? (
                      <p className="text-slate-400">Loading...</p>
                    ) : (
                      settings?.address?.split(',').map((line, i) => <p key={i}>{line.trim()}</p>)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-sm">Quick Links</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
                <Link to="/menu" className="text-slate-300 hover:text-primary transition-colors">Menu</Link>
                <Link to="/gallery" className="text-slate-300 hover:text-primary transition-colors">Gallery</Link>
                <Link to="/about-us" className="text-slate-300 hover:text-primary transition-colors">About Us</Link>
                <Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">Contact</Link>
                <Link to="/reservations" className="text-slate-300 hover:text-primary transition-colors">Reservations</Link>
                <Link to="/faqs" className="text-slate-300 hover:text-primary transition-colors">FAQs</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-slate-500 text-sm">
            © 2024 Eastern Oriental Gastronomy Group. All Rights Reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Built with care for authentic cuisine
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<LayoutProps> = ({ onLogout, showAdminLink }) => (
  <>
    <Navbar onLogout={onLogout} showAdminLink={showAdminLink} />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);
