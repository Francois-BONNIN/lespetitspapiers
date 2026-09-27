export const fr = {
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
  },

  share: {
    action: "Partager",
    linkAction: "Copier un lien de partage",
    linkDescription:
      "Les participants, les règles et les paramètres, sans les résultats : à envoyer à qui organise avec vous.",
    fullLinkAction: "Copier un lien complet",
    fullLinkDescription:
      "Avec les résultats, pour passer sur un autre appareil. Toute personne qui l'ouvre peut voir qui a tiré qui.",
    fullLinkUnavailable: "Disponible une fois le tirage lancé.",
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
      "Tout est enregistré sur cet appareil uniquement. Pour garder une copie, copiez d'abord un lien de partage (bouton « Partager » en haut de la page).",
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
