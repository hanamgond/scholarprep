import { useState, useEffect } from 'react';

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
  
  // Fetch classes for the dropdown
  useEffect(() => {
    fetch('http://localhost:3000/classes')
      .then(res => res.json())
      .then(setAllClasses)
      .catch(console.error);
  }, []);
  
  // Update section options when class changes
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

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('section_id', selectedSectionId);
    formData.append('academic_year_id', 'acy-2025-2026');

    try {
      const response = await fetch('http://localhost:3000/students/bulk-create', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResult(data.message);
    } catch (err) {
      // ✅ Safely handle the unknown error type
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
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
          <a href="http://localhost:3000/students/bulk-template" className="text-sm text-indigo-600 hover:underline">Download CSV Template</a>
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
