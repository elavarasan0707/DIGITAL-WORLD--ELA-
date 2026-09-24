import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  ExternalLink, 
  Github, 
  Layers, 
  TrendingUp, 
  Check, 
  Save 
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { useProjects } from '../../context/ProjectsContext';

interface ProjectManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: ProjectItem | null;
}

const PRESET_IMAGES = [
  { label: 'Fintech & Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Automotive & EV Campaign', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Luxury & Jewelry Branding', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop' },
  { label: 'AI Intelligence & Neural', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Healthcare & WhatsApp Flow', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Real Estate & Architectural', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Mobile App & SaaS Platform', url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Cloud Infrastructure & Server', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop' },
];

const CATEGORIES = [
  'Websites',
  'Marketing',
  'Branding',
  'AI',
  'Automation',
  'Mobile App',
  'Cloud SaaS'
];

export const ProjectManageModal: React.FC<ProjectManageModalProps> = ({
  isOpen,
  onClose,
  projectToEdit
}) => {
  const { addProject, updateProject } = useProjects();

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState<any>('Websites');
  const [description, setDescription] = useState('');
  const [results, setResults] = useState('');
  const [statNumber, setStatNumber] = useState('');
  const [statLabel, setStatLabel] = useState('');
  const [technologiesStr, setTechnologiesStr] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setClient(projectToEdit.client || '');
      setCategory(projectToEdit.category || 'Websites');
      setDescription(projectToEdit.description || '');
      setResults(projectToEdit.results || '');
      setStatNumber(projectToEdit.statNumber || '');
      setStatLabel(projectToEdit.statLabel || '');
      setTechnologiesStr(projectToEdit.technologies ? projectToEdit.technologies.join(', ') : '');
      setImage(projectToEdit.image || PRESET_IMAGES[0].url);
      setLiveUrl(projectToEdit.liveUrl || '');
      setGithubUrl(projectToEdit.githubUrl || '');
    } else {
      setName('');
      setClient('');
      setCategory('Websites');
      setDescription('');
      setResults('');
      setStatNumber('');
      setStatLabel('');
      setTechnologiesStr('React 19, TypeScript, Tailwind CSS');
      setImage(PRESET_IMAGES[0].url);
      setLiveUrl('');
      setGithubUrl('');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }
    if (!client.trim()) {
      setError('Please provide a client or organization name.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for this project.');
      return;
    }

    const techArray = technologiesStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, {
          name: name.trim(),
          client: client.trim(),
          category,
          description: description.trim(),
          results: results.trim() || 'Proven business acceleration & measurable digital impact',
          statNumber: statNumber.trim() || '+100%',
          statLabel: statLabel.trim() || 'Performance Target',
          technologies: techArray.length ? techArray : ['Web Development', 'Digital Systems'],
          image: image.trim(),
          liveUrl: liveUrl.trim(),
          githubUrl: githubUrl.trim()
        });
      } else {
        await addProject({
          name: name.trim(),
          client: client.trim(),
          category,
          description: description.trim(),
          results: results.trim() || 'High-performance delivery & accelerated conversion metrics',
          statNumber: statNumber.trim() || '+100%',
          statLabel: statLabel.trim() || 'ROI Metric',
          technologies: techArray.length ? techArray : ['React 19', 'Next.js', 'Tailwind'],
          image: image.trim(),
          liveUrl: liveUrl.trim(),
          githubUrl: githubUrl.trim(),
          featured: true
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Owner Project Management</span>
          </div>
          <h3 className="font-heading text-2xl font-black text-white">
            {projectToEdit ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Projects added will instantly update on Firestore and be live for all visitors worldwide.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <X className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Project Name & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Global Fintech Portal"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Client / Company *
              </label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Apex Global Capital"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Category & Key Results Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Key Result / Business Metric *
              </label>
              <input
                type="text"
                required
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="e.g. +340% Onboarding velocity, ₹150+ Crores processed"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Stat Number & Stat Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Highlight Stat (e.g. "+340%", "24,000+", "₹350 Cr+")
              </label>
              <input
                type="text"
                value={statNumber}
                onChange={(e) => setStatNumber(e.target.value)}
                placeholder="+340%"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Stat Label (e.g. "Conversion Speed", "Orders")
              </label>
              <input
                type="text"
                value={statLabel}
                onChange={(e) => setStatLabel(e.target.value)}
                placeholder="Conversion Rate"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Case Study Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the client problem, digital architecture, custom features built, and real-world outcomes..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all resize-none"
            />
          </div>

          {/* Row 5: Technologies */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Technologies / Stack (comma separated)
            </label>
            <input
              type="text"
              value={technologiesStr}
              onChange={(e) => setTechnologiesStr(e.target.value)}
              placeholder="e.g. React 19, Three.js, Tailwind CSS, WebSockets, Firebase"
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>

          {/* Row 6: Image Selection with 1-Click Curated Presets */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Project Cover Image
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all mb-2"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
                <ImageIcon className="w-3 h-3" /> Presets:
              </span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImage(preset.url)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                    image === preset.url
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {/* Live Preview of image */}
            {image && (
              <div className="mt-2 relative aspect-[16/7] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).src = PRESET_IMAGES[0].url;
                  }}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[9px] text-slate-300 font-mono">
                  Live Preview
                </div>
              </div>
            )}
          </div>

          {/* Row 7: Live URL & GitHub URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-amber-400" />
                <span>Live Website URL (Optional)</span>
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Github className="w-3 h-3 text-amber-400" />
                <span>GitHub Repository (Optional)</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : projectToEdit ? 'Save Changes' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
