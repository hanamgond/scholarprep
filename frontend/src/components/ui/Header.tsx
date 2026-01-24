import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="h-14 border-b px-4 flex items-center justify-between">
      <div className="font-medium">
        {isLoading ? "Loading..." : user?.role}
      </div>

      <div className="text-sm text-gray-500">v0.1</div>
    </header>
  );
}
