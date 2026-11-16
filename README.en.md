<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/banner-escuro.png">
    <img src="docs/assets/brand/banner-claro.png" alt="Emulador Report: performance reports edited right on the page. Real screens of the emulators with fictional data." width="100%">
  </picture>
</p>

<p align="center">
  <a href="README.md">Português</a> · <b>English</b>
</p>

<p align="center">
  <a href="#video-walkthroughs">Videos</a> ·
  <a href="#gallery">Gallery</a> ·
  <a href="docs/demo/">Interactive demo</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#my-role">My role</a> ·
  <a href="#documentation">Documentation</a>
</p>

# Emulador Report

**The monthly marketing performance report, edited right on the page and turned into an executive email ready for Outlook. No code, nothing to install.**

Two emulators, one for **PF** (consumer banking) and one for **PJ** (business banking). They grew out of a real reporting need. Every month the team had to update a report full of campaigns, KPIs, creatives and videos, keep each segment's visual identity, and send leadership a summary they would actually read in their inbox.

> The interface, sample content and supporting documentation are in Portuguese, the language the tool was built for. This page is an English adaptation of the case.

> [!NOTE]
> **Fictional demo:** this repository uses illustrative images, fictional campaigns, sample names and synthetic data solely to present the project's features. None of the data shown represents real results, customer information or internal Santander campaigns.
> This is an independent portfolio case, with no institutional affiliation with or endorsement by Santander. See the [data, brand and license notes](docs/disclaimer.md) (in Portuguese).

<p align="center">
  <img src="docs/assets/gifs/01-visao-geral.gif" alt="Real recording: the PF emulator opens the fictional April report and the page itself becomes the editor" width="100%">
</p>

## The case in 30 seconds

| | |
|---|---|
| **The problem** | A monthly report with a fixed structure, rebuilt every month under brand rules, Outlook's rendering limits and two segments with different identities. The first versions were hand-edited HTML. |
| **The answer** | A single file that opens in the browser and turns the report page into its own editor. You click, type, rearrange, swap images and videos, save one self-contained `.html` and generate the summary email as an `.eml`. |
| **What sets it apart** | It separates **content** (the team), **form** (brand and layout) and **channel** (web page and email). One engine serves two profiles (PF and PJ), and the tool never makes up a number. |

## Context

The project began during a marketing role connected to Santander's **PF** (consumer) and **PJ** (business) teams. The need is a familiar one for marketing teams: **show every month what was done and what worked**. That means campaigns, KPIs, creatives, videos, learnings and next steps, presented in a polished, consistent format that is easy to update for the people who make decisions.

The report had two destinations:
- a **full web page**, with scroll motion, videos and creatives on click;
- an **email**, the entry point, read in Outlook.

The people updating it were not developers, and they worked on corporate machines where installing software was not an option.

## Pain points and opportunities

The table lists what the project had to solve, as documented in the repository history (releases, docs and recorded decisions). How severe each pain was has not been measured; only documented problems are listed.

| Pain point | Evidence in the repo | Opportunity | What the solution does |
|---|---|---|---|
| Same report rebuilt every month | Monthly workflow in `docs/COMO_ATUALIZAR_O_MES.md` | Reuse last month | Open the saved report and edit only what changed; start from a blank template when needed |
| Technical editing (HTML) | Releases 1.x–2.x: hand-edited HTML email ([CHANGELOG](CHANGELOG.md)) | Take code out of the way | Inline editing on the page itself, an item toolbar, Undo and Redo |
| Visual consistency and brand rules | Brand settings centralized in `config/marca.txt` | Let the tool own the form | The engine applies colors, fonts, symbol and grid; the team only touches content |
| Outlook limitations | `docs/OUTLOOK_COMPATIBILITY.md`, dark-mode fixes (4.12.1) | Email that arrives as previewed | Table-based HTML with inline styles, dark-mode handling, ready-to-send `.eml` |
| Two segments, two identities | Releases 5.0–5.4 (PJ) | One system, two profiles | Same code, PF and PJ profiles; each emulator only opens its own segment |
| Executive summary built separately | Summary email since 3.9; picked highlights in 4.13 | Generate the summary from the page | Up to 4 highlights picked from the report, live preview and status |
| Non-technical users, no installs | `docs/CORPORATE_SETUP.md` | One file, double-click | A standalone `.html` emulator that runs in Chrome or Edge |
| Trustworthy numbers | Emulator rules in `docs/operacao.md` | A tool that never invents data | It never creates or calculates numbers; a KPI with no data stays hidden |

<p align="center"><img src="docs/assets/diagrams/problema-oportunidade-solucao.svg" alt="Diagram: challenges, the opportunity of separating content, form and channel, and the PF and PJ emulators" width="100%"></p>

## The solution

The **emulators** are browser-based tools for creating and editing marketing performance reports:

