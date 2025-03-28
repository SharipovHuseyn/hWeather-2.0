function chartWeather(data) {
    const ctx = document.getElementById("weatherChart").getContext("2d");

    if (!data || !ctx) {
        console.error("Missing data parameter or canvas not found");
        return;
    }

    const dataArray = Array.isArray(data) ? data : [data];
    const datasets = [];

    dataArray.forEach((dataDay, index) => {
        let hours = [];
        let temps = [];
        
        if (dataDay.hour && Array.isArray(dataDay.hour)) {
            hours = dataDay.hour.map(h => h.time.substr(11, 5));
            temps = dataDay.hour.map(h => h.temp_c);
        }

        if (hours.length === 0 || temps.length === 0) {
            console.error(`No valid weather data found for day ${index + 1}`);
            return;
        }
        const isFirstLine = index === 0;
        const color = isFirstLine ? '#007bff' : `hsla(${(index * 120) % 360}, 70%, 50%, 0.7)`;
        const backgroundColor = isFirstLine 
            ? 'rgba(0, 123, 255, 0.2)' 
            : `hsla(${(index * 120) % 360}, 70%, 50%, 0.2)`;
        
        datasets.push({
            label: `Прогноз ${index + 1}`,
            data: temps,
            backgroundColor: backgroundColor,
            borderColor: color,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.1
        });
    });

    if (datasets.length === 0) {
        console.error("No valid weather data found in any of the objects");
        return;
    }

    const labels = datasets[0].data.map((_, i) => {
        return dataArray[0].hour[i].time.substr(11, 5);
    });

    if (window.weatherChart instanceof Chart) {
        window.weatherChart.destroy();
    }

    window.weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Температура по часам',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '°C';
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Температура (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Часы'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 24
                    }
                }
            }
        }
    });
}