import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Target, FileCheck,
  Users, CreditCard, MessageSquare, Shield, LogOut, Menu, X, Settings
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard, exact: true },
  { path: '/admin/courses', label: 'Parcours', icon: BookOpen },
  { path: '/admin/submissions', label: 'Livrables', icon: FileCheck },
  { path: '/admin/users', label: 'Utilisateurs', icon: Users },
  { path: '/admin/payments', label: 'Paiements', icon: CreditCard },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/settings', label: 'Réglages', icon: Settings },
];

const AdminLayout = ({ children, title }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex text-white">

      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-white/10 fixed top-0 left-0 h-full z-40">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-none">GUARDIAN</p>
            <p className="text-[10px] text-primary-light font-semibold tracking-wide">ADMIN</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-primary/15 text-primary-light border border-primary/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={17} className={active ? 'text-primary-light' : 'text-slate-500'} />
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-accent flex items-center justify-center text-xs font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-muted">Administrateur</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-surface border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center">
            <Shield size={13} className="text-white" />
          </div>
          <span className="font-display text-sm font-bold text-white">ADMIN</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-base/95 backdrop-blur-xl pt-16 px-4 pb-4 overflow-y-auto">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-primary/15 text-primary-light' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} />
              Déconnexion
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 md:ml-64">
        <div className="md:hidden h-14"></div>
        <div className="p-6 md:p-8">
          {title && (
            <div className="mb-8 pb-6 border-b border-white/10">
              <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;