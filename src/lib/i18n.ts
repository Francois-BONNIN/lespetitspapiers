
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
    drawStale: "Tirage à refaire",
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
    step: (step: number) => `Étape ${step} :`,
    notifications: "Notifications",
    closeNotification: "Fermer la notification",
    themeToLight: "Passer en thème clair",
    themeToDark: "Passer en thème sombre",
    themeLight: "Thème clair",
    themeDark: "Thème sombre",
  },

  participants: {
    title: "Qui participe ?",
    description: "Ajoutez chaque personne qui participe au tirage.",
    importAction: "Importer",
    importTitle: "Importer un fichier CSV de participants",
    shareAction: "Partager",
    shareLinkAction: "Copier un lien de partage",
    shareLinkDescription:
      "Les participants, les règles et les paramètres, sans les résultats : à envoyer à qui organise avec vous.",
    fullLinkAction: "Copier un lien complet",
    fullLinkDescription:
      "Avec les résultats, pour passer sur un autre appareil. Toute personne qui l'ouvre peut voir qui a tiré qui.",
    fullLinkUnavailable: "Disponible une fois le tirage lancé.",
    nameLabel: "Nom",
    namePlaceholder: "Camille Durand",
    groupLabel: "Groupe",
    groupPlaceholder: "Équipe A, Famille Durand…",
    groupHintSameGroup:
      "Les membres d'un même groupe ne se tireront pas entre eux : pratique pour un couple ou une famille.",
    groupHintFree:
      "Le groupe sert seulement à ranger la liste : la règle qui empêche ses membres de se tirer est désactivée (étape 2).",
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
    stepTitle: "Des règles à respecter ?",
    optional: "Facultatif",
    description:
      "Empêchez certaines personnes de se tirer, ou imposez qui tire qui.",
    configure: "Configurer",
    openLabel: "Configurer les règles du tirage",
    done: "Terminé",
    none: "Aucune règle : tout le monde peut tirer tout le monde.",
    summarySameGroup: "Même groupe exclu",
    summaryNoReciprocal: "Pas de tirage réciproque",
    summaryExclusions: (count: number) =>
      `${count} exclusion${count > 1 ? "s" : ""}`,
    summaryInclusions: (count: number) =>
      `${count} tirage${count > 1 ? "s" : ""} imposé${count > 1 ? "s" : ""}`,
    drawerLabel: "Qui tire",
    drawnLabel: "Qui est tiré",
  },

  exclusions: {
    title: "Exclusions",
    description:
      "Empêchez une personne d'en tirer une autre, par exemple deux personnes qui se connaissent trop bien. La règle ne joue que dans un sens.",
    sameGroupLabel: "Exclure automatiquement les membres d'un même groupe",
    sameGroupDescription:
      "Les participants partageant le même groupe ne pourront pas se tirer entre eux.",
    reciprocalLabel: "Éviter les tirages réciproques",
    reciprocalDescription:
      "Si Alex tire Sam, Sam ne pourra pas tirer Alex. Il faut au moins trois participants.",
    notEnoughTitle: "Pas encore assez de participants",
    notEnoughDescription:
      "Ajoutez au moins deux personnes pour pouvoir définir des exclusions.",
    connector: "ne tirera pas",
    emptyTitle: "Aucune exclusion définie",
    emptyDescription:
      "Le tirage reste entièrement libre entre tous les participants.",
    deleteLabel: "Supprimer cette exclusion",
  },

  inclusions: {
    title: "Tirages imposés",
    description:
      "Imposez qui tire qui : personne d'autre ne pourra tirer la personne choisie. Avec plusieurs tireurs pour la même personne, le hasard choisit entre eux.",
    notEnoughTitle: "Pas encore assez de participants",
    notEnoughDescription:
      "Ajoutez au moins deux personnes pour pouvoir imposer un tirage.",
    connector: "tirera",
    or: "ou",
    emptyTitle: "Aucun tirage imposé",
    emptyDescription: "Le hasard décide pour tout le monde.",
    deleteLabel: (drawer: string, drawn: string) =>
      `Supprimer « ${drawer} tirera ${drawn} »`,
  },

  draw: {
    title: "Tirage au sort",
    descriptionDone:
      "Les résultats restent masqués, pour que le tirage reste une surprise, même pour vous.",
    descriptionPending:
      "Lancez le tirage une fois vos participants et vos règles en place.",
    moreActions: "Plus d'actions",
    revealAll: "Tout révéler",
    revealAllDescription:
      "Affiche tous les résultats à l'écran : vous saurez qui a tiré qui.",
    hideAll: "Tout masquer",
    hideAllDescription: "Masque de nouveau tous les résultats.",
    copyAll: "Copier tous les messages",
    copyAllDescription:
      "Les messages de tout le monde, à la suite, dans le presse-papiers.",
    csv: "Télécharger en CSV",
    csvDescription: "La liste complète de qui tire qui.",
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
    resultInstructions:
      "Copiez le message de chaque personne et envoyez-le-lui, par SMS ou par e-mail. Il contient déjà le nom tiré : inutile de révéler les résultats.",
    resultInstructionsLink:
      "Copiez le message de chaque personne et envoyez-le-lui, par SMS ou par e-mail. Il contient un lien personnel qui ne révèle que son propre tirage.",
    staleTitle: "Ce tirage ne correspond plus",
    staleDescription:
      "Les participants ou les règles ont changé depuis. Relancez le tirage pour que tout le monde soit pris en compte.",
    redraw: "Relancer le tirage",
    revealResult: (name: string) => `Révéler le résultat de ${name}`,
    hideResult: (name: string) => `Masquer le résultat de ${name}`,
    reveal: "Révéler",
    hide: "Masquer",
    copyMessage: "Copier le message",
    copyMessageTitle: (name: string) => `Copier le message destiné à ${name}`,
    copied: "Copié",
    note: "Les résultats ne sont enregistrés que sur cet appareil : ouvrir le site ailleurs ne les montrera pas.",
  },

  settings: {
    open: "Paramètres",
    title: "Paramètres",
    description:
      "Personnalisez le message que chaque participant recevra avec son tirage.",
    eventTitle: "L'événement",
    eventHint:
      "Ces informations s'ajoutent au message. Laissez vide ce qui ne sert pas.",
    eventNameLabel: "Nom de l'événement",
    eventNamePlaceholder: "Noël 2026 chez les Durand",
    budgetLabel: "Budget",
    budgetPlaceholder: "20 €",
    dateLabel: "Date de l'échange",
    messageTitle: "Le message",
    deliveryLabel: "Chaque participant reçoit",
    deliveryMessage: "Son résultat dans le message",
    deliveryMessageDescription:
      "Le nom de la personne tirée est écrit directement dans le message.",
    deliveryLink: "Un lien personnel",
    deliveryLinkDescription:
      "Le message contient un lien qui ne révèle que son propre tirage, avec une petite animation. Les lignes qui citent la personne tirée sont retirées.",
    messageLabel: "Message envoyé à chaque participant",
    insertLabel: "Insérer :",
    insertTitle: (label: string) =>
      `Insérer « ${label} » à l'emplacement du curseur`,
    tokenLabels: {
      participant: "Participant",
      drawn: "Personne tirée",
      link: "Lien personnel",
      event: "Événement",
      budget: "Budget",
      date: "Date",
    },
    tokens: {
      participant: "participant",
      drawn: "personne_tirée",
      link: "lien",
      event: "événement",
      budget: "budget",
      date: "date",
    },
    messageHint:
      "Une ligne qui contient une information laissée vide (budget, date…) n'apparaît pas dans le message.",
    unknownPlaceholders: (placeholders: string[]) =>
      placeholders.length > 1
        ? `${placeholders.join(", ")} ne sont pas reconnus : ils apparaîtront tels quels dans le message. Utilisez les boutons « Insérer ».`
        : `${placeholders[0]} n'est pas reconnu : il apparaîtra tel quel dans le message. Utilisez les boutons « Insérer ».`,
    resetMessage: "Rétablir le message par défaut",
    previewTitle: "Aperçu",
    previewDescription: "Avec des prénoms d'exemple, pas ceux de votre tirage.",
    previewDrawer: "Camille",
    previewDrawn: "Sacha",
    defaultTemplate:
      "Bonjour {participant} !\n\nLe tirage au sort est fait : tu as tiré {personne_tirée}.\nLe tirage au sort est fait ! Découvre qui tu as tiré ici : {lien}\n\nÉvénement : {événement}\nBudget : {budget}\nÉchange prévu le {date}",
    dataTitle: "Données",
    dataDescription:
      "Tout est enregistré sur cet appareil uniquement. Pour garder une copie, copiez d'abord un lien de partage (étape 1, bouton « Partager »).",
    clearAll: "Tout effacer",
    autosave: "Les modifications sont enregistrées automatiquement.",
    done: "Terminé",
    customize: "Personnaliser le message",
  },

  reveal: {
    loading: "Ouverture de ton petit papier…",
    greeting: (name: string) => `Bonjour ${name} !`,
    intro: "Le tirage au sort est fait. Ton petit papier t'attend.",
    introEvent: (eventName: string) =>
      `Le tirage au sort « ${eventName} » est fait. Ton petit papier t'attend.`,
    open: "Déplier mon petit papier",
    youDrew: "Tu as tiré",
    budget: (budget: string) => `Budget : ${budget}`,
    exchange: (date: string) => `Échange prévu le ${date}`,
    drawnOn: (date: string) => `Tirage fait le ${date}.`,
    keepSecret:
      "Ce lien n'affiche que ton tirage. Garde le secret ! Si le tirage est relancé, tu recevras un nouveau lien : fie-toi au plus récent.",
    organize: "Organiser mon propre tirage",
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
    inclusionExists: "Tirage imposé déjà défini",
    inclusionAdded: "Tirage imposé ajouté",
    inclusionAddFailedDescription: "Le tirage imposé n'a pas pu être créé.",
    inclusionDeleted: "Tirage imposé supprimé",
    drawFailed: "Tirage impossible",
    drawFailedDescription:
      "Aucune combinaison ne respecte toutes les règles. Retirez une exclusion ou un tirage imposé, ou désactivez une option.",
    drawDone: "Tirage effectué",
    drawDoneDescription: (count: number) => `${count} attribution(s) générée(s).`,
    drawSaveFailed: "Enregistrement impossible",
    drawSaveFailedDescription: "Le tirage n'a pas été sauvegardé.",
    drawReset: "Tirage réinitialisé",
    drawResetFailed: "Réinitialisation impossible",
    exportStarted: "Export lancé",
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
    shareCopied: "Lien de partage copié",
    shareCopiedDescription:
      "Participants, règles et paramètres, sans les résultats. Si vous modifiez quelque chose, copiez un nouveau lien.",
    fullLinkCopied: "Lien complet copié",
    fullLinkCopiedDescription:
      "Il contient les résultats : ne l'envoyez qu'à qui organise avec vous. Après une modification, copiez-en un nouveau.",
    shareFailed: "Création du lien impossible",
    sharedLoaded: "Tirage partagé chargé",
    sharedLoadedDescription: (count: number) =>
      `${count} participant(s) récupéré(s) depuis le lien.`,
    sharedLoadedWithDrawDescription: (count: number) =>
      `${count} participant(s) et le résultat du tirage récupérés. Les résultats restent masqués.`,
    sharedInvalid: "Lien de partage invalide",
    sharedInvalidDescription:
      "Le lien est incomplet ou abîmé : demandez-en un nouveau.",
    allCleared: "Tout a été effacé",
    clearAllFailed: "Effacement impossible",
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
    redrawTitle: "Relancer le tirage ?",
    redrawDescription:
      "Le tirage actuel sera remplacé. Les messages et les liens personnels déjà envoyés ne seront plus valables.",
    redrawConfirm: "Relancer",
    clearAllTitle: "Tout effacer ?",
    clearAllDescription:
      "Les participants, les règles, le tirage et les paramètres seront supprimés de cet appareil. Cette action est définitive.",
    clearAllConfirm: "Tout effacer",
    openSharedTitle: "Ouvrir le tirage partagé ?",
    openSharedDescription: (participants: number, rules: number) =>
      `Ce lien contient ${participants} participant(s) et ${rules} règle(s). Ils remplaceront vos participants, vos règles, vos paramètres et votre tirage actuels.`,
    openSharedWithDrawDescription: (participants: number, rules: number) =>
      `Ce lien contient ${participants} participant(s), ${rules} règle(s) et le résultat du tirage. Ils remplaceront vos participants, vos règles, vos paramètres et votre tirage actuels.`,
    openSharedConfirm: "Remplacer",
  },

  csv: {
    drawsFilename: "tirage",
    drawsHeader: "Tireur,Tiré",
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
    drawStale: "Draw out of date",
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
    step: (step: number) => `Step ${step}:`,
    notifications: "Notifications",
    closeNotification: "Dismiss notification",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    themeLight: "Light theme",
    themeDark: "Dark theme",
  },

  participants: {
    title: "Who's taking part?",
    description: "Add everyone taking part in the draw.",
    importAction: "Import",
    importTitle: "Import a CSV file of participants",
    shareAction: "Share",
    shareLinkAction: "Copy a share link",
    shareLinkDescription:
      "The participants, the rules and the settings, without the results: send it to whoever is organising with you.",
    fullLinkAction: "Copy a full link",
    fullLinkDescription:
      "With the results, to move to another device. Anyone who opens it can see who drew whom.",
    fullLinkUnavailable: "Available once the draw has been run.",
    nameLabel: "Name",
    namePlaceholder: "Alex Morgan",
    groupLabel: "Group",
    groupPlaceholder: "Team A, Morgan family…",
    groupHintSameGroup:
      "Members of the same group won't draw each other: handy for a couple or a family.",
    groupHintFree:
      "The group only organises the list: the rule that stops its members from drawing each other is off (step 2).",
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
    stepTitle: "Any rules to follow?",
    optional: "Optional",
    description:
      "Stop some people from drawing each other, or decide who draws whom.",
    configure: "Configure",
    openLabel: "Configure the draw rules",
    done: "Done",
    none: "No rules: anyone can draw anyone.",
    summarySameGroup: "Same group excluded",
    summaryNoReciprocal: "No reciprocal draws",
    summaryExclusions: (count: number) =>
      `${count} exclusion${count > 1 ? "s" : ""}`,
    summaryInclusions: (count: number) =>
      `${count} forced draw${count > 1 ? "s" : ""}`,
    drawerLabel: "Who draws",
    drawnLabel: "Who is drawn",
  },

  exclusions: {
    title: "Exclusions",
    description:
      "Stop one person from drawing another, for example two people who know each other far too well. The rule only works one way.",
    sameGroupLabel: "Automatically exclude members of the same group",
    sameGroupDescription:
      "Participants who share a group will not be able to draw each other.",
    reciprocalLabel: "Avoid reciprocal draws",
    reciprocalDescription:
      "If Alex draws Sam, Sam won't be able to draw Alex. Needs at least three participants.",
    notEnoughTitle: "Not enough participants yet",
    notEnoughDescription: "Add at least two people before defining exclusions.",
    connector: "won't draw",
    emptyTitle: "No exclusions defined",
    emptyDescription:
      "The draw stays completely open between all participants.",
    deleteLabel: "Delete this exclusion",
  },

  inclusions: {
    title: "Forced draws",
    description:
      "Decide who draws whom: nobody else will be able to draw the chosen person. With several drawers for the same person, chance picks between them.",
    notEnoughTitle: "Not enough participants yet",
    notEnoughDescription: "Add at least two people before forcing a draw.",
    connector: "will draw",
    or: "or",
    emptyTitle: "No forced draws",
    emptyDescription: "Chance decides for everyone.",
    deleteLabel: (drawer: string, drawn: string) =>
      `Delete “${drawer} will draw ${drawn}”`,
  },

  draw: {
    title: "Random draw",
    descriptionDone:
      "Results stay hidden, so the draw stays a surprise, even for you.",
    descriptionPending:
      "Run the draw once your participants and your rules are in place.",
    moreActions: "More actions",
    revealAll: "Reveal all",
    revealAllDescription:
      "Shows every result on screen: you will know who drew whom.",
    hideAll: "Hide all",
    hideAllDescription: "Hides every result again.",
    copyAll: "Copy all messages",
    copyAllDescription:
      "Everyone's messages, one after the other, in your clipboard.",
    csv: "Download as CSV",
    csvDescription: "The full list of who draws whom.",
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
    resultInstructions:
      "Copy each person's message and send it to them by text or email. It already contains the name they drew: no need to reveal the results.",
    resultInstructionsLink:
      "Copy each person's message and send it to them by text or email. It contains a personal link that reveals only their own draw.",
    staleTitle: "This draw is out of date",
    staleDescription:
      "Participants or rules have changed since. Run the draw again so everyone is taken into account.",
    redraw: "Run the draw again",
    revealResult: (name: string) => `Reveal the result for ${name}`,
    hideResult: (name: string) => `Hide the result for ${name}`,
    reveal: "Reveal",
    hide: "Hide",
    copyMessage: "Copy message",
    copyMessageTitle: (name: string) => `Copy the message for ${name}`,
    copied: "Copied",
    note: "Results are only saved on this device: opening the site elsewhere won't show them.",
  },

  settings: {
    open: "Settings",
    title: "Settings",
    description:
      "Customise the message each participant will receive with their draw.",
    eventTitle: "The event",
    eventHint:
      "These details are added to the message. Leave empty whatever you don't need.",
    eventNameLabel: "Event name",
    eventNamePlaceholder: "Christmas 2026 at the Morgans'",
    budgetLabel: "Budget",
    budgetPlaceholder: "$20",
    dateLabel: "Exchange date",
    messageTitle: "The message",
    deliveryLabel: "Each participant receives",
    deliveryMessage: "Their result in the message",
    deliveryMessageDescription:
      "The name of the person drawn is written straight into the message.",
    deliveryLink: "A personal link",
    deliveryLinkDescription:
      "The message holds a link that reveals only their own draw, with a small animation. Lines naming the person drawn are left out.",
    messageLabel: "Message sent to each participant",
    insertLabel: "Insert:",
    insertTitle: (label: string) => `Insert “${label}” at the cursor`,
    tokenLabels: {
      participant: "Participant",
      drawn: "Person drawn",
      link: "Personal link",
      event: "Event",
      budget: "Budget",
      date: "Date",
    },
    tokens: {
      participant: "participant",
      drawn: "drawn_person",
      link: "link",
      event: "event",
      budget: "budget",
      date: "date",
    },
    messageHint:
      "A line containing a detail left empty (budget, date…) is left out of the message.",
    unknownPlaceholders: (placeholders: string[]) =>
      placeholders.length > 1
        ? `${placeholders.join(", ")} are not recognised and will appear as is in the message. Use the “Insert” buttons.`
        : `${placeholders[0]} is not recognised and will appear as is in the message. Use the “Insert” buttons.`,
    resetMessage: "Restore the default message",
    previewTitle: "Preview",
    previewDescription: "With example names, not the ones from your draw.",
    previewDrawer: "Alex",
    previewDrawn: "Robin",
    defaultTemplate:
      "Hi {participant}!\n\nThe draw is done: you drew {drawn_person}.\nThe draw is done! Find out who you drew here: {link}\n\nEvent: {event}\nBudget: {budget}\nExchange on {date}",
    dataTitle: "Data",
    dataDescription:
      "Everything is saved on this device only. To keep a copy, first copy a share link (step 1, “Share” button).",
    clearAll: "Erase everything",
    autosave: "Changes are saved automatically.",
    done: "Done",
    customize: "Customise the message",
  },

  reveal: {
    loading: "Opening your paper slip…",
    greeting: (name: string) => `Hi ${name}!`,
    intro: "The draw is done. Your paper slip is waiting for you.",
    introEvent: (eventName: string) =>
      `The “${eventName}” draw is done. Your paper slip is waiting for you.`,
    open: "Unfold my paper slip",
    youDrew: "You drew",
    budget: (budget: string) => `Budget: ${budget}`,
    exchange: (date: string) => `Exchange on ${date}`,
    drawnOn: (date: string) => `Drawn on ${date}.`,
    keepSecret:
      "This link only shows your own draw. Keep it secret! If the draw is run again, you'll get a new link: trust the most recent one.",
    organize: "Organise my own draw",
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
    inclusionExists: "Forced draw already defined",
    inclusionAdded: "Forced draw added",
    inclusionAddFailedDescription: "The forced draw could not be created.",
    inclusionDeleted: "Forced draw deleted",
    drawFailed: "Draw impossible",
    drawFailedDescription:
      "No combination satisfies every rule. Remove an exclusion or a forced draw, or turn off an option.",
    drawDone: "Draw complete",
    drawDoneDescription: (count: number) => `${count} assignment(s) generated.`,
    drawSaveFailed: "Could not save",
    drawSaveFailedDescription: "The draw was not saved.",
    drawReset: "Draw reset",
    drawResetFailed: "Could not reset",
    exportStarted: "Export started",
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
    shareCopied: "Share link copied",
    shareCopiedDescription:
      "Participants, rules and settings, without the results. If you change anything, copy a new link.",
    fullLinkCopied: "Full link copied",
    fullLinkCopiedDescription:
      "It contains the results: only send it to whoever is organising with you. After any change, copy a new one.",
    shareFailed: "Could not create the link",
    sharedLoaded: "Shared draw loaded",
    sharedLoadedDescription: (count: number) =>
      `${count} participant(s) loaded from the link.`,
    sharedLoadedWithDrawDescription: (count: number) =>
      `${count} participant(s) and the draw result loaded. The results stay hidden.`,
    sharedInvalid: "Invalid share link",
    sharedInvalidDescription:
      "The link is incomplete or damaged: ask for a new one.",
    allCleared: "Everything has been erased",
    clearAllFailed: "Could not erase",
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
    redrawTitle: "Run the draw again?",
    redrawDescription:
      "The current draw will be replaced. Messages and personal links already sent will no longer be valid.",
    redrawConfirm: "Run again",
    clearAllTitle: "Erase everything?",
    clearAllDescription:
      "Participants, rules, the draw and the settings will be deleted from this device. This action cannot be undone.",
    clearAllConfirm: "Erase everything",
    openSharedTitle: "Open the shared draw?",
    openSharedDescription: (participants: number, rules: number) =>
      `This link contains ${participants} participant(s) and ${rules} rule(s). They will replace your current participants, rules, settings and draw.`,
    openSharedWithDrawDescription: (participants: number, rules: number) =>
      `This link contains ${participants} participant(s), ${rules} rule(s) and the draw result. They will replace your current participants, rules, settings and draw.`,
    openSharedConfirm: "Replace",
  },

  csv: {
    drawsFilename: "draw",
    drawsHeader: "Drawer,Drawn",
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
