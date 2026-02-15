import { cn } from "~/lib/utils";

export const Chip = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => {
  return (
    <button className={cn("flex items-center justify-center rounded-sm bg-accent border px-2 py-1 text-xs font-medium shadow-sm hover:shadow-md hover:-translate-y-1 scale-105 transition-all duration-300 ease-in-out cursor-pointer", className)} onClick={onClick}>
      {children}
    </button>
  );
};
