# Learning guide — how the AI Science Lab build works

This guide explains the purpose of each layer and the path data takes through the application.

## 1. Architecture: browser → backend → AI provider → backend → browser

**Frontend (HTML/CSS/JavaScript):** runs on the student's device. It lets the student take/choose a photo, enter an optional observation and interact with the returned Physics content.

**Backend (Python + FastAPI):** runs on the server. It validates the upload, prepares the image, holds the secret API key and makes the model request. Keeping the key here is essential: JavaScript sent to a browser can be inspected by users.

**AI model (Responses API):** receives image and text input and returns the structured learning content. A vision-capable model can process an image input; Structured Outputs constrains the response to the JSON schema expected by our frontend.

## 2. `index.html`: the interface structure

The HTML defines the elements that JavaScript later finds by ID. For instance:

```html
<input id="cameraInput" type="file" accept="image/jpeg,image/png,image/webp" capture="environment">
```

- `type="file"` asks the browser to provide a file.
- `accept="image/*"` asks for image files.
- `capture="environment"` requests the outward-facing camera on supported devices. It is a request/hint, not a guarantee across every browser.

The PWA also has an in-app camera dialog using `navigator.mediaDevices.getUserMedia()`. It requests the outward-facing camera with `facingMode: { ideal: "environment" }`, streams frames into a `<video>` element, and captures a still frame by drawing it onto a `<canvas>`. `canvas.toBlob()` creates image bytes, which are wrapped in a `File` object and handled like a gallery photo. The `cameraInput` with `capture="environment"` is a fallback for browsers where the live camera API is unavailable or permission is declined. The separate `galleryInput` has no `capture` attribute, allowing a normal photo-library/file-picker route.

## 3. `styles.css`: responsive behaviour

The original style system uses CSS Grid, Flexbox, `clamp()` and media queries. For example, the two input cards sit side-by-side on wide screens and become a single column below 760px. Touch controls have larger minimum heights than small desktop-only controls.

CSS variables such as `--blue` and `--ink` keep the palette consistent. Change a variable in `:root` to change that colour throughout the interface.

## 4. `app.js`: browser-side logic

### A. DOM references

```js
const objectInput = document.getElementById("objectInput");
```

`document` represents the loaded page. `getElementById()` returns the HTML element with that ID so JavaScript can read or update it.

### B. Event listeners

```js
button.addEventListener("click", analyzeObject);
```

This registers a function to run when a user clicks a button. Other listeners respond to file selection, drag-and-drop, online/offline changes, and PWA installation events.

### C. File objects and previews

When a user chooses a photo, the browser gives JavaScript a `File` object. A `File` is a browser representation of a local file; it can be appended to a `FormData` object and sent in a request.

```js
selectedImageUrl = URL.createObjectURL(file);
imagePreview.src = selectedImageUrl;
```

`createObjectURL()` makes a temporary local URL so the browser can preview the file without uploading it. We call `URL.revokeObjectURL()` when replacing/removing it to release the browser resource.

### D. `FormData` and `fetch`

```js
const formData = new FormData();
formData.append("image", selectedImage, selectedImage.name);
formData.append("object_hint", objectHint);

const response = await fetch("/api/analyze", {
  method: "POST",
  body: formData
});
```

`FormData` packages fields and a file using the browser's multipart form format. `fetch()` sends an HTTP request. `await` pauses this async function until the server responds, without freezing the entire page.

Do not manually set the multipart `Content-Type` header: the browser adds the required boundary automatically.

### E. Rendering safely

The model's response is untrusted text. The app uses `textContent` when adding model-generated strings to the page. It does not treat a model response as HTML. This reduces the risk that text returned by the model could be interpreted as markup or script.

The concept list and multiple-choice options are built with `document.createElement()`, then inserted with `append()`.

## 5. `main.py`: the backend

### A. Environment variables

```python
API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
```

An environment variable is configuration held outside the source code. The `.env` file is read locally by `python-dotenv`. The backend uses `httpx` to send the key in the HTTPS `Authorization: Bearer ...` request header. We never send the key to the browser.

### B. FastAPI endpoint

```python
@app.post("/api/analyze")
async def analyze_object(image: UploadFile | None = File(None), ...):
```

- `@app.post` registers a URL that accepts HTTP POST requests.
- `UploadFile` represents the submitted photo.
- `File()` tells FastAPI that this value comes from a multipart file field.
- `Form()` reads text fields sent in the same `FormData` body.
- `async` allows FastAPI to wait for network operations without blocking the server thread.

### C. Image preparation

The backend reads the image in memory, enforces a 5 MB limit, checks that Pillow can decode it as JPEG/PNG/WEBP, rotates it according to orientation metadata, resizes it to fit within 1600×1600 and converts it to JPEG.

The image is re-encoded rather than forwarded byte-for-byte. This removes embedded EXIF metadata (which can include location information) and reduces upload size. It is not saved to disk by this app.

### D. Base64 data URL

The model request accepts an image URL or a Base64-encoded data URL. Base64 converts binary image bytes into text characters so the image can be included in the JSON request body. The `data:image/jpeg;base64,` prefix tells the API what kind of data follows.

### E. Responses API and Structured Outputs

The backend uses `httpx.AsyncClient` to make a direct HTTP `POST` request to the Responses API. The private key is sent in an `Authorization: Bearer ...` header, and the JSON request body contains:

- a system instruction describing the app's teaching rules;
- a user message with the learner's level and optional hint;
- an `input_image` item if a photo was uploaded;
- a JSON Schema specifying the response structure.

Structured Outputs is used so the response has predictable fields such as `object_name`, `concepts`, `explanation`, and `quiz`. This is more reliable for rendering a UI than asking the model for free-form prose. Schema adherence does not prove scientific correctness, so the explanations still need human/source checking.

### F. Validation

The raw Responses API payload contains an `output` array. `extract_response_text()` searches that array for the completed `output_text` item. The text is decoded as JSON and checked against Pydantic models. Pydantic validates types and field constraints. Additional business rules check that a ready result includes at least two concepts. The backend returns an HTTP error when the provider is unavailable, the API key is invalid, the rate limit is reached, or the output cannot be validated.

## 6. PWA files

### `manifest.webmanifest`

This gives the app its name, icon paths, start URL and `standalone` display mode. The 192px and 512px icons support install prompts on Chromium-based browsers.

### `sw.js`

A service worker is a browser-managed script that can intercept network requests. This one caches the static app shell (HTML, CSS, JavaScript, manifest and icons) after the first visit. It deliberately does not cache `/api/` requests. As a result, the app interface can reopen offline, but live AI analysis cannot run offline.

A PWA/service worker generally needs HTTPS in deployment; `localhost` is allowed for local development.

## 7. What you should be able to explain in your own words

1. Why must the API key stay in `main.py`/the server environment rather than `app.js`?
2. What does `getUserMedia()` return, and why must the camera tracks be stopped after capture or closing the dialog?
3. What is the difference between a `File` object and a Base64 data URL?
4. Why does the browser use `FormData` to send an image?
5. What job does FastAPI perform between the browser and the AI API?
6. Why is Structured Outputs useful when a frontend needs to display concepts and quiz questions?
7. Why can the app shell work offline while image analysis cannot?
8. Why does the app still need human scientific-accuracy testing even when the API returns valid JSON?

Try answering these without looking at the guide. If you can explain them and trace one image from the camera to the results screen, you understand the core architecture.
