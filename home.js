const homeMessages = {
  info: "Stochastic Typewriter is inspired by Johanna Drucker's \nletterpress book Stochastic Poetics, which proposes that poetry evolves under conditions that cannot be predicted. \nDrucker printed it that way too, with shifting lines and overprinting that made every copy unique.\n\nStochastic Typewriter carries that idea from the press to the screen: a programmed typewriter whose rules bend your words as you write, and a room where the surrounding sound, wind, \nand noise reshape them as they are read_",
  typing: "Typing Space is where your words enter the machine.\nYou write, and the machine intervenes.\n\nChoose a folder and write into the open page. \nEach folder is a small machine with its own rules. \n It bends the rhythm and behaviour of your words\n before they travel on to the Reading Room_",
  reading: "Reading Room is where your words are \nread back by your surroundings and distractions.\n\n Turn on your microphone. Let the sound, wind, \nand noise scatter letters, and reshape the text \non the paper_"
};
const homeTypedText = document.querySelector("#home-typed-text");
const homePaperLink = document.querySelector("#home-paper-link");

function showHomePaperMessage(message) {
  homeTypedText.textContent = message;
}

function typeHomeMessage(section) {
  const message = homeMessages[section];
  const destination = section === "typing" ? "typing-space.html" : section === "reading" ? "reading-room.html" : "";
  homePaperLink.hidden = !destination;
  homePaperLink.href = destination || "#";
  const destinationLabel = section === "typing" ? "typing space" : "reading room";
  homePaperLink.textContent = destination ? destinationLabel + " →" : "";
  showHomePaperMessage(message);
}
document.querySelectorAll(".home-folder").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".home-folder").forEach((folder) => {
      folder.style.transform = "rotate(" + Math.round((Math.random() * 40) - 20) + "deg)";
      folder.classList.toggle("is-active-home-folder", folder === button);
    });
    typeHomeMessage(button.dataset.homeSection);
  });
});
const infoFolder = document.querySelector("[data-home-section='info']");
infoFolder.classList.add("is-active-home-folder");
typeHomeMessage("info");
const homeTitle = document.querySelector("#home-title");
homeTitle.innerHTML = homeTitle.textContent.split("").map((letter) =>
  letter === " " ? "<br>" : "<span class=\"home-title-letter\">" + letter + "</span>"
).join("");

// The title uses the microphone like the Reading Room: bass adds weight,
// voices make letters jump, and treble creates wind-like rotation.
async function startTitleSoundReaction() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    audioContext.createMediaStreamSource(stream).connect(analyser);
    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    const letters = [...document.querySelectorAll(".home-title-letter")];
    const energyBetween = (minimum, maximum) => {
      const binSize = audioContext.sampleRate / analyser.fftSize;
      const start = Math.max(0, Math.floor(minimum / binSize));
      const end = Math.min(frequencies.length - 1, Math.ceil(maximum / binSize));
      let total = 0;
      for (let index = start; index <= end; index++) total += frequencies[index];
      return total / Math.max(1, end - start + 1);
    };
    function reactTitle() {
      analyser.getByteFrequencyData(frequencies);
      const bass = energyBetween(20, 250);
      const voices = energyBetween(250, 4000);
      const treble = energyBetween(4000, 14000);
      letters.forEach((letter, index) => {
        const weight = Math.round(400 + (bass / 255) * 500);
        const jump = (Math.sin((performance.now() * 0.018) + index * 2.1) + Math.sin((performance.now() * 0.007) + index * 0.9)) * (voices / 255) * 16;
        const wind = Math.sin((performance.now() * 0.012) + index * 1.7) * (treble / 255) * 28;
        letter.style.fontVariationSettings = "\"wght\" " + weight;
        letter.style.transform = "translateY(" + jump + "px) rotate(" + wind + "deg)";
      });
      window.requestAnimationFrame(reactTitle);
    }
    reactTitle();
  } catch (error) {
    console.log("Microphone permission was not granted; the homepage title remains still.");
  }
}
startTitleSoundReaction();
