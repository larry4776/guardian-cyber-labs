import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Dashboard = () => {
  const { token, loading, user } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => {
    if (!loading && !token) navigate('/login');
  }, [token, loading]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/auth/me/enrollments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(setEnrollments)
      .finally(() => setLoadingEnrollments(false));
  }, [token]);

  if (loading || !token) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Chargement...</div>;
  }

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-2xl font-bold mb-1 tracking-tight">{fr ? 'Mon apprentissage' : 'My learning'}</h1>
        <p className="text-muted text-sm mb-10">
          {fr ? 'Content de te revoir' : 'Good to see you'}{user?.email ? `, ${user.email.split('@')[0]}` : ''}.
        </p>

        {loadingEnrollments ? (
          <p className="text-muted text-sm">{fr ? 'Chargement de tes formations...' : 'Loading your courses...'}</p>
        ) : enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map(e => {
              const percent = e.total_lessons > 0 ? Math.round((e.completed_lessons / e.total_lessons) * 100) : 0;
              return (
                <div key={e.course_id} className="bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                        {e.payment_method ? e.payment_method.toUpperCase() : (fr ? 'Gratuit' : 'Free')}
                      </span>
                      <h3 className="font-display text-lg font-bold mt-3">{e.course_title}</h3>
                    </div>
                    <Link to={`/player/${e.course_id}`} className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-shadow shrink-0">
                      {fr ? 'Continuer' : 'Continue'} <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                  </div>
                  <p className="text-xs text-muted mt-2">{e.completed_lessons} / {e.total_lessons} {fr ? 'leçons' : 'lessons'} — {percent}% {fr ? 'complété' : 'complete'}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <p className="text-muted text-sm mb-4">{fr ? "Tu n'as encore commencé aucune formation." : "You haven't started any course yet."}</p>
            <Link to="/catalog" className="text-primary-light hover:text-white font-semibold text-sm">{fr ? 'Découvrir le catalogue →' : 'Discover the catalog →'}</Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;