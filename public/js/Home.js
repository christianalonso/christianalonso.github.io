let inputfile = document.getElementById("filexlsx")
const listaReceta = document.getElementById("listReceta")
const btnPDF = document.getElementById("btnPDF")
const btnPrint = document.getElementById("btnPrint")
const marco = document.querySelector("#toPrint")
const pathPrint = "Template/Print.html"
const modalAddPremix = document.getElementById("addPremixModal")
const btnAddNewPremix = document.getElementById("addNewPremix")


modalAddPremix.addEventListener('shown.bs.modal', (e) => {
    const name = e.relatedTarget.name
    btnAddNewPremix.value = name
    document.querySelector("#modalNewPremixLabel").textContent =`Nuevo Insumo Grupo ${name[5]}`
})

btnAddNewPremix.addEventListener("click",(e)=>{

    const nombreInsumo = document.getElementById("txtNombreInsumo")
    const pesoInsumo = document.getElementById("txtPesoInsumo")
    const borderColor = claseDeEstilo(e.target.value)

    addItemList(borderColor.border,{
        codInsumo:"G0_"+nombreInsumo,
        descripcion:nombreInsumo.value.toUpperCase(),
        displayBatch: (pesoInsumo.value * 4).toFixed(2)
        
    },{name:e.target.value,id:"G0_"+nombreInsumo,})
    
    nombreInsumo.value = ""
    pesoInsumo.value = ""

})

btnPDF.addEventListener("click",(e)=>{
    localStorage.setItem("export",true)
    localStorage.setItem("content",crearTablaPesaje())
    marco.src = pathPrint
   
})

btnPrint.addEventListener("click",(e)=>{

    localStorage.setItem("content",crearTablaPesaje())
    marco.src = pathPrint
   
})

function crearTablaPesaje(){

    let main=""
    const container = document.createElement("div")

    container.innerHTML = `<div class="table-title">
                                <h5>${document.getElementById("tableTitle").value}</5>
                            </div>`

    for (let i = 1; i <= 3; i++) {
        
        const lista = Array.from(document.querySelector("#grupo"+i).children)
        
        if(lista.length > 0){

            const table = document.createElement("table")

            if(i == 2) table.className = "margen"
            
            lista.forEach(item => {
                const tr = document.createElement("tr")
                const columns = item.querySelectorAll(".details")[0].children

                for (let x = 0; x < columns.length; x++) {
                    
                    const td = Object.assign(document.createElement("td"),{
                        textContent : columns[x].textContent
                    })

                    tr.appendChild(td)
                    
                }

                table.appendChild(tr)
            });
            container.appendChild(table)
        }
        
    }

    return container.innerHTML
}

const validFiedls = (fields) => {
    let valid = true
    if(!fields){
        return false
    }

    let fld = ["COD.INSUMO","DESCRIPCION","PESOS","COD.PT","NUMVERSION","FECHAVERSION","RECETA"]
    
    fields.forEach((element,index) => {
        
        if(!(element === fld[index])){
            valid = false
            return
        }
    });
   
    return valid;
}

const fillList = (id,data)=>{

    let lista = document.getElementById(id)
    lista.innerHTML = ""
    data.forEach(element => {

        const li = Object.assign(document.createElement("li"),{
            value:element.codPT
        })
        const a = Object.assign(document.createElement("a"),{
            className:"dropdown-item",
            href:"#",
            textContent:element.receta
        })

        li.appendChild(a)
        lista.appendChild(li)
    });

}

const handleFile = (e)=>{

    const file = e.target.files[0];
    const reader  = new FileReader();

    let regex = /(.xls|.xlsx)$/

    if(!file){
        return
    }

    if(!regex.test(file.name)){
        utils.myAlert({icon:"error",title:"Oops...Algo salio mal",text:"Al parecer intentaste subir un archivo diferente a un libro de excel"})
        return
    }

    reader.onload = (e) =>{

        data.init(reader.result)

        if(!validFiedls(data.header())){
            
            utils.myAlert({icon:"error",title:"Oops...Algo salio mal",text:"El archivo que intentaste subir no es una formula de batcheo"})
            inputfile.value = null
            return
        }

        fillList("listReceta",data.getUniquesCode());
        document.getElementById("nameFile").textContent = file.name
       
        if(data.insumoNoRegistrado.length > 0){
            utils.myAlert({icon:"error",title:"Cuidado...!",text:`
                El paquete contiene insumos que no se encuentran registrados en la base de datos, comunicarse con el administrador.
                `})
        }else{
            utils.myAlert({icon:"success",title:"Bien Hecho...!",text:"El paquete se cargo correctamente"})
        }
       
        llenarTablaReceta(139590)
                
    } 
    
    reader.error = () =>{
        utils.myAlert({icon:"error",title:"Oops...Algo salio mal!",text:"El archivo no se pudo cargar, intentelo de nuevo mas tarde"})
    }

    reader.readAsArrayBuffer(file)

}

