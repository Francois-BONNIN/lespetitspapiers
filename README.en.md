# 🎟️ Les Petits Papiers

**The paper-slip draw, online.** Add your participants, set your rules, run the
draw. No data ever leaves your browser.

_[Version française](README.md)_

### [→ Visit "Les Petits Papiers"](https://lespetitspapiers.up.railway.app/)

---

## The idea

You know the ritual: everyone's name on a scrap of paper, folded, shaken up in a
hat — and someone always ends up drawing themselves. So you start over. Then you
remember that Sam and Jamie are a couple, that they're already buying each other
a present, and that it would be better to avoid it. So you start over again.

Les Petits Papiers does exactly the same thing, except the hat knows the rules.

## In three steps

**1. Add the participants.** A first name is enough. The group ("Morgan
family", "Team A"…) is optional: its members won't draw each other, unless you
turn that rule off.

**2. Set your rules, if you need them.** Two kinds of rules, to combine as you
like:

- **exclusions**: _Alex won't draw Sam._ As many rules as you need. One
  checkbox covers the most common case in a single click: stop members of the
  same group from drawing each other. Another avoids reciprocal draws: if Alex
  draws Sam, Sam won't draw Alex.
- **forced draws**: _Alex or Jamie will draw Robin._ Nobody else can draw
  Robin. Handy when a gift is going in together, or when a child should land on
  an adult.

**3. Run the draw.** The assignment satisfies every rule at once. If your
constraints make a valid draw impossible, the app tells you so instead of
handing you a half-broken result.

## Results stay secret

This is the awkward part of any draw someone has to organise: the person
pressing the button shouldn't get to see everything.

Results appear **hidden by default**. You reveal one line at a time, only when
you need to. And for each participant, a button copies a ready-written message —
recipient's name included — that you just paste into a text or an email. Everyone
finds out who they drew without ever seeing the full list.

Even more discreet: in the settings, choose to send **a personal link** instead of
the name. The message then only holds a link. Opening it, each participant unfolds
their paper slip and finds out who they drew, along with the budget and exchange
date. The link contains only their own pair: even if forwarded, it reveals nothing
about anyone else.

## Your data stays with you

No account to create. No password. No server storing your guest lists.

Everything is saved in your browser's local storage. Names, groups, rules and
results are never sent anywhere — there simply is no database at the other end.

What that means in practice:

- The draw lives **on the device where you made it**. Opening the site on your
  phone will not show you the list you created on your computer. To move it, use a
  share link (see below).
- Clearing your browsing data erases the draw. To keep it or pass it on, copy a
  share link.
- To start from scratch, the "Erase everything" button in the settings deletes
  participants, rules, the draw and the settings in one go.
- In private browsing, saving is sometimes blocked by the browser. If so, a
  banner warns you as soon as you open the page, before you have typed anything.

## Sharing, import and export

The "Share" button offers two links, with no server involved: everything fits in
the address itself.

- **The share link** holds the participants, the rules and the settings, never
  the results. You can send it to whoever is organising with you.
- **The full link** adds the draw result, to move to another device. Be careful
  who you send it to: anyone who opens it can see who drew whom.

A link reflects things as they are when you copy it: after any change, copy a new
one.

Got a long list to type in? Import a CSV file: names, groups, exclusions
and forced draws all come across in one go.

Column headers are recognised in English as well as French ("Name" or "Nom",
"Group" or "Groupe"…).

Going the other way, the result of the draw can be downloaded as CSV.

## Also in the box

- ✉️ A **customisable message** in the settings: event name, budget, exchange date
  and the wording itself, with a live preview.
- 🇫🇷 🇬🇧 **French and English**, switchable at any time. The starting language
  follows your browser's.
- 🌙 **Light and dark themes**, matching your system preference by default.
- 📱 **From phone to large screen**, with no app to install.
- 🔍 A **search** through the list, and participants **grouped by group** with a
  colour code, to keep your bearings as the table grows.
- ♿ Keyboard navigation and labels written with screen readers in mind.

## Frequently asked questions

**Is it free?**
Yes, and there's no sign-up.

**How many participants can I have?**
There's no set limit, and the draw stays near-instant even for a big gathering.

**Does it work for anything other than a Secret Santa?**
Yes. Nothing about it is specific to Christmas: splitting up chores, pairing
reviewers, assigning topics, "who brings what" — anything you'd draw lots for
with a few rules attached.

**What if the draw turns out to be impossible?**
If the app can't find a combination that satisfies all of your rules, it says so
plainly rather than cobbling together a result. That usually means one exclusion
too many: remove one and run it again.

---

<sub>Les Petits Papiers is an open web app built with React, TypeScript and
Tailwind CSS. It runs entirely in the browser.</sub>
