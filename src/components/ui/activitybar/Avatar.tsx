// components/Avatar.tsx

// ─────────────────────────────────────────────────────────────────────────────
// A simple gradient avatar that displays up to 2 initials.
// Accepts an optional onClick handler for profile actions.
// ─────────────────────────────────────────────────────────────────────────────

const SIZE = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  } as const;
  
  interface AvatarProps {
    initials?: string;
    size?: keyof typeof SIZE;
    onClick?: () => void;
  }
  
  export default function Avatar({ initials = "A", size = "md", onClick }: AvatarProps) {
    return (
      <button
        type="button"
        title="Profile"
        aria-label="Profile"
        onClick={onClick}
        className={[
          SIZE[size],
          "rounded-full shrink-0 select-none",
          "bg-gradient-to-br from-[#39d353] to-[#1f6feb]",
          "flex items-center justify-center",
          "font-bold text-white",
          "ring-2 ring-transparent hover:ring-[#39d353]/50",
          "transition-all duration-200",
        ].join(" ")}
      >
        {initials.slice(0, 2).toUpperCase()}
      </button>
    );
  }