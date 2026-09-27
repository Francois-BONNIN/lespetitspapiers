import { Link2, Share2, Smartphone } from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { useI18n } from "@/i18n/language-context";

interface ShareMenuProps {
  disabled: boolean;
  hasDraws: boolean;
  onCopyShareLink: () => void;
  onCopyFullLink: () => void;
}

export function ShareMenu({
  disabled,
  hasDraws,
  onCopyShareLink,
  onCopyFullLink,
}: ShareMenuProps) {
  const { t } = useI18n();

  return (
    <ActionMenu
      icon={Share2}
      label={t.share.action}
      disabled={disabled}
      variant="toolbar"
      items={[
        {
          id: "share-link",
          icon: Link2,
          label: t.share.linkAction,
          description: t.share.linkDescription,
          onSelect: onCopyShareLink,
        },
        {
          id: "full-link",
          icon: Smartphone,
          label: t.share.fullLinkAction,
          description: hasDraws
            ? t.share.fullLinkDescription
            : t.share.fullLinkUnavailable,
          disabled: !hasDraws,
          onSelect: onCopyFullLink,
        },
      ]}
    />
  );
}
