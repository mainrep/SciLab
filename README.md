# AI Science Lab — Frontend Prototype v0.1

This is the first working browser prototype. It demonstrates the intended learning journey:

1. Add an everyday-object photo (local preview only).
2. Enter/select the object's name.
3. See relevant Physics concepts from a small curated example library.
4. Select a concept and read an explanation connected to the object.
5. Answer a prediction/application question.
6. Receive feedback and a further-exploration prompt.

## Important limitation

This version does **not** use image recognition or a live AI model. The object name selects a hand-written JavaScript example. The uploaded photo is previewed in the browser and is not sent to a server. This is intentional: it lets us validate the interface and learning flow before connecting a backend and multimodal AI API.

## Run it

### Option 1: VS Code Live Server

1. Open this folder in VS Code.
2. Open `index.html`.
3. Use **Go Live** (if the Live Server extension is installed).

### Option 2: Python's local web server

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Files

- `index.html` — page structure and content regions.
- `styles.css` — layout, colours, responsive behaviour and visual states.
- `app.js` — sample Physics data, image preview, interactions, rendering and answer feedback.

## Next development stage

Replace the `runDemoAnalysis()` demo lookup with a `fetch()` request to a Python backend. The backend will receive the image and prompt/context, call a multimodal AI API, validate the response, and return structured JSON to the frontend. The API key must stay on the backend, never in browser JavaScript.
