// Base URL da API (ajuste conforme o back-end)
const API_URL = "https://banco-clash-royale.onrender.com/api/battles";

// Função para exibir resultados
function displayResult(elementId, data) {
  const resultDiv = document.getElementById(elementId);
  resultDiv.classList.add("resultado");
  if (!data) {
    resultDiv.innerHTML = `<p class="text-danger">Erro ao carregar dados.</p>`;
    return;
  }
  resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// Consulta 1: Vitórias e derrotas com Fireball
async function runConsulta1() {
  try {
    const response = await axios.get(`${API_URL}/consulta1`, {
      params: {
        carta: 1, // Fireball
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta1", response.data);
  } catch (error) {
    console.error("Erro na Consulta 1:", error);
    displayResult("resultado-consulta1", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 2: Decks com mais de 50% de vitórias
async function runConsulta2() {
  try {
    const response = await axios.get(`${API_URL}/consulta2`, {
      params: {
        porcentagem: 50,
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta2", response.data);
  } catch (error) {
    console.error("Erro na Consulta 2:", error);
    displayResult("resultado-consulta2", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 3: Derrotas com combo (Fireball + outra)
async function runConsulta3() {
  try {
    const response = await axios.get(`${API_URL}/consulta3`, {
      params: {
        cartas: "1,2", // Fireball + carta fictícia
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta3", response.data);
  } catch (error) {
    console.error("Erro na Consulta 3:", error);
    displayResult("resultado-consulta3", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 4: Vitórias com Fireball, 20% menos troféus
async function runConsulta4() {
  try {
    const response = await axios.get(`${API_URL}/consulta4`, {
      params: {
        carta: 1,
        porcentagemTrofeus: 20,
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta4", response.data);
  } catch (error) {
    console.error("Erro na Consulta 4:", error);
    displayResult("resultado-consulta4", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 5: Combos de 3 cartas com mais de 50% de vitórias
async function runConsulta5() {
  try {
    const response = await axios.get(`${API_URL}/consulta5`, {
      params: {
        tamanhoCombo: 3,
        percentualMinimo: 50,
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta5", response.data);
  } catch (error) {
    console.error("Erro na Consulta 5:", error);
    displayResult("resultado-consulta5", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}
