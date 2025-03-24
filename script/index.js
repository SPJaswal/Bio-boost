const questions = [
  { label: "Voornaam", type: "text", name: "voornaam" },
  { label: "Achternaam", type: "text", name: "achternaam" },
  { label: "E-mailadres", type: "email", name: "email" },
  { label: "Leeftijd", type: "number", name: "leeftijd" },
  { label: "Geslacht", type: "button-select", name: "geslacht", options: ["Man", "Vrouw", "Anders"] },
  { label: "Lengte (cm)", type: "number", name: "lengte" },
  { label: "Gewicht (kg)", type: "number", name: "gewicht" },
  { label: "Wachtwoord", type: "password", name: "password" }
];

  
  let currentStep = 0;
  const formData = {};
  
  const questionTitle = document.getElementById("question-title");
  const formStep = document.getElementById("form-step");
  const nextBtn = document.getElementById("nextBtn");
  
  function loadQuestion() {
    const q = questions[currentStep];
    questionTitle.textContent = q.label;
    formStep.innerHTML = "";
  
    let inputField;
  
    if (q.type === "button-select") {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("option-buttons");
  
      q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = option;
        btn.classList.add("select-option-btn");
  
        btn.addEventListener("click", () => {
          // deselect all first
          const allBtns = document.querySelectorAll(".select-option-btn");
          allBtns.forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
  
          // Save selected value
          btn.setAttribute("data-selected", "true");
          formData[q.name] = option;
        });
  
        buttonContainer.appendChild(btn);
      });
  
      formStep.appendChild(buttonContainer);
    } else if (q.type === "select") {
      inputField = document.createElement("select");
      q.options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        inputField.appendChild(opt);
      });
      inputField.name = q.name;
      inputField.id = "inputField";
      inputField.classList.add("input");
      formStep.appendChild(inputField);
    } else {
      inputField = document.createElement("input");
      inputField.type = q.type;
      inputField.name = q.name;
      inputField.id = "inputField";
      inputField.classList.add("input");
      formStep.appendChild(inputField);
    }
  
    const errorMsg = document.createElement("div");
    errorMsg.id = "error-msg";
    errorMsg.style.color = "red";
    errorMsg.style.marginTop = "0.5rem";
    formStep.appendChild(errorMsg);
  
    if (inputField) {
      inputField.focus();
    }
  }
  
  nextBtn.addEventListener("click", () => {
    const q = questions[currentStep];
    const errorMsg = document.getElementById("error-msg");
  
    if (q.type === "button-select") {
      const selectedBtn = document.querySelector(".select-option-btn.selected");
      if (!selectedBtn) {
        errorMsg.textContent = "Selecteer een optie.";
        return;
      }
    } else {
      const input = document.getElementById("inputField");
      if (input.value.trim() === "") {
        errorMsg.textContent = "Dit veld mag niet leeg zijn.";
        return;
      }
  
      // Simpele email check
      if (input.type === "email") {
        const emailRegex = /.+@.+/;
        if (!emailRegex.test(input.value.trim())) {
          errorMsg.textContent = "Voer een geldig e-mailadres in.";
          return;
        }
      }
  
      // Leeftijd check
      if (input.name === "leeftijd") {
        const leeftijd = parseInt(input.value.trim());
        if (leeftijd < 0 || leeftijd > 120) {
          errorMsg.textContent = "Voer een geldige leeftijd in (0-120).";
          return;
        }
      }
  
      // Lengte check
      if (input.name === "lengte") {
        const lengte = parseInt(input.value.trim());
        if (lengte < 50 || lengte > 250) {
          errorMsg.textContent = "Lengte moet tussen 50 en 250 cm zijn.";
          return;
        }
      }
  
      // Gewicht check
      if (input.name === "gewicht") {
        const gewicht = parseInt(input.value.trim());
        if (gewicht < 20 || gewicht > 300) {
          errorMsg.textContent = "Gewicht moet tussen 20 en 300 kg zijn.";
          return;
        }
      }
  
      // Alles is goed
      errorMsg.textContent = "";
      formData[q.name] = input.value.trim();
    }
  
    currentStep++;
    if (currentStep < questions.length) {
      loadQuestion();
    } else {
      questionTitle.textContent = "Registratie voltooid!";
      formStep.innerHTML = "<p>Dankjewel voor je registratie 🎉<br>Formulier wordt verzonden...</p>";
      nextBtn.style.display = "none";
      
      // Zorg dat alle verzamelde antwoorden ook echt in hidden fields komen,
      // zodat ze in PHP via $_POST beschikbaar zijn:
      const multiStepForm = document.getElementById("multiStepForm");
      Object.keys(formData).forEach((key) => {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = key;
        hiddenInput.value = formData[key];
        multiStepForm.appendChild(hiddenInput);
      });
      
      // Nu mogen we het formulier laten submitten
      multiStepForm.submit();
    }
  });
  
  // Init
  loadQuestion();
  
  // Prevent default form submit
// We blokkeren de submit alléén zolang we nog vragen hebben
document.getElementById("multiStepForm").addEventListener("submit", function (e) {
  // Laat het formulier alleen doorgaan als we bij de laatste step zijn
  if (currentStep < questions.length) {
    e.preventDefault();
  }
});

  
  // Enter = volgende
  document.getElementById("multiStepForm").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      nextBtn.click();
    }
  });
  