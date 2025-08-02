/* globals Chart:false, feather:false */
let myDataChart ;
let myChart ;
(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  const percent = (value)=>{
      const valor = (value * 100) / 4000
      const porcent = valor != 100 ? valor.toFixed(2)+"%" : valor+"%"
      return porcent
  }
  

  const ctx = document.getElementById('myChart');
  
  myDataChart = {
      labels: ['Premix','Medios','Liquidos','Macros'],
      datasets: [
          {
            label: "Premix",
            data:[1,2,3],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(153, 102, 255, 1)'
          },
          {
            label: "Medios",
            data:[4,5,6,],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(75, 192, 192, 1)'
          },
          {
            label: "Liquidos",
            data:[7,8,9,10,11,12,13,14,15],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(255, 26, 104, 1)'
          },
          {
            label: "Macros",
            data:[16,17,18,19,20,21],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(255, 159, 64, 1)'
          }
      ]
    
  }

  const config = {
    type: 'pie',
    plugins:[ChartDataLabels],
    data: myDataChart,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing:{
        key:"batch"
      },
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins:{
        legend:{
          position:"top", 
          labels:{
            font:{
              weight:"bold"
            },
            generateLabels: (chart) => {
              const labels = chart.data.labels  
              const legends = chart.data.datasets.map((sets,i)=>{
                  return {
                    text: labels[i],
                    fillStyle: sets.backgroundColor,
                    strokeStyle: sets.borderColor,
                    lineWidth: 0
                  }
              })
              let total = 0

              for (const key in data.pesoTotalPorReceta) {
                  total = total + data.pesoTotalPorReceta[key]
              }

              legends.push({
                text:`% Total : ${ percent(total) }`,
                fillStyle: "#4CA771",
                lineWidth: 0
              })
              return legends
            },
            
          }
        },
        datalabels:{
            color:"black",
            anchor:"center",
            font:{
              weight:"bold",
              size:13
            },
            formatter: (value) => {
                
                return percent(value.batch)
            }
        },
        tooltip:{
              callbacks:{
                  title:function(tooltipItems){
                      return tooltipItems[0].dataset.label
                  },
                  label: function(context) {
                      return ` ${context.raw.descripcion} : ${context.raw.displayBatch} kg`
                  },
                  footer:function(context){
                      const key = context[0].dataset.label
                      const pesoTotal = data.pesoTotalPorReceta[key.toLowerCase()].toFixed(2)
                      return [`Porcentaje: ${percent(context[0].parsed)}`,
                      `Peso Total ${key} : ${pesoTotal} kg`,
                      `% Total ${key} : ${percent(pesoTotal)}`]
                  }
              }
          }
      }
    }
  }

  myChart = new Chart(ctx, config);


})()
