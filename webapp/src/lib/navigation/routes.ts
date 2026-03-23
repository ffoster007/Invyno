// ─────────────────────────────────────────────────────────────────────────────
// Navigation Routes Configuration
// ─────────────────────────────────────────────────────────────────────────────

export interface RouteConfig {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  componentPath: string;
  description?: string;
}

export const NAVIGATION_ROUTES: RouteConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "House",
    componentPath: "@/components/page",
    description: "Main dashboard overview"
  },
  {
    id: "workspace", 
    label: "Workspace",
    icon: "Box",
    componentPath: "@/components/interfaces/Workspace/page",
    description: "Portfolio management workspace"
  },
  {
    id: "analytics",
    label: "Analytics", 
    icon: "ChartSpline",
    componentPath: "@/components/interfaces/Analytics/page",
    description: "Investment analytics and insights"
  }
];

export type NavigationId = "dashboard" | "workspace" | "analytics";

export const getRouteById = (id: string): RouteConfig | undefined => {
  return NAVIGATION_ROUTES.find(route => route.id === id);
};

export const isValidNavigationId = (id: string): id is NavigationId => {
  return NAVIGATION_ROUTES.some(route => route.id === id);
};