inputfile.addEventListener("change",handleFile);

listaReceta.addEventListener("click",(e)=>{

    e.preventDefault()
    if(e.target.tagName === "A" || e.target.tagName === "a"){
        llenarTablaReceta( e.target.parentNode.value)
    }
 
})

function llenarTablaReceta(codReceta){
    
    const codPT = codReceta
    const dataList = data.filterProduct(codPT)
    const table = document.getElementById("tableReceta")
    const title = document.getElementById("titleReceta")
    const tbody = document.createElement("tbody")
    const tableTitle = document.getElementById("tableTitle")
    
    const tbodyDelete = table.childNodes

    if(tbodyDelete.length > 3){
            tbodyDelete[3].remove()
        }

    title.textContent = dataList[0].receta+ " " + dataList[0].codPT
    tableTitle.value = dataList[0].codPT +" - "+ dataList[0].receta 
   
    dataList.forEach((element,index) => {
            
            const tr = document.createElement("tr")

            const num = Object.assign(document.createElement("td"),{
                textContent:index+1
            })
            tr.appendChild(num)

            const codInsumo = Object.assign(document.createElement("td"),{
                textContent:element.codInsumo
            })
            tr.appendChild(codInsumo)

            const descripcion = Object.assign(document.createElement("td"),{
                textContent:element.descripcion
            })
            tr.appendChild(descripcion)

            const pesos = Object.assign(document.createElement("td"),{
                textContent: element.pesos.toFixed(2)
            })
            tr.appendChild(pesos)

            const batch = Object.assign(document.createElement("td"),{
                textContent: element.displayBatch
            })
            tr.appendChild(batch)

            tbody.appendChild(tr)
            table.appendChild(tbody)

    });
    const insumos = assembleTypeInsumos(codPT,["MA","PE","LI","ME"])
    pesoTotalPorReceta(insumos)
    graphicPie.update(insumos)
    llenarListPremix(insumos.premix)
}

const pesoTotalPorReceta = (assembleInsumos) => {
    
    for (const key in assembleInsumos) {
        data.pesoTotalPorReceta[key] = assembleInsumos[key].reduce((collector,{batch}) => {
            return collector + batch
        },0)
    }
}

const assembleTypeInsumos = (idReceta,tipos) => {
    
    const roots = tipos.map((item) => {
        let root = ""

        switch (item) {
            case "MA":
                root="macros"
                break;

            case "ME":
                root="medios"
                break;

            case "PE":
                root="premix"
                break;
        
            case "LI":
                root="liquidos"
                break;
        }

        return root
        
    })

    const insumos = {
        macros:[],
        medios:[],
        premix:[],
        liquidos:[]
    }

   for (let i = 0; i < tipos.length; i++) {
        insumos[roots[i]] = data.filterTypeInsumo(idReceta,tipos[i])
   }
   
   return insumos
    
}

const listInsumosPremix = document.getElementById("listInsumosPremix")

listInsumosPremix.addEventListener("click",(e) => {
    
    if(e.target.tagName === "INPUT"){

        let target = e.target
        let value = JSON.parse(target.value)
        let checkboxes = [...target.parentElement.children]
        let edit = -1
        let theme = target.name
        let oldTheme = ""
        
        /* SELECCIONAR SOLO UN CHECKBOX */

        checkboxes.forEach((cbox,index) => {
            if(cbox !== target){
                if(cbox.checked){
                    edit=index
                }
                cbox.checked = false
            }
        });

        oldTheme = checkboxes[edit] === undefined ? "default" : checkboxes[edit].name
        if(target.checked === false){
            oldTheme = target.name
            theme= "default"
        }
        const className = claseDeEstilo(target.name)
        changeThemeItem(`[name='${target.id.slice(3,target.id.length)}']`,oldTheme,theme)
       
        /** EDITAR */   
        
        if(edit >= 0){
            let toMove = document.getElementById(value.codInsumo)
            let originFromToMove = toMove.parentElement.id
            let destiny = document.getElementById(target.name)

            destiny.appendChild(toMove)
            pesoTotal(originFromToMove)
            toMove.classList.replace(toMove.classList[1],className.border)
            pesoTotal(target.name)
            window.scrollTo(0, document.body.scrollHeight);

        }

        /* AGREGAR */
        
        if(target.checked && edit == -1 ){
            addItemList(className.border,value,target)
        }

        /** ELIMINAR  */

        if(target.checked === false){
            removeItemList(target.name,value.codInsumo)
        }
    }

});

