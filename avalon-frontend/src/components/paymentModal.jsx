import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const PaymentModal = ({ course, onClose }) => {
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const { token, isAuthenticated, user } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);

  useEffect(() => {
    fetch(`${API_URL}/payment-methods/`).then(res => res.json()).then(setMethods).catch(() => setMethods([]));
  }, []);

  if (!course) return null;
  const courseTitle = t(course, 'title_fr', 'title_en');

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/payments/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: course.id, method: method.toLowerCase() }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.detail || (language === 'fr' ? 'Le paiement a échoué.' : 'Payment failed.')); }
      const selectedMethod = methods.find(m => m.key === method.toLowerCase());
      setReceipt({
        course: courseTitle,
        price: course.is_free ? (language === 'fr' ? 'Gratuit' : 'Free') : `$${course.price}`,
        method: selectedMethod?.display_name || method,
        date: new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      });
      setSuccess(true);
    } catch (err) { setError(err.message); } finally { setProcessing(false); }
  };

  const sendReceiptByEmail = () => {
    const subject = `${language === 'fr' ? 'Reçu de paiement' : 'Payment receipt'} - ${receipt.course}`;
    const body = `Guardian Cyber Labs\n\n${language === 'fr' ? 'Parcours' : 'Course'}: ${receipt.course}\n${language === 'fr' ? 'Montant' : 'Amount'}: ${receipt.price}\n${language === 'fr' ? 'Moyen de paiement' : 'Payment method'}: ${receipt.method}\n${language === 'fr' ? 'Date' : 'Date'}: ${receipt.date}`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user?.email || ''}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#0A0E1A]/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white text-lg transition-colors z-10">✕</button>

        {!isAuthenticated ? (
          <div className="text-center py-24 px-8">
            <p className="text-slate-300 text-base mb-6">{language === 'fr' ? "Connecte-toi d'abord pour débloquer ce parcours." : 'Log in first to unlock this course.'}</p>
            <Link to="/login" onClick={onClose} className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-colors">
              {language === 'fr' ? 'Se connecter' : 'Log in'}
            </Link>
          </div>
        ) : !success ? (
          <div className="grid md:grid-cols-2">
            <div className="p-10 border-b md:border-b-0 md:border-r border-slate-800">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide mb-6 block">{language === 'fr' ? 'Résumé de la commande' : 'Order summary'}</span>
              <h2 className="text-white font-bold text-2xl mb-3 leading-snug">{courseTitle}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{t(course, 'description_fr', 'description_en')}</p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">{language === 'fr' ? 'Sous-total' : 'Subtotal'}</span><span className="text-slate-300">{course.is_free ? '$0' : `$${course.price}`}</span></div>
                <div className="h-px bg-slate-800"></div>
                <div className="flex justify-between"><span className="text-white font-semibold">{language === 'fr' ? 'Total' : 'Total'}</span><span className="text-blue-400 font-bold text-xl">{course.is_free ? (language === 'fr' ? 'Gratuit' : 'Free') : `$${course.price}`}</span></div>
              </div>
              <p className="text-slate-500 text-xs mt-6">{language === 'fr' ? 'Accès à vie, dès la confirmation du paiement.' : 'Lifetime access, upon payment confirmation.'}</p>
            </div>

            <div className="p-10">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide mb-6 block">{language === 'fr' ? 'Moyen de paiement' : 'Payment method'}</span>
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}
              <form onSubmit={handlePayment} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  {methods.map((m) => (
                    <button key={m.key} type="button" onClick={() => setMethod(m.key)}
                      className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-colors ${method === m.key ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}>
                      {m.logo_url ? <img src={m.logo_url} alt={m.display_name} className="h-10 object-contain" /> : <span className="text-sm font-bold uppercase text-slate-300">{m.key}</span>}
                      <span className={`text-xs font-semibold uppercase ${method === m.key ? 'text-blue-400' : 'text-slate-500'}`}>{m.display_name}</span>
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={!method || processing} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-4 rounded-xl text-sm transition-colors">
                  {processing ? (language === 'fr' ? 'Traitement en cours...' : 'Processing...') : (language === 'fr' ? 'Confirmer le paiement' : 'Confirm payment')}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-6">✓</div>
            <h3 className="text-white font-bold text-2xl mb-2">{language === 'fr' ? 'Accès débloqué' : 'Access unlocked'}</h3>
            <p className="text-slate-400 text-sm mb-8">{language === 'fr' ? 'Le module est maintenant disponible dans ton espace.' : 'This module is now available in your dashboard.'}</p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-sm space-y-3 mb-8 text-left">
              <div className="flex justify-between"><span className="text-slate-500">{language === 'fr' ? 'Parcours' : 'Course'}</span><span className="text-slate-200">{receipt.course}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{language === 'fr' ? 'Montant' : 'Amount'}</span><span className="text-slate-200">{receipt.price}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{language === 'fr' ? 'Moyen' : 'Method'}</span><span className="text-slate-200">{receipt.method}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="text-slate-200">{receipt.date}</span></div>
            </div>
            <div className="space-y-3">
              <button onClick={sendReceiptByEmail} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-4 rounded-xl text-sm transition-colors">
                {language === 'fr' ? 'Envoyer le reçu par email' : 'Send receipt by email'}
              </button>
              <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-xl text-sm transition-colors">
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaymentModal;