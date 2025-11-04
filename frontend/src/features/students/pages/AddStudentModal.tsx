// src/features/students/pages/AddStudentModal.tsx

import { useState, useEffect } from 'react';
// ✅ Import both types from the single source of truth
import type { Student, StudentCreatePayload } from '@/features/students/types/student';
import { studentsService } from '@/features/students/services/students';

// --- Type Definitions for this component ---
interface Section { id: string; name: string; }
interface Class { id:string; name: string; sections: Section[]; }

// ❌ Local StudentFormData type removed

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: (newStudent: Student) => void;
}

// --- The Modal Component ---
export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  
  // ✅ Use the new payload type for state
  const [formData, setFormData] = useState<Partial<StudentCreatePayload>>({
    // tenant_id and school_id are removed (handled by backend JWT)
    academic_year_id: 'acy-2025-2026',
    first_name: '',
    last_name: '',
    email: '',
    section_id: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
        try {
            // TODO: We need a classes service - using empty array for now
            setAllClasses([]);
            setError("Class loading not implemented yet. Using empty list.");
        } catch (err) {
            console.error(err);
            setError("Could not load classes. Make sure the backend is running.");
        }
    };
    loadClasses();
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
    // ✅ Improved validation
    if (!formData.section_id || !formData.first_name || !formData.academic_year_id) {
      alert('Please fill out all required fields (First Name, Class, Section).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // ✅ This is now fully type-safe!
      const newStudent = await studentsService.create(
        formData as StudentCreatePayload
      );
      onSuccess(newStudent);
      onClose();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
        <h2 className="text-xl font-semibold mb-6">Create New Student Profile</h2>
        {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
            <legend className="text-lg font-medium px-2">Personal Details</legend>
            {/* ✅ Made inputs "controlled" with value prop */}
            <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="w-full rounded-lg border p-2" required />
            <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="w-full rounded-lg border p-2" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email (Optional)" className="w-full rounded-lg border p-2" />
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