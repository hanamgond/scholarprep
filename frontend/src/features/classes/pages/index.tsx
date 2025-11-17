import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// FIXED: Corrected path based on your info
import { getClasses, createClass } from '../../../services/api/class'; 
import AddClassModal, { ClassFormData } from '../components/AddClassModal';
// FIXED: Use 'import type' for types
import type { Class, ApiClass } from '../../../types/class';

const ClassesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. FETCH DATA (READ)
  const { data: classes, isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });

  // 2. CREATE DATA (CREATE)
  const createClassMutation = useMutation({
    mutationFn: (newClass: Omit<Class, 'id'>) => createClass(newClass),
    onSuccess: () => {
      console.log('Class created successfully!');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    // FIXED: Added 'Error' type
    onError: (error: Error) => { 
      console.error('Error creating class:', error);
    },
  });

  // 3. Handle the form submission
  const handleAddClass = (data: ClassFormData) => {
    const newClassData: Omit<Class, 'id'> = {
      ...data,
      sections: [], 
    };
    createClassMutation.mutate(newClassData);
  };

  if (isLoading) {
    return <div className="p-4">Loading classes...</div>;
  }

  if (isError) {
    return <div className="p-4">Error loading classes.</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Classes & Sections</h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Class
        </button>
      </div>

      {/* DISPLAY DATA */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Showing {classes?.length} Classes</h2>
        <ul className="divide-y divide-gray-200">
          {/* FIXED: Added 'ApiClass' type to 'cls' */}
          {classes?.map((cls: ApiClass) => (
            <li key={cls.id} className="py-3 flex justify-between items-center">
              <span>{cls.name}</span>
              <div>
                <button className="text-blue-500 hover:underline mr-2">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RENDER THE MODAL */}
      <AddClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddClass}
      />
    </div>
  );
};

export default ClassesPage;