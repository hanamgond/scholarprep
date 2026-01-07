import React, { useState } from 'react';
import { X, Check, Lightbulb, Clock, Brain, Target, BarChart2 } from 'lucide-react';
import { MathText } from '../../../components/shared/MathText';
import type { 
  QuestionType, Option, QuestionContent, BloomsLevel, QuestionNature, Difficulty,
  ExactNumericalData, RangeNumericalData, AssertionReasonData, MatrixMatchData
} from '../types/question';

interface QuestionFullPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    text: string;
    imageUrl?: string;
    type: QuestionType;
    options: Option[]; // For SCQ/MCQ
    content: QuestionContent; // For other types
    solution: string;
    tags: string[];
    difficulty: Difficulty;
    blooms?: BloomsLevel;
    nature?: QuestionNature;
    idealTime?: number;
  };
}

export const QuestionFullPreview: React.FC<QuestionFullPreviewProps> = ({ isOpen, onClose, data }) => {
  const [showSolution, setShowSolution] = useState(false);

  if (!isOpen) return null;

  // Helper to render correct answer based on type
  const renderCorrectAnswer = () => {
    switch (data.type) {
      case 'SCQ':
      case 'MCQ':
        return (
          <div className="space-y-2">
            {data.options.filter(o => o.isCorrect).map((opt, i) => (
              <div key={i} className="flex gap-2 items-start text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">
                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold mr-2">{opt.id})</span>
                  <MathText text={opt.text} />
                  {opt.explanation && (
                    <p className="text-xs text-emerald-600 mt-1 border-t border-emerald-200 pt-1">
                      Reason: {opt.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'INT': {
        // Cast to the specific union types for Numerical data
        const intData = data.content as ExactNumericalData | RangeNumericalData;
        return (
          <div className="text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100 font-mono text-lg">
            {intData.type === 'exact' 
              ? `Exact Answer: ${intData.value}` 
              : `Range: ${intData.min} to ${intData.max}`}
          </div>
        );
      }

      case 'AR': {
        const arData = data.content as AssertionReasonData;
        return (
          <div className="text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100">
            Correct Logic: <strong>Option {arData.correctCode}</strong>
          </div>
        );
      }

      case 'MM': {
        const mmData = data.content as MatrixMatchData;
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(mmData.correctMatches || {}).map(([rowId, colIds]) => (
              <div key={rowId} className="flex items-center gap-2 bg-emerald-50 p-2 rounded border border-emerald-100">
                <span className="font-bold text-emerald-800">{rowId}</span>
                <span className="text-emerald-400">→</span>
                <span className="font-mono text-emerald-700">{(colIds as string[]).join(', ')}</span>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Question Preview
              <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {data.type}
              </span>
              <span className={`text-xs font-normal px-2 py-0.5 rounded-full border ${
                data.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                data.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-rose-100 text-rose-700 border-rose-200'
              }`}>
                {data.difficulty}
              </span>
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 1. Question Area */}
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none text-lg text-slate-800">
              <MathText text={data.text || 'No question text provided.'} />
            </div>
            
            {data.imageUrl && (
              <div className="mt-4">
                <img src={data.imageUrl} alt="Question" className="max-h-80 rounded-lg border border-slate-200" />
              </div>
            )}

            {/* Type Specific Rendering */}
            {data.type === 'AR' && (
              <div className="grid gap-3 mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex gap-3">
                  <span className="font-bold text-indigo-600">A:</span>
                  <span className="text-slate-700">{(data.content as AssertionReasonData).assertion}</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-indigo-600">R:</span>
                  <span className="text-slate-700">{(data.content as AssertionReasonData).reason}</span>
                </div>
              </div>
            )}

            {data.type === 'MM' && (
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-500 uppercase border-b pb-1">Column I</h4>
                  {(data.content as MatrixMatchData).columnA?.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <span className="font-bold text-slate-900">{item.id}.</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-500 uppercase border-b pb-1">Column II</h4>
                  {(data.content as MatrixMatchData).columnB?.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <span className="font-bold text-slate-900">{item.id}.</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Options Area (For SCQ/MCQ) */}
          {(data.type === 'SCQ' || data.type === 'MCQ') && (
            <div className="grid gap-3">
              {data.options.map((opt) => (
                <div key={opt.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center shrink-0">
                    {opt.id}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="text-slate-700"><MathText text={opt.text} /></div>
                    {opt.imageUrl && (
                      <img src={opt.imageUrl} alt="Option" className="mt-2 h-20 rounded border border-slate-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 my-6" />

          {/* 3. Solution & Answer Key (Collapsible) */}
          <div className="space-y-4">
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution & Answer Key'}
              <Lightbulb className={`w-4 h-4 ${showSolution ? 'fill-indigo-600' : ''}`} />
            </button>

            {showSolution && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-6">
                
                {/* Correct Answer Block */}
                <div>
                  <h4 className="text-sm font-bold text-emerald-700 uppercase mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Correct Answer
                  </h4>
                  {renderCorrectAnswer()}
                </div>

                {/* Detailed Solution */}
                {data.solution && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase mb-3">Detailed Explanation</h4>
                    <div className="prose prose-sm max-w-none text-slate-600">
                      <MathText text={data.solution} />
                    </div>
                  </div>
                )}

                {/* Analytics Tags */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {data.blooms && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      <Brain className="w-3 h-3" /> {data.blooms}
                    </span>
                  )}
                  {data.nature && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                      <Target className="w-3 h-3" /> {data.nature}
                    </span>
                  )}
                  {data.idealTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                      <Clock className="w-3 h-3" /> {data.idealTime}s
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    <BarChart2 className="w-3 h-3" /> {data.tags.join(', ') || 'No Tags'}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};