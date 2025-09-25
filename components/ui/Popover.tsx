import * as React from "react"
import { cn } from "../../lib/utils"

const PopoverRoot = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("relative", className)} {...props} />
)

const PopoverTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
    <button
        ref={ref}
        className={cn("focus:outline-none", className)}
        {...props}
    >
        {children}
    </button>
))
PopoverTrigger.displayName = "PopoverTrigger"


const PopoverContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        side?: "top" | "right" | "bottom" | "left"
        align?: "start" | "center" | "end"
    }
>(({ className, side = "bottom", align = "center", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            side === "bottom" && "data-[side=bottom]:slide-in-from-top-2",
            side === "left" && "data-[side=left]:slide-in-from-right-2",
            side === "right" && "data-[side=right]:slide-in-from-left-2",
            side === "top" && "data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
))
PopoverContent.displayName = "PopoverContent"

// A simplified Popover implementation for this app
interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
}
const Popover: React.FC<PopoverProps> = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <PopoverRoot ref={popoverRef}>
            <div onClick={handleTriggerClick}>
                {trigger}
            </div>
            {isOpen && (
                 <div className="absolute mt-2 z-50">
                    <PopoverContent data-state="open" side="bottom" align="start">
                        {children}
                    </PopoverContent>
                </div>
            )}
        </PopoverRoot>
    )
}


export { Popover, PopoverTrigger, PopoverContent }