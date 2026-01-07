import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentsService } from '@/features/students/services/students';
import type { Student } from '@/features/students/types/student';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!id) return;
    const loadStudent = async () => {
      try {
        setLoading(true);
        const data = await studentsService.getById(id);
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-600">Student not found.</div>;

  // --- Components ---
  
  const StatCard = ({ label, value, trend, trendUp }: StatCardProps) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-slate-500 text-sm font-medium mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  const InfoGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string, value: string | undefined | number }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-50 pb-2 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Top Navigation */}
      <button 
        onClick={() => navigate('/students')}
        className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <span className="mr-2">←</span> Back to Student List
      </button>

      {/* 2. Admin Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <img 
            src={`https://i.pravatar.cc/150?u=${student.id}`} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-2 border-slate-100 shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                {student.admissionNo}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-600 font-medium">
                {student.className || 'Class N/A'} — {student.sectionName || 'N/A'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-500">Roll: {student.rollNumber || '-'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            Edit Profile
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700">
            View Reports
          </button>
        </div>
      </div>

      {/* 3. Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Class Rank" value={`#${student.rank || '-'}`} trend="Top 10%" trendUp={true} />
        <StatCard label="Avg Accuracy" value={`${student.accuracyPercent || 0}%`} trend="+2.5%" trendUp={true} />
        <StatCard label="Tests Taken" value="24" />
        <StatCard label="Attendance" value="92%" trend="-1.5%" trendUp={false} />
      </div>

      {/* 4. Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {['Profile', 'Exam Results', 'Performance Analytics', 'Attendance History'].map((tab) => {
            const tabKey = tab.split(' ')[0].toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tabKey
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
              
              {/* Left Column */}
              <div className="space-y-8">
                <InfoGroup title="Personal Details">
                  <InfoRow label="Full Name" value={`${student.firstName} ${student.lastName}`} />
                  <InfoRow label="Date of Birth" value={student.dateOfBirth} />
                  <InfoRow label="Gender" value={student.gender} />
                  <InfoRow label="Blood Group" value="O+" /> {/* Placeholder */}
                </InfoGroup>

                <InfoGroup title="Contact Details">
                  <InfoRow label="Email Address" value={student.email} />
                  <InfoRow label="Student Phone" value={student.phone} />
                  <InfoRow label="Address" value={student.address} />
                </InfoGroup>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <InfoGroup title="Academic Info">
                  <InfoRow label="Current Class" value={student.className} />
                  <InfoRow label="Section" value={student.sectionName} />
                  <InfoRow label="Admission Number" value={student.admissionNo} />
                  <InfoRow label="Date of Admission" value="-" />
                </InfoGroup>

                <InfoGroup title="Guardian Info">
                  <InfoRow label="Father's Name" value={student.fatherName} />
                  <InfoRow label="Mother's Name" value={student.motherName} />
                  <InfoRow label="Primary Contact" value={student.contactNumber} />
                </InfoGroup>
              </div>
            </div>
          )}

          {/* Placeholders */}
          {activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="text-4xl mb-4">📊</div>
              <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}