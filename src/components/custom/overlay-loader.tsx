import { cn } from "@/lib/utils";

interface OverlayLoadingProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
  backdrop?: "light" | "dark" | "blur";
}

export function OverlayLoading({
  isLoading,
  message = "Loading...",
  className,
  spinnerSize = "md",
  backdrop = "light",
}: OverlayLoadingProps) {
  if (!isLoading) return null;

  const spinnerSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const backdrops = {
    light: "bg-white/80",
    dark: "bg-black/50",
    blur: "bg-white/80 backdrop-blur-sm",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        backdrops[backdrop],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            spinnerSizes[spinnerSize],
          )}
        />
        {message && (
          <p className="text-sm font-medium text-gray-700 text-balance">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
