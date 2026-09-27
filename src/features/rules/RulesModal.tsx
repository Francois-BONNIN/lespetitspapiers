import { useState, type ReactNode } from "react";
import { Ban, SlidersHorizontal, Target } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { TabList, TabPanel, type TabItem } from "@/components/ui/Tabs";
import { useI18n } from "@/i18n/language-context";

type RulesTab = "exclusions" | "inclusions";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
  exclusionCount: number;
  forcedDrawCount: number;
  exclusionsPanel: ReactNode;
  inclusionsPanel: ReactNode;
}

export function RulesModal({
  open,
  onClose,
  exclusionCount,
  forcedDrawCount,
  exclusionsPanel,
  inclusionsPanel,
}: RulesModalProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<RulesTab>("exclusions");

  const tabs: TabItem<RulesTab>[] = [
    {
      id: "exclusions",
      label: t.exclusions.title,
      icon: Ban,
      count: exclusionCount,
    },
    {
      id: "inclusions",
      label: t.inclusions.title,
      icon: Target,
      count: forcedDrawCount,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.rules.title}
      description={t.rules.description}
      icon={SlidersHorizontal}
      accent="amber"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-md btn-primary max-sm:w-full"
          >
            {t.rules.done}
          </button>
        </div>
      }
    >
      <TabList
        idPrefix="rules"
        label={t.rules.title}
        tabs={tabs}
        selected={tab}
        onSelect={setTab}
        className="mb-5"
      />
      <TabPanel idPrefix="rules" id={tab}>
        {tab === "exclusions" ? exclusionsPanel : inclusionsPanel}
      </TabPanel>
    </Modal>
  );
}
