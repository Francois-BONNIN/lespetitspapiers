import { OrganizerPage } from "@/pages/organizer/OrganizerPage";
import { RevealPage } from "@/pages/reveal/RevealPage";
import { usePersonalDrawLink } from "@/pages/reveal/usePersonalDrawLink";

export function App() {
  const { personalDraw, exit } = usePersonalDrawLink();

  if (personalDraw === null) return <OrganizerPage />;

  return (
    <RevealPage
      draw={personalDraw === "loading" ? null : personalDraw}
      onExit={exit}
    />
  );
}
