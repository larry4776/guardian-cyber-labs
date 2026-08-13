import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, BookOpen, CreditCard } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const AdminOverview = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/payments/admin/summary`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : null).then(setSummary);
    fetch(`${API_URL}/admin/transactions`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : []).then(setTransactions);
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <AdminLayout title="Vue d'ensemble">
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase text-muted font-semibold tracking-wide">Chiffre d'affaires</p>
              <TrendingUp size={18} className="text-primary-light" />
            </div>
            <p className="font-display text-2xl font-bold text-white">{summary.total_revenue.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase text-muted font-semibold tracking-wide">Meilleure vente</p>
              <BookOpen size={18} className="text-primary-light" />
            </div>
            <p className="text-sm font-bold text-white">{summary.top_course.title || '—'}</p>
            <p className="text-xs text-muted mt-1">{summary.top_course.sales} ventes</p>
          </div>
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase text-muted font-semibold tracking-wide">Répartition paiement</p>
              <CreditCard size={18} className="text-primary-light" />
            </div>
            <p className="text-sm font-bold text-white">
              {Object.entries(summary.payment_breakdown).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(' · ') || 'Aucune vente'}
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-sm font-bold text-white">Transactions récentes ({transactions.length})</h3>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-white/[0.03] text-muted uppercase">
            <tr>
              <th className="p-4">Étudiant</th>
              <th className="p-4">Parcours</th>
              <th className="p-4">Moyen</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length > 0 ? transactions.map(t => (
              <tr key={t.id}>
                <td className="p-4 text-slate-300">{t.user_email}</td>
                <td className="p-4 text-slate-400">{t.course_title}</td>
                <td className="p-4 text-primary-light uppercase font-semibold">{t.payment_method || 'Gratuit'}</td>
                <td className="p-4 text-muted">{formatDate(t.created_at)}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="p-6 text-center text-slate-600">Aucune transaction pour l'instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default AdminOverview;