# Carpool Calendar

A shared week calendar for four people. You add your before-school and after-school
things; everyone else sees them. That's it.

No frameworks, no build step. Two files: `index.html` and `schedule.json`.

## Using it

Each weekday is a column, split into **Before school** and **After school**. Hit **+ Add**
on a day, pick who it's for, a start time and optionally an end time, and what it is.
Tick **Repeats every week** for standing things like practice — it'll show up on that
weekday from then on.

Tap any event to change or delete it. Then hit **Save**.

Everyone gets a color, so you can scan a column and see whose is whose.

## How the others see it

**Viewing is the easy half.** Once Pages is on, the site lives at
`https://YOURNAME.github.io/carpool/`. Anyone with that link opens it — no GitHub
account, no login, no app install, any phone. Send them the link, tell them to Add to
Home Screen, done. The page re-fetches every time it opens, so opening it is always
current. (There's no push — if it's already open, hit ↻ to pull in new stuff.)

**Adding is the part that needs a decision.** Saving means writing to the repo, and
that needs write access. Two ways to give it to them:

**Option A — one shared token (easiest, and what the app is set up for).**
Make a single fine-grained token and send the other three a setup link. They never need
a GitHub account.

- Make the token at **github.com/settings/personal-access-tokens** → *Fine-grained token*
- Repository access: **Only select repositories** → `carpool`
- Permissions → Repository permissions → **Contents: Read and write**. Nothing else.
- Open the site → gear → paste the token and `YOURNAME/carpool` → **Done**
- Open the gear again → **Copy setup link** → send it to each of the other three

They tap the link once. It fills in the repo and token, wipes itself out of the address
bar, and asks them to pick their name. That's their whole setup.

Send that link **directly to each person**, not to a group chat or anywhere it gets
forwarded — it contains the token, so whoever holds it can edit the calendar. (It's in
the URL's `#` fragment, which browsers never transmit to any server, but it's still the
token.) If it gets loose, revoke the token on the GitHub page above and send a new link.

What you're accepting: anyone holding that token can edit that one file in that one
repo, and nothing else — it can't touch your other repos or your account. If a phone
gets lost, revoke it on that page and hand out a new one. Every commit will show as
your account, but each event records who it belongs to, so you can still tell who
added what.

**Option B — everyone gets their own.** Add the other three as repo collaborators
(Settings → Collaborators; free on public repos), and each makes their own token the
same way. More setup, but commits are properly attributed and you can revoke one person
without disrupting the rest.

**Without any token**, Save copies the JSON to the clipboard and you paste it into
`schedule.json` on GitHub by hand. That still needs a GitHub account with write access,
so it's a fallback, not a way around the above.

## Setup

**1.** Make a GitHub repo called `carpool`. Upload `index.html` and `schedule.json`.

**2.** Repo → **Settings** → **Pages** → Source: *Deploy from a branch*, Branch: `main`,
folder `/ (root)`. A minute later it's live.

**3.** Set yourself up (gear → repo + token → Done), then send everyone else a
**Copy setup link** link. They tap it and pick their name.

Saving merges: it keeps everyone else's events as they are on GitHub and only replaces
yours, so two people saving close together don't wipe each other out.

To rename people: gear → **Raw JSON** → edit `"people"` → **Apply** → **Save**.

## For Claude

Fetch `https://raw.githubusercontent.com/YOURNAME/carpool/main/schedule.json`.

`events` is a flat list. Each one has:

| field | meaning |
|---|---|
| `person` | who it belongs to |
| `date` | `YYYY-MM-DD` |
| `when` | `before` or `after` school |
| `time` | start, 24h `HH:MM` |
| `end` | end time, 24h — may be empty |
| `title` | what it is |
| `repeat` | if true, happens that weekday every week from `date` onward |

This file records schedules only — there's nothing in it about who drives, and that's
deliberate. Don't infer or suggest a driver.

## One thing to know

GitHub Pages is static hosting, so a password on the page can't actually protect
anything — any JS check is visible in the page source. Pages from a private repo needs
a paid plan, so the repo is public and this file is readable by anyone with the URL.

Fine for first names, activity labels, and times. Keep the school name, addresses, and
phone numbers out of it. Worth telling Wesley and Crystal it's a public page before
their stuff goes in.

## Files

```
index.html      the app
schedule.json   the data
.claude/        local preview helper, don't upload
```

Preview locally with `node .claude/serve.js` → <http://localhost:8777>.
