import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDropdown from '../../../components/ui/CustomDropdown'; 
import { classService, type Class} from '../../../services/api/class';

export default function ClassesPage() {
  const navigate = useNavigate();
  
  // --- State ---
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [modal, setModal] = useState<'addClass' | 'addSection' | 'editClass' | null>(null);

  // Form Inputs
  const [newClassName, setNewClassName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  
  // Filters
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. Load Data ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await classService.getClasses();
        setAllClasses(data);
        
        // Set first class active by default
        if (data.length > 0 && !activeClassId) {
             setActiveClassId(data[0].id);
        }

        // Populate filter options
        const uniqueClassNames = [...new Set(data.map(c => c.name))];
        const uniqueSectionNames = [...new Set(data.flatMap(c => c.sections).map(s => s.name))];
        setClassOptions(uniqueClassNames);
        setSectionOptions(uniqueSectionNames);

      } catch (err) {
        console.error(err);
        setError('Could not load classes.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeClassId]);

  // --- 2. Filter Logic ---
  const filteredClasses = useMemo(() => {
    let classesToFilter = [...allClasses];
    if (classFilter) {
      classesToFilter = classesToFilter.filter(c => c.name === classFilter);
    }
    if (sectionFilter) {
      classesToFilter = classesToFilter.filter(c => c.sections.some(s => s.name === sectionFilter));
    }
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      classesToFilter = classesToFilter.filter(c => 
        c.name.toLowerCase().includes(lowercasedSearch) ||
        c.sections.some(s => s.name.toLowerCase().includes(lowercasedSearch))
      );
    }
    return classesToFilter;
  }, [allClasses, classFilter, sectionFilter, searchTerm]);
  
  const resetFilters = () => {
      setClassFilter('');
      setSectionFilter('');
      setTeacherFilter('');
      setSearchTerm('');
  };

  const handleToggleAccordion = (classId: string) => {
    setActiveClassId(activeClassId === classId ? null : classId);
  };

  // --- 3. Handlers ---

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const newClass = await classService.createClass(newClassName);
      setAllClasses([...allClasses, newClass]);
      setNewClassName('');
      setModal(null);
    } catch (err) {
      console.error(err);
      alert('Error adding class.');
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editingClass.name.trim()) return;
    try {
      const updatedClass = await classService.updateClass(editingClass.id, editingClass.name);
      setAllClasses(allClasses.map(c => c.id === editingClass.id ? updatedClass : c));
      setEditingClass(null);
      setModal(null);
    } catch(err) {
      console.error(err);
      alert('Error updating class.'); 
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim() || !activeClassId) return;
    try {
      const newSection = await classService.createSection(activeClassId, newSectionName);
      setAllClasses(allClasses.map(cls => 
        cls.id === activeClassId 
          ? { ...cls, sections: [...cls.sections, newSection] } 
          : cls
      ));
      setNewSectionName('');
      setModal(null);
    } catch (err) {
       console.error(err);
       alert('Error adding section.'); 
    }
  };

  // Note: Delete handlers removed from UI but logic can remain in service if needed.

  // --- 4. Render ---

  if (isLoading) return <div className="p-6">Loading classes...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Filters Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CustomDropdown
                  label="Class"
                  options={classOptions}
                  value={classFilter}
                  onChange={setClassFilter}
              />
              <CustomDropdown
                  label="Section"
                  options={sectionOptions}
                  value={sectionFilter}
                  onChange={setSectionFilter}
              />
              <CustomDropdown
                  label="Class Teacher"
                  options={[]}
                  value={teacherFilter}
                  onChange={setTeacherFilter}
              />
               <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">Search by Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Enter class or section name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>
          <div className="flex justify-end gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 shadow">Apply Filters</button>
              <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium px-4 py-2 hover:bg-indigo-50">Reset</button>
          </div>
      </section>

      {/* Class List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-semibold">Classes & Sections</h3>
            <div className="text-sm text-slate-500">Showing {filteredClasses.length} classes</div>
          </div>
          <button className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700" onClick={() => setModal('addClass')}>+ Add Class</button>
        </div>

        <ul className="divide-y divide-slate-200">
          {filteredClasses.map((cls) => (
            <li key={cls.id}>
              <div
                className={`px-6 py-4 hover:bg-indigo-50/40 transition cursor-pointer flex justify-between items-center ${activeClassId === cls.id ? 'bg-indigo-100/60' : ''}`}
                onClick={() => handleToggleAccordion(cls.id)}
              >
                <div>
                  <div className="font-semibold flex items-center gap-3">
                    <i className={`fas fa-chevron-right text-slate-400 transition-transform ${activeClassId === cls.id ? 'rotate-90 text-indigo-600' : ''}`}></i>
                    <span>{cls.name}</span>
                  </div>
                  <div className="text-sm text-slate-500 pl-7 flex flex-wrap gap-4 mt-1">
                    <span><i className="fas fa-users mr-1"></i> {cls.sections.length} sections</span>
                    <span><i className="fas fa-user-graduate mr-1"></i> {cls.studentCount} students</span>
                    <span><i className="fas fa-chart-line mr-1"></i> {cls.avgAccuracy}% avg accuracy</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-indigo-600 text-indigo-600 text-sm font-medium px-3 py-2 hover:bg-indigo-50"
                    onClick={(e) => { e.stopPropagation(); setActiveClassId(cls.id); setModal('addSection'); }}
                  >+ Section</button>
                  <button 
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50" 
                    onClick={(e) => { e.stopPropagation(); setEditingClass(cls); setModal('editClass'); }}
                  >Edit</button>
                </div>
              </div>
              
              {activeClassId === cls.id && (
                <div className="p-6 pt-2 pl-12 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cls.sections.map((section) => (
                      <div 
                        key={section.id} 
                        className="border border-slate-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex justify-between items-center" 
                        onClick={() => navigate(`/sections/${section.id}`)}
                      >
                         <h4 className="font-semibold text-indigo-700">Section {section.name}</h4>
                      </div>
                    ))}
                    {cls.sections.length === 0 && <p className="text-slate-500">No sections found.</p>}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* --- MODALS --- */}
      
      {/* Add Class Modal */}
      {modal === 'addClass' && (
        <div className="modal fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="modal-title text-lg font-bold mb-4">Add New Class</h3>
            <form onSubmit={handleAddClass}>
              <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g., Class 9" className="w-full rounded-lg border border-slate-300 p-2 mb-4" required />
              <div className="form-actions flex justify-end gap-3">
                <button type="button" className="rounded-lg border border-slate-400 text-slate-600 px-4 py-2" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2">Add Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Class Modal */}
      {modal === 'editClass' && editingClass && (
        <div className="modal fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="modal-title text-lg font-bold mb-4">Edit Class Name</h3>
            <form onSubmit={handleUpdateClass}>
              <input
                type="text"
                value={editingClass.name}
                onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2 mb-4"
                required
              />
              <div className="form-actions flex justify-end gap-3">
                <button type="button" className="rounded-lg border border-slate-400 text-slate-600 px-4 py-2" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {modal === 'addSection' && (
        <div className="modal fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="modal-title text-lg font-bold mb-4">Add Section to {allClasses.find((c) => c.id === activeClassId)?.name}</h3>
                <form onSubmit={handleAddSection}>
                    <input type="text" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} placeholder="e.g., A, B" className="w-full rounded-lg border border-slate-300 p-2 mb-4" required/>
                    <div className="form-actions flex justify-end gap-3">
                        <button type="button" className="rounded-lg border border-slate-400 text-slate-600 px-4 py-2" onClick={() => setModal(null)}>Cancel</button>
                        <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2">Add Section</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </main>
  );
}