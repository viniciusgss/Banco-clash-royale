const ctxVictory = document.getElementById('victoryChart').getContext('2d');
const victoryChart = new Chart(ctxVictory, {
    type: 'bar',
    data: {
        labels: [], // Será preenchido dinamicamente
        datasets: [{
            label: 'Porcentagem de Vitórias',
            data: [], // Será preenchido dinamicamente
            backgroundColor: ['#ffc107', '#007bff', '#28a745']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Porcentagem de Vitórias por Carta' }
        }
    }
});