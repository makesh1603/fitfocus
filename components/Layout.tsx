
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, User, Search, Sparkles, X, LogOut, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';
import { User as AuthUser } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, login, logout, savedAccounts, isLoggingIn, setIsLoggingIn } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginView, setLoginView] = useState<'chooser' | 'form'>('chooser');

  const isAdmin = user?.email === 'admin@fitfocus.ai';

  // Change to chooser if accounts exist
  React.useEffect(() => {
    if (savedAccounts.length > 0) {
      setLoginView('chooser');
    } else {
      setLoginView('form');
    }
  }, [savedAccounts.length]);

  const navItems = [
    { path: '/', label: 'Home', icon: Search },
    { path: '/trainers', label: 'Trainers', icon: Dumbbell },
    { path: '/exercises', label: 'Exercises', icon: BookOpen },
    ...(user?.role === 'customer' ? [{ path: '/dashboard', label: 'My Bookings', icon: Calendar }] : []),
    ...(user?.role === 'host' ? [{ path: '/dashboard', label: 'Reservations', icon: Calendar }] : []),
    { path: '/ai-coach', label: 'AI Coach', icon: Sparkles },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  const handleGmailSignIn = (overrideEmail?: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      let signInEmail = overrideEmail || email;

      // If no email entered, simulate Google Account Chooser with a prompt
      if (!signInEmail) {
        const promptEmail = window.prompt("Simulating Google Sign-In\n\nPlease enter the Gmail address you want to use:", "user@gmail.com");
        if (!promptEmail) {
          setIsLoggingIn(false);
          return;
        }
        signInEmail = promptEmail;
      }

      // Create user from the dynamic email
      const namePart = signInEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const photoUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=4f46e5&color=fff`;

      const newUser = {
        name: formattedName,
        email: signInEmail,
        photoUrl: photoUrl
      };

      login(newUser);

      setIsLoggingIn(false);
      setShowLoginModal(false);
      // Reset form
      setEmail('');
      setPassword('');
    }, 1500);
  };

  const handleEmailSignIn = (overrideEmail?: string, overridePassword?: string) => {
    const finalEmail = overrideEmail || email;
    const finalPassword = overridePassword || password;

    if (!finalEmail || !finalPassword) return;

    setIsLoggingIn(true);
    // Simulate API call
    setTimeout(() => {
      // Create a mock user from the email address
      const namePart = finalEmail.split('@')[0];
      // Capitalize first letter of name
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const photoUrl = `https://ui-avatars.com/api/?name=${formattedName}&background=0f172a&color=fff`;

      const newUser = {
        name: formattedName,
        email: finalEmail,
        photoUrl: photoUrl,
      };

      login(newUser, finalPassword);

      setIsLoggingIn(false);
      setShowLoginModal(false);
      // Reset form
      setEmail('');
      setPassword('');
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    setLoginView('chooser');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">FitFocus<span className="text-indigo-600">AI</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 pl-3 pr-1 py-1 rounded-full border border-slate-200">
                <span className="text-xs font-bold text-slate-700 hidden lg:block">{user.name}</span>
                <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
                <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full shadow-sm" />
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 animate-fade-in">
        {children}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isLoggingIn && setShowLoginModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">FitFocusAI</span>
                </div>
                {!isLoggingIn && (
                  <button onClick={() => setShowLoginModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                    <X className="w-6 h-6 text-slate-900" />
                  </button>
                )}
              </div>

              <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
                <p className="text-slate-500">Sign in to sync your fitness progress across devices.</p>
              </div>

              {savedAccounts.length > 0 && loginView === 'chooser' ? (
                // Account Chooser View
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {savedAccounts.map((account) => (
                      <button
                        key={account.email}
                        onClick={() => {
                          if (account.password) {
                            handleEmailSignIn(account.email, account.password);
                          } else {
                            handleGmailSignIn(account.email);
                          }
                        }}
                        disabled={isLoggingIn}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left group"
                      >
                        <img src={account.photoUrl} alt={account.email} className="w-10 h-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{account.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{account.email}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setLoginView('form')}
                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    Add new account
                  </button>
                </div>
              ) : (
                // Standard Login Form
                <div className="space-y-4">
                  <button
                    onClick={() => handleGmailSignIn()}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Continue with Gmail.com</span>
                      </>
                    )}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold">or</span></div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEmailSignIn();
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900 font-bold"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900 font-bold"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoggingIn || !email || !password}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingIn ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                </div>
              )}

              <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                By signing in, you agree to our <span className="underline cursor-pointer text-slate-600 text-[10px]">Terms</span> and <span className="underline cursor-pointer text-slate-600 text-[10px]">Privacy</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default Layout;
