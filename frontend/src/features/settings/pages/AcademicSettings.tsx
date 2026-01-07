import React, { useState, useEffect } from 'react';
import { Calendar, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import { mockDb } from '../../../mocks/db';
import type { AcademicYear } from '../types/settings';
import toast from 'react-hot-toast';

export const AcademicSettings = () => {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newYearName, setNewYearName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const currentUser = { id: 'user-1', name: 'Admin User', role: 'Administrator' };

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    try {
      const data = await mockDb.getAcademicYears();
      const sorted = [...data].sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setYears(sorted);
    } catch {
      toast.error('Failed to load academic years');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newYearName || !startDate || !endDate) {
      toast.error('Please fill in all fields');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    try {
      const now = new Date();
      const start = new Date(startDate);
      let status: 'Active' | 'Upcoming' | 'Archived' = 'Upcoming';
      if (start < now) status = 'Archived';

      const newYear: AcademicYear = {
        id: crypto.randomUUID(),
        name: newYearName,
        startDate,
        endDate,
        isCurrent: false,
        status: status
      };

      // Ensure mockDb has this method implemented
      await mockDb.createAcademicYear(newYear, currentUser);

      toast.success('Academic session created');
      setNewYearName('');
      setStartDate('');
      setEndDate('');
      setIsAdding(false);
      loadYears();
    } catch {
      toast.error('Failed to create session');
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      // Ensure mockDb has this method implemented as 'setActiveAcademicYear'
      await mockDb.setActiveAcademicYear(id, currentUser); 
      toast.success('Active academic year updated');
      loadYears();
    } catch {
      toast.error('Failed to update active year');
    }
  };

  const handleDelete = async (year: AcademicYear) => {
    if (year.isCurrent) {
      toast.error('Cannot delete the currently active session');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${year.name}?`)) return;

    try {
      // Ensure mockDb has this method implemented
      await mockDb.deleteAcademicYear(year.id, currentUser);
      toast.success('Session deleted');
      loadYears();
    } catch {
      toast.error('Failed to delete session');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sessions...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Academic Years</h2>
          <p className="text-sm text-gray-500">Manage school sessions and terms.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
              <input
                type="text"
                placeholder="e.g. 2025-2026"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Session
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {years.map((year) => (
              <tr key={year.id} className={year.isCurrent ? 'bg-blue-50/50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-2 ${year.isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`font-medium ${year.isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                      {year.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {year.isCurrent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {year.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!year.isCurrent && (
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleSetActive(year.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" /> Set Active
                      </button>
                      <button
                        onClick={() => handleDelete(year)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {year.isCurrent && (
                     <span className="text-gray-400 text-xs italic flex items-center justify-end gap-1">
                       <AlertCircle className="w-3 h-3"/> Current
                     </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};