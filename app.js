/*
 * AI Science Lab — first frontend prototype
 *
 * IMPORTANT: This version does not call an AI service yet.
 * It uses a small, curated JavaScript dataset so we can build and test the
 * user journey before adding a Python backend and a multimodal AI API.
 */

const OBJECT_LIBRARY = {
  bicycle: {
    displayName: "Bicycle",
    concepts: [
      {
        id: "friction",
        title: "Friction",
        category: "FORCES AND INTERACTIONS",
        explanation: "Friction is a force that acts when two surfaces are in contact. It opposes relative sliding between those surfaces. At the tyres, friction with the ground helps the bicycle gain forward motion when the rider pedals; at the brakes, friction helps slow the wheels down.",
        connection: "The tyre-road contact helps the bicycle move and turn without simply sliding sideways. Brake pads also use friction to reduce the wheel's motion.",
        question: {
          prompt: "If a bicycle's tyres had much less grip on the road, what would become harder?",
          options: [
            { label: "Turning and braking safely", value: "turning" },
            { label: "Making the bicycle frame heavier", value: "weight" },
            { label: "Changing the colour of the tyres", value: "colour" }
          ],
          answer: "turning",
          feedback: "Grip comes from friction between the tyres and the road. With less available friction, the tyres are more likely to slip, making turning and braking harder."
        },
        challenge: "Investigate how the tyre surface pattern might affect grip on a dry road compared with a wet road. What would you predict, and why?"
      },
      {
        id: "energy",
        title: "Energy transfer",
        category: "ENERGY",
        explanation: "When a rider pedals, chemical energy stored in the body is transferred mechanically to the bicycle. Some energy becomes kinetic energy as the bicycle moves. Some is also transferred to the surroundings as thermal energy and sound because of friction and other resistive effects.",
        connection: "The chain transfers energy from the pedals to the rear wheel. As the bicycle speeds up, its kinetic energy increases.",
        question: {
          prompt: "A rider pedals harder and the bicycle speeds up. What happens to the bicycle's kinetic energy?",
          options: [
            { label: "It increases", value: "increase" },
            { label: "It becomes zero", value: "zero" },
            { label: "It changes into mass", value: "mass" }
          ],
          answer: "increase",
          feedback: "Kinetic energy is the energy an object has because of its motion. For the same bicycle and rider, a greater speed means greater kinetic energy."
        },
        challenge: "Where else does some of the rider's energy go besides the bicycle's motion? Think about heat and sound."
      },
      {
        id: "rotation",
        title: "Rotational motion",
        category: "MOTION",
        explanation: "The wheels rotate around their axles. A rotating object turns about an axis, and points farther from the axis travel in a larger circular path during each revolution. The bicycle's forward movement is linked to the rotation of its wheels.",
        connection: "The pedals turn the chainring, the chain drives the rear sprocket, and the rear wheel rotates to help move the bicycle forward.",
        question: {
          prompt: "Which part of a bicycle rotates around an axle as the bicycle moves?",
          options: [
            { label: "The wheel", value: "wheel" },
            { label: "The painted logo", value: "logo" },
            { label: "The rider's shadow", value: "shadow" }
          ],
          answer: "wheel",
          feedback: "The wheel rotates around its axle. This rotational motion is connected to the bicycle's forward motion."
        },
        challenge: "Compare a small wheel and a large wheel. If both rotate at the same number of revolutions per second, how might their edge speeds compare?"
      }
    ]
  },
  ball: {
    displayName: "Ball",
    concepts: [
      {
        id: "forces",
        title: "Forces and motion",
        category: "FORCES AND INTERACTIONS",
        explanation: "A force is an interaction that can change an object's motion or shape. When a ball is kicked, the foot exerts a force on it. The ball's motion changes depending on the size and direction of the net force acting on it.",
        connection: "The kick changes the ball's velocity. After it leaves the foot, gravity and air resistance continue to affect its motion.",
        question: {
          prompt: "A stationary ball starts moving after being kicked. What caused its motion to change?",
          options: [
            { label: "A force from the foot", value: "force" },
            { label: "Its colour", value: "colour" },
            { label: "The ball becoming heavier", value: "mass" }
          ],
          answer: "force",
          feedback: "The foot applies a force to the ball. An unbalanced force can change an object's velocity, meaning its speed, direction, or both can change."
        },
        challenge: "How could kicking the same ball in a different direction change its motion?"
      },
      {
        id: "energy",
        title: "Kinetic energy",
        category: "ENERGY",
        explanation: "A moving ball has kinetic energy. For a given mass, a faster-moving ball has more kinetic energy. When the ball slows down because of air resistance, friction, or a collision, energy is transferred to other stores and the surroundings.",
        connection: "A ball moving across a field has kinetic energy. When it is caught, some of that energy is transferred to the player's hands and surroundings.",
        question: {
          prompt: "Two identical balls move in the same direction. Which one has more kinetic energy?",
          options: [
            { label: "The faster ball", value: "fast" },
            { label: "The slower ball", value: "slow" },
            { label: "They always have equal kinetic energy", value: "equal" }
          ],
          answer: "fast",
          feedback: "For objects with the same mass, the faster-moving object has more kinetic energy. Kinetic energy depends on both mass and speed."
        },
        challenge: "What changes when a ball collides with the ground and bounces? Consider its speed and direction."
      },
      {
        id: "gravity",
        title: "Gravity",
        category: "INTERACTIONS",
        explanation: "Gravity is an attractive interaction between masses. Near Earth's surface, Earth's gravitational field exerts a downward force on the ball. This is why a ball thrown upward eventually returns towards the ground.",
        connection: "When a ball is in the air, gravity continually changes its vertical motion, even while it is moving upward.",
        question: {
          prompt: "After a ball leaves a player's hand and travels upward, which force continues to act downward (ignoring air resistance)?",
          options: [
            { label: "The gravitational force", value: "gravity" },
            { label: "The force of the player's hand", value: "hand" },
            { label: "A forward push that never stops", value: "push" }
          ],
          answer: "gravity",
          feedback: "Earth's gravitational force continues to act on the ball after it leaves the player's hand. The hand is no longer in contact with it."
        },
        challenge: "How would the path of a ball differ if it were thrown horizontally from a higher point?"
      }
    ]
  },
  guitar: {
    displayName: "Guitar",
    concepts: [
      {
        id: "vibrations",
        title: "Vibrations",
        category: "WAVES AND SOUND",
        explanation: "When a guitar string is plucked, it vibrates: it moves repeatedly around an equilibrium position. The vibrating string transfers energy to the surrounding air and helps produce sound. The guitar body also vibrates and helps transmit sound to the air.",
        connection: "Plucking a string sets it vibrating. The vibration causes pressure variations in the surrounding air that travel as a sound wave.",
        question: {
          prompt: "What starts the sound being produced when a guitar string is played?",
          options: [
            { label: "The string vibrates", value: "vibrate" },
            { label: "The string stops moving forever", value: "stop" },
            { label: "The guitar changes its mass", value: "mass" }
          ],
          answer: "vibrate",
          feedback: "Plucking the string makes it vibrate. Those vibrations help create sound waves in the surrounding air."
        },
        challenge: "What do you think happens to the sound as the string's vibrations gradually become smaller?"
      },
      {
        id: "frequency",
        title: "Frequency and pitch",
        category: "WAVES AND SOUND",
        explanation: "Frequency is the number of complete oscillations or cycles per second, measured in hertz (Hz). For a vibrating guitar string, a higher frequency generally produces a higher-pitched note.",
        connection: "Tightening a guitar string usually increases its tension and changes its vibration frequency, which changes the pitch of the note.",
        question: {
          prompt: "Which vibrating string generally produces the higher-pitched note?",
          options: [
            { label: "The string with the higher frequency", value: "high" },
            { label: "The string with the lower frequency", value: "low" },
            { label: "Frequency has no relationship with pitch", value: "none" }
          ],
          answer: "high",
          feedback: "A higher frequency of vibration is heard as a higher pitch. Frequency describes how many cycles happen each second."
        },
        challenge: "How could changing the length or tension of a string affect its frequency?"
      }
    ]
  },
  lamp: {
    displayName: "Lamp",
    concepts: [
      {
        id: "electrical-energy",
        title: "Electrical energy",
        category: "ELECTRICITY AND ENERGY",
        explanation: "A lamp transfers energy electrically from a power source to its components. In a working circuit, an electric current flows through the circuit. The lamp then transfers energy to its surroundings, mainly as light and thermal energy.",
        connection: "When switched on, the lamp uses electrical energy and transfers energy to the surroundings as light and heat.",
        question: {
          prompt: "What are two forms in which a typical lamp transfers energy to its surroundings?",
          options: [
            { label: "Light and thermal energy", value: "light-thermal" },
            { label: "Sound and gravitational energy only", value: "sound-gravity" },
            { label: "Nuclear energy and chemical energy only", value: "nuclear-chemical" }
          ],
          answer: "light-thermal",
          feedback: "A lamp transfers energy to its surroundings as light and also as thermal energy. The proportions depend on the type of lamp."
        },
        challenge: "Compare an LED lamp with an older incandescent bulb. How might the energy transfers differ?"
      },
      {
        id: "circuits",
        title: "Electric circuits",
        category: "ELECTRICITY",
        explanation: "An electric circuit is a complete conducting path through which charge can flow. In a simple lamp circuit, the switch controls whether the path is complete. If the circuit is open, current does not flow through the lamp as intended.",
        connection: "The switch opens or closes the circuit. Closing the circuit provides a complete path for current, allowing the lamp to operate.",
        question: {
          prompt: "What happens when a switch opens a simple series circuit containing a lamp?",
          options: [
            { label: "The current stops flowing and the lamp goes out", value: "open" },
            { label: "The lamp becomes a battery", value: "battery" },
            { label: "The circuit becomes brighter automatically", value: "bright" }
          ],
          answer: "open",
          feedback: "Opening the circuit breaks the conducting path. In a simple series circuit, current stops and the lamp goes out."
        },
        challenge: "Draw a simple circuit containing a cell, a switch and a lamp. Mark where the current flows when the switch is closed."
      }
    ]
  },
  headphones: {
    displayName: "Headphones",
    concepts: [
      {
        id: "sound-waves",
        title: "Sound waves",
        category: "WAVES AND SOUND",
        explanation: "Sound is a mechanical wave. It travels through a medium, such as air, as a pattern of pressure variations. Headphones contain small drivers that vibrate and create changing pressure in the air near your ears.",
        connection: "The headphone driver moves back and forth, producing pressure variations that travel through the air to your eardrum.",
        question: {
          prompt: "What kind of wave is sound in air?",
          options: [
            { label: "A mechanical wave", value: "mechanical" },
            { label: "A light wave", value: "light" },
            { label: "A wave that needs no medium", value: "none" }
          ],
          answer: "mechanical",
          feedback: "Sound is a mechanical wave because it travels through vibrations of particles in a medium. It cannot travel through a vacuum."
        },
        challenge: "Why would ordinary headphones not transmit sound to your ears through the vacuum of space?"
      },
      {
        id: "electrical-signals",
        title: "Electrical signals",
        category: "ELECTRICITY",
        explanation: "An audio device sends changing electrical signals to the headphone driver. The driver converts these electrical variations into mechanical vibrations, which create sound waves.",
        connection: "The headphone cable or wireless electronics deliver an audio signal to the driver, which moves to reproduce the sound.",
        question: {
          prompt: "In a typical headphone driver, what do electrical signals help produce?",
          options: [
            { label: "Mechanical vibrations", value: "vibrations" },
            { label: "A change in the headphones' mass", value: "mass" },
            { label: "Gravity disappearing", value: "gravity" }
          ],
          answer: "vibrations",
          feedback: "The driver converts the changing electrical signal into mechanical vibrations. These vibrations create sound waves."
        },
        challenge: "How might changing the electrical audio signal affect the sound you hear?"
      }
    ]
  },
  skateboard: {
    displayName: "Skateboard",
    concepts: [
      {
        id: "friction",
        title: "Friction",
        category: "FORCES AND INTERACTIONS",
        explanation: "Friction acts between surfaces in contact and opposes relative sliding. Friction in the wheel bearings and between the wheels and ground can affect how a skateboard moves. Friction is also important when a rider uses a foot or another braking method to slow down.",
        connection: "The interaction between the wheels and ground helps the skateboard roll and turn. Resistive forces gradually reduce its speed when the rider is not pushing.",
        question: {
          prompt: "If resistive forces act on a skateboard after the rider stops pushing, what usually happens to its speed?",
          options: [
            { label: "It gradually decreases", value: "decrease" },
            { label: "It increases forever", value: "increase" },
            { label: "It instantly becomes infinite", value: "infinite" }
          ],
          answer: "decrease",
          feedback: "Resistive forces oppose the skateboard's motion, so its speed decreases unless another force keeps it moving or speeds it up."
        },
        challenge: "How might the skateboard behave differently on a smooth surface compared with a rough surface?"
      },
      {
        id: "energy",
        title: "Energy transfer",
        category: "ENERGY",
        explanation: "A moving skateboard has kinetic energy. When a rider pushes against the ground, energy from the rider's body is transferred to the skateboard's motion. Resistive forces transfer some mechanical energy to thermal energy and sound in the surroundings.",
        connection: "Pushing with a foot can increase the skateboard's speed and kinetic energy. As it slows, energy is transferred to the surroundings.",
        question: {
          prompt: "A skateboard speeds up after a push. What happens to its kinetic energy?",
          options: [
            { label: "It increases", value: "increase" },
            { label: "It disappears completely", value: "disappear" },
            { label: "It turns into charge", value: "charge" }
          ],
          answer: "increase",
          feedback: "As the skateboard speeds up, its kinetic energy increases. Energy is transferred from the rider to the moving skateboard."
        },
        challenge: "Where does some of the skateboard's mechanical energy go as it rolls to a stop?"
      }
    ]
  },
  fan: {
    displayName: "Fan",
    concepts: [
      {
        id: "rotation",
        title: "Rotational motion",
        category: "MOTION",
        explanation: "A fan's blades rotate around a central axis. The motor applies a turning effect to the blades, causing them to spin. Points on the blades move in circular paths around the axis.",
        connection: "The motor turns the central shaft, which makes the fan blades rotate and move air.",
        question: {
          prompt: "What is the name for motion around a fixed axis?",
          options: [
            { label: "Rotational motion", value: "rotation" },
            { label: "Random motion only", value: "random" },
            { label: "No motion", value: "none" }
          ],
          answer: "rotation",
          feedback: "Rotational motion is motion around an axis. A fan blade traces a circular path as it rotates."
        },
        challenge: "How would increasing the fan's rotational speed affect how quickly the blades complete each revolution?"
      },
      {
        id: "energy",
        title: "Energy transfer",
        category: "ENERGY",
        explanation: "A fan transfers electrical energy to mechanical energy in the rotating blades and moving air. Some energy is also transferred to the surroundings as thermal energy and sound.",
        connection: "The motor uses electrical energy to rotate the blades, which transfer energy to the air and create airflow.",
        question: {
          prompt: "Which energy transfer best describes a fan while it is operating?",
          options: [
            { label: "Electrical energy to mechanical energy, with some thermal and sound energy", value: "correct" },
            { label: "Light energy to nuclear energy only", value: "wrong1" },
            { label: "Gravitational energy to chemical energy only", value: "wrong2" }
          ],
          answer: "correct",
          feedback: "The motor transfers electrical energy into mechanical energy of the rotating blades and moving air. Some energy is also dissipated as heat and sound."
        },
        challenge: "Why might a fan become warm after operating for a long time?"
      }
    ]
  }
};

