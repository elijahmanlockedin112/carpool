# Carpool Calendar

A shared week calendar for four people. You add your before-school and after-school
things; everyone else sees them. That's it.

**Live at <https://elijahmanlockedin112.github.io/carpool/>**

No frameworks, no build step, no npm.

## It's encrypted

The repo is public — that's what free GitHub Pages requires — so `schedule.json` is
encrypted (AES-256-GCM) before it's ever written. Anyone who wanders into the repo sees
this and nothing else:

```json
{ "v": 1, "iv": "VV239ec28G8y+6xV", "ct": "03vxhZHJ6bCR1rRuu7PvSRWuujrnqTcT…" }
```

No names, no times, no activities. The key never goes to GitHub — it lives in each
person's browser, put there once by their setup link. Opening the page without the key
shows a locked screen.

This is real encryption, not a JavaScript password box. A password check on a static
page is decoration; this isn't.

## Using it

Each weekday is a column, split into **Before school** and **After school**. Hit **+ Add**
on a day, pick who it's for, a start time and optionally an end time, and what it is.
Tick **Repeats every week** for standing things like practice.

Tap any event to change or delete it. Then hit **Save**. Everyone has a color.

## Setting up the other three

**1. Make a token** (once, you only). At
**github.com/settings/personal-access-tokens** → *Fine-grained token* → Repository
access: **Only select repositories** → `carpool` → Permissions → Repository permissions
→ **Contents: Read and write**. Nothing else.

**2. Set yourself up.** Open the site → gear → paste the token and
`elijahmanlockedin112/carpool` → pick your name → **Done**. Add an event and hit **Save**
so the file gets sealed.

**3. Send each of them a link.** Gear → **Copy setup link**. That link carries the repo,
the token, and the encryption key. They tap it once, pick their name, and they're in —
no GitHub account, nothing to type.

Send it **directly to each person**, not to a group chat. Anyone with the link can read
and edit the calendar. It rides in the URL's `#` fragment, which browsers never send to
any server, and the app wipes it out of the address bar on arrival — but it's still the
keys to the thing.

If a link gets loose: revoke the token on GitHub, then gear → Raw JSON → **Save** with a
fresh key (or just delete and remake the repo — it's a calendar). Send out new links.

## Day to day

Saving merges — it keeps everyone else's events as they are and only replaces yours, so
two people saving close together don't wipe each other out. Hit ↻ to pull the latest.
There's no push notification; opening the page always gets you current data.

To rename people: gear → **Raw JSON** → edit `"people"` → **Apply** → **Save**.

## Reading it outside the browser

```bash
node decrypt.js <key>
```

The key is the `k` value from a setup link. Pass a file path as a second argument to read
a local copy instead of the live one. This is also how you'd hand the calendar to Claude —
give it the key, or just paste the decrypted output.

`events` is a flat list. Each has `person`, `date` (`YYYY-MM-DD`), `when` (`before` or
`after` school), `time` (start, 24h), `end` (may be empty), `title`, and `repeat` (if
true, that weekday every week from `date` onward).

There is nothing in this file about who drives, and that's deliberate — don't infer or
suggest a driver.

## What encryption doesn't cover

- Anyone holding a setup link can read everything. Losing a phone means revoking.
- GitHub can see the file size and how often you commit — not the contents.
- The list of *names* lives inside the encrypted blob, so that's covered too.

Still worth telling Wesley and Crystal this lives on the internet before their schedules
go in, even encrypted.

## Files

```
index.html      the app
schedule.json   the encrypted calendar
decrypt.js      read it from the command line
.claude/        local preview helper, not published
```

Preview locally with `node .claude/serve.js` → <http://localhost:8777>.
