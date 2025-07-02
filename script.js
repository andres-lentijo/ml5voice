let recognizer;
let currentSection = 0;
const totalSections = 8;
const sectionsContainer = document.getElementById('sections-container');
const sections = document.querySelectorAll('.section');

async function setup() {
  console.log("Setup function called. Current URL:", window.location.href);
  runMicrophoneTest();

  recognizer = speechCommands.create('BROWSER_FFT');
  await recognizer.ensureModelLoaded();
  console.log("Speech Commands model loaded.");

  recognizer.listen(result => {
    const scores = result.scores;
    const labels = recognizer.wordLabels();
    const maxScoreIndex = scores.indexOf(Math.max(...scores));
    const command = labels[maxScoreIndex];
    const confidence = scores[maxScoreIndex];

    console.log("Heard:", command, "Confidence:", confidence.toFixed(2));

    if (confidence > 0.85) {
      handleCommand(command.toLowerCase());
    } else {
      console.log("Low confidence, ignoring.");
    }
  }, {
    includeSpectrogram: false,
    probabilityThreshold: 0.75
  });
}

function handleCommand(command) {
  const numberWords = {
    'one': 0,
    'two': 1,
    'three': 2,
    'four': 3,
    'five': 4,
    'six': 5,
    'seven': 6,
    'eight': 7
  };

  if (command === 'up') {
    scrollToSection(0);
  } else if (command === 'down') {
    scrollToSection(totalSections - 1);
  } else if (command in numberWords) {
    scrollToSection(numberWords[command]);
  } else {
    console.log("Command not recognized:", command);
  }
}

function scrollToSection(index) {
  if (index < 0) index = 0;
  if (index >= totalSections) index = totalSections - 1;

  currentSection = index;
  const targetSection = sections[currentSection];
  if (targetSection) {
    sectionsContainer.scrollTo({
      top: targetSection.offsetTop,
      behavior: 'smooth'
    });
    console.log(`Scrolled to section ${currentSection + 1}`);
  }
}

function runMicrophoneTest() {
  console.log("Running microphone access test...");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log("Microphone access granted.");
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(err => {
        console.error("Microphone error:", err);
        if (err.name === "NotAllowedError") {
          console.warn("Microphone access was denied.");
        } else if (err.name === "NotFoundError") {
          console.warn("No microphone found.");
        }
      });
  } else {
    console.warn("getUserMedia not supported.");
  }
}

window.onload = setup;
