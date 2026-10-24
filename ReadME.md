# **Java DSA Journal**

A personal journal for documenting my Java and data structures & algorithms practice. The site organizes program walkthroughs by chapter and includes a searchable program library, chapter progress counts, and chapter-aware navigation.

## **What this project does**

* Organizes learning into 27 topic-based chapters, from Java foundations through interview patterns and revision.  
* Provides a dashboard with chapter status and a searchable program library.  
* Discovers `.html` program pages directly from each chapter's `programs/` folder.  
* Updates the program catalog and chapter counts from the files on disk, without manually registering every program in JavaScript or adding a separate card to a chapter page.  
* Adds previous/next program navigation within the current chapter, with chapter-level navigation at the beginning and end of a chapter.  
* Uses a shared dark visual theme, responsive layouts, and animated page transitions.

## **Tech stack**

* HTML for the dashboard, chapter pages, and individual program walkthroughs  
* CSS and vanilla JavaScript for styling, interactions, search, and navigation  
* Python standard-library HTTP server for serving the site and generating the live catalog  
* GitHub for version control and source files  
* Render for hosting the live website (optional)

No database or JavaScript framework is required for the current version.

## **Project structure**

```
.
├── index.html                    # Main dashboard and program library
├── start-journal.py              # HTTP server, catalog discovery, and program-page support
├── start-journal.sh              # Convenience script for local development
├── render.yaml                   # Render deployment configuration
├── DEPLOY_TO_RENDER.md           # Deployment instructions
├── assets/
│   ├── journal.css               # Shared dashboard and chapter styles
│   ├── journal.js                # Dashboard, chapter UI, and catalog rendering
│   ├── program-navigation.js     # Program navigation and transition behaviour
│   ├── journal-components.css    # Shared styles for existing program pages
│   └── program-page.js            # Shared helper script for program pages
└── chapters/
    ├── ch-01-foundation/
    │   ├── index.html             # Chapter landing page
    │   └── programs/              # Add program HTML files here
    ├── ch-02-control/
    │   ├── index.html
    │   └── programs/
    └── ...                        # Remaining chapters, through Chapter 27
```

Each chapter has its own `index.html` and `programs/` directory. The chapter list and slugs are defined in `start-journal.py`; the server scans the program folders to build the catalog.

## **Run locally**

Requirements: Python 3 installed.

1. Clone or download this repository.  
2. Open a terminal in the repository root.  
3. Start the server:  
   ./start-journal.sh  
   Alternatively:  
   python3 start-journal.py  
4. Open [http\://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

Keep the terminal open while using the site. **Do not open `index.html` directly using a `file://` URL**: the live catalog and automatic discovery are served by the Python server.

## **Add a new program**

The normal workflow is to create the program's HTML walkthrough and place it in the correct chapter's `programs/` directory.

For example, a new Functions & Methods page goes here:

chapters/ch-04-functions-methods/programs/YourProgram.html

Then:

1. Save the HTML file in that folder.  
2. Refresh the journal in your browser. The local server scans the folders when `/api/catalog` is requested, so the new page can appear in the chapter listing, dashboard counts, and searchable program library without editing `assets/journal.js` or the chapter's `index.html` to register it.  
3. Open the page and check that its own CSS, JavaScript, images, and other resources load correctly.

### **Program page guidance**

* Use a unique, descriptive filename. Keep filenames consistent and avoid duplicate names within the same chapter.  
* Include a meaningful `<title>` in the HTML. The catalog uses the title and filename to derive a display name.  
* If you want a description in the catalog, add a description meta tag, for example:  
  \<meta name="description" content="A short description of what this program demonstrates."\>  
* Keep relative asset paths valid from the program page's URL. Shared journal assets are available under `/assets/`.  
* The server injects the chapter-aware program navigation into HTML files served from a chapter's `programs/` directory. Do not open those pages directly from the filesystem if you want that behaviour.

### **Program order**

Programs are ordered separately within each chapter. The existing order for the original Chapter 04 programs is preserved by the server. Other files use natural filename order. To make the order explicit, use numeric prefixes such as `01-Variables.html`, `02-InputOutput.html`, and `03-Conditions.html` for new programs. If you rename existing files, check any special ordering rules in `start-journal.py`.

### **Adding programs after deployment**

With automatic deployment enabled, Render redeploys from the new commit. On startup and subsequent catalog requests, the server discovers the files included in that deployed version. There is no need to edit the dashboard catalog or manually create a program card.

## 

## 

## **How discovery works**

`start-journal.py` serves the website and exposes `/api/catalog`. When the dashboard or chapter page requests this endpoint, the server scans the known chapter `programs/` directories for `.html` files and returns their metadata, URLs, chapter association, and counts. The front end uses that response to render the program library and chapter information.

When a program HTML file is requested, the server can add the shared chapter-aware navigation script to the served response. This allows navigation to be derived from the current catalog without manually editing every program page.

This is filesystem discovery, not a hosted content editor: changes made locally must be committed and deployed before they appear on the public website.

## **Troubleshooting**

* **The program does not appear:** Confirm it is a `.html` file inside the correct chapter's `programs/` directory, then refresh the page and inspect `/api/catalog`.  
* **The page is blank or looks unstyled:** Check browser developer tools for missing CSS, JavaScript, image, or font requests. Ensure referenced files exist and their paths are valid.  
* **The catalog does not update locally:** Confirm the Python server is running and you opened `http://127.0.0.1:8000`, not the file directly from disk.  
* **The live site has not updated:** Check that the commit reached the branch connected to Render and that the latest deployment succeeded.  
* **Previous/next navigation is unexpected:** Check the file's chapter folder and filename ordering. Navigation is chapter-local, not global across the entire journal.

## **Project goals**

This journal is a practical record of my learning: each program page documents a concept or problem as I work through Java and DSA topics. The structure is intended to stay simple to maintain as the collection grows.