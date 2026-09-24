import React from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  TrendingUp, 
  Layers, 
  Building2, 
  Calendar, 
  MessageCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { getWhatsAppDirectUrl } from '../../lib/whatsapp';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  onRequestStrategy: (project: ProjectItem) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  onRequestStrategy
}) => {
  if (!isOpen || !project) return null;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello ELA Digital World! I reviewed your project "${project.name}" (Client: ${project.client}) and would like to build a similar high-impact digital solution.`
    );
    window.open(`https://wa.me/917904092404?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-slate-100 my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Banner Image */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-slate-950 flex-shrink-0">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-amber-500 text-slate-950 shadow-lg">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-200 bg-slate-900/90 backdrop-blur border border-slate-700">
              Client: {project.client}
            </span>
          </div>

          {/* Metric Highlight on Banner */}
          {project.statNumber && (
            <div className="absolute bottom-4 right-5 text-right bg-slate-950/90 backdrop-blur-md border border-amber-500/40 rounded-2xl px-4 py-2 shadow-xl">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-heading block leading-none">
                {project.statNumber}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                {project.statLabel || 'Result'}
              </span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white leading-tight">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Proven Results Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-bold block">
                Verified Outcome & ROI
              </span>
              <p className="text-sm font-semibold text-slate-100 mt-0.5">
                {project.results}
              </p>
            </div>
          </div>

          {/* Technology Architecture */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2.5">
              Technologies & System Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links: Live Site & Code */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch Live Site</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss via WhatsApp</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestStrategy(project);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all"
            >
              <span>Request Similar Strategy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
