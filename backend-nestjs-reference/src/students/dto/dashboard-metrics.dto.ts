export class DashboardMetricsDto {
  totalStudents: number;
  newAdmissionsThisMonth: number;
  activeStudents: number;
  genderRatio: {
    male: number;
    female: number;
  };
}
