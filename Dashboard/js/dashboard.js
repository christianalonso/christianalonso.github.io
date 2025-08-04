const graphicPie = (()=>{

  console.log("Graphics is loaded !!")
  const grph = this
  const ctx = document.getElementById('myChart');

  let myDataChart = {
      labels: ['Premix','Medios','Liquidos','Macros'],
      datasets: [
          {
            label: "Premix",
            data:[
                {descripcion:"insumo1",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo2",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo3",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo4",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo5",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo6",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo7",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo8",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo9",batch:10,displayBatch:"10.00"},
                {descripcion:"insumo10",batch:10,displayBatch:"10.00"}
            ],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(153, 102, 255, 1)'
          },
          {
            label: "Medios",
            data:[
                {descripcion:"insumo11",batch:30,displayBatch:"30.00"},
                {descripcion:"insumo12",batch:30,displayBatch:"30.00"},
                {descripcion:"insumo13",batch:30,displayBatch:"30.00"},
                {descripcion:"insumo14",batch:30,displayBatch:"30.00"},
                {descripcion:"insumo15",batch:30,displayBatch:"30.00"},
                {descripcion:"insumo16",batch:30,displayBatch:"30.00"}
            ],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(75, 192, 192, 1)'
          },
          {
            label: "Liquidos",
            data:[{descripcion:"insumo17",batch:80,displayBatch:"80"}],
            lineTension:0,
            borderWidth: 1,
            backgroundColor:'rgba(255, 26, 104, 1)'
          },
          {
            label: "Macros",
            data:[
                {descripcion:"insumo18",batch:2400,displayBatch:"2400.00"},
                {descripcion:"insumo19",batch:960,displayBatch:"960.00"},
                {descripcion:"insumo20",batch:200,displayBatch:"200.00"}
             ],
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
                  text:`% Total : ${ utils.percent(total,4000) }`,
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
                  
                  return utils.percent(value.batch,4000)
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
                        return [`% en Receta: ${utils.percent(context[0].parsed,4000)}`,
                        `% Total ${key} : ${utils.percent(pesoTotal,4000)}`,
                        `Peso Total ${key} : ${pesoTotal} kg`
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
