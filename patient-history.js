// Fetch patient data from MongoDB
async function fetchPatientData() {
    try {
        const response = await fetch('http://localhost:3000/api/patients');
        if (!response.ok) {
            throw new Error('Failed to fetch patient data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return [];
    }
}

// Create gender distribution pie chart
function createGenderChart(data) {
    const genderCounts = {
        male: 0,
        female: 0,
        other: 0
    };

    data.forEach(patient => {
        genderCounts[patient.gender] = (genderCounts[patient.gender] || 0) + 1;
    });

    const ctx = document.getElementById('genderChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Male', 'Female', 'Other'],
            datasets: [{
                data: [genderCounts.male, genderCounts.female, genderCounts.other],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create disease frequency bar chart
function createDiseaseChart(data) {
    const diseaseCounts = {};
    data.forEach(patient => {
        const disease = patient.prediction || 'Unknown';
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
    });

    const ctx = document.getElementById('diseaseChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(diseaseCounts),
            datasets: [{
                label: 'Number of Cases',
                data: Object.values(diseaseCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Populate patient table
function populatePatientTable(data) {
    const tableBody = document.getElementById('patientTableBody');
    tableBody.innerHTML = '';

    data.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.bloodGroup}</td>
            <td>${patient.pastOperations}</td>
            <td>${patient.prediction || 'Unknown'}</td>
            <td>${new Date(patient.createdAt).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize the dashboard
async function initializeDashboard() {
    const patientData = await fetchPatientData();
    
    if (patientData.length > 0) {
        createGenderChart(patientData);
        createDiseaseChart(patientData);
        populatePatientTable(patientData);
    } else {
        document.getElementById('patientTableBody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No patient data available</td>
            </tr>
        `;
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeDashboard); 