const elem = document.getElementById("country-list");

fetch("https://corona-api.com/countries")
    .then((response) => response.json())
    .then((res) => {
        res.data.map((country) => {
            const li = document.createElement("button");
            li.id = country.code;
            li.classList.add("country-name");
            li.innerHTML = `<div class="list-col1">${country.code}</div>
                            <div class="list-col2">${country.name}</div>
                            <div class="list-col3"><img src="https://www.countryflags.io/${country.code}/flat/32.png"></div>`;
            li.addEventListener("click", () => {
                getData(country.code).then((res) => {
                    document.getElementById("country-selected").innerHTML = `<div>${country.name}</div>`;
                    displayData(res);
                });
            });
            elem.appendChild(li);
        });

        getData('IN').then((res) => {
            document.getElementById("country-selected").innerHTML = `<div>IN</div>`;
            displayData(res);
        });
    });

const getData = async (countryCode) => {
    const resp = await fetch(`https://corona-api.com/countries/${countryCode}`);
    console.log(resp);
    const data = await resp.json();
    return data;
};

function displayData(resp){
    
    document.getElementById("active").innerHTML = `<div>${resp.data.latest_data.critical}</div>`;
    document.getElementById("recovered").innerHTML = `<div>${resp.data.latest_data.recovered}</div>`;
    document.getElementById("deaths").innerHTML = `<div>${resp.data.latest_data.deaths}</div>`;
    document.getElementById("dr").innerHTML = `<div>${(resp.data.latest_data.calculated.death_rate).toFixed(2)}</div>`;
    document.getElementById("rr").innerHTML = `<div>${(resp.data.latest_data.calculated.recovery_rate).toFixed(2)}</div>`;

    let graphData1 = [];
    resp.data.timeline.map((data) => {
        graphData1.push([new Date(data.date).getTime(), data.recovered]);
    });
    graphData1.reverse();

    let graphData2 = [];
    resp.data.timeline.map((data) => {
        graphData2.push([new Date(data.date).getTime(), data.deaths]);
    });
    graphData2.reverse();

    var options = {
        chart: {
            height: 350,
            type: "line",
            stacked: false
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#1aff00", "#ff0000"],
        series: [
            {
            name: "Recovered",
            data: graphData1
            },
            {
            name: "Deaths",
            data: graphData2
            }
        ],
        stroke: {
            width: [4, 4]
        },
        plotOptions: {
            bar: {
            columnWidth: "20%"
            }
        },
        xaxis: {
            min: new Date(resp.data.timeline[resp.data.timeline.length - 1].date).getTime(),
            max: new Date(resp.data.timeline[0].date).getTime(),
        },
        yaxis: [
            {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: "#1aff00"
            },
            labels: {
                style: {
                colors: "#1aff00"
                }
            },
            title: {
                text: "Recovered",
                style: {
                color: "#1aff00"
                }
            }
            },
            {
            opposite: true,
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: "#ff0000"
            },
            labels: {
                style: {
                colors: "#ff0000"
                }
            },
            title: {
                text: "Deaths",
                style: {
                color: "#ff0000"
                }
            }
            }
        ],
        tooltip: {
            shared: false,
            intersect: true,
            x: {
            show: false
            }
        },
        legend: {
            horizontalAlign: "left",
            offsetX: 40
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
}