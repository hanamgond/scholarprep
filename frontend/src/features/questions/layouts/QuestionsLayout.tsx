import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function QuestionsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'view', label: 'View Questions', path: '/questions' },
    { id: 'add', label: 'Add Questions', path: '/questions/create' },
    { id: 'papers', label: 'Question Papers', path: '/questions/papers' },
    { id: 'syllabus', label: 'Syllabus', path: '/questions/syllabus' },
    { id: 'stats', label: 'Statistics', path: '/questions/stats' }
  ];

  const activeTab = tabs.find(t => t.path === location.pathname)?.id || 'view';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>Home</li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span>Questions</span>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Question Bank</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
            <p className="text-gray-600 mt-1">Manage and organize your question repository</p>
          </div>
          
          <div className="flex gap-3 mt-4 lg:mt-0">
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center gap-2">
              <span>📥</span>
              Import
            </button>
            {activeTab === 'view' && (
              <button 
                onClick={() => navigate('/questions/create')}
                className="px-4 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                Add Question
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}