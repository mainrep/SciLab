/*
 * AI Science Lab — PWA frontend
 *
 * This file controls user interactions in the browser. It does not contain
 * the OpenAI API key. Images and optional object descriptions are sent to
 * the FastAPI backend, which calls the vision-capable model securely.
 */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const elements = {
  cameraInput: document.getElementById("cameraInput"),
  galleryInput: document.getElementById("galleryInput"),
  takePhotoButton: document.getElementById("takePhotoButton"),
  cameraPanel: document.getElementById("cameraPanel"),
  cameraVideo: document.getElementById("cameraVideo"),
  cameraCanvas: document.getElementById("cameraCanvas"),
  cameraMessage: document.getElementById("cameraMessage"),
  closeCameraButton: document.getElementById("closeCameraButton"),
  capturePhotoButton: document.getElementById("capturePhotoButton"),
  cameraFallbackButton: document.getElementById("cameraFallbackButton"),
  choosePhotoButton: document.getElementById("choosePhotoButton"),
  dropZone: document.getElementById("dropZone"),
  uploadPrompt: document.getElementById("uploadPrompt"),
  imagePreview: document.getElementById("imagePreview"),
  imageMessage: document.getElementById("imageMessage"),
  removeImageButton: document.getElementById("removeImageButton"),
  objectInput: document.getElementById("objectInput"),
  learningLevel: document.getElementById("learningLevel"),
  analyzeButton: document.getElementById("analyzeButton"),
  inputMessage: document.getElementById("inputMessage"),
  loadingSection: document.getElementById("loadingSection"),
  loadingMessage: document.getElementById("loadingMessage"),
  resultsSection: document.getElementById("resultsSection"),
  resultsSubheading: document.getElementById("resultsSubheading"),
  analysisNotice: document.getElementById("analysisNotice"),
  conceptArea: document.getElementById("conceptArea"),
  conceptList: document.getElementById("conceptList"),
  conceptCategory: document.getElementById("conceptCategory"),
  conceptTitle: document.getElementById("conceptTitle"),
  conceptExplanation: document.getElementById("conceptExplanation"),
  conceptConnection: document.getElementById("conceptConnection"),
  misconceptionBox: document.getElementById("misconceptionBox"),
  misconceptionText: document.getElementById("misconceptionText"),
  questionPrompt: document.getElementById("questionPrompt"),
  answerOptions: document.getElementById("answerOptions"),
  checkAnswerButton: document.getElementById("checkAnswerButton"),
  feedbackBox: document.getElementById("feedbackBox"),
  exploreNext: document.getElementById("exploreNext"),
  challengeText: document.getElementById("challengeText"),
  resetButton: document.getElementById("resetButton"),
  toast: document.getElementById("toast"),
  offlineNotice: document.getElementById("offlineNotice"),
  connectionBadge: document.getElementById("connectionBadge"),
  installButton: document.getElementById("installButton"),
};

let selectedImage = null;
let selectedImageUrl = null;
let currentAnalysis = null;
let activeConceptIndex = 0;
let selectedAnswerIndex = null;
let toastTimer = null;
let installPromptEvent = null;
let cameraStream = null;
let serverAIConfigured = false;

// ---------- Small interface helpers ----------

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 3200);
}

function setBusy(isBusy, message = "The AI is examining the object and preparing a learning pathway.") {
  elements.analyzeButton.disabled = isBusy || !navigator.onLine;
  elements.analyzeButton.innerHTML = isBusy
    ? '<span class="button-spinner" aria-hidden="true"></span> Analysing...'
    : 'Explore this object <span aria-hidden="true">→</span>';
  elements.loadingSection.hidden = !isBusy;
  elements.loadingMessage.textContent = message;
}

function updateConnectionState() {
  const online = navigator.onLine;
  elements.offlineNotice.hidden = online;
  if (!online) {
    elements.connectionBadge.innerHTML = '<span class="status-dot offline-dot"></span> Offline mode';
    elements.analyzeButton.disabled = true;
  } else if (serverAIConfigured) {
    elements.connectionBadge.innerHTML = '<span class="status-dot online-dot"></span> AI service ready';
    elements.analyzeButton.disabled = false;
  } else {
    elements.connectionBadge.innerHTML = '<span class="status-dot offline-dot"></span> Server setup needed';
    elements.analyzeButton.disabled = false;
  }
}

async function checkServerHealth() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const health = await response.json();
    serverAIConfigured = Boolean(response.ok && health.ai_configured);
  } catch (error) {
    serverAIConfigured = false;
    console.warn("Could not check backend status:", error);
  }
  updateConnectionState();
checkServerHealth();
}

// ---------- Photo selection and camera capture ----------

