const typingInput = document.querySelector("#editable-text-layer");
let activeTypingBook = "1";
let dreamLoopSwitch = false;
const questionPrompts = ["And then?", "Why?", "Is it true?", "For whom?", "Still here?"];
const folderDescription = document.querySelector("#folder-description");
const folderConcepts = {
  "1": "A diary without “a” replaces every typed a with another vowel.",
  "2": "Things make you stutter repeats consonants as you write.",
  "3": "Dream loop returns a recurring line after every three written lines.",
  "4": "Questions adds one random question after every line.",
  "5": "All is all begins every new line with “All is”.",
  "6": "Fließtext leaves your words exactly as you write them."
};
typingInput.contentEditable = "false";
typingInput.dataset.placeholder = "choose a folder to begin writing";
function placeTypingCaretAtEnd() {
  typingInput.focus();
  const range = document.createRange();
  range.selectNodeContents(typingInput); range.collapse(false);
  const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
}
document.querySelectorAll(".folder").forEach((folder) => {
  folder.addEventListener("click", () => {
    if (activeTypingBook === "5" && folder.dataset.book !== "5") {
      typingInput.innerText = typingInput.innerText.replace(/^All is ?/gm, "");
    }
    activeTypingBook = folder.dataset.book;
    document.querySelectorAll(".folder").forEach((item) => item.classList.toggle("is-active-folder", item === folder));
    folderDescription.textContent = folderConcepts[activeTypingBook];
    dreamLoopSwitch = false;
    typingInput.contentEditable = "true";
    typingInput.dataset.placeholder = "click to write";
    if (activeTypingBook === "5" && typingInput.innerText.trim() === "") {
      typingInput.innerText = "All is ";
    }
    placeTypingCaretAtEnd();
  });
});
typingInput.addEventListener("input", (event) => {
  if (activeTypingBook === "1" && event.inputType === "insertText" && /a/i.test(event.data || "")) {
    typingInput.innerText = typingInput.innerText.replace(/a/gi, () => ["i", "u", "o", "e"][Math.floor(Math.random() * 4)]);
    placeTypingCaretAtEnd();
  }
  if (activeTypingBook === "2" && event.inputType === "insertText" && /^[tscrpbfkjgdx]$/i.test(event.data || "")) {
    typingInput.innerText += event.data.repeat(Math.floor(Math.random() * 3));
    placeTypingCaretAtEnd();
  }
  if (event.inputType !== "insertParagraph") return;
  let lines = typingInput.innerText.split("\n");
  let written = lines.filter((line) => line.trim());
  if (activeTypingBook === "3" && written.length > 0 && written.length % 3 === 0) {
    typingInput.innerText = typingInput.innerText.trimEnd() + "\n" + (dreamLoopSwitch ? "but then, i woke up" : "then i woke up again") + "\n";
    dreamLoopSwitch = !dreamLoopSwitch; placeTypingCaretAtEnd();
  } else if (activeTypingBook === "4" && written.length > 0) {
    const question = questionPrompts[Math.floor(Math.random() * questionPrompts.length)];
    typingInput.innerText = typingInput.innerText.trimEnd() + "\n" + question + "\n";
    placeTypingCaretAtEnd();
  } else if (activeTypingBook === "5") {
    typingInput.innerText = typingInput.innerText.trimEnd() + "\nAll is ";
    placeTypingCaretAtEnd();
  }
});
document.querySelector("#move-to-reading").addEventListener("click", () => {
  sessionStorage.setItem("stochastic-current-text", typingInput.innerText.trimEnd());
  sessionStorage.setItem("stochastic-current-book", activeTypingBook);
});