function addItemList(colorBorde,data,target){

    let lista = document.getElementById(target.name)
    const listItem = Object.assign(document.createElement("li"),{
        id:data.codInsumo,
        className: `list-item ${colorBorde} border border-3 py-1 px-1`,
        draggable:true
    })

    listItem.innerHTML = `<div class="details fw-bold">
                        <span class="descripcion">${data.descripcion}</span>
                        <span class="pesos">${data.displayBatch}</span>
                        <span class="incremento"></span>
                    </div>
                    <div class="d-flex align-items-center">
                        <button type="button" onclick="deleteItemList(this)" name="${target.id}"  class="btn btn-danger btn-list">
                            <i class="bi bi-trash"></i>
                        </button>
                        <i class="bi bi-grip-vertical"></i> 
                    </div>`
    // sortableItem(listItem)
    utils.sortableItem(listItem,(item) => { pesoTotal(item.parentElement.id) })
    lista.appendChild(listItem)
    pesoTotal(target.name)
    window.scrollTo(0, document.body.scrollHeight);

}


const removeItemList = (idList,idItem) => {
    removeElement(idItem)
    pesoTotal(idList)
}

const removeElement = (id)=>{
    let toDelete = document.getElementById(id)
    toDelete.remove()
}

function pesoTotal (idLista) {
    let ponderado = 0
    let grupo = document.getElementById(idLista)
    let filas = grupo.children

    for (let x = 0; x < filas.length; x++) {
        let pesos = filas[x].getElementsByClassName("pesos")[0].innerHTML
        ponderado = ponderado + parseFloat(pesos)
        filas[x].getElementsByClassName("incremento")[0].innerHTML = ponderado.toFixed(2)
    }

    grupo.parentElement.nextElementSibling.innerHTML = `Peso total : ${ponderado.toFixed(2)} Kg`
}

const llenarListPremix = (listPremix) => {
    
    let incremento = 0
    listInsumosPremix.innerHTML = ""
    const inputs = (values) => {
            let elementos = "";
            for (let i = 1; i <= 3; i++) {
                elementos += `<input type="checkbox" class="btn-check" id="G${i}_${values.codInsumo}" value='${JSON.stringify(values)}' name="grupo${i}" autocomplete="off">
                                    <label class="btn btn-outline-secondary" for="G${i}_${values.codInsumo}">G${i}</label>`
                
            }
            return elementos
    }

    const grupos = ["grupo1","grupo2","grupo3"]
    for (let i = 0; i < grupos.length; i++) {

         const grupo = document.getElementById(grupos[i])
         grupo.innerHTML = ""
         pesoTotal(grupos[i])
        
    }
    
    listPremix.forEach((element) => {
        incremento = incremento + element.batch
        const itemList = `<li class="list-item border-secondary border border-3 px-2 py-1" name="${element.codInsumo}">
                            <div class="details fw-bold">
                                <span class="descripcion">${element.descripcion}</span>
                                <span class="pesos">${element.displayBatch}</span>
                                <span class="incremento">${(incremento).toFixed(2)}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="btn-group btn-group-sm px-2" role="group">
                                    ${inputs(element)}
                                </div>
                                <i class="bi bi-grip-vertical"></i> 
                            </div>
                        </li>`
        
        listInsumosPremix.innerHTML += itemList
    });
    document.getElementById("pesoTotal").textContent = `Peso total : ${data.pesoTotalPorReceta.premix.toFixed(2)} Kg`
}

const borderColor = { danger:"border-danger",warning:"border-warning",primary:"border-primary",secondary:"border-secondary" }
const btnOutline = {danger:"btn-outline-danger",warning:"btn-outline-warning",primary:"btn-outline-primary",secondary:"btn-outline-secondary"}

const claseDeEstilo = (grupo) => {
   
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

function changeThemeItem(querySelector,oldTheme,newTheme){

    const listInsumosPremix = document.getElementById("listInsumosPremix")
    const item = listInsumosPremix.querySelector(querySelector)
    const oldBorder = claseDeEstilo(oldTheme)
    const newBorder = claseDeEstilo(newTheme)

    item.classList.replace(oldBorder.border,newBorder.border)
    const groupCheckbox = item.querySelectorAll("label")
    
    for (let i = 0; i < groupCheckbox.length; i++) {
        groupCheckbox[i].classList.replace(oldBorder.btnBorder,newBorder.btnBorder)
    }
}

function deleteItemList(e) {

    const id = e.name.slice(3,e.name.length)
    
    if(isNaN(id) === false){
        const checkBox = document.getElementById(e.name)
        removeItemList(checkBox.name,id)
        changeThemeItem(`[name='${id}']`,checkBox.name,"default")
        checkBox.checked = false
        return
    }
    
    removeItemList(btnAddNewPremix.value,e.name)
    
}

utils.draggable({drag:".draggable",grab:".modal-header"})










