import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';

const QUESTIONS = [
  {
    id: 1,
    question: "Comment évalueriez-vous votre expérience en informatique ?",
    question_en: "How would you rate your experience in IT?",
    answers: [
      { letter: 'A', text: "Débutant complet — je commence tout juste", text_en: "Complete beginner — just starting out" },
      { letter: 'B', text: "Bases solides — j'utilise des outils couramment", text_en: "Solid basics — I use tools regularly" },
      { letter: 'C', text: "Intermédiaire — j'ai déjà codé ou administré des systèmes", text_en: "Intermediate — I've coded or managed systems" },
      { letter: 'D', text: "Avancé — j'ai une expérience professionnelle en IT", text_en: "Advanced — I have professional IT experience" },
    ],
  },
  {
    id: 2,
    question: "Quel domaine de la cybersécurité vous attire le plus ?",
    question_en: "Which cybersecurity domain interests you the most?",
    answers: [
      { letter: 'A', text: "L'attaque — tester et exploiter des systèmes (Red Team)", text_en: "Attacking — testing and exploiting systems (Red Team)" },
      { letter: 'B', text: "La défense — surveiller et protéger (Blue Team)", text_en: "Defense — monitoring and protecting (Blue Team)" },
      { letter: 'C', text: "La gouvernance — gérer les risques et la conformité (GRC)", text_en: "Governance — managing risks and compliance (GRC)" },
      { letter: 'D', text: "Je ne sais pas encore — je veux découvrir", text_en: "Not sure yet — I want to explore" },
    ],
  },
  {
    id: 3,
    question: "Avez-vous déjà utilisé des outils comme Nmap, Wireshark ou Metasploit ?",
    question_en: "Have you ever used tools like Nmap, Wireshark or Metasploit?",
    answers: [
      { letter: 'A', text: "Jamais — je ne connais pas ces outils", text_en: "Never — I don't know these tools" },
      { letter: 'B', text: "Entendu parler — mais jamais utilisé", text_en: "Heard of them — but never used" },
      { letter: 'C', text: "Essayé occasionnellement — en cours ou en autodidacte", text_en: "Tried occasionally — in class or self-taught" },
      { letter: 'D', text: "Utilise régulièrement — dans un contexte pro ou perso", text_en: "Use regularly — professionally or personally" },
    ],
  },
  {
    id: 4,
    question: "Quel est votre objectif principal ?",
    question_en: "What is your main goal?",
    answers: [
      { letter: 'A', text: "Reconversion professionnelle vers la cybersécurité", text_en: "Career switch to cybersecurity" },
      { letter: 'B', text: "Approfondir mes compétences dans mon poste actuel", text_en: "Deepen my skills in my current role" },
      { letter: 'C', text: "Obtenir une certification reconnue", text_en: "Get a recognized certification" },
      { letter: 'D', text: "Curiosité et apprentissage personnel", text_en: "Curiosity and personal learning" },
    ],
  },
  {
    id: 5,
    question: "Combien d'heures par semaine pouvez-vous consacrer à votre formation ?",
    question_en: "How many hours per week can you dedicate to your training?",
    answers: [
      { letter: 'A', text: "Moins de 3h — je suis très occupé", text_en: "Less than 3h — I'm very busy" },
      { letter: 'B', text: "3 à 7h — je peux m'organiser", text_en: "3 to 7h — I can manage" },
      { letter: 'C', text: "7 à 15h — je suis motivé", text_en: "7 to 15h — I'm motivated" },
      { letter: 'D', text: "Plus de 15h — c'est ma priorité absolue", text_en: "More than 15h — it's my top priority" },
    ],
  },
];

const getRecommendation = (answers) => {
  // Domaine selon Q2
  const domain = { A: 'red_team', B: 'blue_team', C: 'grc', D: 'blue_team' }[answers[1]] || 'blue_team';

  // Niveau selon Q1 + Q3
  const levelScore = { A: 0, B: 1, C: 2, D: 3 };
  const score = (levelScore[answers[0]] || 0) + (levelScore[answers[2]] || 0);
  let level = 'beginner';
  if (score >= 5) level = 'advanced';
  else if (score >= 3) level = 'intermediate';

  return { domain, level };
};

const DOMAIN_INFO = {
  red_team: { fr: 'Red Team', en: 'Red Team', color: '#c0505a' },
  blue_team: { fr: 'Blue Team', en: 'Blue Team', color: '#4a7fc2' },
  grc: { fr: 'GRC', en: 'GRC', color: '#c9a94e' },
};

const LEVEL_INFO = {
  beginner: { fr: 'Débutant', en: 'Beginner', border: 'rgba(106,158,106,0.4)', color: '#6a9e6a', bg: 'rgba(106,158,106,0.08)' },
  intermediate: { fr: 'Intermédiaire', en: 'Intermediate', border: 'rgba(201,169,78,0.4)', color: '#c9a94e', bg: 'rgba(201,169,78,0.08)' },
  advanced: { fr: 'Avancé', en: 'Advanced', border: 'rgba(192,80,90,0.4)', color: '#c0505a', bg: 'rgba(192,80,90,0.08)' },
};

