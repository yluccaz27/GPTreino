// main.js
const fichas = {
  segunda: "Peito e tríceps",
  terca: "Costas e bíceps",
  quarta: "Perna - anterior",
  quinta: "Ombro e trapézio",
  sexta: "Bíceps e tríceps",
  sabado: "Posteriores e glúteos",
  domingo: "Costas e bíceps"
};

let usos = 0;
let custoTotal = 0;

function estimarCusto(modelo, tokens) {
  if (modelo === "gpt-3.5-turbo") {
    return (tokens / 1000) * 0.0035;
  }
}


function normalizarDia(diaBr) {
  return diaBr
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace("-feira", "")
    .toLowerCase();
}

async function mandarMotivacao() {
  const respostaEl = document.getElementById("resposta");
  const nivel = document.getElementById("nivel").value;
  const diaBr = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
  const dia = normalizarDia(diaBr);
  const treino = fichas[dia] || "Sem treino definido para hoje.";
  const chave = localStorage.getItem("openai_api_key");
  if (!chave) {
    respostaEl.textContent = "⚠️ Nenhuma chave API foi encontrada. Use o console para configurar:\nlocalStorage.setItem('openai_api_key', 'sua_key_aqui')";
    return;
  }

  respostaEl.textContent = "Consultando GPTREINO...";

  const prompt = `Hoje é ${diaBr}, e o treino é: ${treino}\n\nMe dê uma motivação de nível ${nivel} para esse treino. Seja intenso, criativo e varie entre ciência, provocação ou pura raiva motivacional.`;

  const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${chave}`
    },
    
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um coach de treino que responde com textos motivacionais baseados no dia da semana e no tipo de treino. Os textos variam em intensidade de 1 a 5, sendo 5 o modo berserker. Faça algo com poucas frases, mas, profundas e intensas. como um verdadeiro BERSERKER pediria." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await resposta.json();
  respostaEl.textContent = data.choices[0].message.content;
  usos += 1;
  const tokensEstimados = 800; // ajuste se quiser variar por nível
  const custoAtual = estimarCusto("gpt-3.5-turbo", tokensEstimados);
  custoTotal += custoAtual;

document.getElementById("contador").textContent =
  `🏋️ Motivações geradas: ${usos} | 💸 Estimativa de custo: $${custoTotal.toFixed(3)} | Custo do Inicio: $0.26`;


  document.getElementById("treinoDoDia").textContent = `\uD83C\uDFC5 Treino de hoje (${diaBr}): ${treino}`;

  // Gifs lendários
  const gifs = [
    "gojo-gojo-satoru.gif",
    "gojo.gif",
    "satoru-gojo-domain-expansion.gif",
    "mm.gif",
    "thorfin.gif",
    "thor-anime.gif",
    "vinland-saga-thorfinn.gif",
    "berserk-guts.gif",
    "sigma.gif",
    "guts-berserk.gif"
  ];
  
  const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)];
  document.getElementById("gif").innerHTML = `
    <img src="gifs/${gifAleatorio}" 
         alt="Inspiração" 
         style="max-width: 100%; border-radius: 12px; margin-top: 20px;">`;
}  
