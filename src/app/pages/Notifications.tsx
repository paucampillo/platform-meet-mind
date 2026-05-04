import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Bell,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Clock,
  Eye,
  Check,
  AlarmClock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Video,
  FileText,
  Users,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type NotificationType = "all" | "meetings" | "tasks" | "projects";
type NotificationPriority = "completed" | "upcoming" | "overdue";

interface Notification {
  id: number;
  type: "meeting" | "task" | "project";
  priority: NotificationPriority;
  title: string;
  description: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  dueDate?: string;
  time?: string;
  icon: any;
  read: boolean;
}

export default function Notifications() {
  const [filter, setFilter] = useState<NotificationType>("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "meeting",
      priority: "upcoming",
      title: "Reunión Sprint Marketing",
      description: "Comienza en 30 min",
      assignee: {
        name: "María García",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
      time: "10:30 AM",
      icon: Video,
      read: false,
    },
    {
      id: 2,
      type: "task",
      priority: "upcoming",
      title: "Diseñar landing page",
      description: "Vence mañana",
      assignee: {
        name: "Laura Martínez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
      dueDate: "6 Mar 2026",
      icon: FileText,
      read: false,
    },
    {
      id: 3,
      type: "task",
      priority: "overdue",
      title: "Informe mensual",
      description: "Retrasado 2 días",
      assignee: {
        name: "Carlos Ruiz",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
      dueDate: "3 Mar 2026",
      icon: AlertCircle,
      read: false,
    },
    {
      id: 4,
      type: "project",
      priority: "completed",
      title: "Proyecto App Mobile actualizado",
      description: "Ana Silva completó 3 tareas",
      assignee: {
        name: "Ana Silva",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      },
      time: "Hace 2h",
      icon: BarChart3,
      read: true,
    },
    {
      id: 5,
      type: "meeting",
      priority: "upcoming",
      title: "Daily Standup",
      description: "Comienza en 2 horas",
      assignee: {
        name: "Equipo Desarrollo",
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
      },
      time: "12:00 PM",
      icon: Users,
      read: false,
    },
    {
      id: 6,
      type: "task",
      priority: "upcoming",
      title: "Revisar pull request",
      description: "Vence hoy a las 6:00 PM",
      assignee: {
        name: "David López",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
      dueDate: "5 Mar 2026",
      icon: CheckCircle2,
      read: false,
    },
    {
      id: 7,
      type: "project",
      priority: "upcoming",
      title: "Rediseño de Dashboard",
      description: "75% completado - milestone próximo",
      time: "Hace 1h",
      icon: TrendingUp,
      read: true,
    },
    {
      id: 8,
      type: "task",
      priority: "overdue",
      title: "Actualizar documentación",
      description: "Retrasado 1 día",
      assignee: {
        name: "Laura Martínez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
      dueDate: "4 Mar 2026",
      icon: AlertTriangle,
      read: false,
    },
  ]);

  const aiSuggestions = [
    {
      id: 1,
      type: "priority",
      icon: Sparkles,
      title: "3 tareas prioritarias hoy",
      description: "Diseñar landing page, Revisar pull request, Testing componentes",
      color: "bg-indigo-50 border-indigo-200 text-indigo-900",
      iconColor: "text-indigo-600",
    },
    {
      id: 2,
      type: "reminder",
      icon: Clock,
      title: "Reunión en 1h — revisa tareas pendientes",
      description: "Sprint Marketing: 2 action items sin resolver del último meeting",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      type: "warning",
      icon: AlertTriangle,
      title: "2 tareas podrían retrasarse",
      description: "Informe mensual y Documentación necesitan atención urgente",
      color: "bg-orange-50 border-orange-200 text-orange-900",
      iconColor: "text-orange-600",
    },
    {
      id: 4,
      type: "insight",
      icon: TrendingUp,
      title: "Productividad de la semana",
      description: "Has completado 12 de 15 tareas planificadas (80%)",
      color: "bg-green-50 border-green-200 text-green-900",
      iconColor: "text-green-600",
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "meetings") return notif.type === "meeting";
    if (filter === "tasks") return notif.type === "task";
    if (filter === "projects") return notif.type === "project";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "upcoming":
        return "bg-yellow-50 border-yellow-200";
      case "overdue":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completado
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Próximo
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Retrasado
          </Badge>
        );
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAsDone = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? { ...notif, priority: "completed", read: true }
          : notif
      )
    );
  };

  return (
    <div className="relative z-[1] min-h-screen app-background">
      <Header />

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-8 h-8 text-gray-900" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Notificaciones Inteligentes
                </h1>
                <p className="text-gray-600 mt-1">
                  Mantente al día con tus tareas, reuniones y proyectos
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setNotifications(
                  notifications.map((n) => ({ ...n, read: true }))
                )
              }
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>

          {/* Filters */}
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as NotificationType)}
            className="w-full"
          >
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="all" className="gap-2">
                <Bell className="w-4 h-4" />
                Todas
                <Badge variant="secondary" className="ml-1 bg-gray-100">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="meetings" className="gap-2">
                <Video className="w-4 h-4" />
                Reuniones
                <Badge variant="secondary" className="ml-1 bg-gray-100">
                  {notifications.filter((n) => n.type === "meeting").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Tareas
                <Badge variant="secondary" className="ml-1 bg-gray-100">
                  {notifications.filter((n) => n.type === "task").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Proyectos
                <Badge variant="secondary" className="ml-1 bg-gray-100">
                  {notifications.filter((n) => n.type === "project").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Notifications Panel */}
          <div className="col-span-2 space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card className="border-gray-200">
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No hay notificaciones en esta categoría
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`border-2 transition-all hover:shadow-lg ${getPriorityColor(
                      notification.priority
                    )} ${
                      !notification.read
                        ? "ring-2 ring-indigo-400 ring-offset-2"
                        : ""
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notification.priority === "overdue"
                              ? "bg-red-100"
                              : notification.priority === "upcoming"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              notification.priority === "overdue"
                                ? "text-red-600"
                                : notification.priority === "upcoming"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                )}
                              </div>
                              <p className="text-sm text-gray-700">
                                {notification.description}
                              </p>
                            </div>
                            {getPriorityBadge(notification.priority)}
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                            {notification.assignee && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage
                                    src={notification.assignee.avatar}
                                  />
                                  <AvatarFallback>
                                    {notification.assignee.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{notification.assignee.name}</span>
                              </div>
                            )}
                            {notification.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{notification.dueDate}</span>
                              </div>
                            )}
                            {notification.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{notification.time}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-2"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver
                            </Button>
                            {notification.type === "task" &&
                              notification.priority !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 gap-2"
                                  onClick={() =>
                                    handleMarkAsDone(notification.id)
                                  }
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Marcar como hecho
                                </Button>
                              )}
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 gap-2"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                <Check className="w-3.5 h-3.5" />
                                Marcar como leída
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-2"
                            >
                              <AlarmClock className="w-3.5 h-3.5" />
                              Posponer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* AI Suggestions Panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Sugerencias Inteligentes
              </h2>
            </div>

            {aiSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <Card
                  key={suggestion.id}
                  className={`border-2 ${suggestion.color} hover:shadow-lg transition-all cursor-pointer`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-5 h-5 ${suggestion.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs opacity-80 leading-relaxed">
                          {suggestion.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-60 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Stats */}
            <Card className="border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Resumen de hoy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tareas completadas</span>
                  <span className="font-semibold text-green-700">4 / 7</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reuniones hoy</span>
                  <span className="font-semibold text-blue-700">2</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tareas retrasadas</span>
                  <span className="font-semibold text-red-700">2</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Proyectos activos</span>
                  <span className="font-semibold text-indigo-700">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


