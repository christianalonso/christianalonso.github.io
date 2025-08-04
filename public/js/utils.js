const utils = (()=>{
    
    feather.replace({ 'aria-hidden': 'true' })
    const self = this

    self.percent = (value,base) => {
        const valor = (value * 100) / base
        const porcent = valor != 100 ? valor.toFixed(2)+"%" : valor+"%"
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
    
    return self

})()

