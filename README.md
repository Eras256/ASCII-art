# Community ASCII Art

```
        .-""""""-.
      .'          '.
     /    __||__    \
    |    /  ||  \    |
    |    \__||__     |      A community gallery of ASCII art about
    |       ||  \    |      payments, finance, and tech.
    |    \__||__/    |
     \      ||      /       Made of plain text, one character at a time.
      '.          .'
        '-......-'
```

This repo collects ASCII art made by the community. Coins, wallets, robots, charts, terminals, and anything else from the world of **payments, finance, and tech**. It's October soon, so we also have a **Halloween** category for spooky takes on the same themes.

**[Browse the gallery →](https://interledger.github.io/ASCII-art/)**

Anyone can contribute. You don't need to be an artist or a developer. If you can type characters into a text file and open a pull request, you're in. This README explains everything else.

---

## Table of contents

- [What we're looking for](#what-were-looking-for)
- [The Halloween edition](#the-halloween-edition)
- [Repository structure](#repository-structure)
- [The gallery website](#the-gallery-website)
- [How to submit your art](#how-to-submit-your-art)
- [File format](#file-format)
- [The rules](#the-rules)
- [Checking your submission](#checking-your-submission)
- [Tips for making ASCII art](#tips-for-making-ascii-art)
- [What happens after you open a PR](#what-happens-after-you-open-a-pr)
- [FAQ](#faq)
- [Code of conduct](#code-of-conduct)
- [License](#license)

---

## What we're looking for

Every piece goes into one of four categories. Each category is a folder inside `art/`.

| Category | Folder | Ideas to get you started |
| --- | --- | --- |
| **Payments** | `art/payments/` | coins, wallets, credit cards, receipts, cash registers, a payment going from A to B, QR codes, piggy banks, tip jars |
| **Finance** | `art/finance/` | charts going up (or down), banks, vaults, calculators, money bags, a very serious accountant, bulls and bears |
| **Tech** | `art/tech/` | robots, laptops, terminals, servers, keyboards, circuit boards, rockets, networks of connected nodes |
| **Halloween** | `art/halloween/` | any of the above, but spooky. See [below](#the-halloween-edition) |

Not sure which category fits? Pick the closest one and mention it in your PR. We can move it for you.

Want a category that doesn't exist yet? [Open an issue](../../issues/new) and suggest it before you open the PR.

## The Halloween edition

Take something from payments, finance, or tech and give it a spooky twist. Some ideas:

- a jack-o'-lantern with `$` for eyes
- a ghost haunting your bank statement (the Ghost of Hidden Fees, maybe)
- a vampire robot, a zombie laptop, a mummy wrapped in receipts
- a haunted ATM that only gives out candy
- bats flying out of a wallet
- a skeleton still waiting for a payment to clear

Keep it **family-friendly**. Spooky, silly, and eerie are all great. Gore and anything graphic are not.

Halloween pieces go in `art/halloween/`, even if they could also fit another category.

## Repository structure

```
.
├── README.md                    <- you are here
├── TEMPLATE.txt                 <- copy this to start your submission
├── art/
│   ├── payments/
│   │   ├── dollar-coin--bibschan.txt
│   │   └── wallet--bibschan.txt
│   ├── finance/
│   │   └── stonks--bibschan.txt
│   ├── tech/
│   │   ├── pay-bot--bibschan.txt
│   │   └── terminal-payment--bibschan.txt
│   └── halloween/
│       ├── jack-o-coin--bibschan.txt
│       └── hidden-fees-ghost--bibschan.txt
├── site/                        <- the gallery website (HTML, CSS, JS)
├── scripts/
│   ├── validate.py              <- checks your file follows the rules
│   └── build_site.py            <- turns art/ into site/art.json for the gallery
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        ├── validate.yml         <- runs validate.py on every PR
        └── pages.yml            <- publishes the gallery when main changes
```

Browse the files in `art/` for examples of finished submissions.

## The gallery website

Every piece in `art/` shows up automatically on the [gallery website](https://interledger.github.io/ASCII-art/). You can filter by category, search, open a piece full size, and copy it to your clipboard. When a PR is merged into `main`, a GitHub Action rebuilds and publishes the site. You don't need to touch anything in `site/` to submit art.

To preview the gallery on your own computer, including your new piece:

```bash
python3 scripts/build_site.py
python3 -m http.server 8000 -d site
```

Then open <http://localhost:8000>.

## How to submit your art

Submissions happen through **pull requests (PRs)**. If you've never opened one before, that's fine. Here's the whole process step by step.

### Option A: Entirely in your browser (no installs)

1. **Go to the right folder** in this repo, for example `art/tech/`.
2. **Create a file.** Click **Add file → Create new file**.
3. **Name it** `your-piece-name--your-github-handle.txt`, for example `haunted-atm--octocat.txt`. See [File format](#file-format) for the naming rules.
4. **Paste in the header and your art.** Start from [`TEMPLATE.txt`](TEMPLATE.txt). Switch to the **Preview** tab to check the alignment. GitHub's editor uses a monospace font, so what you see is what you get.
5. **Commit the file.** Click **Commit changes**, choose "Create a new branch" if asked, and give the branch a name like `add-haunted-atm`.
6. **Open a pull request.** GitHub will prompt you to. Fill out the checklist in the PR description.

### Option B: With git on your computer

```bash
# 1. Clone the repo
git clone https://github.com/interledger/ASCII-art.git
cd ASCII-art

# 2. Create a branch
git checkout -b add-haunted-atm

# 3. Copy the template into the right category folder
cp TEMPLATE.txt art/halloween/haunted-atm--<your-github-handle>.txt

# 4. Edit the file in your favorite editor, then check it
python3 scripts/validate.py

# 5. Commit and push
git add art/halloween/haunted-atm--<your-github-handle>.txt
git commit -m "Add haunted ATM (halloween)"
git push origin add-haunted-atm
```

Then open a pull request from your branch on GitHub.

### Submitting more than one piece?

Go for it. You can add several files in one PR, or open one PR per piece. One file per piece either way.

## File format

### Where it goes

```
art/<category>/<piece-name>--<github-handle>.txt
```

- `<category>` is one of `payments`, `finance`, `tech`, `halloween`.
- `<piece-name>` is **lowercase letters, numbers, and dashes only**, like `piggy-bank` or `robot-2000`.
- Two dashes (`--`) separate the piece name from your handle.
- `<github-handle>` is your GitHub username, without the `@`.
- The file extension must be `.txt`.

Adding your handle to the filename means two people can both submit a `robot` without clashing.

| ✅ Good | ❌ Not quite |
| --- | --- |
| `art/payments/piggy-bank--octocat.txt` | `art/payments/Piggy Bank.txt` (spaces, caps, no handle) |
| `art/tech/robot-2000--octocat.txt` | `art/tech/robot_2000--octocat.txt` (underscore) |
| `art/halloween/haunted-atm--octocat.txt` | `art/haunted-atm--octocat.txt` (no category folder) |

### What goes inside

Each file has a short **header**, then a line with exactly `---`, then **your art**:

```
Title: Pay-Bot 3000
Artist: @octocat
Category: tech
Description: A friendly robot with a coin slot where its heart should be.
---
         [ ]
          |
     .---------.
     |  O   O  |
     |    ^    |
     |  \___/  |
     '---------'
```

| Field | Required? | What to put |
| --- | --- | --- |
| `Title` | Yes | The name of your piece |
| `Artist` | Yes | Your GitHub handle with an `@`. Must match the handle in the filename |
| `Category` | Yes | Must match the folder the file is in |
| `Description` | No | One short sentence. If you adapted someone else's work, credit them here |

## The rules

1. **Themed.** Your piece relates to payments, finance, or tech (or a Halloween take on one of them).
2. **Plain ASCII only.** Use the characters on a standard US keyboard: letters, numbers, spaces, and `` ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~ ``. No emoji, no box-drawing characters (`┌─┐`), no accented letters, no other Unicode.
3. **Spaces, not tabs.** Tabs show up at different widths in different editors and will break your alignment.
4. **Max 80 characters wide.** This includes the header lines. 80 columns is the classic terminal width, so your art shows up properly everywhere.
5. **Max 40 lines tall** (just the art, not counting the header).
6. **No trailing spaces** at the end of lines. They're invisible and they don't change how your art looks.
7. **One piece per file.**
8. **Original work.** Make it yourself. If you're adapting someone else's piece, you need their permission and you must credit them in the `Description`. Don't submit art copied from elsewhere on the internet.
9. **Family-friendly.** Nothing offensive, hateful, or graphic. That goes for Halloween too.
10. **No real brands or logos.** Draw a generic credit card, not a specific bank's card. This keeps us clear of trademark issues.

## Checking your submission

A script checks every rule it can check automatically: file location, filename, header, width, height, characters, tabs, and trailing spaces. It runs automatically on every pull request. You can also run it yourself first (you need Python 3, which comes installed on macOS and most Linux systems):

```bash
python3 scripts/validate.py
```

To check just your own file:

```bash
python3 scripts/validate.py art/tech/robot-2000--octocat.txt
```

When everything passes, you'll see:

```
ok   art/tech/robot-2000--octocat.txt

1 passed, 0 failed
```

When something needs fixing, the script tells you exactly what and where:

```
FAIL art/tech/robot-2000--octocat.txt
  - line 9 is 84 characters wide (max 80)
  - line 12 contains a tab; use spaces instead
```

If the check fails on your PR, don't worry. Fix the file, push again, and the check re-runs.

## Tips for making ASCII art

- **Use a monospace font.** Every character must take up the same width, or your alignment will look off. Code editors (VS Code, Sublime, Notepad++, even GitHub's web editor) use one by default. Word processors like Google Docs or Word do not, so avoid them.
- **Start with the outline**, then add detail. Useful building blocks:
  - curves: `.-'` `'-.` `(` `)` `/` `\`
  - flat edges: `_` for bottoms, `-` for middles, `=` for thicker lines
  - corners: `.` for top corners, `'` for bottom corners, or `+` for sharp ones
  - shading, light to dark: `. : - = + * # % @`
- **Symmetry is your friend.** For round things like coins, count the columns on each side of the center and keep them equal.
- **Check the result** in a terminal (`cat your-file.txt`) or in the GitHub preview. Something that looks fine in one editor can drift if tabs sneak in.
- **Smaller is often better.** A 10-line coin with clean lines beats a 40-line coin that's hard to read.
- **Backslashes are fine.** Unlike code, `.txt` files don't need escaping. A `\` is a `\`.

## What happens after you open a PR

1. **Automated check.** The validation script runs on your PR within a minute or two. A green check means it passed.
2. **Human review.** A maintainer will look at your piece, check that it fits the theme and the rules, and may suggest small tweaks.
3. **Merge.** Once it's approved, we merge it and your art appears on the [gallery website](https://interledger.github.io/ASCII-art/) a few minutes later. 🎉

We try to review PRs within a few days. During busy stretches (hello, October) it may take a bit longer, but we'll get to yours.

## FAQ

**Can I submit art I generated with a tool (like an image-to-ASCII converter)?**
We prefer hand-made pieces. If you used a tool, say so in your PR, and make sure the result is clearly readable and follows all the rules.

**Can I use color?**
No. ASCII art here is plain text only, so no ANSI color codes.

**Can I include text in my art, like a speech bubble?**
Yes. See [`hidden-fees-ghost--bibschan.txt`](art/halloween/hidden-fees-ghost--bibschan.txt) for an example.

**Can I update my piece after it's merged?**
Yes. Open a new PR that edits your file.

**Can I edit someone else's piece?**
Please don't change other people's art. If you spot a problem, like a broken line, open an issue or leave a comment instead.

**The check says my Artist doesn't match my filename.**
The part after `--` in the filename must be the same as your `Artist` handle without the `@`. For example, `robot--octocat.txt` needs `Artist: @octocat`.

**My art looks misaligned on GitHub but fine in my editor.**
You almost certainly have tabs in your file. Run the validation script and it will point out the lines. Replace each tab with spaces.

## Code of conduct

Be kind. This is a playful, beginner-friendly space. Give feedback on art the way you'd want feedback on yours, welcome first-time contributors, and remember that everyone started somewhere. Maintainers may close PRs or issues that aren't in that spirit.

## License

By submitting a pull request, you agree that your contribution is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Anyone can share and adapt the art, as long as they credit the artist. Your name stays on your work through the `Artist` field.

```
          |
     .---------.
     |  O   O  |     Thanks for contributing!
     |    ^    |
     |  \___/  |
     '---------'
```
