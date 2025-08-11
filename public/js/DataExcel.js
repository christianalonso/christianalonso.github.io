class DataExcel{
    
    constructor(){
        this.insumos = insumos();
        this.data = []
        this.receta = []
        this.insumoNoRegistrado
        this.formmula = []
    }

    factor = 4
    pesoTotalReceta = 4000
    pesoInsumosReceta = {
        macros:0,
        medios:0,
        premix:0,
        liquidos:0,
    }

    insumosReceta = {
        macros:[],
        medios:[],
        premix:[],
        liquidos:[],
    }

    shortNameTipoInsumo = ["MA","ME","PE","LI"]
    nombresTipoInsumo = ["macros","medios","premix","liquidos"]
    

    cargarArchivoExcel = (file) => {
        const workbook = XLSX.read(file);
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
        this.#prepareData();
    }

    #prepareData = () =>{
        
        this.insumoNoRegistrado = []
        this.formmula = this.data.slice(1,this.data.length)
        this.formmula.forEach((items) => {
            
            if(this.buscarInsumo(items.codInsumo) === undefined){
                this.insumoNoRegistrado.push(items) 
            }

        });
        
    }

    prepararReceta = (codPT) => {
        
        for (let i = 0; i < this.nombresTipoInsumo.length; i++) {
            
            this.insumosReceta[this.nombresTipoInsumo[i]] = this.getTiposDeInsumos(codPT,this.shortNameTipoInsumo[i])

            const pesoTotalInsumos = this.insumosReceta[this.nombresTipoInsumo[i]]
                            .reduce((collector,{pesos}) => {
                               
                                return collector + (pesos * this.factor)
                            },0)
            this.pesoInsumosReceta[this.nombresTipoInsumo[i]] = Math.round(pesoTotalInsumos * 100) / 100
        }
        
    }

    rows = () =>{
        return this.formmula  
    }

    header = () =>{
        return Object.values(this.data[0]);
    }

    getRecetas = () =>{
        
        const formula = this.rows();
        const recetas = [ { codPT:formula[0].codPT , receta:formula[0].receta } ]
       
        formula.forEach((row)=>{
            
            const flag = recetas.find((line) => line.codPT === row.codPT )

            if(flag===undefined){
                recetas.push({ codPT:row.codPT , receta:row.receta })
            }
            
        })
        return recetas
    }

    getReceta = (codPT) =>{
        let total = 0
        const filterById = (obj) => {

            if(obj.codPT === codPT){
                total = total + (obj.pesos * 4)
                return true
            }else{
                return false
            }

        }

        const result = this.rows().filter( filterById );
        this.pesoTotalReceta = Math.round(total *100) / 100
        return result
    
    }

    buscarInsumo = (codInsumo) => {
        const insumo = this.insumos.find(({CODIGO}) => CODIGO == codInsumo)
        return insumo
    }

    getTiposDeInsumos = (codPT,tipoInsumo) => {

        const receta = this.getReceta(codPT)
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

const Receta = new DataExcel;



/** GRAFICOS DINAMICOS */