const OBJECT_ALIASES = {
  cycle: "bicycle",
  bike: "bicycle",
  football: "ball",
  soccerball: "ball",
  guitar: "guitar",
  light: "lamp",
  lightbulb: "lamp",
  earphones: "headphones",
  earbuds: "headphones",
  skateboard: "skateboard",
  electricfan: "fan"
};

const elements = {
  photoInput: document.getElementById("photoInput"),
  dropZone: document.getElementById("dropZone"),
  uploadPrompt: document.getElementById("uploadPrompt"),
  imagePreview: document.getElementById("imagePreview"),
  removeImageButton: document.getElementById("removeImageButton"),
  objectInput: document.getElementById("objectInput"),
  analyzeButton: document.getElementById("analyzeButton"),
  inputMessage: document.getElementById("inputMessage"),
  resultsSection: document.getElementById("resultsSection"),
  resultsSubheading: document.getElementById("resultsSubheading"),
  conceptList: document.getElementById("conceptList"),
  conceptCategory: document.getElementById("conceptCategory"),
  conceptTitle: document.getElementById("conceptTitle"),
  conceptExplanation: document.getElementById("conceptExplanation"),
  conceptConnection: document.getElementById("conceptConnection"),
  questionPrompt: document.getElementById("questionPrompt"),
  answerOptions: document.getElementById("answerOptions"),
  checkAnswerButton: document.getElementById("checkAnswerButton"),
  feedbackBox: document.getElementById("feedbackBox"),
  exploreNext: document.getElementById("exploreNext"),
  challengeText: document.getElementById("challengeText"),
  resetButton: document.getElementById("resetButton"),
  toast: document.getElementById("toast")
};

