import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { EditProfileModal } from "./EditProfileModal";
import { Link } from "react-router";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Users, 
  Briefcase, 
  Target,
  GitBranch,
  Settings,
  LogOut,
  Edit3,
  Bell,
  Shield,
  User
} from "lucide-react";
import { useState } from "react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const [isActive, setIsActive] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isOpen) return null;

  const userData = {
    name: "Juan Domínguez",
    role: "Product Manager Senior",
    email: "juan.dominguez@meetmind.io",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    bio: "Apasionado por crear productos que impactan. 8 años de experiencia liderando equipos de producto en startups tecnológicas.",
    team: "Product & Design",
    currentProject: "MeetMind v2.0 - AI Meeting Assistant",
    hierarchy: "Product Lead → VP of Product → CEO",
    preferredCommunication: [
      { method: "Slack", icon: MessageSquare, primary: true },
      { method: "Email", icon: Mail, primary: false },
      { method: "Llamada", icon: Phone, primary: false },
    ],
    status: {
      active: true,
      message: "Disponible para reuniones",
    },
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Card */}
      <Card className="absolute top-20 right-8 w-[380px] shadow-2xl border-gray-200 z-50">
        <CardHeader className="pb-4">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div 
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{userData.name}</h3>
              <p className="text-sm text-gray-600">{userData.role}</p>
              <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 p-0"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center gap-2">
            <div 
              onClick={() => setIsActive(!isActive)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex-1"
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium text-gray-700">
                {isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 leading-relaxed">{userData.bio}</p>
            </div>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 space-y-4">
          {/* Team */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-1">Equipo</p>
              <p className="text-sm font-medium text-gray-900">{userData.team}</p>
            </div>
          </div>

          {/* Current Project */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-1">Proyecto actual</p>
              <p className="text-sm font-medium text-gray-900">{userData.currentProject}</p>
            </div>
          </div>

          {/* Hierarchy */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-1">Jerarquía</p>
              <p className="text-sm text-gray-700">{userData.hierarchy}</p>
            </div>
          </div>

          {/* Preferred Communication */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-2">Comunicación preferida</p>
              <div className="flex flex-wrap gap-2">
                {userData.preferredCommunication.map((comm, index) => {
                  const Icon = comm.icon;
                  return (
                    <Badge
                      key={index}
                      className={`gap-1.5 ${
                        comm.primary
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {comm.method}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>

        <Separator />

        {/* Actions */}
        <CardContent className="pt-3 pb-3 space-y-1">
          <Link to="/profile" onClick={onClose}>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50"
              size="sm"
            >
              <User className="w-4 h-4" />
              Ver perfil completo
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50"
            size="sm"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50"
            size="sm"
          >
            <Bell className="w-4 h-4" />
            Notificaciones
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50"
            size="sm"
          >
            <Shield className="w-4 h-4" />
            Privacidad
          </Button>
          <Separator className="my-2" />
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            size="sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
      />
    </>
  );
}