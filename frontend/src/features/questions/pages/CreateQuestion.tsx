import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Save, ArrowLeft, Image as ImageIcon, Type, List, HelpCircle, 
  Check, Plus, Trash2, Settings, Layout, Lightbulb, 
  Target, Scale, GitMerge, BarChart, Clock, Brain, BookOpen, Eye, X, AlertCircle
} from 'lucide-react';
import { questionService } from '../services/questionService';
import { MathText } from '../../../components/shared/MathText';
import { QuestionFullPreview } from '../components/QuestionFullPreview';
import type { 
  QuestionType, Difficulty, Subject, Option, QuestionStatus, 
  CreateQuestionRequest, MatrixItem, QuestionContent,
  BloomsLevel, QuestionNature, AROption
} from '../types/question';

// --- Mock Hierarchy Data ---
const SUBJECTS: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

const CHAPTERS: Record<Subject, string[]> = {
  'Physics': ['Kinematics', 'Laws of Motion', 'Work, Energy & Power', 'Electrostatics'],
  'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Organic Basics'],
  'Mathematics': ['Sets & Relations', 'Trigonometry', 'Calculus', 'Vectors'],
  'Biology': ['Cell Biology', 'Genetics', 'Plant Physiology', 'Human Physiology']
};

const TOPICS: Record<string, string[]> = {
  'Kinematics': ['1D Motion', 'Projectile Motion', 'Relative Motion'],
  'Laws of Motion': ['Newton First Law', 'Friction', 'Circular Motion'],
  'Work, Energy & Power': ['Work', 'Energy', 'Power'],
  'Electrostatics': ['Electric Field', 'Potential', 'Flux'],
};

const SUBTOPICS: Record<string, string[]> = {
  '1D Motion': ['Average Velocity', 'Instantaneous Acceleration'],
  'Projectile Motion': ['Horizontal Projectile', 'Oblique Projectile']
};

const DEFAULT_AR_OPTIONS: AROption[] = [
  { code: 'A', text: 'Both Assertion & Reason are True, and Reason IS the correct explanation of Assertion.' },
  { code: 'B', text: 'Both Assertion & Reason are True, but Reason is NOT the correct explanation of Assertion.' },
  { code: 'C', text: 'Assertion is True, but Reason is False.' },
  { code: 'D', text: 'Assertion is False, but Reason is True.' },
];

