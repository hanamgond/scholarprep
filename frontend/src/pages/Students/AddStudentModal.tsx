import { useState, useEffect } from 'react';
import type { Student } from '../../types/student';

// --- Type Definitions for this component ---
interface Section { id: string; name: string; }
interface Class { id:string; name: string; sections: Section[]; }

// Define the shape of the data the form will submit
type StudentFormData = {
  first_name: string;
  last_name: string;
  email: string;
  section_id: string;
  tenant_id: string;
  academic_year_id: string;
  school_id: string;
  // Add other fields from your finalized schema here if needed
  [key: string]: unknown;
};

// Define the component's props for type safety
interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: (newStudent: Student) => void;
}

// --- API Helper ---
const api = {
  getClasses: async (): Promise<Class[]> => {
    const response = await fetch('http://localhost:3000/classes');
    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  },
  addStudent: async (payload: StudentFormData): Promise<Student> => {
    const response = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create student');
    }
    return response.json();
  }
}

// --- The Modal Component ---
export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  
  const [formData, setFormData] = useState<Partial<StudentFormData>>({
    tenant_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 
    school_id: 'scl-11223344-5566-7788-9900-aabbccddeeff',
    academic_year_id: 'acy-2025-2026'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getClasses().then(setAllClasses).catch(err => {
      console.error(err);
      setError("Could not load classes. Make sure the backend is running.");
    });
  }, []);

  useEffect(() => {
    const selectedClass = allClasses.find(c => c.id === selectedClassId);
    setAvailableSections(selectedClass ? selectedClass.sections : []);
    setFormData(prev => ({ ...prev, section_id: '' }));
  }, [selectedClassId, allClasses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.section_id) {
      alert('Please select a class and section.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newStudent = await api.addStudent(formData as StudentFormData);
      onSuccess(newStudent);
      onClose();
    } catch (err) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
        <h2 className="text-xl font-semibold mb-6">Create New Student Profile</h2>
        {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
            <legend className="text-lg font-medium px-2">Personal Details</legend>
            <input name="first_name" onChange={handleChange} placeholder="First Name" className="w-full rounded-lg border p-2" required />
            <input name="last_name" onChange={handleChange} placeholder="Last Name" className="w-full rounded-lg border p-2" />
            {/* Add any other inputs from your detailed schema here */}
          </fieldset>
          
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
              <legend className="text-lg font-medium px-2">Academic Details</legend>
              <select onChange={(e) => setSelectedClassId(e.target.value)} className="w-full rounded-lg border p-2" required>
                <option value="">Select Class</option>
                {allClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
              </select>
              <select name="section_id" value={formData.section_id} onChange={handleChange} className="w-full rounded-lg border p-2" required disabled={!selectedClassId}>
                <option value="">Select Section</option>
                {availableSections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
              </select>
          </fieldset>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {loading ? "Saving..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
