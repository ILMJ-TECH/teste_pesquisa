const questions = [
  {
    id: 1,
    type: "radio",
    title:
      "Qual o seu principal objetivo ao visitar o site de carreiras do Grupo Fleury?",
    subtitle: "Selecione apenas uma opção.",
    options: [
      "Procurar e me candidatar a vagas abertas.",
      "Pesquisar sobre a cultura e os valores da empresa.",
      "Buscar informações sobre programas específicos (Estágio, Trainee, Aprendiz).",
      "Obter informações sobre benefícios e o dia a dia dos colaboradores.",
      "Outro objetivo.",
    ],
  },
  {
    id: 2,
    type: "radio",
    title: "Qual o seu nível de experiência na área de saúde ou serviços?",
    subtitle: "Selecione apenas uma opção.",
    options: [
      "Estudante / Sem experiência profissional formal.",
      "Iniciante (até 2 anos de experiência).",
      "Pleno (2 a 5 anos de experiência).",
      "Sênior / Especialista (Mais de 5 anos de experiência).",
      "Liderança / Gestão.",
    ],
  },
  {
    id: 3,
    type: "scale",
    title: "Foi fácil encontrar a seção de vagas abertas ('Oportunidades')?",
    subtitle: "Escala de Facilidade: 1 = Muito Difícil e 5 = Muito Fácil.",
    minLabel: "Muito Difícil",
    maxLabel: "Muito Fácil",
  },
  {
    id: 4,
    type: "scale",
    title: "A organização do conteúdo e do menu principal é lógica?",
    subtitle:
      "Escala de Satisfação: 1 = Discordo Totalmente e 5 = Concordo Totalmente.",
    minLabel: "Discordo Totalmente",
    maxLabel: "Concordo Totalmente",
  },
  {
    id: 5,
    type: "scale",
    title:
      "O site se adapta e funciona bem em dispositivos móveis (celular/tablet)?",
    subtitle: "Escala de Satisfação: 1 = Muito Ruim e 5 = Muito Bom.",
    minLabel: "Muito Ruim",
    maxLabel: "Muito Bom",
  },
  {
    id: 8,
    type: "scale",
    title:
      "A descrição dos valores e da cultura ('Nossa Essência') é clara e atrativa?",
    subtitle:
      "Escala de Satisfação: 1 = Totalmente Insatisfeito(a) e 5 = Totalmente Satisfeito(a).",
    minLabel: "Insatisfeito(a)",
    maxLabel: "Satisfeito(a)",
  },
  {
    id: 9,
    type: "scale",
    title: "O conteúdo sobre Benefícios e Vantagens é detalhado e convincente?",
    subtitle:
      "Escala de Satisfação: 1 = Totalmente Insatisfeito(a) e 5 = Totalmente Satisfeito(a).",
    minLabel: "Insatisfeito(a)",
    maxLabel: "Satisfeito(a)",
  },
  {
    id: 14,
    type: "radio",
    title:
      "A descrição das vagas de emprego (responsabilidades e requisitos) é:",
    subtitle: "Selecione a opção que melhor se aplica.",
    options: [
      "Muito incompleta.",
      "Razoável.",
      "Completa e clara.",
      "Não procurei por vagas.",
    ],
  },
  {
    id: 16,
    type: "radio",
    title:
      "O site o(a) incentivou a se candidatar ou a acompanhar futuras vagas do Grupo Fleury?",
    subtitle: "Selecione o nível de incentivo.",
    options: ["Sim, muito.", "Sim, um pouco.", "Neutro.", "Não me incentivou."],
  },
  {
    id: 17,
    type: "radio",
    title:
      "Qual palavra melhor descreve sua impressão geral sobre o Grupo Fleury como empregador, após visitar o site?",
    subtitle: "Selecione apenas uma opção.",
    options: [
      "Inovador(a)",
      "Acolhedor(a)",
      "Profissional",
      "Confuso(a)",
      "Desinteressante",
    ],
  },
  {
    id: 18,
    type: "scale-10",
    title:
      "Em uma escala de 0 a 10, qual a probabilidade de você recomendar o site de carreiras do Grupo Fleury para outros profissionais que procuram emprego?",
    subtitle:
      "(NPS - Net Promoter Score) 0 = Nada provável, 10 = Muito provável.",
    minLabel: "Nada provável (0)",
    maxLabel: "Muito provável (10)",
  },
  {
    id: 19,
    type: "radio",
    title:
      "Em geral, sua satisfação com o site de carreiras do Grupo Fleury é:",
    subtitle: "Selecione seu nível de satisfação geral.",
    options: [
      "Muito Insatisfeito(a).",
      "Insatisfeito(a).",
      "Neutro.",
      "Satisfeito(a).",
      "Muito Satisfeito(a).",
    ],
  },
];

let currentQuestionIndex = 0;
let userResponses = {};

const questionContent = document.getElementById("questionContent");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const finishButton = document.getElementById("finishButton");
const progressBar = document.getElementById("progressBar");
const currentStepSpan = document.getElementById("currentStep");
const totalStepsSpan = document.getElementById("totalSteps");

