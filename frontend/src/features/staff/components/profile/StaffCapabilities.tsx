import type { Staff } from '../../types/staff';

export default function StaffCapabilities({ staff }: { staff: Staff }) {
  const perms = staff.contentPermissions;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Privileges</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <div>
              <p className="font-medium">Create Questions</p>
              <p className="text-xs text-gray-500">Can add to Question Bank</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded font-bold ${perms.canCreateQuestions ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {perms.canCreateQuestions ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <div>
              <p className="font-medium">Generate Papers</p>
              <p className="text-xs text-gray-500">Can create final exams</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded font-bold ${perms.canGeneratePapers ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {perms.canGeneratePapers ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
        <h4 className="text-sm font-bold text-red-800">Subject Lock</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {perms.accessibleSubjects.map(sub => (
            <span key={sub} className="px-2 py-1 bg-white border border-red-200 text-red-700 text-xs rounded">
              {sub}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}