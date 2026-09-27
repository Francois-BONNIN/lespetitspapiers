import type { Translation } from "./fr";

export const en: Translation = {
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
  },

  share: {
    action: "Share",
    linkAction: "Copy a share link",
    linkDescription:
      "The participants, the rules and the settings, without the results: send it to whoever is organising with you.",
    fullLinkAction: "Copy a full link",
    fullLinkDescription:
      "With the results, to move to another device. Anyone who opens it can see who drew whom.",
    fullLinkUnavailable: "Available once the draw has been run.",
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
      "Everything is saved on this device only. To keep a copy, first copy a share link (“Share” button at the top of the page).",
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