function renderRadioQuestion(question) {
  let optionsHTML = question.options
    .map(
      (option, index) => `
    <label>
      <input type="radio" name="q${question.id}" value="${option}" ${
        userResponses[question.id] === option ? "checked" : ""
      } />
      <span>${option}</span>
    </label>
  `
    )
    .join("");

  return `
    <h1>${question.title}</h1>
    <p class="sub">${question.subtitle}</p>
    <div class="options" onchange="enableNextButton()">
      ${optionsHTML}
    </div>
  `;
}

function renderScaleQuestion(question) {
  const numSteps = question.type === "scale-10" ? 11 : 5;
  const start = question.type === "scale-10" ? 0 : 1;
  let numbersHTML = "";
  for (let i = start; i < start + numSteps; i++) {
    const isSelected =
      userResponses[question.id] === i.toString() ? "selected" : "";
    numbersHTML += `<span data-value="${i}" class="${isSelected}">${i}</span>`;
  }

  return `
    <h1>${question.title}</h1>
    <p class="sub">${question.subtitle}</p>
    <div class="scale-container" onclick="handleScaleClick(event, ${question.id})">
      <div class="scale-numbers">
        ${numbersHTML}
      </div>
      <div class="scale-labels">
        <span class="label-min">${question.minLabel}</span>
        <span class="label-max">${question.maxLabel}</span>
      </div>
    </div>
  `;
}

function handleScaleClick(event, questionId) {
  if (
    event.target.tagName === "SPAN" &&
    event.target.closest(".scale-container")
  ) {
    const value = event.target.getAttribute("data-value");
    const scaleNumbers = event.currentTarget.querySelector(".scale-numbers");
    scaleNumbers
      .querySelectorAll("span")
      .forEach((span) => span.classList.remove("selected"));
    event.target.classList.add("selected");
    userResponses[questionId] = value;
    enableNextButton();
  }
}

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  if (!question) return;

  switch (question.type) {
    case "radio":
      questionContent.innerHTML = renderRadioQuestion(question);
      break;
    case "scale":
    case "scale-10":
      questionContent.innerHTML = renderScaleQuestion(question);
      break;
    default:
      questionContent.innerHTML = `<h1>Tipo de pergunta não suportado.</h1>`;
  }
  updateUI();
}

function updateUI() {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  currentStepSpan.textContent = currentQuestionIndex + 1;
  totalStepsSpan.textContent = questions.length;

  backButton.style.visibility =
    currentQuestionIndex === 0 ? "hidden" : "visible";

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  nextButton.classList.toggle("hidden", isLastQuestion);
  finishButton.classList.toggle("hidden", !isLastQuestion);
  const buttonToToggle = isLastQuestion ? finishButton : nextButton;
  if (userResponses[currentQuestion.id]) {
    buttonToToggle.disabled = false;
  } else {
    buttonToToggle.disabled = true;
  }
}

function enableNextButton() {
  const currentQuestion = questions[currentQuestionIndex];
  const selectedValue = getSelectedAnswer(currentQuestion);
  if (selectedValue) {
    userResponses[currentQuestion.id] = selectedValue;
    updateUI();
  }
}

function getSelectedAnswer(question) {
  if (question.type === "radio") {
    const radio = document.querySelector(
      `input[name="q${question.id}"]:checked`
    );
    return radio ? radio.value : null;
  }
  if (question.type.startsWith("scale")) {
    const selected = document.querySelector(".scale-numbers .selected");
    return selected ? selected.getAttribute("data-value") : null;
  }
  return null;
}

backButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  const currentQuestion = questions[currentQuestionIndex];
  const answer = getSelectedAnswer(currentQuestion);
  if (answer) {
    userResponses[currentQuestion.id] = answer;
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion();
    }
  } else {
    alert("Por favor, selecione uma resposta para continuar.");
  }
});

finishButton.addEventListener("click", async () => {
  const currentQuestion = questions[currentQuestionIndex];
  const answer = getSelectedAnswer(currentQuestion);
  if (answer) {
    userResponses[currentQuestion.id] = answer;
    console.log("Dados a serem enviados:", userResponses);
    try {
      // --- O FETCH FOI REATIVADO AQUI ---
      const response = await fetch(
        "https://bq39wfbh-3000.brs.devtunnels.ms//survey",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userResponses),
        }
      );

      if (response.ok) {
        alert("Feedback enviado com sucesso!");
      } else {
        alert("Erro ao enviar feedback. Código: " + response.status);
      }
      document.querySelector(".card").innerHTML =
        '<h1>Obrigado por responder!</h1><p class="sub">Seu feedback é muito importante para nós.</p>';
      document.querySelector(".progress-container").style.display = "none";
    } catch (error) {
      alert(
        "Falha na conexão com o servidor. Verifique o endpoint. Erro: " +
          error.message
      );
      console.error(error);
    }
  } else {
    alert("Por favor, selecione uma resposta para finalizar.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  totalStepsSpan.textContent = questions.length;
  renderQuestion();
});

document.addEventListener("change", (e) => {
  const currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.type === "radio" && e.target.type === "radio") {
    enableNextButton();
  }
});
