// src/features/students/pages/AddStudentModal.tsx
import { useState, useEffect } from 'react';
import type { Student, StudentCreatePayload } from '@/features/students/types/student';
import { studentsService } from '@/features/students/services/students';
import { classService } from '@/services/api/class'; // Import the class service

// --- Type Definitions for this component ---
interface Section { id: string; name: string; }
interface Class { id: string; name: string; sections: Section[]; }

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess: (newStudent: Student) => void;
}

// --- The Modal Component ---
export default function AddStudentModal({ onClose, onSuccess }: AddStudentModalProps) {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  
  // Updated form fields to include more required data
  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    section_id: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fixed: Load classes from the service
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classes = await classService.getClasses();
        setAllClasses(classes);
      } catch (err) {
        console.error('Failed to load classes:', err);
        setError("Could not load classes.");
      }
    };
    loadClasses();
  }, []);

  // Fixed: Update available sections when class changes
  useEffect(() => {
    const selectedClass = allClasses.find(c => c.id === selectedClassId);
    setAvailableSections(selectedClass ? selectedClass.sections : []);
    setFormFields(prev => ({ ...prev, section_id: '' }));
  }, [selectedClassId, allClasses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formFields.first_name || !formFields.section_id || !formFields.date_of_birth) {
      alert('Please fill out all required fields (First Name, Date of Birth, and Section).');
      return;
    }
    
    setLoading(true);
    setError(null);

    // FIXED: Include all required fields including sectionId
    const payload: StudentCreatePayload = {
      // Required fields from form
      firstName: formFields.first_name,
      lastName: formFields.last_name,
      email: formFields.email,
      phone: formFields.phone || '0000000000', // Use provided phone or default
      dateOfBirth: formFields.date_of_birth,
      sectionId: formFields.section_id, // ← THIS WAS MISSING!
      
      // Required fields that need values
      campusId: '00000000-0000-0000-0000-000000000000', // TODO: Get from context/tenant
      admissionNo: `ADM-${Date.now()}`,
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
            <input 
              name="first_name" 
              value={formFields.first_name} 
              onChange={handleChange} 
              placeholder="First Name *" 
              className="w-full rounded-lg border p-2" 
              required 
            />
            <input 
              name="last_name" 
              value={formFields.last_name} 
              onChange={handleChange} 
              placeholder="Last Name" 
              className="w-full rounded-lg border p-2" 
            />
            <input 
              type="email" 
              name="email" 
              value={formFields.email} 
              onChange={handleChange} 
              placeholder="Email (Optional)" 
              className="w-full rounded-lg border p-2" 
            />
          </fieldset>

          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            <legend className="text-lg font-medium px-2">Contact & Academic Details</legend>
            <input 
              type="tel" 
              name="phone" 
              value={formFields.phone} 
              onChange={handleChange} 
              placeholder="Phone Number" 
              className="w-full rounded-lg border p-2" 
            />
            <input 
              type="date" 
              name="date_of_birth" 
              value={formFields.date_of_birth} 
              onChange={handleChange} 
              placeholder="Date of Birth *" 
              className="w-full rounded-lg border p-2" 
              required 
            />
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)} 
              className="w-full rounded-lg border p-2" 
              required
            >
              <option value="">Select Class *</option>
              {allClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <select 
              name="section_id" 
              value={formFields.section_id} 
              onChange={handleChange} 
              className="w-full rounded-lg border p-2" 
              required 
              disabled={!selectedClassId}
            >
              <option value="">Select Section *</option>
              {availableSections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </fieldset>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}