export default function CreateQuestion() {
  const navigate = useNavigate();
  
  // --- HYBRID ID DETECTION (Supports both /edit/:id and ?id=xyz) ---
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const id = paramId || queryId;
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'main' | 'option', index?: number } | null>(null);

  const [stemTab, setStemTab] = useState<'write' | 'preview'>('write');
  const [solutionTab, setSolutionTab] = useState<'write' | 'preview'>('write');
  const [showFullPreview, setShowFullPreview] = useState(false);

  // --- Metadata State ---
  const [type, setType] = useState<QuestionType>('SCQ');
  
  // Hierarchy State
  const [classLevel, setClassLevel] = useState('11');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');

  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Analytics
  const [blooms, setBlooms] = useState<BloomsLevel>('Apply');
  const [nature, setNature] = useState<QuestionNature>('Conceptual');
  const [idealTime, setIdealTime] = useState<number>(120);
  const [source, setSource] = useState('');

  // Content
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [solution, setSolution] = useState('');

  // Options
  const [options, setOptions] = useState<Option[]>([
    { id: 'A', text: '', isCorrect: false, explanation: '' },
    { id: 'B', text: '', isCorrect: false, explanation: '' },
    { id: 'C', text: '', isCorrect: false, explanation: '' },
    { id: 'D', text: '', isCorrect: false, explanation: '' },
  ]);

  const [numericalMode, setNumericalMode] = useState<'exact' | 'range'>('exact');
  const [exactValue, setExactValue] = useState<number>(0);
  const [rangeMin, setRangeMin] = useState<number>(0);
  const [rangeMax, setRangeMax] = useState<number>(0);

  const [arAssertion, setArAssertion] = useState('');
  const [arReason, setArReason] = useState('');
  const [arOptions, setArOptions] = useState<AROption[]>(DEFAULT_AR_OPTIONS);
  const [arCorrectCode, setArCorrectCode] = useState<string>('A');

  const [colA, setColA] = useState<MatrixItem[]>([{ id: 'A', text: '' }, { id: 'B', text: '' }]);
  const [colB, setColB] = useState<MatrixItem[]>([{ id: 'p', text: '' }, { id: 'q', text: '' }, { id: 'r', text: '' }]);
  const [matches, setMatches] = useState<Record<string, string[]>>({ 'A': [], 'B': [] });

  // --- Hydration (Edit Mode) ---
  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchQuestion = async () => {
      setFetching(true);
      try {
        const data = await questionService.getById(id);
        // Metadata
        setType(data.type);
        setSubject(data.subject);
        setDifficulty(data.difficulty);
        setText(data.text);
        setSolution(data.solution || '');
        setImageUrl(data.imageUrl || '');
        setTags(data.tags || []);
        
        // Hierarchy
        if (data.classLevel) setClassLevel(data.classLevel);
        if (data.chapterId) setChapter(data.chapterId); 
        if (data.topicId) setTopic(data.topicId);
        if (data.subtopic) setSubtopic(data.subtopic);

        // Analytics
        if (data.bloomsLevel) setBlooms(data.bloomsLevel);
        if (data.nature) setNature(data.nature);
        if (data.idealTime) setIdealTime(data.idealTime);
        if (data.source) setSource(data.source);

        // Content Rehydration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = data.data as any;
        if (data.type === 'SCQ' || data.type === 'MCQ') {
          if (content.options) setOptions(content.options);
        } else if (data.type === 'INT') {
          setNumericalMode(content.type);
          if (content.type === 'exact') setExactValue(content.value);
          else { setRangeMin(content.min); setRangeMax(content.max); }
        } else if (data.type === 'AR') {
          setArAssertion(content.assertion);
          setArReason(content.reason);
          if (content.options) setArOptions(content.options);
          setArCorrectCode(content.correctCode);
        } else if (data.type === 'MM') {
          setColA(content.columnA);
          setColB(content.columnB);
          setMatches(content.correctMatches);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load question");
      } finally {
        setFetching(false);
      }
    };
    fetchQuestion();
  }, [id, isEditMode]);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (uploadTarget.type === 'main') setImageUrl(base64);
      else if (uploadTarget.type === 'option' && uploadTarget.index !== undefined) {
        const newOpts = [...options];
        newOpts[uploadTarget.index].imageUrl = base64;
        setOptions(newOpts);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = (target: { type: 'main' | 'option', index?: number }) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const toggleCorrectOption = (index: number) => {
    const newOptions = [...options];
    if (type === 'SCQ') {
      newOptions.forEach(o => o.isCorrect = false);
      newOptions[index].isCorrect = true;
    } else {
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    }
    setOptions(newOptions);
  };

  const toggleMatrixMatch = (rowId: string, colId: string) => {
    const current = matches[rowId] || [];
    const updated = current.includes(colId) ? current.filter(x => x !== colId) : [...current, colId];
    setMatches({ ...matches, [rowId]: updated });
  };

  const updateArOptionText = (idx: number, val: string) => {
    const newArOptions = [...arOptions];
    newArOptions[idx].text = val;
    setArOptions(newArOptions);
  };

  const buildPayloadData = (): QuestionContent => {
    switch (type) {
      case 'INT': return numericalMode === 'exact' ? { type: 'exact', value: exactValue } : { type: 'range', min: rangeMin, max: rangeMax };
      case 'AR': return { type: 'assertion-reason', assertion: arAssertion, reason: arReason, options: arOptions, correctCode: arCorrectCode };
      case 'MM': return { type: 'matrix', columnA: colA, columnB: colB, correctMatches: matches };
      default: return { type: 'options', options };
    }
  };

  // --- Validation ---
  const validateForm = (targetStatus: QuestionStatus): boolean => {
    // If saving as Draft, loosen restrictions
    if (targetStatus === 'Draft') {
      if (!text.trim()) { setValidationError("Drafts must at least have Question Text."); window.scrollTo(0, 0); return false; }
      return true;
    }

    // Published questions need strict validation
    if (!text.trim()) { setValidationError("Question text is required."); window.scrollTo(0, 0); return false; }
    if (!subject) { setValidationError("Subject is required."); window.scrollTo(0, 0); return false; }
    if (!chapter) { setValidationError("Chapter is required."); window.scrollTo(0, 0); return false; }
    
    if (type === 'SCQ' || type === 'MCQ') {
      if (!options.some(o => o.isCorrect)) {
        setValidationError("Please mark at least one correct answer.");
        window.scrollTo(0, 0);
        return false;
      }
    }
    if (type === 'AR' && (!arAssertion.trim() || !arReason.trim())) {
      setValidationError("Assertion and Reason text required.");
      window.scrollTo(0, 0);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSave = async (targetStatus: QuestionStatus) => {
    if (!validateForm(targetStatus)) return;
    setLoading(true);

    const payload: CreateQuestionRequest = {
      text, solution, imageUrl, type, subject, difficulty, 
      status: targetStatus, 
      classLevel, tags,
      data: buildPayloadData(),
      chapterId: chapter, topicId: topic, subtopic, 
      bloomsLevel: blooms, nature, idealTime, source,
      tenantId: 'mock-tenant'
    };

    try {
      if (isEditMode && id) {
        await questionService.update(id, payload);
      } else {
        await questionService.create(payload);
      }
      navigate('/questions');
    } catch (e) {
      console.error(e);
      alert('Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center text-slate-500">Loading question data...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-gray-50/50">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Question' : 'Create Question'}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Question Bank</span><span>•</span><span>{type} Mode</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFullPreview(true)} className="flex items-center gap-2 px-4 py-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-medium rounded-lg border border-indigo-200 transition-all">
            <Eye className="w-4 h-4" /> Preview
          </button>
          
          {/* Draft Button */}
          <button 
            onClick={() => handleSave('Draft')} 
            disabled={loading}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg border border-slate-200"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          
          {/* Publish Button */}
          <button 
            onClick={() => handleSave('Published')} 
            disabled={loading} 
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm disabled:opacity-70 transition-all"
          >
            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> {isEditMode ? 'Update' : 'Publish'}</>}
          </button>
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-red-700 text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          {validationError}
          <button onClick={() => setValidationError(null)} className="ml-auto hover:text-red-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12">
          
          {/* LEFT: Editor Content */}
          <div className="col-span-12 lg:col-span-9 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              
              {/* Question Stem */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                   <div className="flex gap-4">
                     <button onClick={() => setStemTab('write')} className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 ${stemTab === 'write' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>Write</button>
                     <button onClick={() => setStemTab('preview')} className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1 ${stemTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}><Eye className="w-3 h-3" /> Preview</button>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => triggerImageUpload({ type: 'main' })} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 hover:text-indigo-600"><ImageIcon className="w-3 h-3" /> Diagram</button>
                      <button className="text-xs text-indigo-600 font-medium flex items-center gap-1"><Type className="w-3 h-3" /> Rich Text</button>
                   </div>
                </div>
                {stemTab === 'write' ? (
                  <div className="relative">
                    <textarea value={text} onChange={e => setText(e.target.value)} className="w-full p-6 min-h-[150px] outline-none text-slate-800 text-lg resize-none placeholder:text-slate-300" placeholder="Type question text..." />
                    {imageUrl && <div className="px-6 pb-6"><div className="relative inline-block group"><img src={imageUrl} alt="Diagram" className="max-h-60 rounded-lg border border-slate-200" /><button onClick={() => setImageUrl('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600"><X className="w-3 h-3" /></button></div></div>}
                  </div>
                ) : (
                  <div className="w-full p-6 min-h-[150px] bg-slate-50/50 text-slate-800 text-lg"><div><MathText text={text} /></div>{imageUrl && <img src={imageUrl} alt="Diagram" className="mt-4 max-h-60 rounded-lg" />}</div>
                )}
              </div>

              {/* Answer Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><List className="w-4 h-4 text-indigo-500" /> {type} Answer Configuration</h3>
                    {type === 'INT' && (
                     <div className="flex bg-slate-100 p-1 rounded-lg">
                       <button onClick={() => setNumericalMode('exact')} className={`px-3 py-1 text-xs font-medium rounded-md ${numericalMode === 'exact' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Exact</button>
                       <button onClick={() => setNumericalMode('range')} className={`px-3 py-1 text-xs font-medium rounded-md ${numericalMode === 'range' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Range</button>
                     </div>
                    )}
                 </div>
                 
                 {/* SCQ/MCQ Options */}
                 {(type === 'SCQ' || type === 'MCQ') && (
                    <div className="space-y-4">
                      {options.map((opt, idx) => (
                        <div key={idx} className={`group p-3 rounded-lg border transition-all ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-start gap-3 mb-2">
                            <div className="pt-2"><span className="font-bold text-slate-400 text-xs mr-2">{opt.id}</span></div>
                            <div className="flex-1">
                               <div className="relative">
                                 <input className="w-full bg-transparent outline-none text-slate-800 text-sm font-medium mb-2 pr-8" value={opt.text} onChange={e => {const n=[...options]; n[idx].text=e.target.value; setOptions(n)}} placeholder="Option text..." />
                               </div>
                               {opt.imageUrl && <img src={opt.imageUrl} className="h-16 rounded border border-slate-200 mb-2" alt="opt" />}
                               <input className="w-full bg-slate-50 p-2 rounded text-xs text-slate-600 outline-none" value={opt.explanation || ''} onChange={e => {const n=[...options]; n[idx].explanation=e.target.value; setOptions(n)}} placeholder="Explanation..." />
                            </div>
                            <div className="flex flex-col gap-1">
                              <button onClick={() => toggleCorrectOption(idx)} className={`px-3 py-2 rounded-lg border w-16 flex flex-col items-center ${opt.isCorrect ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-400'}`}>
                                <Check className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">{opt.isCorrect ? 'Key' : 'Mark'}</span>
                              </button>
                              <button onClick={() => triggerImageUpload({type: 'option', index: idx})} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600"><ImageIcon className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-medium hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Option</button>
                    </div>
                 )}

                 {/* Numerical UI */}
                 {type === 'INT' && (
                  <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
                    {numericalMode === 'exact' ? (
                      <div className="flex flex-col items-center">
                         <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Target className="w-3 h-3" /> Correct Value</label>
                         <input type="number" step="0.01" className="w-40 px-4 py-3 border border-slate-300 rounded-lg text-2xl font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none" value={exactValue} onChange={e => setExactValue(parseFloat(e.target.value))} />
                      </div>
                    ) : (
                      <div className="flex items-end justify-center gap-4">
                         <div><label className="text-xs font-bold text-slate-500 mb-2 block">Min</label><input type="number" step="0.01" className="w-32 px-4 py-3 border border-slate-300 rounded-lg text-xl font-mono text-center outline-none" value={rangeMin} onChange={e => setRangeMin(parseFloat(e.target.value))} /></div>
                         <div className="pb-4 text-slate-400"><Scale className="w-6 h-6" /></div>
                         <div><label className="text-xs font-bold text-slate-500 mb-2 block">Max</label><input type="number" step="0.01" className="w-32 px-4 py-3 border border-slate-300 rounded-lg text-xl font-mono text-center outline-none" value={rangeMax} onChange={e => setRangeMax(parseFloat(e.target.value))} /></div>
                      </div>
                    )}
                  </div>
                 )}

                 {/* AR UI - With Editable Options */}
                 {type === 'AR' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative"><span className="absolute left-3 top-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Assertion</span><textarea className="w-full p-3 pt-10 border border-indigo-100 bg-indigo-50/10 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]" value={arAssertion} onChange={e => setArAssertion(e.target.value)} /></div>
                        <div className="relative"><span className="absolute left-3 top-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Reason</span><textarea className="w-full p-3 pt-10 border border-indigo-100 bg-indigo-50/10 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px]" value={arReason} onChange={e => setArReason(e.target.value)} /></div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Check className="w-3 h-3" /> Select Key</label>
                      <div className="space-y-3">
                        {arOptions.map((opt, idx) => {
                          const isSelected = arCorrectCode === opt.code;
                          return (
                            <div 
                              key={opt.code} 
                              onClick={() => setArCorrectCode(opt.code)} 
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/30' : 'bg-white hover:border-indigo-300'}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{opt.code}</div>
                              <textarea 
                                value={opt.text} 
                                onChange={(e) => updateArOptionText(idx, e.target.value)} 
                                onClick={(e) => e.stopPropagation()} 
                                className={`flex-1 bg-transparent outline-none text-sm resize-none ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}`} 
                                rows={2} 
                              />
                              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border shrink-0 ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-300'}`}>{isSelected ? 'Correct' : 'Select'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                 )}

                 {/* MM UI */}
                 {type === 'MM' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2"><h4 className="text-xs font-bold text-slate-500 uppercase border-b pb-2 mb-2">Column I</h4>{colA.map((item, i) => (<div key={item.id} className="flex items-center gap-2"><span className="font-bold text-slate-400 w-6 text-center">{item.id}</span><input className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none" value={item.text} onChange={e => { const n = [...colA]; n[i].text = e.target.value; setColA(n); }} /></div>))}</div>
                        <div className="space-y-2"><h4 className="text-xs font-bold text-slate-500 uppercase border-b pb-2 mb-2">Column II</h4>{colB.map((item, i) => (<div key={item.id} className="flex items-center gap-2"><span className="font-bold text-slate-400 w-6 text-center">{item.id}</span><input className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none" value={item.text} onChange={e => { const n = [...colB]; n[i].text = e.target.value; setColB(n); }} /></div>))}</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-200"><h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><GitMerge className="w-3 h-3" /> Map Pairs</h4><div className="grid gap-3">{colA.map((row) => (<div key={row.id} className="flex items-center gap-4 bg-white p-3 rounded border border-slate-200"><span className="font-bold text-slate-700 w-6 text-center bg-slate-100 rounded">{row.id}</span><div className="h-px w-8 bg-slate-300" /><div className="flex items-center gap-2 flex-wrap">{colB.map((col) => (<button key={col.id} type="button" onClick={() => toggleMatrixMatch(row.id, col.id)} className={`w-8 h-8 rounded text-sm font-bold border transition-all ${matches[row.id]?.includes(col.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-500'}`}>{col.id}</button>))}</div></div>))}</div></div>
                  </div>
                 )}
              </div>

              {/* Solution Editor */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Detailed Solution</span>
                  <div className="flex gap-2">
                     <button onClick={() => setSolutionTab('write')} className={`text-xs font-bold uppercase px-2 py-1 rounded ${solutionTab === 'write' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600'}`}>Write</button>
                     <button onClick={() => setSolutionTab('preview')} className={`text-xs font-bold uppercase px-2 py-1 rounded ${solutionTab === 'preview' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-600'}`}>Preview</button>
                  </div>
                </div>
                {solutionTab === 'write' ? (
                  <textarea value={solution} onChange={e => setSolution(e.target.value)} className="w-full p-6 min-h-[150px] outline-none text-slate-700" placeholder="Write step-by-step derivation..." />
                ) : (
                  <div className="w-full p-6 min-h-[150px] bg-slate-50/50 text-slate-700"><MathText text={solution} /></div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar (Organization & Analytics) */}
          <div className="col-span-12 lg:col-span-3 bg-white border-l border-slate-200 h-full overflow-y-auto">
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-2 border-b border-slate-100"><Settings className="w-4 h-4 text-slate-400" /> Question Type</div>
                <div className="grid grid-cols-2 gap-2">{['SCQ','MCQ','INT','AR','MM'].map((t) => (<button key={t} onClick={() => setType(t as QuestionType)} className={`px-2 py-2 text-xs font-medium rounded-lg border ${type === t ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white hover:bg-slate-50'}`}>{t}</button>))}</div>
              </div>

              {/* Analytics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-2 border-b border-slate-100"><BarChart className="w-4 h-4 text-slate-400" /> Analytics</div>
                <div className="space-y-3">
                  <div><label className="text-xs text-slate-500 mb-1 flex gap-1"><Brain className="w-3 h-3" /> Bloom's</label><select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={blooms} onChange={e => setBlooms(e.target.value as BloomsLevel)}>{['Remember','Understand','Apply','Analyze','Evaluate','Create'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                  <div><label className="text-xs text-slate-500 mb-1 flex gap-1"><Target className="w-3 h-3" /> Nature</label><select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={nature} onChange={e => setNature(e.target.value as QuestionNature)}>{['Conceptual','Calculative','Memory-Based','Tricky'].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                  <div><label className="text-xs text-slate-500 mb-1 flex gap-1"><Clock className="w-3 h-3" /> Time (s)</label><input type="number" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={idealTime} onChange={e => setIdealTime(parseInt(e.target.value))} /></div>
                  <div><label className="text-xs text-slate-500 mb-1 flex gap-1"><BookOpen className="w-3 h-3" /> Source</label><input type="text" className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none" value={source} onChange={e => setSource(e.target.value)} /></div>
                </div>
              </div>

              {/* Organization */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-2 border-b border-slate-100"><Layout className="w-4 h-4 text-slate-400" /> Organization</div>
                <div className="space-y-3">
                   <div><label className="text-xs text-slate-500 mb-1">Class</label><select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" value={classLevel} onChange={e => setClassLevel(e.target.value)}><option value="11">11</option><option value="12">12</option><option value="Dropper">Dropper</option></select></div>
                   <div><label className="text-xs text-slate-500 mb-1">Subject</label><select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" value={subject} onChange={e => { setSubject(e.target.value as Subject); setChapter(''); setTopic(''); }}>{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                   {/* Cascading Chapter-Topic-Subtopic */}
                   <div>
                     <label className="text-xs text-slate-500 mb-1">Chapter</label>
                     <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" value={chapter} onChange={e => { setChapter(e.target.value); setTopic(''); }}>
                       <option value="">Select Chapter...</option>
                       {CHAPTERS[subject]?.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-slate-500 mb-1">Topic</label>
                     <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" value={topic} onChange={e => { setTopic(e.target.value); setSubtopic(''); }} disabled={!chapter}>
                       <option value="">Select Topic...</option>
                       {TOPICS[chapter]?.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-slate-500 mb-1">Subtopic</label>
                     <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" value={subtopic} onChange={e => setSubtopic(e.target.value)} disabled={!topic}>
                       <option value="">Select Subtopic...</option>
                       {SUBTOPICS[topic]?.map(st => <option key={st} value={st}>{st}</option>)}
                     </select>
                   </div>
                   
                   <div><label className="text-xs text-slate-500 mb-1">Difficulty</label><div className="flex bg-slate-100 p-1 rounded-lg">{['Easy', 'Medium', 'Hard'].map((d) => (<button key={d} type="button" onClick={() => setDifficulty(d as Difficulty)} className={`flex-1 py-1 text-[10px] font-medium rounded ${difficulty === d ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{d}</button>))}</div></div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[60px]">{tags.map(tag => (<span key={tag} className="bg-white border text-slate-600 px-2 py-1 rounded text-xs flex gap-1 shadow-sm">{tag} <button onClick={() => setTags(tags.filter(t => t !== tag))}><Trash2 className="w-3 h-3" /></button></span>))}<input className="bg-transparent text-sm outline-none w-full px-1" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} /></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <QuestionFullPreview 
        isOpen={showFullPreview} 
        onClose={() => setShowFullPreview(false)} 
        data={{ text, imageUrl, type, options, solution, tags, difficulty, blooms, nature, idealTime, content: buildPayloadData() }} 
      />
      
      <div className="fixed bottom-6 right-6 max-w-xs bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-lg">
         <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div><h4 className="text-sm font-bold text-indigo-900">Pro Tip</h4><p className="text-xs text-indigo-700 mt-1">Use <code className="bg-indigo-100 px-1 rounded">$x^2$</code> for inline math and <code className="bg-indigo-100 px-1 rounded">$$...$$</code> for block equations.</p></div>
         </div>
      </div>
    </div>
  );
}