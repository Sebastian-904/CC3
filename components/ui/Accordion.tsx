import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

const AccordionContext = React.createContext<{
  value: string | string[];
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
}>({
  value: "",
  onValueChange: () => {},
  type: "single",
});

const useAccordion = () => {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error("useAccordion must be used within an Accordion");
    }
    return context;
}

const Accordion = ({
  className,
  type = "single",
  collapsible = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean; children?: React.ReactNode }) => {
  const [value, setValue] = React.useState<string | string[]>(type === "multiple" ? [] : "");

  const onValueChange = React.useCallback((itemValue: string) => {
    if (type === "single") {
        setValue(prev => (prev === itemValue && collapsible) ? "" : itemValue);
    } else {
        setValue((prev) => {
            const arr = Array.isArray(prev) ? prev : [];
            return arr.includes(itemValue) ? arr.filter((v) => v !== itemValue) : [...arr, itemValue];
        });
    }
  }, [type, collapsible]);

  return (
    <AccordionContext.Provider value={{ value, onValueChange, type }}>
        <div className={cn("w-full", className)} {...props} />
    </AccordionContext.Provider>
  )
}

const AccordionItemContext = React.createContext<string>("");

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <div
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value, onValueChange } = useAccordion();
    const itemValue = React.useContext(AccordionItemContext);
    const isOpen = Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
    
    return (
        <h3>
            <button
                ref={ref}
                onClick={() => onValueChange(itemValue)}
                className={cn(
                "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
                )}
                data-state={isOpen ? "open" : "closed"}
                aria-expanded={isOpen}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </h3>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value } = useAccordion();
    const itemValue = React.useContext(AccordionItemContext);
    const isOpen = Array.isArray(value) ? value.includes(itemValue) : value === itemValue;

    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={ref}
            data-state={isOpen ? "open" : "closed"}
            className={cn(
                "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                className
            )}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
});
AccordionContent.displayName = "AccordionContent"


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
