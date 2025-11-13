import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsService } from '@/features/students/services/students';
// 1. Import the API's payload type
import type { StudentCreatePayload } from '@/features/students/types/student'; 

// --- Type Definitions ---
interface Section { id: string; name: string; }
interface Class { id: string; name: string; sections: Section[]; }

// This is your form's internal state. It's perfectly fine.
interface StudentFormData {
  tenant_id: string;
  school_id: string;
  academic_year_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  email: string;
  mobile_number: string;
  father_name: string;
  father_mobile: string;
  mother_name: string;
  mother_mobile: string;
  section_id: string;
}

// --- The Page Component ---
export default function AddStudentPage() {
  const navigate = useNavigate();
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  
  const [formData, setFormData] = useState<StudentFormData>({
    // ... (your form's default state is fine) ...
    tenant_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 
    school_id: 'scl-11223344-5566-7788-9900-aabbccddeeff',
    academic_year_id: 'acy-2025-2026',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    email: '',
    mobile_number: '',
    father_name: '',
    father_mobile: '',
    mother_name: '',
    mother_mobile: '',
    section_id: '',
  });
  
  // ... (your loading, error, and useEffect hooks are all fine) ...
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setAllClasses([]);
        setError('Class loading not implemented yet');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) { /* ... */ }
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
    if (!formData.section_id) {
      setError('Please select both a class and a section before saving.');
      return;
    }
    setLoading(true);
    setError(null);

    // --- THIS IS THE FIX ---
    // We manually create a 'payload' object that matches the
    // 'StudentCreatePayload' type your service expects.
    const payload: StudentCreatePayload = {
      // 1. Map snake_case (form) to camelCase (API)
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      phone: formData.mobile_number,
      dateOfBirth: formData.dob, // Make sure your <input type="date"> provides YYYY-MM-DD
      gender: formData.gender || undefined,
      fatherName: formData.father_name || undefined,
      motherName: formData.mother_name || undefined,

      // 2. Add required fields that are missing from your form
      //    Your .NET API needs these!
      //    TODO: Get these values from your app's context or a dropdown.
      campusId: '00000000-0000-0000-0000-000000000000', // Using a placeholder Guid
      admissionNo: `ADM-${Date.now()}`, // Using a temporary placeholder
    };
    // --- END OF FIX ---

    try {
      // 3. Send the new 'payload' object, not the old 'formData'
      await studentsService.create(payload);
      alert('Student created successfully!');
      navigate('/students/overview');
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

  // ... (Your JSX and <form> remain exactly the same) ...
  const inputStyles = "w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
  const disabledStyles = "disabled:bg-slate-100 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">Create New Student Profile</h2>
      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... all your fieldsets are correct ... */}
        <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
          <legend className="text-lg font-medium px-2 text-slate-700">Basic Details</legend>
          <input name="first_name" onChange={handleChange} placeholder="First Name" className={inputStyles} required />
          <input name="last_name" onChange={handleChange} placeholder="Last Name" className={inputStyles} />
          <input name="dob" type="date" onChange={handleChange} className={inputStyles} />
          <select name="gender" onChange={handleChange} className={inputStyles}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
          </select>
          <input type="email" name="email" onChange={handleChange} placeholder="Email Address" className={inputStyles} />
          <input name="mobile_number" onChange={handleChange} placeholder="Mobile Number" className={inputStyles} required />
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
            <legend className="text-lg font-medium px-2 text-slate-700">Academic Details</legend>
            <select onChange={(e) => setSelectedClassId(e.target.value)} className={inputStyles} required>
              <option value="">Select Class</option>
              {allClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            <select name="section_id" value={formData.section_id} onChange={handleChange} className={`${inputStyles} ${disabledStyles}`} required disabled={!selectedClassId}>
              <option value="">Select Section</option>
              {availableSections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
            </select>
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
          <legend className="text-lg font-medium px-2 text-slate-700">Parents/Guardian Details</legend>
          <input name="father_name" onChange={handleChange} placeholder="Father's Name" className={inputStyles} />
          <input name="father_mobile" onChange={handleChange} placeholder="Father's Mobile" className={inputStyles} />
          <input name="mother_name" onChange={handleChange} placeholder="Mother's Name" className={inputStyles} />
          <input name="mother_mobile" onChange={handleChange} placeholder="Mother's Mobile" className={inputStyles} />
        </fieldset>
        
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/students/overview')} className="px-5 py-2 border rounded-lg text-slate-700 hover:bg-slate-100 transition">Cancel</button>
          <button type="submit" disabled={loading} className={`px-5 py-2 bg-indigo-600 text-white rounded-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}>
            {loading ? "Saving..." : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}