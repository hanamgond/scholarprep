import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, FileText, Calendar, User, Clock, Star, BookOpen, 
  Edit, Send, Trash2, Archive, CheckCircle, AlertCircle
} from 'lucide-react';
import { examService } from '../services/examService';
import type { Exam, ExamStatus } from '../types/exam';

export default function ExamList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ExamStatus>('Draft');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await examService.getAll(); 
      setExams(data);
    } catch (error) {
      console.error("Failed to load exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await examService.delete(id);
        // Refresh the list
        loadExams(); 
      } catch (error) {
        alert("Failed to delete exam.");
      }
    }
  };

  const handlePublish = async (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to publish this exam? It will be visible to students.')) {
      try {
        await examService.update(id, { status: 'Published' });
        // Refresh the list to move it to the "Published" tab
        loadExams();
        // Optional: Switch to Published tab to see the result
        setActiveTab('Published');
      } catch (error) {
        alert("Failed to publish exam.");
      }
    }
  };

  // Filter locally for mock purposes
  const filteredExams = exams.filter(e => 
    activeTab === 'Draft' ? e.status === 'Draft' : e.status === activeTab
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Exams</h1>
          <p className="text-slate-500 text-sm">Create, schedule, and manage JEE/NEET mock tests.</p>
        </div>
        <button 
          onClick={() => navigate('/exams/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Exam
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'Draft', label: 'Drafts', icon: Edit },
          { id: 'Published', label: 'Published', icon: Send },
          { id: 'Completed', label: 'Completed', icon: CheckCircle },
          { id: 'Archived', label: 'Archived', icon: Archive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ExamStatus)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading exams...</div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-medium">No exams found</h3>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'Draft' ? "Get started by creating a new exam." : `No ${activeTab.toLowerCase()} exams found.`}
            </p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {exam.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(exam.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {exam.createdBy}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{exam.code}</span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 ${
                  exam.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                  exam.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                  'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                     exam.status === 'Published' ? 'bg-emerald-500' : 
                     exam.status === 'Draft' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></span>
                  {exam.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-b border-slate-50 my-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="p-1.5 bg-indigo-50 rounded text-indigo-600"><Clock className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-slate-400">Duration</div>
                    <div className="font-medium">{exam.durationMinutes} mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="p-1.5 bg-pink-50 rounded text-pink-600"><Star className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-slate-400">Marks</div>
                    <div className="font-medium">{exam.totalMarks}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="p-1.5 bg-emerald-50 rounded text-emerald-600"><BookOpen className="w-4 h-4" /></div>
                  <div>
                    <div className="text-xs text-slate-400">Sections</div>
                    <div className="font-medium">{exam.sections.length} Parts</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {/* EDIT BUTTON */}
                <button 
                  onClick={() => navigate(`/exams/create?id=${exam.id}`)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>

                {/* PUBLISH BUTTON (Only for Drafts) */}
                {exam.status !== 'Published' && (
                  <button 
                    onClick={() => handlePublish(exam.id)}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish
                  </button>
                )}

                {/* DELETE BUTTON */}
                <button 
                  onClick={() => handleDelete(exam.id)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}