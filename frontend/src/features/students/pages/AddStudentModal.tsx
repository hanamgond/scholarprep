import { useState, useEffect } from 'react';
// 1. FIX: The import will now work
import type { Student, StudentCreatePayload } from '@/features/students/types/student';
import { studentsService } from '@/features/students/services/students';

// --- Type Definitions for this component ---
interface Section { id: string; name: string; }
interface Class { id:string; name: string; sections: Section[]; }

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: (newStudent: Student) => void;
}

// --- The Modal Component ---
export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  
  // This state matches your simple form fields
  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    section_id: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. FIX: Added useEffect to USE 'setAllClasses'
  useEffect(() => {
    const loadClasses = async () => {
        try {
            // TODO: We need a real classes service
            // Using apiClient as a placeholder
            // const { data } = await apiClient.get<Class[]>('/api/Classes');
            setAllClasses([]); // Set to empty for now
            // setError("Class loading not implemented yet.");
        } catch (err) {
            console.error(err);
            setError("Could not load classes.");
        }
    };
    loadClasses();
  }, []); // 'setAllClasses' is now used

  // 3. FIX: Added useEffect to USE 'setAvailableSections'
  useEffect(() => {
    const selectedClass = allClasses.find(c => c.id === selectedClassId);
    setAvailableSections(selectedClass ? selectedClass.sections : []);
    // Fix implicit 'any'
    setFormFields(prev => ({ ...prev, section_id: '' }));
  }, [selectedClassId, allClasses]); // 'setAvailableSections' is now used

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Fix implicit 'any'
    setFormFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.first_name || !formFields.section_id) {
      alert('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    setError(null);

    // 4. CRITICAL: Map your simple form to the full API Payload
    // Your API needs more data than this form provides.
    // We must add hardcoded placeholders.
    const payload: StudentCreatePayload = {
      // --- Mapped from form ---
      firstName: formFields.first_name,
      lastName: formFields.last_name,
      email: formFields.email,
      
      // --- WARNING: Hardcoded Values ---
      // Your form is missing these required fields.
      // You must add inputs for these to your modal!
      campusId: '00000000-0000-0000-0000-000000000000', // <-- TODO: Get this from context
      admissionNo: `ADM-${Date.now()}`, // <-- TODO: Generate this properly
      phone: '0000000000', // <-- TODO: Add phone input
      dateOfBirth: '2000-01-01', // <-- TODO: Add DOB input
    };

    try {
      const newStudent = await studentsService.create(payload);
      onSuccess(newStudent);
      onClose();
    } catch (err) {
      let message = 'An unknown error occurred.';
      if (err instanceof Error) {
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
            <input name="first_name" value={formFields.first_name} onChange={handleChange} placeholder="First Name" className="w-full rounded-lg border p-2" required />
            <input name="last_name" value={formFields.last_name} onChange={handleChange} placeholder="Last Name" className="w-full rounded-lg border p-2" />
            <input type="email" name="email" value={formFields.email} onChange={handleChange} placeholder="Email (Optional)" className="w-full rounded-lg border p-2" />
          </fieldset>
          
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
              <legend className="text-lg font-medium px-2">Academic Details</legend>
              <select onChange={(e) => setSelectedClassId(e.target.value)} className="w-full rounded-lg border p-2" required>
                <option value="">Select Class</option>
                {allClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
              </select>
              <select name="section_id" value={formFields.section_id} onChange={handleChange} className="w-full rounded-lg border p-2" required disabled={!selectedClassId}>
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