let selectedImageUrl = null;
let activeProfile = null;
let activeConcept = null;
let selectedAnswer = null;
let toastTimer = null;

function normalizeObjectName(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

function findObjectProfile(userText) {
  const normalized = normalizeObjectName(userText);
  const lookupKey = OBJECT_ALIASES[normalized] || normalized;
  return OBJECT_LIBRARY[lookupKey] || null;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 3000);
}

function setImage(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    elements.inputMessage.textContent = "Please choose an image file.";
    return;
  }

  const maximumBytes = 8 * 1024 * 1024;
  if (file.size > maximumBytes) {
    elements.inputMessage.textContent = "That image is larger than 8 MB. Please choose a smaller file.";
    return;
  }

  if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
  selectedImageUrl = URL.createObjectURL(file);
  elements.imagePreview.src = selectedImageUrl;
  elements.imagePreview.hidden = false;
  elements.uploadPrompt.hidden = true;
  elements.removeImageButton.hidden = false;
  elements.inputMessage.textContent = "Image ready. In this prototype it is previewed locally, not analysed by AI.";
}

function removeImage() {
  if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
  selectedImageUrl = null;
  elements.photoInput.value = "";
  elements.imagePreview.removeAttribute("src");
  elements.imagePreview.hidden = true;
  elements.uploadPrompt.hidden = false;
  elements.removeImageButton.hidden = true;
}

