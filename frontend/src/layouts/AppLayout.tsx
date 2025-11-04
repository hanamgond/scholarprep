import { Outlet } from "react-router-dom";
import  Header  from '../components/ui/Header';
import  Sidebar  from '../components/ui/Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-grey-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
