import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ProfileDropdown } from "./ProfileDropdown";
import { Plus, Upload, Brain, Bell } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100/80 bg-white/85 backdrop-blur-sm relative">
      <div className="mx-auto max-w-7xl px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">MeetMind</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-indigo-50/70 px-1.5 py-1">
            <Link to="/" className="px-3 py-1.5 rounded-full text-sm text-indigo-700 hover:bg-white transition-colors">Dashboard</Link>
            <Link to="/tasks" className="px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-white transition-colors">Tareas</Link>
            <Link to="/projects" className="px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-white transition-colors">Proyectos</Link>
            <Link to="/calendar" className="px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-white transition-colors">Calendario</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/meeting/1">
            <Button variant="outline" size="sm" className="gap-2 border-indigo-200 hover:bg-indigo-50">
              <Upload className="w-4 h-4" />
              Importar reunión
            </Button>
          </Link>
          <Link to="/meeting/1">
            <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              <Plus className="w-4 h-4" />
              Nueva grabación
            </Button>
          </Link>
          <Link to="/notifications">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 hover:bg-indigo-50">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">5</span>
              </div>
            </Button>
          </Link>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative"
          >
            <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      <ProfileDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </header>
  );
}
