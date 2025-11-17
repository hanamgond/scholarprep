import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // 1. IMPORT THE USEAUTH HOOK

/** Types */
type LinkItem = { to: string; label: string };
type ActionItem = { action: "logout"; label: string };
type NavItem = LinkItem | ActionItem;

function isActionItem(item: NavItem): item is ActionItem {
  return "action" in item;
}
function isLinkItem(item: NavItem): item is LinkItem {
  return "to" in item;
}

/** Config */
const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/questions", label: "Questions" },
  { to: "/exams", label: "Exams" },
  { to: "/students", label: "Students" },
  { to: "/classes", label: "Classes" },           // sections live under Classes UI
  { to: "/results", label: "Results" },
  { to: "/analytics", label: "Analytics" },
  { to: "/staff", label: "Staff" },
  { to: "/departments", label: "Departments" },
  { to: "/attendance", label: "Attendance" },
  { to: "/settings", label: "Settings" },
  { action: "logout", label: "Logout" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 2. GET THE LOGOUT FUNCTION FROM THE HOOK

  function handleLogout() {
    // 3. CALL THE LOGOUT FUNCTION
    // This will clear the token from localStorage and update the auth state
    logout(); 
    
    // 4. REDIRECT THE USER TO THE LOGIN PAGE
    navigate("/login"); 
  }

  return (
    <aside className="w-[240px] min-h-screen border-r bg-white">
      <div className="p-4 font-bold text-lg">ScholarPrep</div>
      <nav className="px-2 py-2 space-y-1">
        {NAV_ITEMS.map((item, idx) => {
          if (isActionItem(item) && item.action === "logout") {
            return (
              <button
                key={`action-${idx}`}
                onClick={handleLogout} // This button now works
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>{item.label}</span>
              </button>
            );
          }

          if (isLinkItem(item)) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")
                }
              >
                <span>{item.label}</span>
              </NavLink>
            );
          }

          return null;
        })}
      </nav>
    </aside>
  );
}