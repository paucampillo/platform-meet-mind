import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { MeetingCard } from "../components/MeetingCard";
import { TaskItem } from "../components/TaskItem";
import { AutoEvent } from "../components/AutoEvent";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  FolderKanban,
  AlertCircle,
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  Target,
  LockKeyhole,
  Briefcase,
  MessageSquare,
  Settings,
  Check,
  Video
} from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "Rediseño de Dashboard",
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
      name: "App Móvil v2.0",
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
      name: "Integración API Terceros",
      status: "Planificación",
      progress: 15,
      team: 4,
      deadline: "20 Abr 2026",
      priority: "Baja",
      tasksCompleted: 3,
      tasksTotal: 18,
    },
  ];

  const meetings = [
    {
      id: "1",
      title: "Reunión de planificación Q1 2026",
      date: new Date(2026, 1, 24),
      duration: 45,
      tasksCount: 8,
      decisionsCount: 5,
      status: "executing" as const,
      project: "Rediseño de Dashboard",
      type: "Planning",
    },
    {
      id: "2",
      title: "Sesión de estrategia de producto",
      date: new Date(2026, 1, 23),
      duration: 60,
      tasksCount: 12,
      decisionsCount: 7,
      status: "completed" as const,
      project: "App Móvil v2.0",
      type: "Strategy",
    },
    {
      id: "3",
      title: "Stand-up diario del equipo",
      date: new Date(2026, 1, 26, 9, 0),
      duration: 15,
      tasksCount: 4,
      decisionsCount: 2,
      status: "in-progress" as const,
      type: "Daily",
    },
  ];

  const activeTasks = [
    {
      id: "t1",
      title: "Finalizar diseño de la nueva landing page",
      assignee: { name: "María García", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      dueDate: new Date(2026, 1, 28),
      priority: "high" as const,
      completed: false,
      project: "Rediseño de Dashboard",
      blocked: false,
    },
    {
      id: "t2",
      title: "Revisar propuesta de arquitectura del backend",
      assignee: { name: "Carlos Ruiz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      dueDate: new Date(2026, 1, 27),
      priority: "high" as const,
      completed: false,
      project: "App Móvil v2.0",
      blocked: true,
    },
    {
      id: "t3",
      title: "Documentar API endpoints versión 2.0",
      assignee: { name: "Laura Martínez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
      dueDate: new Date(2026, 2, 2),
      priority: "medium" as const,
      completed: false,
      project: "Integración API Terceros",
      blocked: false,
    },
    {
      id: "t4",
      title: "Configurar pipeline de CI/CD en producción",
      assignee: { name: "David López", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      dueDate: new Date(2026, 2, 5),
      priority: "medium" as const,
      completed: false,
      project: "Rediseño de Dashboard",
      blocked: false,
    },
    {
      id: "t5",
      title: "Actualizar dependencias del proyecto",
      assignee: { name: "Ana Torres", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
      dueDate: new Date(2026, 2, 8),
      priority: "low" as const,
      completed: true,
      project: "App Móvil v2.0",
      blocked: false,
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
      name: "Laura Martínez",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      status: "online",
    },
    {
      name: "David López",
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

  const upcomingEvents = [
    {
      id: "e1",
      title: "Revisión de diseño UI/UX",
      date: new Date(2026, 1, 28),
      time: "10:00",
      duration: 2,
      source: "Reunión de planificación Q1",
    },
    {
      id: "e2",
      title: "Sprint planning - Equipo Backend",
      date: new Date(2026, 2, 1),
      time: "14:00",
      duration: 1.5,
      source: "Sesión de estrategia de producto",
    },
    {
      id: "e3",
      title: "Demo para stakeholders",
      date: new Date(2026, 2, 3),
      time: "16:00",
      duration: 1,
      source: "Stand-up diario del equipo",
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
      case "Planificación":
        return "bg-purple-100 text-purple-800 border-0";
      case "Completado":
        return "bg-green-100 text-green-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  return (
    <div className="relative z-[1] min-h-screen app-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-8 py-12">
        {/* Context Selectors */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Mi ámbito:</span>
            <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
              Tecnología
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Ciclo actual:</span>
            <Select defaultValue="sprint5">
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sprint5">Sprint 5</SelectItem>
                <SelectItem value="q1">Q1 2026</SelectItem>
                <SelectItem value="hiring">Hiring Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Integrations Status */}
        <div className="mb-8 flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">Integrado con:</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 gap-1">
                <Check className="w-3 h-3" />
                Microsoft Teams
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 gap-1">
                <Check className="w-3 h-3" />
                Google Meet
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Administrar
          </Button>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            De la conversación a la acción.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tus reuniones convertidas en decisiones, tareas y agenda automáticamente.
          </p>
          <Link to="/meeting/1/summary">
            <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5" />
              Iniciar nueva sesión
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Personal Insights Mini Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <Card className="border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-600">Tareas pendientes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-600">Retrasadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-600">Reuniones esta semana</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-600">Vacantes sin dueño</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mis Proyectos Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Mis Proyectos</h2>
            <Link to="/projects">
              <Button variant="outline" size="sm" className="gap-2">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project, index) => {
              const bgColors = [
                "bg-blue-50/30", 
                "bg-purple-50/30", 
                "bg-indigo-50/30"
              ];
              const accentColors = [
                "border-l-blue-400",
                "border-l-purple-400", 
                "border-l-indigo-400"
              ];
              return (
              <Card key={project.id} className={`border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${bgColors[index % bgColors.length]} border-l-4 ${accentColors[index % accentColors.length]}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.team}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.deadline}
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {project.tasksCompleted}/{project.tasksTotal}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </section>

        {/* Recent Meetings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Reuniones recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting) => (
              <div key={meeting.id}>
                <MeetingCard {...meeting} />
                <div className="mt-2 flex items-center gap-2">
                  {meeting.project && (
                    <Badge variant="secondary" className="text-xs bg-white border-gray-200">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {meeting.project}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                    {meeting.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tasks Section */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Tareas activas</h2>
              <Link to="/tasks">
                <Button variant="outline" size="sm" className="gap-2">
                  Ver todas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {activeTasks.map((task) => (
                <div key={task.id} className="relative">
                  <TaskItem {...task} />
                  <div className="absolute bottom-3 right-4 flex items-center gap-2">
                    {task.blocked && (
                      <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                        <LockKeyhole className="w-3 h-3 mr-1" />
                        Bloqueada
                      </Badge>
                    )}
                    {task.project && (
                      <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                        <FolderKanban className="w-3 h-3 mr-1" />
                        {task.project}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Events + Team */}
          <section className="space-y-6">
            {/* Upcoming Auto-Generated Events */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Próximos eventos</h2>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <AutoEvent key={event.id} {...event} />
                ))}
              </div>
              <Link to="/calendar">
                <Button variant="outline" className="w-full mt-4 gap-2">
                  Ver calendario completo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mi Equipo */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Mi Equipo</h3>
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <Link key={index} to="/profile">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
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
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

