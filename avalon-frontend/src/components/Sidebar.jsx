import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-900 p-6 flex flex-col">
      <h2 className="text-blue-500 font-bold mb-8 uppercase tracking-widest text-sm">Navigation</h2>
      <nav className="space-y-4 font-mono text-xs uppercase text-slate-400">
        <Link to="/dashboard" className="block hover:text-white">Tableau de bord</Link>
        <Link to="/catalogue" className="block hover:text-white">Catalogue</Link>
        <Link to="/contact" className="block hover:text-white">Support</Link>
      </nav>
    </div>
  );
};

export default Sidebar;