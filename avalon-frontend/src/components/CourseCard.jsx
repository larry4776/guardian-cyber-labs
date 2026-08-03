import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ id, title, description }) => {
  return (
    <div className="bg-slate-950 border border-slate-900 p-6 rounded-xl hover:border-blue-600 transition-all">
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <Link 
        to={`/courses/${id}`} 
        className="text-blue-500 font-mono text-xs uppercase hover:text-blue-400"
      >
        Voir le contenu ➔
      </Link>
    </div>
  );
};

export default CourseCard;