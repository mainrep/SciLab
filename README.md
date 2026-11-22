# AI Science Lab — AI + PWA build (v0.2)

AI Science Lab is a mobile-friendly Progressive Web App for exploring school-level Physics through everyday objects. It accepts either a photo taken with a device camera, a photo chosen from the gallery, or a text-only object description.

## Main user journey

1. Take a photo or choose an image; optionally add a short description.
2. The browser sends the file and learning level to the FastAPI backend.
3. The backend validates and compresses the image, removing its embedded EXIF metadata.
4. The backend calls the OpenAI Responses API using an authenticated HTTP POST and a vision-capable model. Structured Outputs asks the model to return a consistent JSON object containing the object, 2–4 Physics concepts, explanations, a misconception, a prediction question, feedback and a further-exploration question.
6. The backend validates the response and sends JSON to the browser.
7. JavaScript renders the concepts and learning activities.

## Project structure

```text
ai_science_lab_v2/
├── main.py                  # FastAPI backend + OpenAI API integration
├── requirements.txt         # Python dependencies
├── .env.example             # Template for server-side configuration
├── .gitignore               # Prevents secrets/virtual environments being committed
├── README.md
├── LEARNING_GUIDE.md
└── frontend/
    ├── index.html           # Page structure and camera/gallery inputs
    ├── styles.css           # Responsive styling
    ├── app.js               # Browser interactions and API request
    ├── manifest.webmanifest # PWA name, icons and display configuration
    ├── sw.js                # Offline app-shell cache
    └── icons/               # Required PWA icon sizes
```

## Requirements

- Python 3.10 or newer (Python 3.11 recommended).
- An OpenAI API key managed by a parent/guardian or teacher. API usage may incur charges; agree on a usage limit before testing.
- Internet access for live AI analysis.

Do not put an API key in `app.js`, HTML, CSS, GitHub Pages, or any public repository. The API key belongs only in the backend `.env` file. Do not paste the key into a chat or share it with anyone.

## Run locally (VS Code)

Open a terminal in the project root (the folder containing `main.py`).

### 1. Create a virtual environment

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

### 2. Install packages

```bash
python -m pip install -r requirements.txt
```

### 3. Add the API key

Copy `.env.example` to a new file named `.env`, then put the server-side API key in it:

```env
OPENAI_API_KEY=your_key_goes_here
OPENAI_MODEL=gpt-5.4-mini
```

Keep `.env` private. The supplied `.gitignore` excludes it from Git.

### 4. Start the server

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000` in your browser. The health endpoint is `http://127.0.0.1:8000/api/health`.

The browser must use the same FastAPI origin so the relative `/api/analyze` request works without CORS configuration.

## Test the app

1. On a phone, open the app using the local network/secure HTTPS preview address provided by your development environment, or test on the deployed HTTPS site. Camera access and PWA service workers require a secure context (HTTPS) except for localhost development.
2. Choose **Take a photo**. The app first requests an in-app camera preview and prefers the rear-facing camera. If the browser cannot provide it or permission is declined, the app offers the device camera picker as a fallback.
3. Also test **Choose a photo** to select an existing image.
4. Try a photo of one clear everyday object, such as a bicycle, guitar, lamp or fan.
5. Optionally enter an object description and choose an explanation level.
6. Explore the concepts, select one, answer the three-option question and inspect the feedback.
7. Test an unclear or irrelevant image; the model should return an uncertainty message rather than inventing Physics connections.
8. Open DevTools → Application → Service Workers/Manifest to inspect PWA setup. After the first visit, reload offline to confirm the app shell is cached. AI analysis itself still requires internet.

## PWA behaviour and limitations

- `manifest.webmanifest` provides install metadata and 192px/512px icons.
- `sw.js` caches the app shell after the first successful visit.
- API requests under `/api/` are deliberately not cached. AI image analysis needs an internet connection.
- The `capture="environment"` camera input requests the outward-facing camera where a browser supports that behaviour; it is not a universal guarantee. The separate gallery input remains available.
- Production PWA installation and camera support require HTTPS. Localhost is permitted for development.
- On iPhone/iPad, installation is normally completed from the browser's Share menu using **Add to Home Screen**; browser installation flows vary by platform.

## Image handling and privacy

- The browser does not save the selected photo in local storage.
- The backend reads the upload into memory, checks its format and size, resizes it, converts it to JPEG, and strips EXIF metadata before sending it to the model.
- The backend does not write uploaded images to disk.
- The Responses API request uses `store=False`, but this does not mean that all provider-side processing/retention is disabled under every account arrangement. Review the provider's current data controls and policies before collecting student images.
- Test with ordinary object photos only. Avoid faces, people, identity documents, location-sensitive images, and other personal information.

## Deployment note

This is a full-stack application. GitHub Pages can host static HTML/CSS/JavaScript but cannot run the Python FastAPI backend. Deploy the FastAPI app on a Python-capable host with HTTPS, configure `OPENAI_API_KEY` as a server-side environment variable, and deploy the `frontend/` folder through the same app origin (as this FastAPI app is already configured to do). Keep the API key out of source control. Before public release, add server-side rate limiting, usage limits, monitoring, and suitable privacy/consent information.

## Current scope

The product currently focuses on Physics. It does not train a model, store user accounts, keep image history, or provide a verified textbook citation for every generated statement. AI output must be checked as part of the project's scientific-accuracy testing.
