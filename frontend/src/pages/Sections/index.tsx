import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- Type Definitions ---
// In a real app, move these to a shared types file
interface SectionDetails {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
  // We can add more details like student list later
}

// --- API Helper ---
const api = {
  getSectionDetails: async (sectionId: string): Promise<SectionDetails> => {
    const response = await fetch(`http://localhost:3000/sections/${sectionId}`);
    if (!response.ok) throw new Error('Failed to fetch section details');
    return response.json();
  },
};

// --- The Main Component ---
export default function SectionsPage() {
  const { id } = useParams<{ id: string }>(); // Gets the section ID from the URL
  const [section, setSection] = useState<SectionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) {
      setError('Section ID is missing from the URL.');
      setIsLoading(false);
      return;
    }

    const loadSectionData = async () => {
      try {
        setIsLoading(true);
        const data = await api.getSectionDetails(id);
        setSection(data);
      } catch (err) {
        setError('Could not load section data. Please ensure the backend is running and the ID is correct.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSectionData();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (isLoading) return <div className="p-6">Loading Section Details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!section) return <div className="p-6">Section not found.</div>;

  const tabs = ['overview', 'students', 'exams', 'leaderboard', 'staff'];

  return (
    <main className="flex-1 p-6 space-y-6">
      <Link to="/classes" className="back-button inline-flex items-center gap-2 text-indigo-600 font-medium mb-4 hover:underline">
        <i className="fas fa-arrow-left"></i>
        Back to Class Management
      </Link>

      <div className="section-info bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="section-title text-xl font-bold mb-2">
          {section.class.name} - Section {section.name}
        </h2>
        <div className="section-meta text-sm text-slate-500 flex flex-wrap gap-4">
          <span><i className="fas fa-user-tie mr-1"></i> Class Teacher: Priya Sharma (Placeholder)</span>
          <span><i className="fas fa-user-graduate mr-1"></i> 35 Students (Placeholder)</span>
        </div>
      </div>

      <div className="tabs flex border-b border-slate-200">
        {tabs.map(tabName => (
           <div 
             key={tabName}
             className={`tab px-4 py-2 cursor-pointer font-medium capitalize ${activeTab === tabName ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
             onClick={() => setActiveTab(tabName)}
           >
             {tabName}
           </div>
        ))}
      </div>
      
      {/* Display content based on the active tab */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="card-title font-semibold mb-4">Overview for Section {section.name}</h3>
            <p className="text-slate-600">Details, charts, and recent activity for this section will be displayed here.</p>
          </div>
        )}
         {activeTab === 'students' && (
          <div className="card bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="card-title font-semibold mb-4">Students in Section {section.name}</h3>
            <p className="text-slate-600">A dynamic list of students assigned to this section will be displayed here.</p>
          </div>
        )}
        {/* Add content for other tabs here */}
      </div>
    </main>
  );
}