function renderConceptButtons() {
  elements.conceptList.replaceChildren();

  activeProfile.concepts.forEach((concept, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "concept-button";
    button.textContent = concept.title;
    button.setAttribute("aria-pressed", String(index === 0));
    button.addEventListener("click", () => selectConcept(concept.id));
    elements.conceptList.append(button);
  });
}

function renderQuestion(concept) {
  selectedAnswer = null;
  elements.answerOptions.replaceChildren();
  elements.questionPrompt.textContent = concept.question.prompt;
  elements.checkAnswerButton.disabled = true;
  elements.feedbackBox.hidden = true;
  elements.feedbackBox.className = "feedback-box";
  elements.exploreNext.hidden = true;

  concept.question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.setAttribute("aria-pressed", "false");

    const marker = document.createElement("span");
    marker.className = "option-marker";
    marker.textContent = String.fromCharCode(65 + index);

    const label = document.createElement("span");
    label.textContent = option.label;

    button.append(marker, label);
    button.addEventListener("click", () => {
      selectedAnswer = option.value;
      elements.answerOptions.querySelectorAll(".answer-option").forEach((choice) => {
        choice.classList.remove("selected");
        choice.setAttribute("aria-pressed", "false");
      });
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      elements.checkAnswerButton.disabled = false;
      elements.feedbackBox.hidden = true;
      elements.exploreNext.hidden = true;
    });
    elements.answerOptions.append(button);
  });
}

