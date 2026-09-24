import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Layers, 
  Crown, 
  SlidersHorizontal,
  X,
  AlertTriangle
} from 'lucide-react';
import { useProjects } from '../../context/ProjectsContext';
import { useAuth } from '../../context/AuthContext';
import { ProjectItem } from '../../types';
import { ProjectManageModal } from '../modals/ProjectManageModal';
import { ProjectDetailModal } from '../modals/ProjectDetailModal';

interface ProjectsSectionProps {
  onSelectProjectForInquiry: (project: ProjectItem) => void;
  openOwnerSettingsModal?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  onSelectProjectForInquiry,
  openOwnerSettingsModal 
}) => {
  const { 
    projects, 
    deleteProject, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useProjects();
  const { isOwner, userProfile } = useAuth();

  // Modals state
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [inspectProject, setInspectProject] = useState<ProjectItem | null>(null);

  // Delete confirmation state
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = [
    'All', 
    'Websites', 
    'Marketing', 
    'Branding', 
    'AI', 
    'Automation', 
    'Mobile App', 
    'Cloud SaaS'
  ];

  // Filter projects by category and search query
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesQuery = 
      p.name.toLowerCase().includes(query) ||
      p.client.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.results.toLowerCase().includes(query) ||
      p.technologies.some(t => t.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsManageModalOpen(true);
  };

  const handleOpenEditModal = (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setIsManageModalOpen(true);
  };

  const handleOpenDeleteConfirm = (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } catch (err) {
      console.warn('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section 
      id="projects" 
      className="py-24 bg-gradient-to-b from-[#030712] via-[#060c1c] to-[#030712] relative overflow-hidden border-t border-slate-900"
    >
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proven Track Record</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
              Featured Case Studies & <br />
              <span className="gold-gradient-text">High-Growth Portfolio</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Explore our real-world digital architectures, AI automations, and growth campaigns built for high-performance scale.
            </p>
          </div>

          {/* Owner Quick Action Bar */}
          {isOwner && (
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-md">
              <div className="flex items-center gap-2 px-2 text-xs font-mono text-amber-300">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Owner Privileges:</span>
                <span className="text-[11px] text-amber-200 font-sans font-semibold">
                  Administrator Active
                </span>
              </div>
              <button
                id="owner-add-project-btn"
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Project</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-850">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-bold scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative min-w-[260px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, stack, client..."
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-400 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Projects Counter Badge */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 px-1">
          <span>
            Displaying <strong className="text-amber-400 font-bold">{filteredProjects.length}</strong> of {projects.length} Projects
          </span>
          {isOwner && (
            <span className="text-[11px] text-amber-300/90 flex items-center gap-1 font-sans">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Owner Edit & Delete Mode Enabled
            </span>
          )}
        </div>

        {/* Empty Search State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No portfolio projects match your search criteria. Try a different filter or keyword.
            </p>
            {isOwner && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 hover:bg-amber-400 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Project in this Category</span>
              </button>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`portfolio-card-${project.id}`}
              className="group rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/50 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between relative cursor-pointer"
              onClick={() => setInspectProject(project)}
            >
              {/* Image & Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300">
                    {project.category}
                  </span>
                </div>

                {/* Owner Actions Overlay (Edit & Delete buttons directly on card) */}
                {isOwner && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                    <button
                      id={`edit-project-${project.id}`}
                      onClick={(e) => handleOpenEditModal(project, e)}
                      className="p-2 rounded-xl bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 transition-colors shadow-lg"
                      title="Edit Project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-project-${project.id}`}
                      onClick={(e) => handleOpenDeleteConfirm(project, e)}
                      className="p-2 rounded-xl bg-slate-950/90 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/40 transition-colors shadow-lg"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Stat Highlight on Image */}
                {project.statNumber && (
                  <div className="absolute bottom-4 right-4 text-right bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-lg">
                    <span className="text-base font-black text-amber-400 font-heading block leading-none">
                      {project.statNumber}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                      {project.statLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                    Client: {project.client}
                  </span>
                  <h3 className="font-heading text-xl font-extrabold text-white mt-1 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Results target highlight */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-xs text-emerald-400 flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span className="font-medium line-clamp-1">{project.results}</span>
                  </div>
                </div>

                {/* Technologies and Card Actions */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-mono">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`inspect-project-${project.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectProject(project);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:border-amber-400"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                        title="Open Live Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      <ProjectManageModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      {/* Project Details Modal */}
      <ProjectDetailModal
        isOpen={Boolean(inspectProject)}
        onClose={() => setInspectProject(null)}
        project={inspectProject}
        onRequestStrategy={onSelectProjectForInquiry}
      />

      {/* Delete Confirmation Dialog */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">
              Delete Project?
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to delete <strong className="text-amber-400">"{projectToDelete.name}"</strong>? This will remove it from the live portfolio and Firestore.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