function setSelectedImage(file) {
  if (!file) return;

  const hasImageMimeType = file.type.startsWith("image/");
  const hasSupportedExtension = /\.(jpe?g|png|webp)$/i.test(file.name || "");
  if (!hasImageMimeType && !hasSupportedExtension) {
    elements.inputMessage.textContent = "Please choose a JPG, PNG or WEBP image.";
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    elements.inputMessage.textContent = "That image is larger than 5 MB. Choose a smaller image.";
    return;
  }

  if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);

  selectedImage = file;
  selectedImageUrl = URL.createObjectURL(file);
  elements.imagePreview.src = selectedImageUrl;
  elements.imagePreview.hidden = false;
  elements.uploadPrompt.hidden = true;
  elements.removeImageButton.hidden = false;
  elements.imageMessage.textContent = `${file.name || "Photo selected"} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  elements.inputMessage.textContent = "Photo ready. Add an optional description, then explore it.";
}

function clearSelectedImage() {
  selectedImage = null;
  if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
  selectedImageUrl = null;
  elements.cameraInput.value = "";
  elements.galleryInput.value = "";
  elements.imagePreview.removeAttribute("src");
  elements.imagePreview.hidden = true;
  elements.uploadPrompt.hidden = false;
  elements.removeImageButton.hidden = true;
  elements.imageMessage.textContent = "A clear photo of one everyday object works best.";
}

// ---------- In-app camera ----------

async function openCamera() {
  // getUserMedia opens a live camera stream inside the PWA. It normally
  // requires HTTPS (localhost is allowed during local development).
  if (!navigator.mediaDevices?.getUserMedia) {
    elements.cameraInput.click(); // compatibility fallback for older browsers
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
    });
    elements.cameraVideo.srcObject = cameraStream;
    elements.cameraPanel.hidden = false;
    await elements.cameraVideo.play();
    elements.closeCameraButton.focus();
  } catch (error) {
    console.warn("In-app camera unavailable:", error);
    stopCamera();
    showToast("The in-app camera was unavailable. Opening your device camera picker instead.");
    elements.cameraInput.click();
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  elements.cameraVideo.srcObject = null;
  elements.cameraPanel.hidden = true;
}

async function capturePhoto() {
  const video = elements.cameraVideo;
  if (!cameraStream || !video.videoWidth || !video.videoHeight) {
    elements.cameraMessage.textContent = "The camera is still starting. Try again in a moment.";
    return;
  }

  const canvas = elements.cameraCanvas;
  // Limit the captured frame to 1600px on its longest side. This keeps
  // phone camera uploads manageable while preserving enough detail.
  const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
  canvas.width = Math.round(video.videoWidth * scale);
  canvas.height = Math.round(video.videoHeight * scale);
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (!blob) {
      showToast("The photo could not be captured. Please try again.");
      return;
    }
    const photoFile = new File([blob], `science-lab-${Date.now()}.jpg`, { type: "image/jpeg" });
    stopCamera();
    setSelectedImage(photoFile);
  }, "image/jpeg", 0.88);
}

// ---------- AI request ----------

async function analyzeObject() {
  const objectHint = elements.objectInput.value.trim();

  if (!selectedImage && !objectHint) {
    elements.inputMessage.textContent = "Take/upload a photo or enter an object description first.";
    elements.objectInput.focus();
    return;
  }

  if (!navigator.onLine) {
    elements.inputMessage.textContent = "AI analysis needs an internet connection. Reconnect and try again.";
    return;
  }

  const formData = new FormData();
  if (selectedImage) formData.append("image", selectedImage, selectedImage.name || "object-photo.jpg");
  formData.append("object_hint", objectHint);
  formData.append("learning_level", elements.learningLevel.value);

  elements.inputMessage.textContent = "";
  elements.resultsSection.hidden = true;
  setBusy(true);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || `The server returned an error (${response.status}).`);
    }

    currentAnalysis = payload;
    renderAnalysis(payload);
    elements.resultsSection.hidden = false;
    elements.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Analysis request failed:", error);
    elements.inputMessage.textContent = error.message || "Something went wrong. Please try again.";
    showToast("The analysis could not be completed.");
  } finally {
    setBusy(false);
  }
}

// ---------- Render AI-generated content safely ----------
// textContent is used instead of innerHTML for model-generated strings. This
// prevents generated text from being interpreted as HTML or executable code.

function renderAnalysis(data) {
  elements.resultsSubheading.textContent = data.object_name
    ? `${data.object_name} · AI-generated Physics exploration`
    : "AI-generated Physics exploration";

  elements.analysisNotice.hidden = false;
  elements.analysisNotice.textContent = data.clarification_message || data.analysis_note || "Explore the concepts below. Verify important details with trusted sources.";

  elements.conceptList.replaceChildren();
  elements.conceptArea.hidden = true;
  elements.exploreNext.hidden = true;

  if (data.status !== "ready" || !Array.isArray(data.concepts) || data.concepts.length === 0) {
    elements.analysisNotice.classList.add("notice-caution");
    return;
  }

  elements.analysisNotice.classList.remove("notice-caution");
  elements.conceptArea.hidden = false;

  data.concepts.forEach((concept, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "concept-button";
    button.textContent = concept.title;
    button.addEventListener("click", () => selectConcept(index));
    elements.conceptList.append(button);
  });

  selectConcept(0);
}

function selectConcept(index) {
  if (!currentAnalysis || !currentAnalysis.concepts[index]) return;

  activeConceptIndex = index;
  const concept = currentAnalysis.concepts[index];
  selectedAnswerIndex = null;

  elements.conceptList.querySelectorAll(".concept-button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });

  elements.conceptCategory.textContent = concept.category || "PHYSICS CONCEPT";
  elements.conceptTitle.textContent = concept.title;
  elements.conceptExplanation.textContent = concept.explanation;
  elements.conceptConnection.textContent = concept.object_connection;
  elements.misconceptionText.textContent = concept.misconception || "No specific misconception was provided.";
  elements.misconceptionBox.hidden = !concept.misconception;
  elements.challengeText.textContent = concept.challenge_question;
  elements.exploreNext.hidden = true;
  elements.feedbackBox.hidden = true;
  elements.feedbackBox.className = "feedback-box";
  elements.checkAnswerButton.disabled = true;

  renderQuestion(concept.quiz);
}

function renderQuestion(quiz) {
  elements.questionPrompt.textContent = quiz.prompt;
  elements.answerOptions.replaceChildren();

  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";

    const marker = document.createElement("span");
    marker.className = "option-marker";
    marker.textContent = String.fromCharCode(65 + index);

    const label = document.createElement("span");
    label.textContent = option;

    button.append(marker, label);
    button.addEventListener("click", () => {
      selectedAnswerIndex = index;
      elements.answerOptions.querySelectorAll(".answer-option").forEach((choice, choiceIndex) => {
        choice.classList.toggle("selected", choiceIndex === index);
        choice.setAttribute("aria-pressed", String(choiceIndex === index));
      });
      elements.checkAnswerButton.disabled = false;
      elements.feedbackBox.hidden = true;
      elements.exploreNext.hidden = true;
    });

    elements.answerOptions.append(button);
  });
}

function checkAnswer() {
  if (selectedAnswerIndex === null || !currentAnalysis) return;

  const concept = currentAnalysis.concepts[activeConceptIndex];
  const quiz = concept.quiz;
  const isCorrect = selectedAnswerIndex === quiz.correct_answer_index;
  const heading = document.createElement("strong");
  heading.textContent = isCorrect ? "That's correct." : "Let's learn from that.";
  const explanation = document.createElement("span");
  explanation.textContent = isCorrect ? quiz.correct_feedback : quiz.incorrect_feedback;

  elements.feedbackBox.replaceChildren(heading, explanation);
  elements.feedbackBox.className = `feedback-box ${isCorrect ? "correct" : "incorrect"}`;
  elements.feedbackBox.hidden = false;
  elements.exploreNext.hidden = false;
  elements.checkAnswerButton.disabled = true;
}

function resetExperience() {
  elements.resultsSection.hidden = true;
  elements.inputMessage.textContent = "";
  elements.objectInput.value = "";
  elements.loadingSection.hidden = true;
  currentAnalysis = null;
  clearSelectedImage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- PWA installation and offline status ----------

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPromptEvent = event;
  elements.installButton.hidden = false;
});

elements.installButton.addEventListener("click", async () => {
  if (!installPromptEvent) {
    showToast("Use your browser's menu and choose 'Add to Home Screen' or 'Install app'.");
    return;
  }

  installPromptEvent.prompt();
  await installPromptEvent.userChoice;
  installPromptEvent = null;
  elements.installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  elements.installButton.hidden = true;
  showToast("AI Science Lab has been installed.");
});

window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}

// ---------- Event listeners ----------

elements.takePhotoButton.addEventListener("click", openCamera);
elements.choosePhotoButton.addEventListener("click", () => elements.galleryInput.click());
elements.closeCameraButton.addEventListener("click", stopCamera);
elements.capturePhotoButton.addEventListener("click", capturePhoto);
elements.cameraFallbackButton.addEventListener("click", () => {
  stopCamera();
  elements.cameraInput.click();
});
elements.cameraPanel.addEventListener("click", (event) => {
  if (event.target === elements.cameraPanel) stopCamera();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.cameraPanel.hidden) stopCamera();
});
window.addEventListener("pagehide", stopCamera);
elements.cameraInput.addEventListener("change", (event) => setSelectedImage(event.target.files[0]));
elements.galleryInput.addEventListener("change", (event) => setSelectedImage(event.target.files[0]));
elements.removeImageButton.addEventListener("click", clearSelectedImage);
elements.analyzeButton.addEventListener("click", analyzeObject);
elements.checkAnswerButton.addEventListener("click", checkAnswer);
elements.resetButton.addEventListener("click", resetExperience);

document.querySelectorAll(".sample-chip").forEach((button) => {
  button.addEventListener("click", () => {
    elements.objectInput.value = button.dataset.object;
    elements.inputMessage.textContent = `“${button.dataset.object}” added. You can now explore it, with or without a photo.`;
    elements.objectInput.focus();
  });
});

elements.dropZone.addEventListener("click", () => elements.galleryInput.click());
elements.dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    elements.galleryInput.click();
  }
});
elements.dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("drag-over");
});
elements.dropZone.addEventListener("dragleave", () => elements.dropZone.classList.remove("drag-over"));
elements.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("drag-over");
  setSelectedImage(event.dataTransfer.files[0]);
});

updateConnectionState();
checkServerHealth();