function selectConcept(conceptId) {
  activeConcept = activeProfile.concepts.find((concept) => concept.id === conceptId);
  if (!activeConcept) return;

  elements.conceptList.querySelectorAll(".concept-button").forEach((button, index) => {
    const isActive = activeProfile.concepts[index].id === conceptId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.conceptCategory.textContent = activeConcept.category;
  elements.conceptTitle.textContent = activeConcept.title;
  elements.conceptExplanation.textContent = activeConcept.explanation;
  elements.conceptConnection.textContent = activeConcept.connection;
  elements.challengeText.textContent = activeConcept.challenge;
  renderQuestion(activeConcept);
}

function runDemoAnalysis() {
  const userText = elements.objectInput.value;
  const profile = findObjectProfile(userText);

  if (!userText.trim()) {
    elements.inputMessage.textContent = "Enter an object name or choose one of the sample objects first.";
    elements.objectInput.focus();
    return;
  }

  if (!profile) {
    const supported = Object.values(OBJECT_LIBRARY).map((item) => item.displayName).join(", ");
    elements.inputMessage.textContent = `This demo currently supports: ${supported}.`;
    elements.objectInput.focus();
    return;
  }

  activeProfile = profile;
  elements.inputMessage.textContent = "";
  elements.resultsSubheading.textContent = `${profile.displayName} · ${profile.concepts.length} curated Physics connections`;
  renderConceptButtons();
  elements.resultsSection.hidden = false;
  selectConcept(profile.concepts[0].id);
  elements.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!selectedImageUrl) {
    showToast("Demo result loaded from the object name. Add a photo to preview it locally.");
  } else {
    showToast("Photo preview attached. The concepts are from the curated demo dataset.");
  }
}

function checkAnswer() {
  if (!activeConcept || selectedAnswer === null) return;

  const isCorrect = selectedAnswer === activeConcept.question.answer;
  elements.feedbackBox.hidden = false;
  elements.feedbackBox.className = `feedback-box ${isCorrect ? "correct" : "incorrect"}`;
  elements.feedbackBox.replaceChildren();

  const heading = document.createElement("strong");
  heading.textContent = isCorrect ? "Good reasoning!" : "Not quite — let's unpack it.";
  const explanation = document.createElement("span");
  explanation.textContent = activeConcept.question.feedback;
  elements.feedbackBox.append(heading, explanation);

  elements.exploreNext.hidden = false;
  elements.checkAnswerButton.disabled = true;
}

function resetExperience() {
  elements.resultsSection.hidden = true;
  elements.objectInput.value = "";
  elements.inputMessage.textContent = "";
  elements.conceptList.replaceChildren();
  activeProfile = null;
  activeConcept = null;
  selectedAnswer = null;
  removeImage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Wire up user actions. Keeping these listeners together makes the app easier to follow.
elements.photoInput.addEventListener("change", (event) => setImage(event.target.files[0]));
elements.removeImageButton.addEventListener("click", removeImage);
elements.analyzeButton.addEventListener("click", runDemoAnalysis);
elements.checkAnswerButton.addEventListener("click", checkAnswer);
elements.resetButton.addEventListener("click", resetExperience);

document.querySelectorAll(".sample-chip").forEach((button) => {
  button.addEventListener("click", () => {
    elements.objectInput.value = button.dataset.object;
    elements.inputMessage.textContent = "Sample object selected. Choose Explore this object to continue.";
    elements.objectInput.focus();
  });
});

// Make the upload area work with drag-and-drop as well as the file picker.
elements.dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("drag-over");
});
elements.dropZone.addEventListener("dragleave", () => elements.dropZone.classList.remove("drag-over"));
elements.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("drag-over");
  setImage(event.dataTransfer.files[0]);
});
elements.dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    elements.photoInput.click();
  }
});
