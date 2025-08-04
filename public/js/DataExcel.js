class DataExcel{
    
    constructor(){
        this.insumos = insumos();
        this.data = []
        this.receta = []
        this.insumoNoRegistrado=[]
    }
    pesoTotalPorReceta = {
        macros:0,
        medios:0,
        premix:0,
        liquidos:0,
    }
    factor = 4

    init = (cont) =>{
        const workbook = XLSX.read(cont);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];  
        const content = XLSX.utils.sheet_to_json(sheet , {
                    header: [
                        "codInsumo",
                        "descripcion",
                        "pesos",
                        "codPT",
                        "numversion",
                        "fechaversion",
                        "receta"
                    ]
                });
        this.data = content;
        const rows = this.data.slice(1,this.data.length)
        
        this.receta = rows.map((items) => {
            const row = items
            const pesoBatch = items.pesos * this.factor
            row.batch = pesoBatch
            row.displayBatch = pesoBatch.toFixed(2)

            if(this.buscarInsumo(items.codInsumo) === undefined){
                this.insumoNoRegistrado.push(items) 
            }
            
            return row
        });

    }

    rows = () =>{
        return this.receta  
    }

    header = () =>{
        return Object.values(this.data[0]);
    }

    getUniquesCode = () =>{
        
        const arr = this.rows();
        let codes = [ { codPT:arr[0].codPT , receta:arr[0].receta } ]
        let exists = true

        for (let x = 0; x < arr.length; x++) { 

            for (let y = 0; y < codes.length; y++) {
                
                if(codes[y].codPT === arr[x].codPT){
                    exists = false
                }else{
                    exists = true
                }
            }
            if(exists){
                codes.push({ codPT:arr[x].codPT , receta:arr[x].receta })
            }
        }
        return codes
    }

    filterProduct = (id) =>{

        const result = this.rows().filter( (element) => element.codPT === id );
        return result
    
    }

    buscarInsumo = (codInsumo) => {
        const insumo = this.insumos.find(({CODIGO}) => CODIGO === codInsumo)
        return insumo
    }

    filterTypeInsumo = (idReceta,tipoInsumo) => {

        const receta = this.filterProduct(idReceta)
        const insumos = this.insumos.filter(({TIPO}) => TIPO === tipoInsumo)
        
        const potentialMatch = (item) => {

            let flag = false
            const collision = insumos.find(({CODIGO}) => CODIGO === item.codInsumo)
            
            if(collision){
                flag = true
            }
            
            return flag
        }

        const match = receta.filter(potentialMatch)
        return match
    }

}

const data = new DataExcel;

/** GRAFICOS DINAMICOS */