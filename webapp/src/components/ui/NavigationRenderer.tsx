// ─────────────────────────────────────────────────────────────────────────────
// Navigation Renderer - Renders components based on navigation state
// ─────────────────────────────────────────────────────────────────────────────

import { lazy, Suspense } from "react";
import { NavigationId } from "@/lib/navigation/routes";

// Lazy load components for better performance
const Dashboard = lazy(() => import("@/components/page"));
const Workspace = lazy(() => import("@/components/interfaces/Workspace/page"));
const Analytics = lazy(() => import("@/components/interfaces/Analytics/page"));

interface NavigationRendererProps {
  activeRoute: NavigationId;
}

export function NavigationRenderer({ activeRoute }: NavigationRendererProps) {
  const renderComponent = () => {
    switch (activeRoute) {
      case "dashboard":
        return <Dashboard />;
      case "workspace":
        return <Workspace />;
      case "analytics":
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-64">
          <div className="text-[#8b949e]">Loading...</div>
        </div>
      }
    >
      {renderComponent()}
    </Suspense>
  );
}
