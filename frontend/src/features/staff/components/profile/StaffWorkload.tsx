import type { Staff, AcademicAssignment } from '../../types/staff';

const WorkloadCard = ({ assignment }: { assignment: AcademicAssignment }) => {
  const styles = {
    ClassTeacher: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '👑' },
    SubjectTeacher: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '📚' },
    StudyHourManager: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'eye' },
  };
  const style = styles[assignment.type];

  return (
    <div className={`p-4 rounded-lg border ${style.bg} ${style.border} flex items-start space-x-4`}>
      <div className="text-2xl">{style.icon}</div>
      <div>
        <h4 className={`font-semibold ${style.text}`}>
          {assignment.type.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <p className="text-gray-600 text-sm mt-1">
          {assignment.classId} - {assignment.sectionId}
        </p>
        {assignment.subjectId && (
          <span className="inline-block mt-2 px-2 py-1 bg-white rounded text-xs border border-gray-200 text-gray-500 font-medium">
            Subject: {assignment.subjectId}
          </span>
        )}
      </div>
    </div>
  );
};

export default function StaffWorkload({ staff }: { staff: Staff }) {
  const assignments = staff.academicAssignments || [];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Academic Responsibilities</h3>
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a) => <WorkloadCard key={a.id} assignment={a} />)}
        </div>
      ) : (
        <p className="text-gray-500 italic">No academic assignments found.</p>
      )}
    </div>
  );
}