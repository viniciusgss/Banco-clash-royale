// Ativar a animação da elixir bar quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    const elixirFill = document.querySelector('.elixir-fill');
    elixirFill.classList.add('active');
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function runQuery(queryId) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    let resultText = '';
    switch (queryId) {
        case 1:
            const card1 = document.getElementById('card1').value;
            const startDate1 = document.getElementById('startDate1').value;
            const endDate1 = document.getElementById('endDate1').value;
            resultText = `Calculando taxa de vitórias/derrotas para a carta "${card1}" entre ${startDate1} e ${endDate1}. Resultado fictício: 60% vitórias, 40% derrotas.`;
            break;
        case 2:
            const winPercent2 = document.getElementById('winPercent2').value;
            const startDate2 = document.getElementById('startDate2').value;
            const endDate2 = document.getElementById('endDate2').value;
            resultText = `Listando decks com mais de ${winPercent2}% de vitórias entre ${startDate2} e ${endDate2}. Exemplo fictício: Deck [Golem, Witch, Zap] - 65%.`;
            break;
        case 3:
            const combo3 = document.getElementById('combo3').value;
            const startDate3 = document.getElementById('startDate3').value;
            const endDate3 = document.getElementById('endDate3').value;
            resultText = `Quantidade de derrotas com o combo "${combo3}" entre ${startDate3} e ${endDate3}. Resultado fictício: 120 derrotas.`;
            break;
        case 4:
            const card4 = document.getElementById('card4').value;
            const trophyDiff4 = document.getElementById('trophyDiff4').value;
            resultText = `Vitórias com a carta "${card4}" onde o vencedor tinha ${trophyDiff4}% menos troféus. Resultado fictício: 45 vitórias.`;
            break;
        default:
            resultText = 'Consulta não implementada.';
    }

    const resultElement = document.createElement('p');
    resultElement.textContent = resultText;
    resultElement.classList.add('result-text', 'animate__animated', 'animate__fadeIn');
    resultsContainer.appendChild(resultElement);
}

// Função para buscar cartas da API
async function fetchCards() {
    try {
        // Substitua pela URL da sua API
        const response = await fetch('https://api.clashroyale.com/v1/cards');
        const data = await response.json();

        // Container onde as cartas serão exibidas
        const cardsContainer = document.getElementById('cards-container');

        // Limpa o container antes de adicionar as cartas
        cardsContainer.innerHTML = '';

        // Itera sobre as cartas e cria os elementos HTML
        data.items.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('col-md-3', 'card-item');

            cardElement.innerHTML = `
                <img src="${card.iconUrls.medium}" alt="${card.name}">
                <h5>${card.name}</h5>
                <p>Raridade: ${card.rarity}</p>
            `;

            cardsContainer.appendChild(cardElement);
        });
    } catch (error) {
        console.error('Erro ao buscar as cartas:', error);
    }
}

// Função para buscar carta específica
async function searchCard() {
    const cardName = document.getElementById('searchCardInput').value.trim();
    if (!cardName) {
        alert('Por favor, insira o nome de uma carta.');
        return;
    }

    try {
        const response = await fetch(`https://api.clashroyale.com/v1/cards`);
        const data = await response.json();

        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        const filteredCards = data.items.filter(card => card.name.toLowerCase().includes(cardName.toLowerCase()));

        if (filteredCards.length === 0) {
            resultsContainer.innerHTML = '<p class="text-white">Nenhuma carta encontrada.</p>';
            return;
        }

        filteredCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('col-md-3', 'card-item');
            cardElement.innerHTML = `
                <img src="${card.iconUrls.medium}" alt="${card.name}">
                <h5>${card.name}</h5>
                <p>Raridade: ${card.rarity}</p>
            `;
            resultsContainer.appendChild(cardElement);
        });
    } catch (error) {
        console.error('Erro ao buscar cartas:', error);
    }
}

// Funções para manipular o deck
const selectedDeck = [];

function addCardToDeck(card) {
    if (selectedDeck.length >= 8) {
        alert('Você só pode adicionar até 8 cartas ao deck.');
        return;
    }

    if (selectedDeck.includes(card)) {
        alert('Esta carta já foi adicionada ao deck.');
        return;
    }

    selectedDeck.push(card);
    updateDeckUI();
}

function updateDeckUI() {
    const deckContainer = document.getElementById('deck-container');
    deckContainer.innerHTML = '';

    selectedDeck.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-md-3', 'card-item');
        cardElement.innerHTML = `
            <img src="${card.iconUrls.medium}" alt="${card.name}">
            <h5>${card.name}</h5>
        `;
        deckContainer.appendChild(cardElement);
    });
}

function finalizeDeck() {
    if (selectedDeck.length === 0) {
        alert('Adicione pelo menos uma carta ao deck.');
        return;
    }

    console.log('Deck finalizado:', selectedDeck);
    alert('Deck finalizado com sucesso!');
}

// Função para buscar informações de batalhas
async function fetchBattleInfo() {
    try {
        const response = await fetch(`https://api.clashroyale.com/v1/battles`);
        const data = await response.json();

        const battleInfoContainer = document.getElementById('battle-info-container');
        battleInfoContainer.innerHTML = '';

        data.items.forEach(battle => {
            const battleElement = document.createElement('div');
            battleElement.classList.add('battle-item');
            battleElement.innerHTML = `
                <h5>Jogador: ${battle.player.name}</h5>
                <p>Troféus: ${battle.player.trophies}</p>
                <p>Deck: ${battle.player.deck.map(card => card.name).join(', ')}</p>
                <p>Tempo de Jogo: ${battle.duration}</p>
            `;
            battleInfoContainer.appendChild(battleElement);
        });
    } catch (error) {
        console.error('Erro ao buscar informações de batalhas:', error);
    }
}

// Chama a função para carregar as cartas ao carregar a página
document.addEventListener('DOMContentLoaded', fetchCards);