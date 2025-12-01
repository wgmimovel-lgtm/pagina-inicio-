import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Menu, X, ShieldCheck, Bell } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [hasNewProperty, setHasNewProperty] = React.useState(false);
  const [hasNewLead, setHasNewLead] = React.useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dynamic classes to highlight buttons on ALL pages
  const getNavLinkClass = (path: string) => {
    const active = location.pathname === path;
    
    // Highlighted Button Style (Applied Globally)
    const baseStyle = "px-5 py-2 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 border shadow-lg transform hover:-translate-y-0.5";
    
    if (active) {
      // Active: Gold background, Navy text
      return `${baseStyle} bg-gold-500 text-navy-900 border-gold-500`;
    }
    
    // Inactive: Darker Navy button, distinct from header, turns Gold on hover
    return `${baseStyle} bg-navy-800 text-slate-300 border-slate-700 hover:bg-gold-500 hover:text-navy-900 hover:border-gold-500`;
  };

  // Force Home on Mount
  useEffect(() => {
    navigate('/');
  }, []);

  useEffect(() => {
    // Check initial state
    const checkNotifications = () => {
      setHasNewProperty(localStorage.getItem('NOTIFY_PROPERTY') === 'true');
      setHasNewLead(localStorage.getItem('NOTIFY_LEAD') === 'true');
    };
    
    checkNotifications();

    // Listen for custom events
    const handlePropertyNotify = () => setHasNewProperty(true);
    const handleLeadNotify = () => setHasNewLead(true);

    window.addEventListener('notify-property', handlePropertyNotify);
    window.addEventListener('notify-lead', handleLeadNotify);
    window.addEventListener('storage', checkNotifications);

    return () => {
      window.removeEventListener('notify-property', handlePropertyNotify);
      window.removeEventListener('notify-lead', handleLeadNotify);
      window.removeEventListener('storage', checkNotifications);
    };
  }, []);

  // Clear notifications when visiting Gestao
  useEffect(() => {
    if (location.pathname === '/gestao') {
      localStorage.removeItem('NOTIFY_PROPERTY');
      localStorage.removeItem('NOTIFY_LEAD');
      setHasNewProperty(false);
      setHasNewLead(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global Background Image Layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1565626424178-b599f7545432?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[1px]"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-24">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-gold-500 rounded-sm group-hover:bg-gold-400 transition-colors">
                  <Building2 className="h-6 w-6 text-navy-900" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold tracking-wide text-gold-500">BARRA BUSINESS</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Imóveis</span>
                </div>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/" className={getNavLinkClass('/')}>Início</Link>
                <Link to="/vender" className={getNavLinkClass('/vender')}>Vender</Link>
                <Link to="/comprar" className={getNavLinkClass('/comprar')}>Comprar</Link>
                
                <Link to="/gestao" className={`relative ${getNavLinkClass('/gestao')}`}>
                  Gestão
                  {/* Notification Container */}
                  <div className="absolute -top-2 -right-3 flex space-x-1">
                    {hasNewProperty && (
                      <span className="relative flex h-3 w-3" title="Novo Imóvel">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                    )}
                    {hasNewLead && (
                      <span className="relative flex h-3 w-3" title="Novo Cliente">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4">
                {(hasNewProperty || hasNewLead) && (
                    <Link to="/gestao" className="relative">
                      <Bell className="h-5 w-5 text-gold-500" />
                      <div className="absolute -top-1 -right-2 flex space-x-0.5">
                        {hasNewProperty && <span className="h-2 w-2 bg-red-500 rounded-full"></span>}
                        {hasNewLead && <span className="h-2 w-2 bg-green-500 rounded-full"></span>}
                      </div>
                    </Link>
                )}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden bg-navy-800 border-t border-slate-700">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-navy-900">Início</Link>
                <Link to="/vender" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-navy-900">Vender</Link>
                <Link to="/comprar" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-navy-900">Comprar</Link>
                <Link to="/gestao" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-navy-900">
                  <span>Gestão</span>
                  <div className="flex gap-2">
                    {hasNewProperty && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">IMÓVEL</span>}
                    {hasNewLead && <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">CLIENTE</span>}
                  </div>
                </Link>
              </div>
            </div>
          )}
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-navy-900 text-slate-400 py-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2024 Barra Business Imóveis. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-gold-500" />
              <span>Intermediação Exclusiva e Segura</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;