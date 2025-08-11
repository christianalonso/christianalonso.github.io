const graphicPie = (()=>{

  const grph = this
  const ctx = document.getElementById('myChart');

  

  let myDataChart = {
      labels: ['Premix','Medios','Liquidos','Macros'],
      datasets: [
          {
            label: "Premix",
            data:utils.insumosDeMuestra.premix,
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(153, 102, 255, 1)'
          },
          {
            label: "Medios",
            data:utils.insumosDeMuestra.medios,
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(75, 192, 192, 1)'
          },
          {
            label: "Liquidos",
            data:utils.insumosDeMuestra.liquidos,
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(255, 26, 104, 1)'
          },
          {
            label: "Macros",
            data:utils.insumosDeMuestra.macros,
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
          key:"pesos"
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
                let {macros,medios,premix,liquidos} = Receta.pesoInsumosReceta 

                let totalInsumos = utils.toDecimal(macros+medios+premix+liquidos)
                

                legends.push({
                  text:`% Total : ${ utils.percent(totalInsumos,Receta.pesoTotalReceta) }`,
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
                  return utils.percent(value.pesos * 4,Receta.pesoTotalReceta)
              }
          },
          tooltip:{
                callbacks:{
                    title:function(tooltipItems){
                        return tooltipItems[0].dataset.label
                    },
                    label: function(context) {
                        return ` ${context.raw.descripcion} : ${ utils.pesoACadena(utils.toBatch(context.raw.pesos,4))  } kg`
                    },
                    footer:function(context){
                      
                        const key = context[0].dataset.label
                        const pesoTotal = Receta.pesoInsumosReceta[key.toLowerCase()]
                        const batch = context[0].raw.pesos * 4
                        return [
                            `% en ${key} : ${utils.percent(batch,pesoTotal)}`,
                            `% en Receta : ${utils.percent(batch,Receta.pesoTotalReceta)}`,
                            `% Total ${key} : ${utils.percent(pesoTotal,Receta.pesoTotalReceta)}`,
                            `Peso Total ${key} : ${utils.pesoACadena(pesoTotal)} kg`
                        ]
                    }
                }
            }
        }
      }
    }

     const pieChart  = new Chart(ctx, config);

    grph.update = (assemble) => {
        const props = ["premix","medios","liquidos","macros"]
        for (let i = 0; i < props.length; i++) {
            myDataChart.datasets[i].data = assemble[props[i]]
        }
        pieChart.update()
    }

  
  return grph
})()
