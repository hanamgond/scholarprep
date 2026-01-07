import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, FileText, CheckCircle, AlertCircle, 
  MoreVertical, BookOpen, Layers, ChevronDown, Download, UploadCloud, Pencil, Trash2, Copy
} from 'lucide-react';
import { questionService } from '../services/questionService';
import { MathText } from '../../../components/shared/MathText';
import type { Question, QuestionType, Difficulty, Subject, QuestionStatus } from '../types/question';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p><h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3></div>
    <div className={`p-3 rounded-lg ${color}`}><Icon className="w-6 h-6 text-white" /></div>
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${className}`}>{children}</span>
);

export default function QuestionBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Fixed: Renamed 'classId' to 'classLevel' to match the Question entity
  const [filters, setFilters] = useState({ 
    search: '', 
    subject: '' as Subject | '', 
    classLevel: '', 
    difficulty: '' as Difficulty | '', 
    type: '' as QuestionType | '', 
    status: '' as QuestionStatus | '' 
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this question?')) {
      await questionService.delete(id);
      loadQuestions(); // Refresh list
    }
    setOpenMenuId(null);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/create?id=${id}&copy=true`);
    setOpenMenuId(null);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const searchLower = filters.search.toLowerCase();
      const matchSearch = !filters.search || 
        q.text.toLowerCase().includes(searchLower) || 
        q.tags.some(t => t.toLowerCase().includes(searchLower));

      const matchSubject = !filters.subject || q.subject === filters.subject;
      const matchClass = !filters.classLevel || q.classLevel === filters.classLevel; // Fixed property access
      const matchDifficulty = !filters.difficulty || q.difficulty === filters.difficulty;
      const matchType = !filters.type || q.type === filters.type;
      const matchStatus = !filters.status || q.status === filters.status;

      return matchSearch && matchSubject && matchClass && matchDifficulty && matchType && matchStatus;
    });
  }, [questions, filters]);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeBadge = (type: QuestionType) => {
    const map: Record<string, string> = {
      SCQ: 'bg-blue-50 text-blue-700 border-blue-200',
      MCQ: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      INT: 'bg-purple-50 text-purple-700 border-purple-200',
      AR:  'bg-orange-50 text-orange-700 border-orange-200'
    };
    return map[type] || 'bg-slate-100';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 text-sm mt-1">Manage JEE/NEET repository, reviews, and analytics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Bulk Import Modal logic goes here")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" /> Import (Bulk)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => navigate('/questions/create')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Questions" value={questions.length} icon={Layers} color="bg-indigo-500" />
        <StatCard label="Published" value={questions.filter(q => q.status === 'Published').length} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="Pending Review" value={questions.filter(q => q.status === 'Review').length} icon={AlertCircle} color="bg-amber-500" />
        <StatCard label="Physics Focus" value={questions.filter(q => q.subject === 'Physics').length} icon={BookOpen} color="bg-blue-500" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by text or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showFilters && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-top-2 duration-200">
            {[
              { label: 'Class', key: 'classLevel', options: ['11', '12', 'Dropper'] },
              { label: 'Subject', key: 'subject', options: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
              { label: 'Difficulty', key: 'difficulty', options: ['Easy', 'Medium', 'Hard', 'Expert'] },
              { label: 'Type', key: 'type', options: ['SCQ', 'MCQ', 'INT', 'AR'] },
              { label: 'Status', key: 'status', options: ['Draft', 'Review', 'Published'] },
            ].map((filter) => (
              <div key={filter.key}>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{filter.label}</label>
                <select 
                  className="w-full p-2 rounded-md border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={filters[filter.key as keyof typeof filters] as string}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                >
                  <option value="">All</option>
                  {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
            <div className="flex items-end md:col-span-5">
              <button 
                onClick={() => setFilters({ search: '', subject: '', classLevel: '', difficulty: '', type: '', status: '' })}
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline mb-2 ml-auto"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-[40%]">Question Stem</th>
                <th className="px-6 py-4">Subject & Topic</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={6} className="p-12 text-center text-slate-500">Loading data...</td></tr>
              ) : filteredQuestions.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="p-12 text-center">
                     <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                       <FileText className="w-6 h-6 text-slate-400" />
                     </div>
                     <p className="text-slate-900 font-medium">No questions found</p>
                     <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
                   </td>
                 </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium text-slate-900 line-clamp-2 leading-relaxed">
                          <MathText text={q.text} />
                        </div>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                             {q.id.slice(0, 8)}
                           </span>
                           {q.tags?.slice(0, 2).map(t => (
                             <span key={t} className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                               #{t}
                             </span>
                           ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{q.subject}</div>
                      <div className="text-xs text-slate-500">Class {q.classLevel}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`border ${getTypeBadge(q.type)}`}>{q.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`border ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                         <div className={`w-2 h-2 rounded-full ${q.status === 'Published' ? 'bg-emerald-500' : q.status === 'Draft' ? 'bg-slate-400' : 'bg-amber-500'}`} />
                         <span className="text-sm text-slate-700">{q.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex justify-end gap-2">
                        {/* Edit Action (Primary) */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/questions/create?id=${q.id}`); }}
                          className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" 
                          title="Edit Question"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        
                        {/* More Actions (Dropdown) */}
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q.id ? null : q.id); }}
                            className={`p-2 rounded-lg transition-colors ${openMenuId === q.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === q.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <button 
                                onClick={(e) => handleDuplicate(q.id, e)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" /> Duplicate
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button 
                                onClick={(e) => handleDelete(q.id, e)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-sm text-slate-500">Showing 1-10 of {filteredQuestions.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 text-sm border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}