- **Create and update** the monthly report from a blank template or from last month's file.
- **Edit visually**: text, figures, result tags, campaigns, highlights and learnings, right on the page.
- **Rearrange**: add items, drag and drop with snapping, move items between sections, and reorder, show or hide sections.
- **Add media**: swap images (resized and cropped in the browser), and add videos and links.
- **Preview before saving**, on desktop and on mobile.
- **Export a single HTML report**, with images and videos embedded.
- **Produce the executive summary email** and export it as an **EML** file for Outlook.
- **Standardize without erasing identity**: PF and PJ share the engine but differ in brand, sections and layout.
- **Work for people who don't code**: one file, no install, no server.

Each item above is checked against the code and the tests in [`docs/features.md`](docs/features.md).

## PF and PJ emulators

| PF emulator | PJ emulator |
|---|---|
| <img src="docs/assets/screenshots/01-emulador-pf.webp" alt="PF emulator start screen with the demo notice" width="100%"> | <img src="docs/assets/screenshots/02-emulador-pj.webp" alt="PJ emulator start screen with the demo notice" width="100%"> |
| Continuous page; releases, creative quality, lab and learnings | Panel layout; campaigns, KPIs, analyses and a funnel view for key results |

The **same code** (`converter-html-eml.html`, `tools/motor.js` and `template/report.html`) serves both segments. Only the profile changes: brand, section names, blank template and layout. The segment is stored in the page itself, and one emulator **won't open** the other segment's report.

## Key features

| Feature | What it solves |
|---|---|
| **On-page editing** | Click and type; text gets an outline and becomes editable. No separate forms. |
| **Result tags** | Green or amber change tags, with **Remove tag** when it doesn't apply and **+ Tag** to bring it back. |
| **+ New item and + New topic** | New items arrive with `[bracketed]` placeholder text, in the right grid. |
| **Drag and drop with snapping** | Reorders along a drop line, also into compatible groups, without breaking the layout. |
| **Move to another section** | Moves an item, with its text and figures, to a section of the same kind. |
| **Sections** | Order, visibility and position, in a panel next to the page. |
| **Images, videos, links** | Swap image (auto crop and resize), add video, image below, + Link. |
| **Funnel** | Key results can also be shown as a funnel (clicks → leads → accounts). |
| **Undo, Redo, Recover** | Edits are kept in the browser (IndexedDB) until saved. |
| **Content import** | Paste structured text blocks (for example, drafted with the corporate Copilot from the prompt library) to fill fields. |
| **Single-file `.html` report** | Images and videos inside the file; opens in any browser, on desktop and mobile. |
| **Summary email `.eml`** | Up to 4 highlights, link to the full report, desktop and mobile preview, live status and Outlook export. It also exports the full email and a `.png` snapshot of the summary. |

## Gallery

Real screenshots of the demo emulators (release 5.6) with fictional data.

| | |
|---|---|
| <img src="docs/assets/screenshots/03-edicao-texto.webp" alt="Inline text editing"><br><sub>**Click and type:** text becomes editable on the page.</sub> | <img src="docs/assets/screenshots/04-indicadores.webp" alt="KPI and tag editing"><br><sub>**KPIs and tags:** value, change, color and baseline.</sub> |
| <img src="docs/assets/screenshots/05-adicionar-item.webp" alt="Item toolbar"><br><sub>**Item toolbar:** + New item, drag, move, link, image.</sub> | <img src="docs/assets/screenshots/06-organizar.webp" alt="Move to another section"><br><sub>**Rearrange:** move an item to another section.</sub> |
| <img src="docs/assets/screenshots/07-imagem-video.webp" alt="Image toolbar"><br><sub>**Images and videos:** swap image, add video.</sub> | <img src="docs/assets/screenshots/08-previa-celular.webp" alt="Mobile preview"><br><sub>**Mobile preview** before saving.</sub> |
| <img src="docs/assets/screenshots/09-report-html.webp" alt="Final HTML report"><br><sub>**The final report:** one HTML file.</sub> | <img src="docs/assets/screenshots/12-funil-pj.webp" alt="PJ funnel"><br><sub>**PJ:** results as a funnel, with consistent figures.</sub> |
| <img src="docs/assets/screenshots/10-email-resumo.webp" alt="Summary email highlights"><br><sub>**Summary email:** up to 4 highlights, previewed live.</sub> | <img src="docs/assets/screenshots/11-exportar-eml.webp" alt="EML export"><br><sub>**Status and `.eml` export** for Outlook.</sub> |

## Video walkthroughs

These are real recordings of the interface, not slides. On-screen captions (in Portuguese) let you follow along without sound. GitHub can't play repository MP4 files inside a README: click a thumbnail to open the file, or watch them on the [presentation page](docs/index.html) once GitHub Pages is enabled.

| | |
|---|---|
| [<img src="docs/assets/videos/overview.jpg" alt="Overview video thumbnail">](docs/assets/videos/overview.mp4)<br>**Overview** · 45 s | [<img src="docs/assets/videos/emuladores-pf-pj.jpg" alt="PF and PJ video thumbnail">](docs/assets/videos/emuladores-pf-pj.mp4)<br>**Both emulators** · 26 s |
| [<img src="docs/assets/videos/workflow-report.jpg" alt="Workflow video thumbnail">](docs/assets/videos/workflow-report.mp4)<br>**From blank template to saved file** · 78 s | [<img src="docs/assets/videos/email-summary.jpg" alt="Summary email video thumbnail">](docs/assets/videos/email-summary.mp4)<br>**Summary email and `.eml`** · 34 s |

