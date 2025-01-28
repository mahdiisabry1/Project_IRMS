
// Example Chart.js code for chart rendering
var ctx = document.getElementById('intern-chart').getContext('2d');
var internChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['AGS', 'CS', 'CGO', 'CO', 'ENG', 'FIN', 'FO', 'HR', 'IT', 'LP', 'MAR', 'RMP', 'SO', 'SAC', 'WSD'],
        datasets: [{
            label: 'Number of Interns',
            data: [10, 20, 15, 30, 40, 25, 10, 50, 60, 20, 10, 70, 30, 20, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});