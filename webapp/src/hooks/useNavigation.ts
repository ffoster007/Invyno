// ─────────────────────────────────────────────────────────────────────────────
// Navigation Hook - Centralized navigation logic
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { NavigationId, NAVIGATION_ROUTES, getRouteById, isValidNavigationId } from "@/lib/navigation/routes";

export interface UseNavigationReturn {
  activeRoute: NavigationId;
  setActiveRoute: (routeId: string) => void;
  routes: typeof NAVIGATION_ROUTES;
  isRouteActive: (routeId: string) => boolean;
  getCurrentRoute: () => ReturnType<typeof getRouteById>;
}

export function useNavigation(initialRoute: NavigationId = "dashboard"): UseNavigationReturn {
  const [activeRoute, setActiveRouteState] = useState<NavigationId>(initialRoute);

  const setActiveRoute = useCallback((routeId: string) => {
    if (isValidNavigationId(routeId)) {
      setActiveRouteState(routeId);
    } else {
      console.warn(`Invalid navigation route: ${routeId}`);
    }
  }, []);

  const isRouteActive = useCallback((routeId: string) => {
    return activeRoute === routeId;
  }, [activeRoute]);

  const getCurrentRoute = useCallback(() => {
    return getRouteById(activeRoute);
  }, [activeRoute]);

  return {
    activeRoute,
    setActiveRoute,
    routes: NAVIGATION_ROUTES,
    isRouteActive,
    getCurrentRoute
  };
}
