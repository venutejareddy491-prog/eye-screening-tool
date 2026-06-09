import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import ApiStatus from '../components/ApiStatus';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ApiStatus />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Smart Dry Eye Screening Tool — For educational purposes only. Not a medical diagnosis.
      </footer>
      <Chatbot />
    </div>
  );
}
