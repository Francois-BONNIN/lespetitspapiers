import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ActionMenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  disabled?: boolean;
  onSelect: () => void;
}

interface ActionMenuProps {
  icon: LucideIcon;
  label: string;
  items: ActionMenuItem[];
  disabled?: boolean;
  variant?: "card" | "toolbar";
}

const VARIANT_CLASSES = {
  card: {
    trigger: "btn-outline",
    label: "",
    chevron: "",
    menu: "absolute left-0 top-full mt-2 w-72 origin-top-left sm:left-auto sm:right-0 sm:origin-top-right",
  },
  toolbar: {
    trigger: "btn-secondary rounded-full",
    label: "hidden sm:inline",
    chevron: "hidden sm:block",
    menu: "fixed inset-x-4 top-[4.25rem] origin-top sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 sm:origin-top-right",
  },
};

export function ActionMenu({
  icon: Icon,
  label,
  items,
  disabled = false,
  variant = "card",
}: ActionMenuProps) {
  const classes = VARIANT_CLASSES[variant];
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledItems = () =>
    itemRefs.current.filter(
      (item): item is HTMLButtonElement => Boolean(item && !item.disabled)
    );

  useEffect(() => {
    if (!open) return;

    itemRefs.current.find((item) => item && !item.disabled)?.focus();

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  const closeAndRefocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    const enabled = enabledItems();
    const current = enabled.indexOf(
      document.activeElement as HTMLButtonElement
    );

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndRefocus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      enabled[(current + 1) % enabled.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      enabled[(current - 1 + enabled.length) % enabled.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`btn btn-sm ${classes.trigger}`}
        aria-label={variant === "toolbar" ? label : undefined}
        title={variant === "toolbar" ? label : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
      >
        <Icon size={15} />
        <span className={classes.label}>{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""} ${
            classes.chevron
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          className={`card z-20 max-w-[calc(100vw-2rem)] animate-scale-in p-1.5 ${classes.menu}`}
        >
          {items.map((item, index) => {
            const ItemIcon = item.icon;

            return (
              <button
                key={item.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  closeAndRefocus();
                  item.onSelect();
                }}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-ink-100 focus-visible:bg-ink-100 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-45 dark:hover:bg-white/[0.08] dark:focus-visible:bg-white/[0.08]"
              >
                <ItemIcon
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-500 dark:text-ink-400"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink-900 dark:text-white">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                      {item.description}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
