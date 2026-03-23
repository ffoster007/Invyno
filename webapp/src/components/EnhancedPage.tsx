// ─────────────────────────────────────────────────────────────────────────────
// Enhanced Page - Uses centralized navigation system
// ─────────────────────────────────────────────────────────────────────────────

import { useNavigation } from "@/hooks/useNavigation";
import EnhancedSidebar from "@/components/ui/activitybar/EnhancedSidebar";
import { NavigationRenderer } from "@/components/ui/NavigationRenderer";

export default function EnhancedPage() {
  const navigation = useNavigation();

  return (
    <div className="bg-[#010409] text-[#c9d1d9] font-mono">
      {/* Sidebar */}
      <EnhancedSidebar navigation={navigation} />

      {/* Main Content */}
      <main className="ml-14 min-h-screen p-6">
        <NavigationRenderer activeRoute={navigation.activeRoute} />
      </main>
    </div>
  );
}
