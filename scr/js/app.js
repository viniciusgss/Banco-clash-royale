// Base URL da API (ajuste conforme o back-end)

const API_URL = "https://banco-clash-royale.onrender.com/api/consultas";

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

// Consulta 1: Vitórias e derrotas com Hog Rider
async function runConsulta1() {
  try {
    const response = await axios.get(`${API_URL}/1`, {
      params: {
        carta: 1, // Hog Rider
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });

    // Exibir os dados no elemento de resultado (opcional)
    displayResult("resultado-consulta1", response.data);

    // Verificar os dados retornados pela API
    console.log("Dados retornados pela API (Consulta 1):", response.data);

    // Processar os dados retornados pela API
    const data = response.data[0]; // Acessar o primeiro elemento do array
    if (!data) {
      console.error("Nenhum dado encontrado para a consulta 1.");
      return;
    }

    const totalPartidas = data.totalPartidas || 0; // Total de partidas
    const porcentagemVitorias = data.porcentagemVitorias || 0; // Porcentagem de vitórias
    const porcentagemDerrotas = data.porcentagemDerrotas || 0; // Porcentagem de derrotas

    const labels = ["Vitórias (%)", "Derrotas (%)"];
    const values = [porcentagemVitorias, porcentagemDerrotas];

    // Renderizar o gráfico no canvas
    const ctx = document.getElementById('chart-consulta1').getContext('2d');
    new Chart(ctx, {
      type: 'pie', // Tipo de gráfico (pizza)
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribuição de Vitórias e Derrotas',
          data: values,
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Erro na Consulta 1:", error);
    displayResult("resultado-consulta1", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 2: Decks com mais de 50% de vitórias
async function runConsulta2() {
  try {
    const response = await axios.get(`${API_URL}/2`, {
      params: {
        porcentagem: 50,
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });

    // Exibir os dados no elemento de resultado (opcional)
    displayResult("resultado-consulta2", response.data);

    // Verificar os dados retornados pela API
    console.log("Dados retornados pela API (Consulta 2):", response.data);

    // Processar os dados retornados pela API
    const data = response.data;
    if (!data || data.length === 0) {
      console.error("Nenhum dado encontrado para a consulta 2.");
      return;
    }

    // Extrair os decks e as porcentagens de vitória
    const labels = data.map((item, index) => `Deck ${index + 1}`); // Exemplo: Deck 1, Deck 2, etc.
    const values = data.map(item => item.porcentagemVitorias); // Porcentagem de vitórias

    // Renderizar o gráfico no canvas
    const ctx = document.getElementById('chart-consulta2').getContext('2d');
    new Chart(ctx, {
      type: 'bar', // Tipo de gráfico (barras)
      data: {
        labels: labels,
        datasets: [{
          label: 'Porcentagem de Vitórias (%)',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Porcentagem de Vitórias (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Decks'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Erro na Consulta 2:", error);
    displayResult("resultado-consulta2", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 3: Derrotas com combo (Fireball + outra)
async function runConsulta3() {
  try {
    const response = await axios.get(`${API_URL}/3`, {
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
    const response = await axios.get(`${API_URL}/4`, {
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
    const response = await axios.get(`${API_URL}/5`, {
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

// Consulta 6: Decks populares por carta
async function runConsulta6() {
  try {
    const response = await axios.get(`${API_URL}/6`, {
      params: {
        carta: 1, // Carta específica (ex.: Hog Rider)
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta6", response.data);
  } catch (error) {
    console.error("Erro na Consulta 6:", error);
    displayResult("resultado-consulta6", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 7: Duração média das partidas
async function runConsulta7() {
  try {
    const response = await axios.get(`${API_URL}/7`, {
      params: {
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta7", response.data);
  } catch (error) {
    console.error("Erro na Consulta 7:", error);
    displayResult("resultado-consulta7", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}

// Consulta 8: Melhores jogadores por carta
async function runConsulta8() {
  try {
    const response = await axios.get(`${API_URL}/8`, {
      params: {
        carta: 1, // Carta específica (ex.: Hog Rider)
        dataInicio: "2025-04-01",
        dataFim: "2025-04-22",
      },
    });
    displayResult("resultado-consulta8", response.data);
  } catch (error) {
    console.error("Erro na Consulta 8:", error);
    displayResult("resultado-consulta8", { error: error.response?.data?.message || "Erro ao executar consulta." });
  }
}


