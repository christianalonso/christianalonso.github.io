/* globals Chart:false, feather:false */
let myDataChart ;
let myChart ;
(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  //Graphs
  // const ctx = document.getElementById('myChart')
  // // eslint-disable-next-line no-unused-vars
  // const myChart = new Chart(ctx, {
  //   type: 'line',
  //   data: {s
  //     labels: [
  //       'Sunday',
  //       'Monday',
  //       'Tuesday',
  //       'Wednesday',
  //       'Thursday',
  //       'Friday',
  //       'Saturday'
  //     ],
  //     datasets: [{
  //       data: [
  //         15339,
  //         21345,
  //         18483,
  //         24003,
  //         23489,
  //         24092,
  //         12034
  //       ],
  //       lineTension: 0,
  //       backgroundColor: 'transparent',
  //       borderColor: '#007bff',
  //       borderWidth: 4,
  //       pointBackgroundColor: '#007bff'
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: false
  //         }
  //       }]
  //     },
  //     legend: {
  //       display: false
  //     }
  //   }
  // })

  const ctx = document.getElementById('myChart');

  myDataChart = {
      labels: ['Liquidos','Macros','Premix','Medios'],
      datasets: [{
        label: 'Peso Total ',
        data: [15339,21345,18483,24003],
        lineTension:0,
        borderWidth: 1,
        // backgroundColor:[
        //   '#ff6384',
				// 	'#36a2eb',
				// 	'#cc65fe',
				// 	'#ffce56'
				// 	]
        backgroundColor:[
          'rgba(255, 26, 104, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)'
        ],
      }]
    
  }

  const config = {
    type: 'pie',
    plugins:[ChartDataLabels],
    data: myDataChart,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins:{
        legend:{
          position:"top"
        },
        datalabels:{
          color:"black",
          anchor:"end",
          font:{
            weight:"bold",
            size:13
          },
          formatter: (value,context) => {
              const valor = (value * 100) / 1000
              const porcent =valor.toFixed(2)+"%"
              return porcent
          }
        }
      }
    }
  }

  myChart = new Chart(ctx, config);


})()
