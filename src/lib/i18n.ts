
export type Language = "fr" | "en";

export const LANGUAGES: Language[] = ["fr", "en"];

export const LANGUAGE_STORAGE_KEY = "sp_lang";

const fr = {
  meta: {
    code: "FR",
    switchLabel: "Switch to English",
    locale: "fr",
    htmlLang: "fr",
    documentTitle: "Les Petits Papiers — Tirage au sort",
    documentDescription:
      "Le tirage des petits papiers en ligne : gérez les participants, posez vos règles d'exclusion et lancez un tirage au sort équitable en un clic.",
  },

  header: {
    tagline: "Tirage au sort",
    drawDone: "Tirage effectué",
  },

  hero: {
    titleMain: "Le tirage des petits papiers,",
    titleAccent: " en ligne",
    subtitle:
      "Ajoutez vos participants, posez vos règles, et laissez le tirage trouver une combinaison équitable. Tout reste sur votre appareil.",
  },

  storage: {
    title: "Stockage local indisponible.",
    body: "Votre navigateur bloque l'enregistrement des données (mode privé ou cookies tiers désactivés) : tout sera perdu en fermant cet onglet. Pensez à exporter votre tirage en CSV.",
  },

  stats: {
    participants: "Participants",
    groups: "Groupes",
    exclusions: "Exclusions",
    inclusions: "Tirages limités",
  },

  footer: "Aucune donnée ne quitte votre navigateur.",

  common: {
    add: "Ajouter",
    cancel: "Annuler",
    close: "Fermer",
    confirm: "Confirmer",
    delete: "Supprimer",
    select: "Sélectionner…",
    unknown: "Inconnu",
    optional: "(facultatif)",
    notifications: "Notifications",
    closeNotification: "Fermer la notification",
    themeToLight: "Passer en thème clair",
    themeToDark: "Passer en thème sombre",
    themeLight: "Thème clair",
    themeDark: "Thème sombre",
  },

  participants: {
    title: "Participants",
    description:
      "Ajoutez les personnes qui participent au tirage. Le groupe est facultatif.",
    exportAction: "Exporter",
    exportTitle: "Exporter les participants et leurs contraintes au format CSV",
    importAction: "Importer",
    importTitle: "Importer un fichier CSV de participants",
    nameLabel: "Nom",
    namePlaceholder: "Camille Durand",
    emailLabel: "E-mail",
    emailPlaceholder: "camille@exemple.fr",
    groupLabel: "Groupe",
    groupPlaceholder: "Équipe A, Famille Durand…",
    searchPlaceholder: "Rechercher un participant…",
    searchLabel: "Rechercher un participant",
    emptyTitle: "Aucun participant pour le moment",
    emptyDescription:
      "Commencez par ajouter au moins deux personnes pour pouvoir lancer un tirage.",
    noResultTitle: "Aucun résultat",
    noResultDescription: (query: string) =>
      `Aucun participant ne correspond à « ${query} ».`,
    ungrouped: "Sans groupe",
    deleteLabel: (name: string) => `Supprimer ${name}`,
  },

  rules: {
    title: "Règles du tirage",
    description:
      "Affinez le tirage : qui ne peut pas tirer qui, et qui ne peut être tiré que par certains.",
    configure: "Configurer",
    openLabel: "Configurer les règles du tirage",
    done: "Terminé",
    none: "Aucune règle : le tirage est entièrement libre.",
    summarySameGroup: "Même groupe exclu",
    summaryExclusions: (count: number) =>
      `${count} exclusion${count > 1 ? "s" : ""}`,
    summaryInclusions: (count: number) =>
      `${count} tirage${count > 1 ? "s" : ""} limité${count > 1 ? "s" : ""}`,
  },

  exclusions: {
    title: "Exclusions",
    description:
      "Définissez qui ne peut pas tirer qui, par exemple deux personnes qui se connaissent trop bien.",
    sameGroupLabel: "Exclure automatiquement les membres d'un même groupe",
    sameGroupDescription:
      "Les participants partageant le même groupe ne pourront pas se tirer entre eux.",
    notEnoughTitle: "Pas encore assez de participants",
    notEnoughDescription:
      "Ajoutez au moins deux personnes pour pouvoir définir des exclusions.",
    drawerLabel: "Personne qui tire",
    excludedLabel: "Personne exclue du tirage",
    connector: "ne peut pas tirer",
    emptyTitle: "Aucune exclusion définie",
    emptyDescription:
      "Le tirage reste entièrement libre entre tous les participants.",
    deleteLabel: "Supprimer cette exclusion",
  },

  inclusions: {
    title: "Tirages limités",
    description:
      "Restreignez le tirage d'une personne à une liste fermée de tireurs possibles.",
    notEnoughTitle: "Pas encore assez de participants",
    notEnoughDescription:
      "Ajoutez au moins deux personnes pour pouvoir définir des restrictions.",
    drawnLabel: "Personne tirée",
    drawerLabel: "Tireur autorisé",
    connector: "peut être tiré par",
    emptyTitle: "Aucune restriction définie",
    emptyDescription:
      "Chaque participant peut être tiré par n'importe qui d'autre.",
    deleteLabel: "Supprimer cette restriction",
    note: "Dès qu'une personne a au moins une restriction, elle ne peut plus être tirée que par les tireurs listés ici. Toutes les autres sont automatiquement écartées.",
  },

  draw: {
    title: "Tirage au sort",
    descriptionDone:
      "Les résultats sont masqués par défaut : révélez-les uniquement si besoin.",
    descriptionPending:
      "Lancez le tirage une fois vos participants et vos règles en place.",
    revealAll: "Tout révéler",
    hideAll: "Tout masquer",
    copyAll: "Tout copier",
    csv: "CSV",
    restart: "Recommencer",
    notPossibleTitle: "Le tirage n'est pas encore possible",
    notPossibleDescription:
      "Il faut au moins deux participants pour lancer un tirage au sort.",
    ready: (count: number) => `${count} participants prêts`,
    readyDescription:
      "Chaque personne se verra attribuer quelqu'un, en respectant toutes les règles définies plus haut.",
    start: "Lancer le tirage",
    inProgress: "Tirage en cours…",
    resultBanner: (count: number) =>
      `Tirage effectué — ${count} attribution${count > 1 ? "s" : ""} générée${
        count > 1 ? "s" : ""
      }.`,
    revealResult: (name: string) => `Révéler le résultat de ${name}`,
    hideResult: (name: string) => `Masquer le résultat de ${name}`,
    reveal: "Révéler",
    hide: "Masquer",
    copyMessageTitle: (name: string) => `Copier le message destiné à ${name}`,
    copied: "Copié",
    message: "Message",
    note: "Ces résultats ne sont visibles que sur cet appareil. Transmettez à chaque participant son message individuellement, sans montrer la liste complète.",
  },

  toast: {
    participantAdded: (name: string) => `${name} ajouté`,
    participantDuplicate:
      "Un participant porte déjà ce nom : pensez à les distinguer.",
    addFailed: "Ajout impossible",
    participantAddFailedDescription: "Le participant n'a pas pu être créé.",
    participantDeleted: "Participant supprimé",
    deleteFailed: "Suppression impossible",
    exclusionExists: "Exclusion déjà définie",
    exclusionAdded: "Exclusion ajoutée",
    exclusionAddFailedDescription: "L'exclusion n'a pas pu être créée.",
    exclusionDeleted: "Exclusion supprimée",
    inclusionExists: "Restriction déjà définie",
    inclusionAdded: "Restriction ajoutée",
    inclusionAddFailedDescription: "La restriction n'a pas pu être créée.",
    inclusionDeleted: "Restriction supprimée",
    drawFailed: "Tirage impossible",
    drawFailedDescription:
      "Aucune combinaison ne respecte toutes les règles. Réduisez les exclusions ou assouplissez les tirages limités.",
    drawDone: "Tirage effectué",
    drawDoneDescription: (count: number) => `${count} attribution(s) générée(s).`,
    drawSaveFailed: "Enregistrement impossible",
    drawSaveFailedDescription: "Le tirage n'a pas été sauvegardé.",
    drawReset: "Tirage réinitialisé",
    drawResetFailed: "Réinitialisation impossible",
    exportStarted: "Export lancé",
    exportParticipantsDescription: "Le fichier CSV a été téléchargé.",
    exportDrawsDescription: "Le fichier CSV du tirage a été téléchargé.",
    importFailed: "Import impossible",
    importFailedDescription: "Le fichier ne correspond pas au format attendu.",
    importDone: "Import réussi",
    importDoneDescription: (count: number) => `${count} participant(s) ajouté(s).`,
    importReadFailed: "Lecture impossible",
    importReadFailedDescription: "Le fichier CSV n'a pas pu être lu.",
    copyFailed: "Copie impossible",
    copyFailedDescription: "Votre navigateur a refusé l'accès au presse-papiers.",
    messagesCopied: "Messages copiés",
    messagesCopiedDescription: (count: number) =>
      `${count} message(s) sont dans votre presse-papiers.`,
  },

  confirm: {
    deleteParticipantTitle: (name: string) => `Supprimer ${name} ?`,
    deleteParticipantFallback: "ce participant",
    linkedConstraints: (count: number) =>
      `${count} règle(s) associée(s) seront également supprimées.`,
    drawInvalidated: "Le tirage en cours sera invalidé.",
    irreversible: "Cette action est définitive.",
    resetDrawTitle: "Recommencer le tirage ?",
    resetDrawDescription:
      "Les attributions actuelles seront effacées. Les participants et les règles sont conservés.",
    resetDrawConfirm: "Recommencer",
  },

  csv: {
    participantsFilename: "participants",
    drawsFilename: "tirage",
    drawsHeader: "Tireur,Tiré",
    participantsHeader: "Nom,Email,Famille,Exclusions,Inclusions",
    message: (drawerName: string, drawnName: string) =>
      `Bonjour ${drawerName} !\n\nLe tirage au sort est fait : tu as tiré ${drawnName}.`,
  },
};

