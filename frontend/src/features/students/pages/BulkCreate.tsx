// src/features/students/pages/BulkCreate.tsx

import { useState, useEffect } from 'react';
// ✅ FIX: Import the studentsService for student actions
// ✅ FIX: Import the base apiClient for other API calls (like classes)
import { apiClient } from '@/services/http/client';

// --- Type Definitions ---
interface Section { id: string; name: string; }
interface Class { id: string; name: string; sections: Section[]; }

export default function BulkCreatePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadClasses = async () => {
      try {
        // ✅ FIX: Use the imported apiClient
        const response = await apiClient.get<Class[]>('/classes');
        setAllClasses(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load class data.');
      }
    };
    loadClasses();
  }, []);
  
  useEffect(() => {
    const selectedClass = allClasses.find(c => c.id === selectedClassId);
    setAvailableSections(selectedClass ? selectedClass.sections : []);
    setSelectedSectionId('');
  }, [selectedClassId, allClasses]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedSectionId) {
      setError('Please select a file and a class/section.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    // NOTE: Your studentsService.bulkCreate has a return type of Student[]
    // but your UI expects a response like { message: "..." }.
    // Using apiClient directly for now to match your component's logic.
    // We should refactor this later.
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('section_id', selectedSectionId);
    formData.append('academic_year_id', 'acy-2025-2026');

    try {
      // ✅ FIX: Use the imported apiClient
      const response = await apiClient.post('/students/bulk-create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming response.data is { message: "..." }
      if (response.data && response.data.message) {
        setResult(response.data.message);
      } else {
        // Fallback if the response is different
        setResult('Upload successful.');
      }

    } catch (err) {
      let message = 'An unknown error occurred.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const responseData = (err as { response?: { data?: { message?: string } } }).response?.data;
        if (responseData && typeof responseData.message === 'string') {
          message = responseData.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Bulk Students Create</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Students CSV File*</label>
          <input type="file" onChange={handleFileChange} accept=".csv" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select onChange={(e) => setSelectedClassId(e.target.value)} className="w-full rounded-lg border p-2" required>
              <option value="">Select Class</option>
              {allClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            <select value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)} className="w-full rounded-lg border p-2" required disabled={!selectedClassId}>
              <option value="">Select Section</option>
              {availableSections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
            </select>
        </div>
        
        <div className="text-right">
          {/* ✅ FIX: Use apiClient's base URL to build the template link */}
          <a 
            href={`${apiClient.defaults.baseURL}/students/bulk-template`} 
            download
            className="text-sm text-indigo-600 hover:underline"
          >
            Download CSV Template
          </a>
        </div>
        
        <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {loading ? "Uploading..." : "Create Bulk Accounts"}
        </button>

        {result && <div className="mt-4 text-green-700 bg-green-100 p-3 rounded-lg">{result}</div>}
        {error && <div className="mt-4 text-red-700 bg-red-100 p-3 rounded-lg">{error}</div>}
      </form>
    </div>
  );
}