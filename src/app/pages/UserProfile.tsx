import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  User,
  Briefcase,
  CheckCircle2,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  Building2,
  Sparkles,
  BarChart3,
  FolderKanban,
  CalendarDays,
  MessageSquare,
  Settings,
  ChevronRight,
  Star,
  Zap,
  Activity,
} from "lucide-react";

export default function UserProfile() {
  const user = {
    name: "MarÃ­a GarcÃ­a",
    email: "maria.garcia@meetmind.com",
    phone: "+34 612 345 678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    role: "Product Manager",
    team: "Producto & DiseÃ±o",
    department: "TecnologÃ­a",
    location: "Madrid, EspaÃ±a",
    status: "Activo",
    joinDate: "Enero 2024",
  };

  const projects = [
    {
      id: 1,
      name: "RediseÃ±o de Dashboard",
      status: "En progreso",
      progress: 75,
      team: 5,
      deadline: "15 Mar 2026",
      priority: "Alta",
      tasksCompleted: 12,
      tasksTotal: 16,
    },
    {
      id: 2,
      name: "App MÃ³vil v2.0",
      status: "En progreso",
      progress: 45,
      team: 8,
      deadline: "30 Mar 2026",
      priority: "Media",
      tasksCompleted: 9,
      tasksTotal: 20,
    },
    {
      id: 3,
      name: "IntegraciÃ³n API Terceros",
      status: "PlanificaciÃ³n",
      progress: 15,
      team: 4,
      deadline: "20 Abr 2026",
      priority: "Baja",
      tasksCompleted: 3,
      tasksTotal: 18,
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "Revisar propuesta de diseÃ±o UX",
      project: "RediseÃ±o de Dashboard",
      dueDate: "2026-03-05",
      priority: "Alta",
      status: "pending",
      assignedBy: "Carlos Ruiz",
    },
    {
      id: 2,
      title: "Definir roadmap Q2 2026",
      project: "App MÃ³vil v2.0",
      dueDate: "2026-03-08",
      priority: "Alta",
      status: "in-progress",
      assignedBy: "Laura MartÃ­nez",
    },
    {
      id: 3,
      title: "Preparar presentaciÃ³n para stakeholders",
      project: "RediseÃ±o de Dashboard",
      dueDate: "2026-03-10",
      priority: "Media",
      status: "pending",
      assignedBy: "David LÃ³pez",
    },
    {
      id: 4,
      title: "Revisar documentaciÃ³n tÃ©cnica API",
      project: "IntegraciÃ³n API Terceros",
      dueDate: "2026-03-12",
      priority: "Media",
      status: "pending",
      assignedBy: "Carlos Ruiz",
    },
    {
      id: 5,
      title: "AnÃ¡lisis de mÃ©tricas de usuario",
      project: "App MÃ³vil v2.0",
      dueDate: "2026-03-15",
      priority: "Baja",
      status: "pending",
      assignedBy: "MarÃ­a GarcÃ­a",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "ReuniÃ³n de planificaciÃ³n Q1",
      date: "2026-03-05",
      time: "10:00 AM",
      type: "ReuniÃ³n",
      attendees: 6,
      location: "Sala de Conferencias A",
    },
    {
      id: 2,
      title: "Demo de producto",
      date: "2026-03-07",
      time: "03:00 PM",
      type: "PresentaciÃ³n",
      attendees: 12,
      location: "Virtual",
    },
    {
      id: 3,
      title: "1-on-1 con CEO",
      date: "2026-03-08",
      time: "11:30 AM",
      type: "1-on-1",
      attendees: 2,
      location: "Oficina del CEO",
    },
    {
      id: 4,
      title: "Sprint Review",
      date: "2026-03-10",
      time: "04:00 PM",
      type: "ReuniÃ³n",
      attendees: 8,
      location: "Sala de Conferencias B",
    },
  ];

  const teamMembers = [
    {
      name: "Carlos Ruiz",
      role: "Tech Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      status: "online",
    },
    {
      name: "Laura MartÃ­nez",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      status: "online",
    },
    {
      name: "David LÃ³pez",
      role: "Backend Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      status: "offline",
    },
    {
      name: "Ana Silva",
      role: "Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      status: "online",
    },
  ];

  const stats = [
    {
      label: "Proyectos activos",
      value: "3",
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Tareas pendientes",
      value: "12",
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Reuniones esta semana",
      value: "8",
      icon: CalendarDays,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const achievements = [
    {
      title: "LÃ­der de equipo",
      description: "LiderÃ³ 5+ proyectos exitosos",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Early Adopter",
      description: "Usuario activo desde el inicio",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Colaborador destacado",
      description: "100+ tareas completadas",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "Media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baja":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En progreso":
        return "bg-blue-100 text-blue-800 border-0";
      case "PlanificaciÃ³n":
        return "bg-purple-100 text-purple-800 border-0";
      case "Completado":
        return "bg-green-100 text-green-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  return (
    <div className="min-h-screen app-background">
      <Header />

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* User Header Card */}
        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">MG</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <Badge className="bg-green-100 text-green-800 border-0">
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">{user.role}</p>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      Equipo: {user.team}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {user.department}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      En MeetMind desde {user.joinDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  ConfiguraciÃ³n
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Mis Proyectos */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                    Mis Proyectos
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {project.name}
                            </h3>
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.team} miembros
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Deadline: {project.deadline}
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {project.tasksCompleted}/{project.tasksTotal} tareas
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progreso del proyecto</span>
                          <span className="font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Mis Tareas */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    Mis Tareas
                  </CardTitle>
                  <Button variant="outline" size="sm" className="gap-2">
                    Ver todas
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={task.status === "in-progress"}
                            readOnly
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {task.project}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(task.dueDate).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                {task.assignedBy}
                              </span>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(task.priority)} >
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Eventos Cercanos */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5 text-indigo-600" />
                  Eventos Cercanos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-indigo-600 bg-indigo-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {event.title}
                        </h4>
                        <Badge className="bg-white text-indigo-600 border-indigo-200 text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.attendees} asistentes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Ver calendario completo
                </Button>
              </CardContent>
            </Card>

            {/* Mi Equipo */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Mi Equipo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {member.role}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Ver todo el equipo
                </Button>
              </CardContent>
            </Card>

            {/* Logros */}
            <Card className="border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-amber-600" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <div className={`w-10 h-10 rounded-lg ${achievement.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${achievement.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">
                      Completaste <span className="font-medium">3 tareas</span>
                    </p>
                    <p className="text-xs text-gray-600">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">
                      Te uniste al proyecto <span className="font-medium">App MÃ³vil v2.0</span>
                    </p>
                    <p className="text-xs text-gray-600">Hace 1 dÃ­a</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">
                      Asististe a <span className="font-medium">ReuniÃ³n de planificaciÃ³n</span>
                    </p>
                    <p className="text-xs text-gray-600">Hace 2 dÃ­as</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