export type Translation = typeof fr;

const en: Translation = {
  meta: {
    code: "EN",
    switchLabel: "Passer en français",
    locale: "en",
    htmlLang: "en",
    documentTitle: "Les Petits Papiers — Random draw",
    documentDescription:
      "The paper-slip draw, online: manage participants, set your exclusion rules and run a fair random draw in one click.",
  },

  header: {
    tagline: "Random draw",
    drawDone: "Draw complete",
  },

  hero: {
    titleMain: "The paper-slip draw,",
    titleAccent: " online",
    subtitle:
      "Add your participants, set your rules, and let the draw find a fair combination. Everything stays on your device.",
  },

  storage: {
    title: "Local storage unavailable.",
    body: "Your browser is blocking data storage (private mode or third-party cookies disabled): everything will be lost when you close this tab. Remember to export your draw as a CSV file.",
  },

  stats: {
    participants: "Participants",
    groups: "Groups",
    exclusions: "Exclusions",
    inclusions: "Restricted draws",
  },

  footer: "No data ever leaves your browser.",

  common: {
    add: "Add",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    delete: "Delete",
    select: "Select…",
    unknown: "Unknown",
    optional: "(optional)",
    notifications: "Notifications",
    closeNotification: "Dismiss notification",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    themeLight: "Light theme",
    themeDark: "Dark theme",
  },

  participants: {
    title: "Participants",
    description: "Add the people taking part in the draw. The group is optional.",
    exportAction: "Export",
    exportTitle: "Export participants and their constraints as a CSV file",
    importAction: "Import",
    importTitle: "Import a CSV file of participants",
    nameLabel: "Name",
    namePlaceholder: "Alex Morgan",
    emailLabel: "Email",
    emailPlaceholder: "alex@example.com",
    groupLabel: "Group",
    groupPlaceholder: "Team A, Morgan family…",
    searchPlaceholder: "Search for a participant…",
    searchLabel: "Search for a participant",
    emptyTitle: "No participants yet",
    emptyDescription:
      "Start by adding at least two people so you can run a draw.",
    noResultTitle: "No results",
    noResultDescription: (query: string) => `No participant matches “${query}”.`,
    ungrouped: "No group",
    deleteLabel: (name: string) => `Delete ${name}`,
  },

  rules: {
    title: "Draw rules",
    description:
      "Fine-tune the draw: who cannot draw whom, and who can only be drawn by certain people.",
    configure: "Configure",
    openLabel: "Configure the draw rules",
    done: "Done",
    none: "No rules: the draw is completely open.",
    summarySameGroup: "Same group excluded",
    summaryExclusions: (count: number) =>
      `${count} exclusion${count > 1 ? "s" : ""}`,
    summaryInclusions: (count: number) =>
      `${count} restricted draw${count > 1 ? "s" : ""}`,
  },

  exclusions: {
    title: "Exclusions",
    description:
      "Define who cannot draw whom, for example two people who know each other far too well.",
    sameGroupLabel: "Automatically exclude members of the same group",
    sameGroupDescription:
      "Participants who share a group will not be able to draw each other.",
    notEnoughTitle: "Not enough participants yet",
    notEnoughDescription: "Add at least two people before defining exclusions.",
    drawerLabel: "Person drawing",
    excludedLabel: "Person excluded from the draw",
    connector: "cannot draw",
    emptyTitle: "No exclusions defined",
    emptyDescription:
      "The draw stays completely open between all participants.",
    deleteLabel: "Delete this exclusion",
  },

  inclusions: {
    title: "Restricted draws",
    description:
      "Restrict who is allowed to draw a given person to a closed list.",
    notEnoughTitle: "Not enough participants yet",
    notEnoughDescription:
      "Add at least two people before defining restrictions.",
    drawnLabel: "Person being drawn",
    drawerLabel: "Allowed drawer",
    connector: "can be drawn by",
    emptyTitle: "No restrictions defined",
    emptyDescription: "Every participant can be drawn by anyone else.",
    deleteLabel: "Delete this restriction",
    note: "As soon as someone has at least one restriction, they can only be drawn by the people listed here. Everyone else is automatically ruled out.",
  },

  draw: {
    title: "Random draw",
    descriptionDone:
      "Results are hidden by default: reveal them only when you need to.",
    descriptionPending:
      "Run the draw once your participants and your rules are in place.",
    revealAll: "Reveal all",
    hideAll: "Hide all",
    copyAll: "Copy all",
    csv: "CSV",
    restart: "Start over",
    notPossibleTitle: "The draw is not possible yet",
    notPossibleDescription:
      "You need at least two participants to run a random draw.",
    ready: (count: number) => `${count} participants ready`,
    readyDescription:
      "Everyone will be assigned someone, respecting all the rules set above.",
    start: "Run the draw",
    inProgress: "Drawing…",
    resultBanner: (count: number) =>
      `Draw complete — ${count} assignment${count > 1 ? "s" : ""} generated.`,
    revealResult: (name: string) => `Reveal the result for ${name}`,
    hideResult: (name: string) => `Hide the result for ${name}`,
    reveal: "Reveal",
    hide: "Hide",
    copyMessageTitle: (name: string) => `Copy the message for ${name}`,
    copied: "Copied",
    message: "Message",
    note: "These results are only visible on this device. Send each participant their own message individually, without showing the full list.",
  },

  toast: {
    participantAdded: (name: string) => `${name} added`,
    participantDuplicate:
      "Another participant already has this name: make sure you can tell them apart.",
    addFailed: "Could not add",
    participantAddFailedDescription: "The participant could not be created.",
    participantDeleted: "Participant deleted",
    deleteFailed: "Could not delete",
    exclusionExists: "Exclusion already defined",
    exclusionAdded: "Exclusion added",
    exclusionAddFailedDescription: "The exclusion could not be created.",
    exclusionDeleted: "Exclusion deleted",
    inclusionExists: "Restriction already defined",
    inclusionAdded: "Restriction added",
    inclusionAddFailedDescription: "The restriction could not be created.",
    inclusionDeleted: "Restriction deleted",
    drawFailed: "Draw impossible",
    drawFailedDescription:
      "No combination satisfies every rule. Remove some exclusions or loosen the restricted draws.",
    drawDone: "Draw complete",
    drawDoneDescription: (count: number) => `${count} assignment(s) generated.`,
    drawSaveFailed: "Could not save",
    drawSaveFailedDescription: "The draw was not saved.",
    drawReset: "Draw reset",
    drawResetFailed: "Could not reset",
    exportStarted: "Export started",
    exportParticipantsDescription: "The CSV file has been downloaded.",
    exportDrawsDescription: "The draw CSV file has been downloaded.",
    importFailed: "Import failed",
    importFailedDescription: "The file does not match the expected format.",
    importDone: "Import successful",
    importDoneDescription: (count: number) => `${count} participant(s) added.`,
    importReadFailed: "Could not read the file",
    importReadFailedDescription: "The CSV file could not be read.",
    copyFailed: "Could not copy",
    copyFailedDescription: "Your browser denied access to the clipboard.",
    messagesCopied: "Messages copied",
    messagesCopiedDescription: (count: number) =>
      `${count} message(s) are in your clipboard.`,
  },

  confirm: {
    deleteParticipantTitle: (name: string) => `Delete ${name}?`,
    deleteParticipantFallback: "this participant",
    linkedConstraints: (count: number) =>
      `${count} related rule(s) will be deleted as well.`,
    drawInvalidated: "The current draw will be invalidated.",
    irreversible: "This action cannot be undone.",
    resetDrawTitle: "Start the draw over?",
    resetDrawDescription:
      "The current assignments will be erased. Participants and rules are kept.",
    resetDrawConfirm: "Start over",
  },

  csv: {
    participantsFilename: "participants",
    drawsFilename: "draw",
    drawsHeader: "Drawer,Drawn",
    participantsHeader: "Name,Email,Group,Exclusions,Inclusions",
    message: (drawerName: string, drawnName: string) =>
      `Hi ${drawerName}!\n\nThe draw is done: you drew ${drawnName}.`,
  },
};

export const translations: Record<Language, Translation> = { fr, en };

export function isLanguage(value: unknown): value is Language {
  return value === "fr" || value === "en";
}

export function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
  }

  if (typeof navigator !== "undefined") {
    const preferred = navigator.languages?.[0] ?? navigator.language;
    if (preferred && !preferred.toLowerCase().startsWith("fr")) return "en";
  }

  return "fr";
}