## How it works

<p align="center"><img src="docs/assets/diagrams/fluxo-de-uso.svg" alt="Seven-step workflow: open, edit, rearrange, media, check, save, email" width="100%"></p>

1. **Open** the emulator (one `.html` file, double-click) with the blank template or last month's report.
2. **Edit** campaigns, text, figures and tags on the page.
3. **Rearrange** items and sections.
4. **Add** images, videos and links.
5. **Check** on desktop and mobile.
6. **Save** a single `.html` with everything embedded.
7. **Generate** the summary email, pick the highlights and download the `.eml`.

## Architecture

Everything runs **in the browser from a local file**. There is no server, database, API or external service. Node.js is only used by maintainers, to build the standalone files and run the tests.

<p align="center"><img src="docs/assets/diagrams/arquitetura.svg" alt="Architecture diagram: emulator UI, report page in an iframe, engine, blank templates and IndexedDB in the browser; .html, .eml and .png outputs; Node.js build and tests" width="100%"></p>

See [`docs/architecture.md`](docs/architecture.md) for Mermaid diagrams and component details (in Portuguese).

## Tech stack

- **HTML, CSS and JavaScript**: no framework and no runtime dependencies.
- **Browser APIs**: `contenteditable`, drag and drop, Canvas (image crop and resize), File API, IndexedDB, Blob downloads.
- **Email**: Outlook-safe HTML (tables, inline styles, dark mode) and `.eml` (MIME) generated in the browser.
- **Tooling**:
  - Node.js to build the standalone files;
  - Playwright (Chromium) for end-to-end tests and for this case's screenshots and videos;
  - ffmpeg for the videos and GIFs.

## Running it

**Demo, nothing to install:**
1. Download the repository.
2. Open `docs/demo/emulador-pf.html` or `docs/demo/emulador-pj.html` in Chrome or Edge.
3. Click **Abrir um report salvo** (Open a saved report) and choose `docs/demo/report-demo-pf.html` (or `-pj`).

When the folder is served over http (GitHub Pages or `python3 -m http.server --directory docs`), the page also has a one-click button that loads the demo report.

**Maintenance** (Node.js 18+ and Playwright): see [`tools/portfolio/README.md`](tools/portfolio/README.md).

## Documentation

The following documents are in Portuguese.

- [Overview](docs/overview.md)
- [Problem and solution](docs/problem-and-solution.md)
- [Architecture](docs/architecture.md)
- [Features](docs/features.md)
- [User guide](docs/user-guide.md)
- [Demo data](docs/demo-data.md)
- [Benchmark](docs/benchmark.md)
- [My role](docs/contribution.md)
- [Disclaimer](docs/disclaimer.md)
- [Publication audit](docs/audit/publication-audit.md)
- [Test report](docs/audit/test-report.md)
- [Changelog](CHANGELOG.md)

## My role

I led the project end to end as its product owner:
- I spotted the opportunity in the monthly reporting process.
- I defined what the tool had to do, and for whom.
- I evolved the solution release by release, based on real use.

What that involved:
- **Problem framing and requirements.** I translated the reporting routine (content, brand, Outlook, mobile, two segments) into requirements and rules, such as "the tool never makes up a number" and "a KPI with no data stays hidden".
- **User experience.** I designed on-page editing for non-technical users, and I simplified the interface after each round of real use.
- **PF and PJ product.** I extended the system from one segment to two, with a shared engine and distinct identities.
- **AI-assisted development.** I built the solution with a generative AI coding assistant (Claude Code). I set the problem, acceptance criteria and priorities, reviewed every delivery and validated it in real use. The history shows 41 pull requests that I reviewed and merged.
- **Quality and enablement.** I added automated tests, an operations guide, a prompt library for the corporate Copilot and training material for the team.

**Skills on display:** product thinking · marketing and results communication · data and KPIs · UX · process design · automation · technology and applied AI.

## Data, brand and license

- **Data:** every screen, video and GIF in this case uses the fictional dataset in [`docs/demo-data.md`](docs/demo-data.md). The relationships between figures (CTR = clicks ÷ impressions, cost per conversion = spend ÷ conversions, funnel steps) are checked automatically.
- **Brand:** the demo uses this case's own visual identity. Santander is mentioned only to give context on the project's professional origin. This repository is not an institutional publication, not an official product and not endorsed by Santander.
- **License:** no open-source license has been assigned. Ownership of code written in a professional context must be confirmed before any licensing (see the [audit](docs/audit/publication-audit.md)). The presentation page fonts (Inter, Instrument Serif, JetBrains Mono) are SIL OFL.

## Status

- **Emulators:** release 5.6, stable; the full test suite passes.
- **Publishing:** this repository is **private**, and its commit history contains work material that **must not** be published. Before going public:
  1. confirm authorization for the code;
  2. publish from a new repository without that history.
- **GitHub Pages:** the page is ready at `docs/index.html`. Enabling it depends on the repository's visibility and the account's plan.
