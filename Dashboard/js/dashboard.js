/* globals Chart:false, feather:false */
let myDataChart ;
let myChart ;
(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  const percent = (value)=>{
      const valor = (value * 100) / 4000
      const porcent =valor.toFixed(2)+"%"
      return porcent
  }

  const ctx = document.getElementById('myChart');

  myDataChart = {
      labels: ['Liquidos','Macros','Premix','Medios'],
      datasets: [{
        label: 'Peso Total ',
        data: [60,3670,80,190],
        lineTension:0,
        borderWidth: 1,
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
            formatter: (value) => {
                return percent(value)
            }
        },
        tooltip:{
              callbacks:{
                    label: function(context) {
                      return `Peso Total: ${context.parsed.toFixed(2)} kg`
                  },
                  footer:function(context){
                      return `Porcentaje: ${percent(context[0].parsed)}`
                  }
              }
          }
      }
    }
  }

  myChart = new Chart(ctx, config);


})()
