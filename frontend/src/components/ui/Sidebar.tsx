// src/components/Sidebar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Users,
  GraduationCap,
  Award,
  BarChart2,
  Briefcase,
  Building2,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Nav items with roles
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/questions", label: "Question Bank", icon: BookOpen, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/exams", label: "Exams", icon: ClipboardCheck, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/students", label: "Students", icon: Users, roles: ["ADMIN", "TEACHER"] },
  { to: "/classes", label: "Classes", icon: GraduationCap, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/staff", label: "Staff Directory", icon: Briefcase, roles: ["ADMIN", "HR"] },
  { to: "/departments", label: "Departments", icon: Building2, roles: ["ADMIN"] },
  { to: "/results", label: "Results", icon: Award, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/analytics", label: "Analytics", icon: BarChart2, roles: ["ADMIN"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["ADMIN"] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isLinkActive = (to: string) => {
    if (location.pathname === to) return true;
    if (location.pathname.startsWith(`${to}/`)) return true;
    if (to === "/classes" && location.pathname.startsWith("/sections")) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col font-sans z-30">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">S</div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">ScholarPrep</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.filter(item => !item.roles || item.roles.includes(user?.role || "")).map(item => {
          const active = isLinkActive(item.to);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${active
                ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
