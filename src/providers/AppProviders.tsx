import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ConfirmProvider } from "./confirm/ConfirmProvider";
import { ToastProvider } from "./toast/ToastProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
