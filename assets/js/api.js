//  buscar dados do clã
async function fetchClanData() {
    const clanTag = document.getElementById('clanTag').value;
    if (!clanTag) {
        alert('Por favor, insira um Clan Tag válido.');
        return;
    }

    try {
        showLoading(); // Mostra o spinner de carregamento
        const response = await fetch(`https://api.clashroyale.com/v1/clans/%23${clanTag}`, {
            headers: {
                Authorization: 'Bearer SEU_TOKEN_AQUI' // Substituir pelo token da API
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do clã.');
        }

        const data = await response.json();
        updateClanInfo(data); // Atualiza a interface com os dados do clã
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar dados do clã. Verifique o Clan Tag e tente novamente.');
    } finally {
        hideLoading(); // Esconde o spinner de carregamento
    }
}

// Função para atualizar a interface com os dados do clã
function updateClanInfo(data) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `
        <h3 class="text-center">Informações do Clã</h3>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Descrição:</strong> ${data.description}</p>
        <p><strong>Quantidade de Membros:</strong> ${data.members}</p>
        <p><strong>Trofeus:</strong> ${data.clanScore}</p>
    `;
}

// Função para buscar estatísticas de vitórias/derrotas
async function fetchStatistics() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const selectedCard = document.getElementById('cardSelect').value;

    try {
        showLoading();
        const response = await fetch(`/api/statistics?startDate=${startDate}&endDate=${endDate}&card=${selectedCard}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar estatísticas.');
        }

        const data = await response.json();
        updateCharts(data); // Atualiza os gráficos com os dados
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar estatísticas.');
    } finally {
        hideLoading();
    }
}

// Função para atualizar os gráficos
function updateCharts(data) {
    // Atualiza o gráfico de vitórias
    victoryChart.data.labels = data.cards.map(card => card.name); // Nomes das cartas
    victoryChart.data.datasets[0].data = data.cards.map(card => card.victoryRate); // Taxa de vitórias
    victoryChart.update();

    // Atualiza o gráfico de decks
    deckChart.data.labels = data.decks.map(deck => deck.name); // Nomes dos decks
    deckChart.data.datasets[0].data = data.decks.map(deck => deck.winRate); // Taxa de vitórias dos decks
    deckChart.update();
}

// Função para carregar as cartas no filtro
async function loadCards() {
    try {
        const response = await fetch('https://api.clashroyale.com/v1/cards', {
            headers: {
                Authorization: 'Bearer SEU_TOKEN_AQUI' // Substitua pelo token da API
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar as cartas.');
        }

        const data = await response.json();
        const cardSelect = document.getElementById('cardSelect');

        // Limpa as opções existentes
        cardSelect.innerHTML = '<option value="all">Todas</option>';

        // Adiciona as cartas como opções
        data.items.forEach(card => {
            const option = document.createElement('option');
            option.value = card.id; // Use o ID da carta como valor
            option.textContent = card.name; // Use o nome da carta como texto
            cardSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar as cartas. Tente novamente mais tarde.');
    }
}

// Função para buscar dados do jogador
async function fetchPlayerData(playerTag) {
    try {
        const response = await fetch(`http://localhost:3000/api/player/${playerTag}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do jogador.');
        }

        const playerData = await response.json();
        updatePlayerUI(playerData); // Atualiza a interface com os dados
    } catch (err) {
        console.error("❌ Erro ao buscar dados do jogador:", err.message);
        alert('Erro ao buscar dados do jogador. Verifique a tag e tente novamente.');
    }
}

// Função para atualizar a interface com os dados do jogador
function updatePlayerUI(data) {
    const resultsDiv = document.getElementById('clanResults');
    resultsDiv.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Tag:</strong> ${data.tag}</p>
        <p><strong>Nível:</strong> ${data.expLevel}</p>
        <p><strong>Trofeus:</strong> ${data.trophies}</p>
        <p><strong>Vitórias:</strong> ${data.wins}</p>
        <p><strong>Derrotas:</strong> ${data.losses}</p>
    `;
}

// Função para buscar jogador
function searchPlayer() {
    const playerTag = document.getElementById('playerTag').value.trim();
    if (!playerTag) {
        alert('Por favor, insira uma tag válida.');
        return;
    }

    fetchPlayerData(playerTag);
}

// Função para executar consultas
function executeQueries() {
    const cardX = document.getElementById('cardX').value;
    const timestamps = document.getElementById('timestamps').value;
    const percentage = parseFloat(document.getElementById('percentage').value);

    // Exemplo de consulta 1: Calcular porcentagem de vitórias e derrotas com a carta X
    const winLossPercentage = calculateWinLossPercentage(cardX, timestamps);
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <p>Porcentagem de Vitórias com a carta ${cardX}: ${winLossPercentage.wins}%</p>
        <p>Porcentagem de Derrotas com a carta ${cardX}: ${winLossPercentage.losses}%</p>
    `;

    // Outras consultas podem ser chamadas aqui
}

function calculateWinLossPercentage(card, timestamps) {
    // Simulação de dados e lógica para calcular porcentagem
    const wins = 60; // Exemplo: 60% de vitórias
    const losses = 40; // Exemplo: 40% de derrotas
    return { wins, losses };
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', loadCards);