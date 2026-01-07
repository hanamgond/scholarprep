import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Calendar, Copy, ChevronRight, 
  Clock, Award, Target, Layers, Layout, BookOpen, Users, CalendarDays, Save
} from 'lucide-react';
import { examService } from '../services/examService';
import type { ExamPattern, CreateExamRequest, ExamMode, ExamCategory, ExamStatus } from '../types/exam';
import type { Subject } from '../../questions/types/question';

const EXAM_ORIGINS = [
  { id: 'Standard', icon: FileText, title: 'Standard Exam', desc: 'Create from scratch' },
  { id: 'Previous', icon: Calendar, title: 'Previous Year', desc: 'Based on past papers' },
  { id: 'Model', icon: Copy, title: 'Model Exam', desc: 'Practice template' },
] as const;

const PATTERNS: {id: ExamPattern, label: string}[] = [
  { id: 'JEE_MAINS', label: 'JEE Mains (300 Marks)' },
  { id: 'JEE_ADVANCED', label: 'JEE Advanced (Variable)' },
  { id: 'NEET', label: 'NEET (720 Marks)' },
  { id: 'BOARD', label: 'Board Exam' },
  { id: 'CUSTOM', label: 'Custom Pattern' },
];

const SUBJECT_OPTIONS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
const CLASS_OPTIONS = ['11', '12', 'Dropper'];

export default function CreateExam() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
   
  const [origin, setOrigin] = useState<'Standard'|'Previous'|'Model'>('Standard');
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExamCategory>('Mock');
  const [mode, setMode] = useState<ExamMode>('Online');
  const [pattern, setPattern] = useState<ExamPattern>('JEE_MAINS');
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(300);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [currentStatus, setCurrentStatus] = useState<ExamStatus>('Draft');

  // Hydrate on Edit
  useEffect(() => {
    if (!isEditMode || !id) return;
    const fetchExam = async () => {
      try {
        const data = await examService.getById(id);
        if (data) {
          setTitle(data.title);
          setDescription(data.description || '');
          setPattern(data.pattern);
          setMode(data.mode);
          setCategory(data.category);
          setDuration(data.durationMinutes);
          setTotalMarks(data.totalMarks);
          setStartDate(data.startDate || '');
          setEndDate(data.endDate || '');
          setSelectedClasses(data.classIds || []);
          setSelectedSubjects(data.subjects || []);
          setCurrentStatus(data.status);
        }
      } catch (e) { console.error("Failed to load exam", e); }
    };
    fetchExam();
  }, [id, isEditMode]);

  // Auto-set defaults based on Pattern
  useEffect(() => {
    if (isEditMode) return;
    if (pattern === 'JEE_MAINS') { setDuration(180); setTotalMarks(300); }
    else if (pattern === 'NEET') { setDuration(200); setTotalMarks(720); }
  }, [pattern, isEditMode]);

  // Smart Date Logic
  useEffect(() => {
    if (startDate && duration) {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + duration * 60000);
      const endString = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setEndDate(endString);
    }
  }, [startDate, duration]);

  const toggleSelection = <T extends string>(item: T, current: T[], setter: (val: T[]) => void) => {
    if (current.includes(item)) setter(current.filter(i => i !== item));
    else setter([...current, item]);
  };

  const handleSave = async (targetStatus: ExamStatus, redirect: 'list' | 'next') => {
    if (!title.trim()) { alert("Please enter an exam title"); return; }
    
    setLoading(true);
    try {
      const payload: CreateExamRequest = {
        title, description, pattern, mode, category,
        durationMinutes: duration, totalMarks,
        startDate, endDate,
        classIds: selectedClasses, subjects: selectedSubjects,
        status: targetStatus
      };

      let examId = id;
      if (isEditMode && id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await examService.update(id, payload as any);
      } else {
        const newExam = await examService.create(payload);
        examId = newExam.id;
      }
      
      if (redirect === 'list') {
        alert(`Exam Saved as ${targetStatus}!`);
        navigate('/exams');
      } else {
        // 👇 FIX: Redirect to the Builder Page
        navigate(`/exams/${examId}/build`); 
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save exam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. Sticky Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/exams')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Exam Blueprint' : 'Create New Exam'}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">Step 1: Basic Setup</span>
              <ChevronRight className="w-3 h-3" />
              <span>Step 2: Configure Sections & Questions</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => handleSave('Draft', 'list')} 
             disabled={loading}
             className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
             Save Draft & Exit
          </button>
          
          {isEditMode && currentStatus === 'Published' && (
             <button 
                onClick={() => handleSave('Published', 'list')} 
                disabled={loading}
                className="px-5 py-2.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-lg border border-emerald-200 transition-colors flex items-center gap-2"
             >
                <Save className="w-4 h-4" /> Update & Exit
             </button>
          )}

          <button 
            onClick={() => handleSave(currentStatus, 'next')} 
            disabled={loading || !title} 
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {loading ? 'Saving...' : 'Next: Configure Sections'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Origin Selection */}
          {!isEditMode && (
            <section>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">1. Select Exam Origin</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {EXAM_ORIGINS.map((card) => (
                  <div 
                    key={card.id} 
                    onClick={() => setOrigin(card.id)} 
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      origin === card.id ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${origin === card.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-lg ${origin === card.id ? 'text-indigo-900' : 'text-slate-800'}`}>{card.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Main Form Grid */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* LEFT: Basic Info & Schedule */}
            <div className="col-span-12 lg:col-span-7 space-y-8">
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><Layout className="w-4 h-4 text-indigo-600" /> Basic Details</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Exam Title *</label>
                    <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-base" placeholder="e.g. JEE Mains Full Mock Test - 01" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none" placeholder="Instructions, syllabus coverage, etc." value={description} onChange={e => setDescription(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1.5">Exam Category</label>
                       <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={category} onChange={e => setCategory(e.target.value as ExamCategory)}>
                         <option value="Mock">Mock Test</option>
                         <option value="Practice">Practice</option>
                         <option value="Term">Term Exam</option>
                         <option value="Final">Final Exam</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1.5">Exam Mode</label>
                       <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={mode} onChange={e => setMode(e.target.value as ExamMode)}>
                         <option value="Online">Online (CBT)</option>
                         <option value="Offline">Offline (OMR)</option>
                         <option value="Hybrid">Hybrid</option>
                       </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-indigo-600" /> Schedule</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
                    <input type="datetime-local" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
                    <input type="datetime-local" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: Configuration & Targeting */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" /> Configuration</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2"><Target className="w-4 h-4 text-slate-400" /> Exam Pattern</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={pattern} onChange={e => setPattern(e.target.value as ExamPattern)}>
                      {PATTERNS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> Duration (Min)</label>
                      <input type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2"><Award className="w-4 h-4 text-slate-400" /> Total Marks</label>
                      <input type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none" value={totalMarks} onChange={e => setTotalMarks(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" /> Target Audience</h3>
                
                <div className="space-y-5">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Applicable Classes</label>
                      <div className="flex flex-wrap gap-2">
                        {CLASS_OPTIONS.map(cls => (
                          <button 
                            key={cls} 
                            onClick={() => toggleSelection(cls, selectedClasses, setSelectedClasses)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                              selectedClasses.includes(cls) 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                              : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300'
                            }`}
                          >
                            Class {cls}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-400" /> Subjects Covered</label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECT_OPTIONS.map(sub => (
                          <button 
                            key={sub} 
                            onClick={() => toggleSelection(sub, selectedSubjects, setSelectedSubjects)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                              selectedSubjects.includes(sub) 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                              : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-300'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}