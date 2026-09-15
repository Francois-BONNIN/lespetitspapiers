import { Participant, Exclusion, Inclusion, Draw } from "./database";
import type { Translation } from "./i18n";
import { buildHomonymHints, labelWithHint } from "./homonyms";

export function exportDrawsToCSV(
  draws: Draw[],
  participants: Participant[],
  t: Translation,
): string {
  const hints = buildHomonymHints(participants);
  const getParticipantName = (id: string) => {
    const participant = participants.find((p) => p.id === id);
    if (!participant) return t.common.unknown;
    return labelWithHint(participant.name, hints.get(id));
  };

  const header = `${t.csv.drawsHeader}\n`;
  const rows = draws.map(
    (draw) =>
      `"${getParticipantName(draw.drawer_id)}","${getParticipantName(
        draw.drawn_id,
      )}"`,
  );

  return header + rows.join("\n");
}

export function exportParticipantsToCSV(
  participants: Participant[],
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  t: Translation,
): string {
  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name || "";

  const header = `${t.csv.participantsHeader}\n`;
  const rows = participants.map((participant) => {
    const participantExclusions = exclusions
      .filter((e) => e.participant_id === participant.id)
      .map((e) => getParticipantName(e.excluded_participant_id))
      .join(";");

    const participantInclusions = inclusions
      .filter((i) => i.participant_id === participant.id)
      .map((i) => getParticipantName(i.included_participant_id))
      .join(";");

    return `"${participant.name}","${participant.email || ""}","${
      participant.family || ""
    }","${participantExclusions}","${participantInclusions}"`;
  });

  return header + rows.join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(["\ufeff" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  participants: Array<{
    name: string;
    email: string | null;
    family: string | null;
  }>;
  exclusions: Array<{
    participantName: string;
    excludedName: string;
  }>;
  inclusions: Array<{
    participantName: string;
    includedName: string;
  }>;
}

export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
  const result: string[][] = [];

  for (const line of lines) {
    const fields: string[] = [];
    let currentField = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && nextChar === '"' && inQuotes) {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(currentField.trim());
        currentField = "";
      } else {
        currentField += char;
      }
    }

    fields.push(currentField.trim());
    result.push(fields);
  }

  return result;
}

export function importParticipantsFromCSV(
  csvContent: string,
): ImportResult | null {
  try {
    const rows = parseCSV(csvContent);

    if (rows.length < 2) {
      throw new Error(
        "The CSV file needs at least a header row and one data row",
      );
    }

    const header = rows[0].map((h) => h.toLowerCase());
    const findColumn = (...aliases: string[]) =>
      header.findIndex((h) => aliases.some((alias) => h.includes(alias)));

    const nameIndex = findColumn("nom", "name");
    const emailIndex = findColumn("email", "e-mail", "mail");
    const familyIndex = findColumn("famille", "groupe", "group");
    const exclusionsIndex = findColumn("exclusion");
    const inclusionsIndex = findColumn("inclusion");

    if (nameIndex === -1) {
      throw new Error("Missing required column: 'Nom' / 'Name'");
    }

    const participants: ImportResult["participants"] = [];
    const exclusions: ImportResult["exclusions"] = [];
    const inclusions: ImportResult["inclusions"] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = row[nameIndex]?.trim();

      if (!name) continue;

      participants.push({
        name,
        email: emailIndex !== -1 ? row[emailIndex]?.trim() || null : null,
        family: familyIndex !== -1 ? row[familyIndex]?.trim() || null : null,
      });

      if (exclusionsIndex !== -1 && row[exclusionsIndex]) {
        const excludedNames = row[exclusionsIndex]
          .split(";")
          .map((n) => n.trim())
          .filter((n) => n);
        excludedNames.forEach((excludedName) => {
          exclusions.push({
            participantName: name,
            excludedName,
          });
        });
      }

      if (inclusionsIndex !== -1 && row[inclusionsIndex]) {
        const includedNames = row[inclusionsIndex]
          .split(";")
          .map((n) => n.trim())
          .filter((n) => n);
        includedNames.forEach((includedName) => {
          inclusions.push({
            participantName: name,
            includedName,
          });
        });
      }
    }

    return { participants, exclusions, inclusions };
  } catch (error) {
    console.error("Erreur lors de l'import CSV:", error);
    return null;
  }
}

export function generateMessageForDraw(
  drawerName: string,
  drawnName: string,
  t: Translation,
): string {
  return t.csv.message(drawerName, drawnName);
}
