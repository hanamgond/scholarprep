import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, AlertCircle, CheckCircle, 
  Search, GripVertical, Calculator
} from 'lucide-react';
import { examService } from '../services/examService';
import { questionService } from '../../questions/services/questionService';
import { MathText } from '../../../components/shared/MathText';

import type { Exam, ExamSection } from '../types/exam';
import type { Question, QuestionType, Subject } from '../../questions/types/question';

export default function ExamBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // --- State ---
  const [exam, setExam] = useState<Exam | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI State
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [qSearch, setQSearch] = useState('');
  const [qSubjectFilter, setQSubjectFilter] = useState<Subject | ''>('');
  const [qTypeFilter, setQTypeFilter] = useState<QuestionType | ''>('');

  // --- Init ---
  useEffect(() => {
    if (!id) return;
    const init = async () => {
      try {
        const [examData, questionsData] = await Promise.all([
          examService.getById(id),
          questionService.getAll()
        ]);
        
        // Initialize with at least one section if empty
        if (examData.sections.length === 0) {
          examData.sections.push({
            id: crypto.randomUUID(),
            name: 'Section A',
            subject: 'Physics',
            questionType: 'SCQ',
            totalQuestions: 10,
            toBeAttempted: 10,
            markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
            questionIds: []
          });
        }
        
        setExam(examData);
        setAllQuestions(questionsData);
      } catch (e) {
        console.error(e);
        alert("Failed to load exam workspace");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  // --- Helpers ---
  const currentSection = exam?.sections[activeSectionIndex];

  // Filter questions for the LEFT panel (Bank)
  const availableQuestions = useMemo(() => {
    if (!exam) return [];
    const usedIds = new Set(exam.sections.flatMap(s => s.questionIds));
    
    return allQuestions.filter(q => 
      !usedIds.has(q.id) &&
      q.text.toLowerCase().includes(qSearch.toLowerCase()) &&
      (!qSubjectFilter || q.subject === qSubjectFilter) &&
      (!qTypeFilter || q.type === qTypeFilter)
    );
  }, [allQuestions, exam, qSearch, qSubjectFilter, qTypeFilter]);

  // --- Actions ---
  const handleAddSection = () => {
    if (!exam) return;
    const newSection: ExamSection = {
      id: crypto.randomUUID(),
      name: `Section ${String.fromCharCode(65 + exam.sections.length)}`,
      subject: 'Physics',
      questionType: 'SCQ',
      totalQuestions: 5,
      toBeAttempted: 5,
      markingScheme: { correct: 4, incorrect: -1, unattempted: 0 },
      questionIds: []
    };
    const updated = { ...exam, sections: [...exam.sections, newSection] };
    setExam(updated);
    setActiveSectionIndex(updated.sections.length - 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateSection = (key: keyof ExamSection | 'markingScheme', value: any) => {
    if (!exam || !currentSection) return;
    const updatedSections = [...exam.sections];
    
    if (key === 'markingScheme') {
       updatedSections[activeSectionIndex].markingScheme = { 
         ...updatedSections[activeSectionIndex].markingScheme, 
         ...value 
       };
    } else {
       // Safe cast because we know the key exists on the object, but dynamic assignment is tricky in TS
       (updatedSections[activeSectionIndex] as Record<string, unknown>)[key] = value;
    }
    setExam({ ...exam, sections: updatedSections });
  };

  const handleAddQuestionToSection = (questionId: string) => {
    if (!exam || !currentSection) return;
    
    if (currentSection.questionIds.length >= currentSection.totalQuestions) {
      alert(`Section limit reached (${currentSection.totalQuestions} questions). Increase the limit to add more.`);
      return;
    }

    const updatedSections = [...exam.sections];
    updatedSections[activeSectionIndex].questionIds.push(questionId);
    setExam({ ...exam, sections: updatedSections });
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (!exam || !currentSection) return;
    const updatedSections = [...exam.sections];
    updatedSections[activeSectionIndex].questionIds = updatedSections[activeSectionIndex].questionIds.filter(id => id !== questionId);
    setExam({ ...exam, sections: updatedSections });
  };

  // --- Publish / Save ---
  const validateExam = () => {
    if (!exam) return false;
    for (const sec of exam.sections) {
      if (sec.questionIds.length !== sec.totalQuestions) {
        alert(`Validation Failed: ${sec.name} needs ${sec.totalQuestions} questions but has ${sec.questionIds.length}.`);
        return false;
      }
    }
    return true;
  };

  const handleSave = async (publish = false) => {
    if (!exam || !id) return;
    if (publish && !validateExam()) return;

    setSaving(true);
    try {
      let totalMarks = 0;
      exam.sections.forEach(s => {
        totalMarks += s.toBeAttempted * s.markingScheme.correct;
      });

      const payload = {
        ...exam,
        totalMarks,
        status: publish ? 'Published' : 'Draft'
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await examService.update(id, payload as any);
      
      if (publish) {
        alert("Exam Published Successfully! Students can now view it.");
        navigate('/exams');
      } else {
        alert("Progress Saved.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save exam.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !exam) return <div className="h-screen flex items-center justify-center text-slate-500">Loading Workspace...</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      
      {/* 1. Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/exams')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{exam.title}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calculator className="w-3 h-3" /> {exam.totalMarks} Marks Est.</span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">{exam.pattern}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg border border-slate-300">Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
            {saving ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Publish Exam</>}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT PANEL: Question Bank Browser */}
        <aside className="w-1/3 bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Bank</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Search questions..." 
                value={qSearch} onChange={e => setQSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs" value={qSubjectFilter} onChange={e => setQSubjectFilter(e.target.value as Subject)}>
                <option value="">All Subjects</option>
                {['Physics','Chemistry','Mathematics','Biology'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs" value={qTypeFilter} onChange={e => setQTypeFilter(e.target.value as QuestionType)}>
                <option value="">All Types</option>
                {['SCQ','MCQ','INT','AR','MM'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {availableQuestions.map(q => (
              <div key={q.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${q.difficulty === 'Easy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{q.difficulty}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{q.type}</span>
                  </div>
                  <button 
                    onClick={() => handleAddQuestionToSection(q.id)}
                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-colors"
                    title="Add to Section"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-slate-800 line-clamp-2"><MathText text={q.text} /></div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                  <span>{q.subject}</span> • <span>{q.id}</span>
                </div>
              </div>
            ))}
            {availableQuestions.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">No matching questions found.</div>
            )}
          </div>
        </aside>

        {/* 3. RIGHT PANEL: Exam Structure */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Section Tabs */}
          <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {exam.sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionIndex(idx)}
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeSectionIndex === idx 
                    ? 'border-indigo-600 text-indigo-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {sec.name}
                <span className={`text-[10px] px-1.5 rounded-full ${sec.questionIds.length === sec.totalQuestions ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {sec.questionIds.length}/{sec.totalQuestions}
                </span>
              </button>
            ))}
            <button onClick={handleAddSection} className="ml-2 p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><Plus className="w-4 h-4" /></button>
          </div>

          {/* Active Section Config */}
          {currentSection && (
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              
              {/* Section Settings Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Section Name</label>
                     <input className="w-full p-2 border border-slate-300 rounded text-sm font-medium" value={currentSection.name} onChange={e => handleUpdateSection('name', e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Type</label>
                     <select className="w-full p-2 border border-slate-300 rounded text-sm" value={currentSection.questionType} onChange={e => handleUpdateSection('questionType', e.target.value)}>
                        {['SCQ','MCQ','INT','AR','MM'].map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Target Count</label>
                     <div className="flex items-center gap-2">
                        <input type="number" className="w-20 p-2 border border-slate-300 rounded text-sm text-center" value={currentSection.totalQuestions} onChange={e => handleUpdateSection('totalQuestions', parseInt(e.target.value))} />
                        <span className="text-xs text-slate-400">questions</span>
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">To Attempt</label>
                     <div className="flex items-center gap-2">
                        <input type="number" className="w-20 p-2 border border-slate-300 rounded text-sm text-center" value={currentSection.toBeAttempted} onChange={e => handleUpdateSection('toBeAttempted', parseInt(e.target.value))} />
                        <span className="text-xs text-slate-400">optional logic</span>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Correct Marks (+)</label><input type="number" className="w-full p-2 border border-emerald-200 bg-emerald-50 rounded text-sm text-emerald-700 font-bold" value={currentSection.markingScheme.correct} onChange={e => handleUpdateSection('markingScheme', { correct: parseInt(e.target.value) })} /></div>
                   <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Negative Marks (-)</label><input type="number" className="w-full p-2 border border-rose-200 bg-rose-50 rounded text-sm text-rose-700 font-bold" value={currentSection.markingScheme.incorrect} onChange={e => handleUpdateSection('markingScheme', { incorrect: parseInt(e.target.value) })} /></div>
                </div>
              </div>

              {/* Selected Questions List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    Selected Questions 
                    <span className={`text-xs px-2 py-0.5 rounded-full ${currentSection.questionIds.length === currentSection.totalQuestions ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {currentSection.questionIds.length} / {currentSection.totalQuestions}
                    </span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentSection.questionIds.map((qid, index) => {
                    const q = allQuestions.find(fq => fq.id === qid);
                    if (!q) return null;
                    return (
                      <div key={qid} className="flex gap-4 p-4 bg-white rounded-lg border border-slate-200 group hover:border-indigo-300 transition-all">
                        <div className="flex flex-col items-center gap-2 pt-1 text-slate-300">
                           <span className="font-mono text-xs font-bold">Q{index + 1}</span>
                           <GripVertical className="w-4 h-4 cursor-grab" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm text-slate-800 mb-1"><MathText text={q.text} /></div>
                           <div className="flex gap-2">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{q.id}</span>
                              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{q.subject}</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveQuestion(qid)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  
                  {currentSection.questionIds.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                      <p>No questions in this section yet.</p>
                      <p className="text-xs">Search and add questions from the left panel.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}