import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FlowPreview } from "../components/FlowPreview";
import { GanttPreview } from "../components/GanttPreview";
import { FlowEditorOverlay } from "../components/FlowEditorOverlay";
import { GanttViewOverlay } from "../components/GanttViewOverlay";
import { ScrumCycle } from "../components/ScrumCycle";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Target,
  MoreVertical,
  Plus,
  GitBranch,
  BarChart3,
  ListTodo,
  Video
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export default function ProjectManager() {
  const [isFlowOverlayOpen, setIsFlowOverlayOpen] = useState(false);
  const [isGanttOverlayOpen, setIsGanttOverlayOpen] = useState(false);

  const project = {
    id: 1,
    name: "RediseÃ±o de Dashboard",
    description: "ModernizaciÃ³n completa de la interfaz del dashboard principal con nuevo sistema de diseÃ±o y mejoras de UX",
    status: "En progreso",
    progress: 75,
    priority: "Alta",
    startDate: "1 Feb 2026",
    deadline: "15 Mar 2026",
    budget: "â‚¬45,000",
    spent: "â‚¬33,750",
    team: [
      {
        name: "MarÃ­a GarcÃ­a",
        role: "Product Manager",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        status: "online"
      },
      {
        name: "Carlos Ruiz",
        role: "Tech Lead",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        status: "online"
      },
      {
        name: "Laura MartÃ­nez",
        role: "UX Designer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        status: "online"
      },
      {
        name: "David LÃ³pez",
        role: "Backend Developer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        status: "offline"
      },
      {
        name: "Ana Silva",
        role: "Frontend Developer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        status: "online"
      }
    ],
    stats: {
      tasksCompleted: 12,
      tasksTotal: 16,
      meetingsHeld: 8,
      decisionsCount: 23
    }
  };

  const tasks = [
    {
      id: 1,
      title: "DiseÃ±ar sistema de componentes",
      assignee: "Laura MartÃ­nez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      status: "completed",
      priority: "Alta",
      dueDate: "2026-03-01"
    },
    {
      id: 2,
      title: "Implementar nuevos widgets",
      assignee: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      status: "in-progress",
      priority: "Alta",
      dueDate: "2026-03-05"
    },
    {
      id: 3,
      title: "Refactorizar API de datos",
      assignee: "David LÃ³pez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      status: "in-progress",
      priority: "Media",
      dueDate: "2026-03-08"
    },
    {
      id: 4,
      title: "Testing de rendimiento",
      assignee: "Carlos Ruiz",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      status: "pending",
      priority: "Media",
      dueDate: "2026-03-12"
    }
  ];

  const meetings = [
    {
      id: 1,
      title: "Kick-off del proyecto",
      date: "2026-02-01",
      duration: 60,
      attendees: 5,
      type: "Planning"
    },
    {
      id: 2,
      title: "Review de diseÃ±o UI/UX",
      date: "2026-02-15",
      duration: 45,
      attendees: 4,
      type: "Review"
    },
    {
      id: 3,
      title: "Sprint Planning - Sprint 1",
      date: "2026-02-20",
      duration: 90,
      attendees: 5,
      type: "Planning"
    }
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
      case "completed":
        return "bg-green-100 text-green-800 border-0";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-0";
      case "pending":
        return "bg-gray-100 text-gray-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  return (
    <div className="min-h-screen app-background">
      <Header />

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <Card className="border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-6 max-w-3xl">{project.description}</p>

                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha inicio</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{project.startDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Deadline</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{project.deadline}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Presupuesto</p>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{project.budget}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gastado</p>
                    <p className="font-medium text-gray-900">{project.spent} <span className="text-sm text-gray-600">(75%)</span></p>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso general del proyecto</span>
                <span className="font-semibold text-gray-900">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>

            {/* Team Members */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Equipo del proyecto ({project.team.length} miembros)</p>
              <div className="flex items-center gap-2">
                {project.team.map((member, index) => (
                  <div key={index} className="relative">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full ml-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {project.stats.tasksCompleted}/{project.stats.tasksTotal}
              </p>
              <p className="text-sm text-gray-600">Tareas completadas</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{project.stats.meetingsHeld}</p>
              <p className="text-sm text-gray-600">Reuniones realizadas</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{project.stats.decisionsCount}</p>
              <p className="text-sm text-gray-600">Decisiones tomadas</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{project.team.length}</p>
              <p className="text-sm text-gray-600">Miembros del equipo</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              Tareas
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-2">
              <Video className="w-4 h-4" />
              Reuniones
            </TabsTrigger>
            <TabsTrigger value="flow" className="gap-2">
              <GitBranch className="w-4 h-4" />
              Flujo
            </TabsTrigger>
            <TabsTrigger value="gantt" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Gantt
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Tareas recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={task.avatar} alt={task.assignee} />
                        <AvatarFallback>{task.assignee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-600">{task.assignee}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Reuniones del proyecto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Video className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{meeting.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span>{new Date(meeting.date).toLocaleDateString('es-ES')}</span>
                          <span>â€¢</span>
                          <span>{meeting.duration} min</span>
                          <span>â€¢</span>
                          <span>{meeting.attendees} asistentes</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {meeting.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Scrum Cycle Module */}
            <ScrumCycle />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Todas las tareas</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva tarea
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={task.status === 'completed'} readOnly className="w-5 h-5" />
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={task.avatar} alt={task.assignee} />
                        <AvatarFallback>{task.assignee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.assignee}</p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Reuniones del proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Video className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{meeting.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(meeting.date).toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meeting.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.attendees} asistentes
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {meeting.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flow Tab */}
          <TabsContent value="flow">
            <FlowPreview onOpenEditor={() => setIsFlowOverlayOpen(true)} />
          </TabsContent>

          {/* Gantt Tab */}
          <TabsContent value="gantt">
            <GanttPreview onOpenEditor={() => setIsGanttOverlayOpen(true)} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Overlays */}
      <FlowEditorOverlay 
        isOpen={isFlowOverlayOpen} 
        onClose={() => setIsFlowOverlayOpen(false)} 
      />
      <GanttViewOverlay 
        isOpen={isGanttOverlayOpen} 
        onClose={() => setIsGanttOverlayOpen(false)} 
      />
    </div>
  );
}