const PlacementTest = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const question = QUESTIONS[currentQ];
  const progress = (currentQ / QUESTIONS.length) * 100;

  const handleSelect = (letter) => {
    if (selected) return; // évite double clic
    setSelected(letter);
    const newAnswers = { ...answers, [currentQ]: letter };
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelected(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        const result = getRecommendation(newAnswers);
        setRecommendation(result);
        setDone(true);
      }
    }, 350);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setDone(false);
    setRecommendation(null);
  };

  // Page de résultat
  if (done && recommendation) {
    const domain = DOMAIN_INFO[recommendation.domain];
    const level = LEVEL_INFO[recommendation.level];

    return (
      <div className="min-h-screen bg-base text-white font-sans">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="rounded-xl overflow-hidden" style={{ background: '#080d14', border: '1px solid rgba(255,255,255,0.1)' }}>

            {/* Barre terminal */}
            <div className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#a94442' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#c9a94e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#6a9e6a' }} />
              <span className="font-mono text-[11px] text-muted ml-3">guardian://placement-test — résultat</span>
            </div>

            {/* Barre de progression pleine */}
            <div className="h-0.5" style={{ background: '#3b6ea5' }} />

            <div className="p-8">
              {/* Label vert ANALYSE TERMINÉE */}
              <div className="flex items-center gap-2 mb-6">
                <span className="font-mono text-xs px-2.5 py-1 rounded"
                  style={{ color: '#6a9e6a', border: '1px solid rgba(106,158,106,0.4)', background: 'rgba(106,158,106,0.08)' }}>
                  [ {fr ? 'ANALYSE TERMINÉE' : 'ANALYSIS COMPLETE'} ]
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-8">
                {fr ? 'Votre profil' : 'Your profile'}
              </h2>

              <div className="rounded-xl p-6 mb-8"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Résultat coloré selon catégorie */}
                <p className="font-display text-4xl font-bold mb-3" style={{ color: domain.color }}>
                  {fr ? domain.fr : domain.en}
                </p>

                {/* Niveau entre crochets */}
                <span className="font-mono text-sm px-3 py-1.5 rounded inline-block mb-6"
                  style={{ color: level.color, border: `1px solid ${level.border}`, background: level.bg }}>
                  [ {fr ? level.fr : level.en} ]
                </span>

                {/* Texte explicatif */}
                <p className="text-muted text-sm leading-relaxed">
                  {fr
                    ? `Basé sur vos réponses, nous recommandons de démarrer avec les parcours ${domain.fr} de niveau ${level.fr}.`
                    : `Based on your answers, we recommend starting with ${domain.en} courses at ${level.en} level.`}
                </p>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/catalog"
                  className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-lg text-sm flex-1 text-center"
                  style={{ backgroundColor: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)' }}>
                  {fr ? 'Voir le catalogue' : 'View catalog'}
                </Link>
                <button onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-sm flex-1"
                  style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent' }}>
                  {fr ? 'Refaire le test' : 'Retake test'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Page de test
  return (
    <div className="min-h-screen bg-base text-white font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="rounded-xl overflow-hidden" style={{ background: '#080d14', border: '1px solid rgba(255,255,255,0.1)' }}>

          {/* Barre terminal avec compteur X/5 */}
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#a94442' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#c9a94e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#6a9e6a' }} />
              <span className="font-mono text-[11px] text-muted ml-3">
                guardian://placement-test — {fr ? 'question' : 'question'} {currentQ + 1}/5
              </span>
            </div>
            <Link to="/catalog" className="font-mono text-[11px] text-muted hover:text-white transition-colors">
              {fr ? 'Passer au catalogue →' : 'Skip to catalog →'}
            </Link>
          </div>

          {/* Barre de progression bleue */}
          <div className="h-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#3b6ea5' }} />
          </div>

          {/* Contenu */}
          <div className="p-8">
            <p className="font-mono text-xs mb-6" style={{ color: '#4a7fc2' }}>
              &gt; ANALYSE EN COURS _
            </p>

            <h2 className="font-display text-xl font-bold text-white mb-8 leading-snug">
              {fr ? question.question : question.question_en}
            </h2>

            {/* Réponses — clic automatique */}
            <div className="space-y-3">
              {question.answers.map((answer) => {
                const isSelected = selected === answer.letter;
                return (
                  <button
                    key={answer.letter}
                    onClick={() => handleSelect(answer.letter)}
                    disabled={!!selected}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-lg text-left transition-all duration-150"
                    style={{
                      background: isSelected ? 'rgba(59,110,165,0.18)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(59,110,165,0.6)' : '1px solid rgba(255,255,255,0.08)',
                      cursor: selected ? 'not-allowed' : 'pointer',
                    }}>
                    <span className="font-mono text-sm font-bold shrink-0" style={{ color: '#4a7fc2' }}>
                      {answer.letter}.
                    </span>
                    <span className="text-sm" style={{ color: isSelected ? '#ffffff' : '#94A3B8' }}>
                      {fr ? answer.text : answer.text_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default PlacementTest;