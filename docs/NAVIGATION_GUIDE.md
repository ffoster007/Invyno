# Navigation System Guide

## ภาพรวมระบบ Navigation

ระบบ navigation ใหม่ถูกแยกออกเป็นไฟล์ต่างๆ เพื่อให้จัดการง่ายและขยายได้ในอนาคต

## โครงสร้างไฟล์

### 1. Route Configuration
**ไฟล์:** `src/lib/navigation/routes.ts`
- กำหนดค่าตั้งต้นของเส้นทางทั้งหมด
- ใช้สำหรับเพิ่ม/ลบ/แก้ไข route ในอนาคต

### 2. Navigation Hook
**ไฟล์:** `src/hooks/useNavigation.ts`
- Logic การจัดการสถานะ navigation
- ใช้ใน component ใดก็ได้ที่ต้องการจัดการ navigation

### 3. Navigation Renderer
**ไฟล์:** `src/components/ui/NavigationRenderer.tsx`
- แสดง component ตาม route ที่เลือก
- Support lazy loading สำหรับ performance

### 4. Enhanced Sidebar
**ไฟล์:** `src/components/ui/activitybar/EnhancedSidebar.tsx`
- Sidebar ที่ใช้ระบบ navigation แบบ centralized
- อ่านค่าจาก route configuration

### 5. Enhanced Page
**ไฟล์:** `src/components/EnhancedPage.tsx`
- Main page ที่ใช้ระบบใหม่
- แทนที่ page.tsx เดิม

## วิธีเพิ่ม Feature ใหม่

### 1. เพิ่ม Route ใหม่
แก้ไข `src/lib/navigation/routes.ts`:

```typescript
export const NAVIGATION_ROUTES: RouteConfig[] = [
  // ... existing routes
  {
    id: "settings",
    label: "Settings",
    icon: "Settings",
    componentPath: "@/components/interfaces/Settings/page",
    description: "Application settings"
  }
];
```

### 2. สร้าง Component ใหม่
สร้างไฟล์ component ตาม `componentPath` ที่กำหนดไว้

### 3. เพิ่มใน NavigationRenderer
แก้ไข `src/components/ui/NavigationRenderer.tsx`:

```typescript
const Settings = lazy(() => import("@/components/interfaces/Settings/page"));

// ใน switch case:
case "settings":
  return <Settings />;
```

### 4. เพิ่ม Icon
แก้ไข `ICON_MAP` ใน EnhancedSidebar:

```typescript
const ICON_MAP = {
  // ... existing icons
  Settings: <Settings className="w-5 h-5 shrink-0" />,
};
```

## การใช้งาน

### ใน Component ใดก็ตาม
```typescript
import { useNavigation } from "@/hooks/useNavigation";

function MyComponent() {
  const navigation = useNavigation();
  
  // ตรวจสอบ route ปัจจุบัน
  console.log(navigation.activeRoute);
  
  // เปลี่ยน route
  navigation.setActiveRoute("analytics");
  
  // ตรวจสอบว่า route ใช้งานอยู่หรือไม่
  if (navigation.isRouteActive("dashboard")) {
    // do something
  }
}
```

## ข้อดีของระบบใหม่

1. **แยก Logic**: การจัดการ navigation อยู่ที่เดียว
2. **ขยายง่าย**: เพิ่ม route ใหม่ได้ง่ายๆ
3. **Maintainable**: แก้ไขได้ที่ไฟล์เดียว
4. **Type Safe**: มี TypeScript support ครบถ้วน
5. **Performance**: Lazy loading components
6. **Reusable**: ใช้ได้ในทุก component

## การย้ายจากระบบเก่า

- `page.tsx` เดิม → ยังคงใช้งานได้ (ในกรณีต้องการกลับ)
- `EnhancedPage.tsx` → ระบบใหม่ที่แนะนำ
- Dashboard page ถูกอัพเดทให้ใช้ EnhancedPage แล้ว
