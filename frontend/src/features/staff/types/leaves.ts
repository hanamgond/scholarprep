export type LeaveType = 'Sick' | 'Casual' | 'Earned' | 'Maternity' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveBalance {
  type: LeaveType;
  allocated: number;
  used: number;
  available: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  name: string;
  department: string;
  date: string;
  checkIn?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
}