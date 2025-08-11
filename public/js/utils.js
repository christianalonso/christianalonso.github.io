const utils = (()=>{
    
    feather.replace({ 'aria-hidden': 'true' })
    const self = this
    const borderColor = { danger:"border-danger",warning:"border-warning",primary:"border-primary",secondary:"border-secondary" }
    const btnOutline = {danger:"btn-outline-danger",warning:"btn-outline-warning",primary:"btn-outline-primary",secondary:"btn-outline-secondary"}

    self.toBatch = (peso,factorPesaje) => {
        const batch = peso * factorPesaje
        return Math.round(batch *100) / 100
    }

    self.toDecimal = (number)=>{
        return Math.round(number *100) / 100
    }

    self.pesoACadena = (peso) => {
        return peso.toFixed(2)
    }

    self.claseDeEstilo = (grupo) => {
        let className = {}
        switch (grupo) {

            case "grupo1":
                className = {border:borderColor.danger,btnBorder:btnOutline.danger}
                break;

            case "grupo2":
                className = {border:borderColor.warning,btnBorder:btnOutline.warning}
                break;

            case "grupo3":
                className = {border:borderColor.primary,btnBorder:btnOutline.primary}
                break;    
        
            default:
                className = {border:borderColor.secondary,btnBorder:btnOutline.secondary}
                break;
        }
        return className
    }

    self.percent = (value,base) => {
        const valor = (value / base) * 100
        const tenth = Math.round(valor *100) / 100
        const porcent =  tenth.toFixed(2)+"%"
        return porcent
    }

    self.myAlert = (config) =>{
        const options = config || { 
            icon: "info",
            title: "Oops...",
            text: "Something went wrong!",
        }

        Swal.fire({
            icon: options.icon,
            title: options.title,
            text: options.text
        });
    }

    self.sortableItem = (listItem,callback) => {
        
        this.draggable = ""
        this.dragginPositionItem =""     

        listItem.addEventListener("dragstart",(e)=>{

            setTimeout(()=>{ listItem.classList.add("dragging") },0)
            this.draggable = e.target
            this.dragginPositionItem = [...listItem.parentElement.children].indexOf(this.draggable)
            
        })  

        listItem.addEventListener("dragend",()=>{
            listItem.classList.remove("dragging") 
        })

        listItem.addEventListener("dragover",(e)=>{
            e.preventDefault()
        })

        listItem.addEventListener("drop",(e) => {
            
            if(this.draggable.parentElement === e.currentTarget.parentElement){

                const nextSibling = this.draggable.nextElementSibling
                const dropPosition = [...listItem.parentElement.children].indexOf(e.currentTarget)
                const bypass = this.dragginPositionItem - dropPosition
                const sibling = this.dragginPositionItem < dropPosition ? e.currentTarget.nextElementSibling : e.currentTarget
                listItem.parentElement.insertBefore(this.draggable,sibling)
                
                if(bypass != -1 && bypass != 0 && bypass != 1){
                    listItem.parentElement.insertBefore(e.currentTarget,nextSibling)
                }
                callback(listItem)
            }

            
        })

    }

    self.draggable = (opt) => {
        const drag = document.querySelector(opt.drag)
        const grab = document.querySelector(opt.grab)
        grab.style.cursor = "grab"
        let isDraggin = false
        let locationX, locationY

        drag.addEventListener("mousedown",(e) => {
            
            if(e.target === grab){
                isDraggin = true
                locationX = e.clientX - drag.offsetLeft
                locationY = e.clientY - drag.offsetTop
                grab.style.cursor = "grabbing"
            }
            
        })

        drag.addEventListener("mousemove",(e) => {
            
            if(isDraggin){
                drag.style.left = e.clientX - locationX + "px"
                drag.style.top = e.clientY - locationY + "px"
            }

        })

        drag.addEventListener("mouseup",() => {
            isDraggin = false
            grab.style.cursor = "grab"
        })

        const modal = document.getElementById("exampleModal")
        modal.addEventListener("hidden.bs.modal",() => {
            drag.style.left = 0 + "px"
            drag.style.top = 0 + "px"
        })
    }
    self.insumosDeMuestra = {
    premix:[
                {descripcion:"insumo1",pesos:2.5},
                {descripcion:"insumo2",pesos:2.5},
                {descripcion:"insumo3",pesos:2.5},
                {descripcion:"insumo4",pesos:2.5},
                {descripcion:"insumo5",pesos:2.5},
                {descripcion:"insumo6",pesos:2.5},
                {descripcion:"insumo7",pesos:2.5},
                {descripcion:"insumo8",pesos:2.5},
                {descripcion:"insumo9",pesos:2.5},
                {descripcion:"insumo10",pesos:2.5}
            ],
    medios:[
                {descripcion:"insumo11",pesos:7.5},
                {descripcion:"insumo12",pesos:7.5},
                {descripcion:"insumo13",pesos:7.5},
                {descripcion:"insumo14",pesos:7.5},
                {descripcion:"insumo15",pesos:7.5},
                {descripcion:"insumo16",pesos:7.5}
            ],
    liquidos:[{descripcion:"insumo17",pesos:20}],
    macros:[
                {descripcion:"insumo18",pesos:600},
                {descripcion:"insumo19",pesos:140},
                {descripcion:"insumo20",pesos:50}
             ],
  }
    return self

})()

