import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import MeetingDetail from "./pages/MeetingDetail";
import CalendarView from "./pages/CalendarView";
import MeetingSummary from "./pages/MeetingSummary";
import UserProfile from "./pages/UserProfile";
import ProjectManager from "./pages/ProjectManager";
import TasksManager from "./pages/TasksManager";
import Notifications from "./pages/Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/meeting/:id",
    Component: MeetingDetail,
  },
  {
    path: "/meeting/:id/summary",
    Component: MeetingSummary,
  },
  {
    path: "/calendar",
    Component: CalendarView,
  },
  {
    path: "/profile",
    Component: UserProfile,
  },
  {
    path: "/projects",
    Component: ProjectManager,
  },
  {
    path: "/tasks",
    Component: TasksManager,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
]);
