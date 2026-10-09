# Reading Room

A small Jekyll site for AI-generated articles on science, philosophy, and finance, hosted on GitHub Pages. It has a filterable library, KaTeX math, syntax-highlighted code, Vega-Lite charts, Mermaid diagrams, and in-browser highlights and notes.

## Layout

```
_articles/            one Markdown file per article (the slug is the URL and the annotation key)
_data/topics.yml      topic keys and labels (science, philosophy, finance)
_layouts/             default.html (page shell), article.html (article template)
_includes/            head, header, articles-json.liquid (article index used by the library)
assets/css/main.css   all styles (IBM Plex Sans / Serif / Mono; light and dark)
assets/js/
  common.js           storage, theme toggle, export/import
  article.js          math, code copy, charts, diagrams, TOC, progress, read status
  annotate.js         highlights and notes
  library.js          library filters
  notes.js            notes page
index.html            library: search, filter by topic, tag, length, and read status
notes/index.html      every highlight and note across all articles
articles.json         machine-readable index
AUTHORING.md          article conventions (front matter, math, charts, callouts)
scripts/check_articles.py   front-matter validation and reading-time estimate
```

## Publish on GitHub Pages

1. Create a GitHub repository (for example `AI-generated-reading`) and push this folder to `main`.
2. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. After about a minute the site is live at `https://<user>.github.io/<repo>/`. GitHub Pages sets `baseurl` automatically. If you add a custom domain, set `url` and `baseurl: ""` in `_config.yml`.

## Preview locally (optional)

```bash
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000
```

## Adding an article

Ask Claude for an article: name the topic, what you want to learn, and the reading time. Claude writes `_articles/<slug>.md` following `AUTHORING.md`. Then:

```bash
python3 scripts/check_articles.py     # validate front matter and check the length estimate
git add _articles && git commit -m "Add <title>" && git push
```

## Annotations

- Select text in an article to get a toolbar with four highlight colours and a **Note** button. Click a highlight to recolour it, edit its note, or delete it.
- Keyboard: with text selected, <kbd>H</kbd> highlights, <kbd>N</kbd> adds a note, and <kbd>1</kbd>–<kbd>4</kbd> pick a colour. <kbd>A</kbd> toggles the notes panel and <kbd>Esc</kbd> closes it.
- Notes support LaTeX: `$x^2$`, `$$…$$`, and `\( … \)`.
- Highlights that span formulas include the whole formula, and the quote keeps the TeX source.
- **Storage:** annotations are saved in this browser's `localStorage`. Use **Export all** (in the panel or on the Notes page) to back them up, and **Import** to merge them into another browser. On merge, the newer edit of each annotation wins. Clearing site data deletes annotations that haven't been exported.
- Highlights are anchored by quoted text plus surrounding context, so they survive small edits to an article. If the passage itself is removed, the annotation is kept and listed as *unanchored*. Renaming an article file changes its key, so don't rename annotated articles.
