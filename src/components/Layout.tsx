import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Skull, Menu, X, LogIn, LogOut, HeartHandshake, CalendarDays, Store, Camera, LayoutDashboard, Shirt, CalendarPlus, Bell, Settings, ChevronDown, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout, notifications, markNotificationsAsRead, isLoading, cart } = useApp();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const handleFirestoreError = (e: any) => {
      const errInfo = e.detail;
      if (errInfo && errInfo.error) {
        if (errInfo.error.toLowerCase().includes('quota')) {
          showToast('Límite de Firebase excedido (Quota). Por favor intenta de nuevo mañana.', 'error');
        } else {
          // showToast(`Error de base de datos: ${errInfo.error}`, 'error'); // Too noisy for non-quota errors maybe?
        }
      }
    };
    window.addEventListener('firestore-error', handleFirestoreError);
    return () => window.removeEventListener('firestore-error', handleFirestoreError);
  }, [showToast]);



  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && unreadCount > 0 && user) {
      setTimeout(() => markNotificationsAsRead(user.id), 2000);
    }
  };

type NavLink = {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  public?: boolean;
  role?: string;
  requiresAuth?: boolean;
  subLinks?: { name: string; path: string }[];
};

  const navLinks: NavLink[] = [
    { name: 'Inicio', path: '/', icon: <Skull className="w-5 h-5" />, public: true },
    { name: 'Catálogo', path: '/catalogo', icon: <Store className="w-5 h-5" />, public: true },
    { name: 'Transparencia', path: '/transparencia', icon: <HeartHandshake className="w-5 h-5" />, public: true },
    { name: 'Próximos Toques', path: '/proximos-toques', icon: <CalendarDays className="w-5 h-5" />, public: true },
    { name: 'Donar Prenda', path: user ? '/donar' : '/login?mode=register', icon: <Camera className="w-5 h-5" />, public: true },
    { name: 'Mis Donaciones', path: '/mis-donaciones', icon: <Shirt className="w-5 h-5" />, requiresAuth: true },
    { name: 'Panel Admin', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, role: 'administrador' },
    { name: 'Configuración', path: '/settings', icon: <Settings className="w-5 h-5" />, requiresAuth: true },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.public) return true;
    if (user && link.requiresAuth) return true;
    if (user && link.role === user.role) return true;
    return false;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sabbath-950">
        <div className="animate-spin">
          <Skull className="w-12 h-12 text-sabbath-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-sabbath-950/90 backdrop-blur-md border-b border-sabbath-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col py-4">
            {/* Top Row: Logo and Mobile Controls */}
            <div className="flex justify-between items-center w-full">
              <Link to="/" className="flex items-center space-x-3 mx-auto md:mx-0" onClick={closeMenu}>
                <Skull className="w-8 h-8 text-sabbath-500" />
                <span className="font-display font-bold text-2xl tracking-widest text-white">
                  METAL<span className="text-sabbath-500">RESCUE</span>
                </span>
              </Link>

              {/* Mobile menu button & Notifications */}
              <div className="md:hidden flex items-center space-x-2 absolute right-4">
                <Link to="/cart" className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-sabbath-500 rounded-full border border-sabbath-950 flex items-center justify-center text-[9px] font-bold text-white">
                      {cart.length}
                    </span>
                  )}
                </Link>
                {user && (
                  <button 
                    onClick={handleNotificationsClick}
                    className="p-2 text-zinc-400 hover:text-white transition-colors relative"
                  >
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sabbath-500 rounded-full border border-sabbath-950"></span>
                    )}
                  </button>
                )}
                <button
                  onClick={toggleMenu}
                  className="p-2 text-zinc-400 hover:text-white focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center space-x-6 mt-4">
              {filteredLinks.map((link) => (
                link.subLinks ? (
                  <div key={link.name} className="relative group">
                    <button className="flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-sabbath-400">
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="bg-sabbath-900 border border-sabbath-800 rounded-md shadow-xl py-2 flex flex-col">
                        {link.subLinks.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="px-4 py-2 text-sm text-zinc-400 hover:bg-sabbath-800 hover:text-white transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-sabbath-400 ${
                      location.pathname === link.path ? 'text-sabbath-400' : 'text-zinc-400'
                    }`}
                    title={link.name === 'Configuración' ? 'Configuración' : undefined}
                  >
                    {link.name === 'Configuración' ? link.icon : link.name}
                  </Link>
                )
              ))}
              
              <Link to="/cart" className="p-2 text-zinc-400 hover:text-white transition-colors relative ml-4">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-sabbath-500 rounded-full border border-sabbath-950 flex items-center justify-center text-[8px] font-bold text-white">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <div className="relative">
                    <button 
                      onClick={handleNotificationsClick}
                      className="p-2 text-zinc-400 hover:text-white transition-colors relative"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-sabbath-500 rounded-full border border-sabbath-950"></span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-sabbath-900 border border-sabbath-800 rounded-xl shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-sabbath-800">
                          <h3 className="font-bold text-white">Notificaciones</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {userNotifications.length === 0 ? (
                            <p className="px-4 py-4 text-sm text-zinc-400 text-center">No tienes notificaciones nuevas.</p>
                          ) : (
                            userNotifications.map(notification => (
                              <div key={notification.id} className={`px-4 py-3 border-b border-sabbath-800/50 last:border-0 ${notification.read ? 'opacity-60' : 'bg-sabbath-800/20'}`}>
                                <p className="text-sm text-zinc-300">{notification.message}</p>
                                <p className="text-xs text-zinc-500 mt-1">{new Date(notification.date).toLocaleString('es-GT')}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="flex items-center space-x-2 bg-sabbath-900 border border-sabbath-800 hover:border-sabbath-500 text-zinc-300 px-4 py-2 rounded-md transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-sabbath-600 hover:bg-sabbath-500 text-white px-5 py-2.5 rounded-md font-medium transition-colors ml-4"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Notifications Dropdown */}
      {isNotificationsOpen && user && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-sabbath-900 border-b border-sabbath-800 z-40">
          <div className="px-4 py-2 border-b border-sabbath-800 bg-sabbath-950">
            <h3 className="font-bold text-white">Notificaciones</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {userNotifications.length === 0 ? (
              <p className="px-4 py-4 text-sm text-zinc-400 text-center">No tienes notificaciones nuevas.</p>
            ) : (
              userNotifications.map(notification => (
                <div key={notification.id} className={`px-4 py-3 border-b border-sabbath-800/50 last:border-0 ${notification.read ? 'opacity-60' : 'bg-sabbath-800/20'}`}>
                  <p className="text-sm text-zinc-300">{notification.message}</p>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(notification.date).toLocaleString('es-GT')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-sabbath-900 border-b border-sabbath-800 z-30">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {filteredLinks.map((link) => (
              link.subLinks ? (
                <div key={link.name} className="space-y-1">
                  <div className="flex items-center space-x-3 px-4 py-3 text-lg font-medium text-zinc-300 border-b border-sabbath-800/50">
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                  <div className="pl-11 flex flex-col">
                    {link.subLinks.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={closeMenu}
                        className="text-zinc-400 hover:text-white py-3 border-l-2 border-sabbath-800 pl-4"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path!}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-4 rounded-md text-lg font-medium ${
                    location.pathname === link.path ? 'bg-sabbath-800 text-white' : 'text-zinc-400 hover:bg-sabbath-800/50 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              )
            ))}
            
            <div className="pt-4 mt-4 border-t border-sabbath-800">
              {user ? (
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="w-full flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-4 rounded-md text-lg font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión ({user.name})</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center space-x-2 bg-sabbath-600 hover:bg-sabbath-500 text-white px-4 py-4 rounded-md text-lg font-medium transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Ingresar / Registrarse</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-sabbath-800 bg-sabbath-900/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Skull className="w-5 h-5 text-sabbath-500" />
            <span className="font-display tracking-widest text-zinc-400">METALRESCUE GT</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} MetalRescue Guatemala. Economía circular con propósito.
          </p>
        </div>
      </footer>
    </div>
  );
};
