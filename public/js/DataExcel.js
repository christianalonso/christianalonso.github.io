class DataExcel{
    
    constructor(){
       this.data
    }

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
        this.insumos = insumos();
    }

    rows = () =>{
        return this.data.slice(1,this.data.lenght)
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

    getTipoInsumosReceta = (idReceta,type) => {

        const arr = []
        const receta = this.filterProduct(idReceta)

        receta.forEach(element => {
            
            const match = this.insumos.find( (insumo) =>{
                return element.codInsumo === insumo.CODIGO && insumo.TIPO === type
            })

            if(match){
                match.PESOS = element.pesos
                arr.push(match)
            }

        });

        return arr

    }

}

const data = new DataExcel;

/** GRAFICOS DINAMICOS */