import type { ReactNode } from "react";
import { useI18n } from "@/i18n/language-context";

interface FieldLabelProps {
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}

export function FieldLabel({
  htmlFor,
  optional = false,
  children,
}: FieldLabelProps) {
  const { t } = useI18n();

  return (
    <label className="label" htmlFor={htmlFor}>
      {children}
      {optional && (
        <>
          {" "}
          <span className="normal-case text-ink-400">{t.common.optional}</span>
        </>
      )}
    </label>
  );
}
