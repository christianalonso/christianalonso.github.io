let inputfile = document.getElementById("filexlsx")
const listaReceta = document.getElementById("listReceta")
const btnPDF = document.getElementById("btnPDF")
const btnPrint = document.getElementById("btnPrint")
const marco = document.querySelector("#toPrint")
const pathPrint = "Template/Print.html"
const modalAddPremix = document.getElementById("addPremixModal")
const btnAddNewPremix = document.getElementById("addNewPremix")

function showBatch(peso){
    return utils.pesoACadena(utils.toBatch(peso,4))
}

function showPeso(peso){
    return utils.pesoACadena(utils.toDecimal(peso))
}

modalAddPremix.addEventListener('shown.bs.modal', (e) => {
    const name = e.relatedTarget.name
    btnAddNewPremix.value = name
    document.querySelector("#modalNewPremixLabel").textContent =`Nuevo Insumo Grupo ${name[5]}`
})

btnAddNewPremix.addEventListener("click",(e)=>{

    const nombreInsumo = document.getElementById("txtNombreInsumo")
    const pesoInsumo = document.getElementById("txtPesoInsumo")
    const borderColor = utils.claseDeEstilo(e.target.value)

    addItem(borderColor.border,{
        codInsumo:"G0_"+nombreInsumo,
        descripcion:nombreInsumo.value.toUpperCase(),
        pesos: pesoInsumo.value
        
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

        Receta.cargarArchivoExcel(reader.result)

        if(!validFiedls(Receta.header())){
            
            utils.myAlert({icon:"error",title:"Oops...Algo salio mal",text:"El archivo que intentaste subir no es una formula de batcheo"})
            inputfile.value = null
            return
        }
       
        if(Receta.insumoNoRegistrado.length > 0){
            utils.myAlert({icon:"error",title:"Cuidado...!",text:`
                El paquete contiene insumos que no se encuentran registrados en la base de datos, comunicarse con el administrador.
                `})
        }else{
            utils.myAlert({icon:"success",title:"Bien Hecho...!",text:"El paquete se cargo correctamente"})
        }
        document.getElementById("nameFile").textContent = file.name
        fillList("listReceta",Receta.getRecetas());
        realeaseReceta(139590);
                
    } 
    
    reader.error = () =>{
        utils.myAlert({icon:"error",title:"Oops...Algo salio mal!",text:"El archivo no se pudo cargar, intentelo de nuevo mas tarde"})
    }

    reader.readAsArrayBuffer(file)

}

function realeaseReceta (codPT) {
    Receta.prepararReceta(codPT)
    displayData(codPT)
}

function displayData(codPT){
    graphicPie.update(Receta.insumosReceta)
    llenarTablaReceta(codPT)
    llenarListPremix(Receta.insumosReceta.premix)
}

inputfile.addEventListener("change",handleFile);

listaReceta.addEventListener("click",(e)=>{

    e.preventDefault()
    if(e.target.tagName === "A" || e.target.tagName === "a"){
        realeaseReceta(e.target.parentNode.value)
    }
 
})

function llenarTablaReceta(codPT){
    
    const receta = Receta.getReceta(codPT)
    const table = document.getElementById("tableReceta")
    const title = document.getElementById("titleReceta")
    const tbody = document.createElement("tbody")
    const tableTitle = document.getElementById("tableTitle")
    
    const tbodyDelete = table.childNodes

    if(tbodyDelete.length > 3){
            tbodyDelete[3].remove()
        }

    title.textContent = receta[0].receta+ " " + receta[0].codPT
    tableTitle.value = receta[0].codPT +" - "+ receta[0].receta 

    receta.forEach((element,index) => {
            
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
                textContent: showPeso(element.pesos)
            })
            tr.appendChild(pesos)

            const batch = Object.assign(document.createElement("td"),{
                textContent: showBatch(element.pesos)
            })
            tr.appendChild(batch)

            tbody.appendChild(tr)
            table.appendChild(tbody)

    });
    
    
}

const listInsumosPremix = document.getElementById("listInsumosPremix")

const handleAdditem = (e) => {
    
    if(e.target.tagName === "INPUT"){

        const boxes = checkBoxes(e)
        const switchGroup =  boxsChecked(boxes)
        const itemData = JSON.parse(e.target.value)

        /** Cambiar de grupo al item **/
        if(switchGroup.length === 2){
            ChangeGroup(switchGroup,e.target)
            const oldBox = switchGroup.find((box) => box !== e.target)
            changeThemeItem(`[name='${itemData.codInsumo}']`,oldBox.name,e.target.name)
        }

        unCheck(boxes,e.target)

        /** Agregar item **/
        if(switchGroup.length === 1){
            addItem(itemData,e.target)
            changeThemeItem(`[name='${itemData.codInsumo}']`,"",e.target.name)
        }

        /** Eliminar item **/
        if(switchGroup.length === 0){
            removeItemList(e.target.name,itemData.codInsumo)
            changeThemeItem(`[name='${itemData.codInsumo}']`,e.target.name,"")
        }
    }
}

const ChangeGroup = (boxsChecked,target) => {

    const dataItem = JSON.parse(target.value)
    const item = document.getElementById(dataItem.codInsumo)
    const btnDelete = item.querySelector("button")
    btnDelete.name = target.id

    document.querySelector(`#${target.name}`).appendChild(item)

    for (const box of boxsChecked) {
        pesoTotal(box.name)
    }

}

const checkBoxes = (e) => {

    const parent = e.target.parentElement
    return parent.querySelectorAll("input")

}

const unCheck = (checkBoxes,target) =>{
    
    for (const current of checkBoxes) {
        if(current !== target){
            current.checked = false
        }
    }

}

const boxsChecked = (checkBoxes) => {
    
    const boxes = [...checkBoxes]
    const boxsChecked = boxes.filter((box) => {
        return box.checked
    })
    return boxsChecked

}

listInsumosPremix.addEventListener("click",handleAdditem);

function addItem(data,target){

    let lista = document.getElementById(target.name)
    const listItem = Object.assign(document.createElement("li"),{
        id:data.codInsumo,
        className: `list-item py-1 px-1`,
        draggable:true
    })

    listItem.innerHTML = `<div class="details fw-bold">
                        <span class="descripcion">${data.descripcion}</span>
                        <span class="pesos">${showBatch(data.pesos)}</span>
                        <span class="incremento"></span>
                    </div>
                    <div class="d-flex align-items-center">
                        <button type="button" onclick="deleteItemList(this)" name="${target.id}"  class="btn btn-danger btn-list">
                            <i class="bi bi-trash"></i>
                        </button>
                        <i class="bi bi-grip-vertical"></i> 
                    </div>`
    
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
        filas[x].getElementsByClassName("incremento")[0].innerHTML = showPeso(ponderado)
    }

    grupo.parentElement.nextElementSibling.innerHTML = `Peso total : ${showPeso(ponderado)} Kg`
}

const llenarListPremix = (listPremix) => {
    
    let incremento = 0
    listInsumosPremix.innerHTML = ""
    const inputs = (values) => {
            let elementos = "";
            for (let i = 1; i <= 3; i++) {
                const valores = {
                    codInsumo:values.codInsumo,
                    descripcion:values.descripcion,
                    pesos:values.pesos
                }
                elementos += `<input type="checkbox" class="btn-check" id="G${i}_${values.codInsumo}" value='${JSON.stringify(valores)}' name="grupo${i}" autocomplete="off">
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
        incremento = incremento + (element.pesos * Receta.factor)
        const itemList = `<li class="list-item border-secondary border border-3 px-2 py-1" name="${element.codInsumo}">
                            <div class="details fw-bold">
                                <span class="descripcion">${element.descripcion}</span>
                                <span class="pesos">${showBatch(element.pesos)}</span>
                                <span class="incremento">${showPeso(incremento)}</span>
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
    document.getElementById("pesoTotal").textContent = `Peso total : ${Receta.pesoInsumosReceta.premix.toFixed(2)} Kg`
}

function changeThemeItem(querySelector,oldTheme,newTheme){

    const listInsumosPremix = document.getElementById("listInsumosPremix")
    const item = listInsumosPremix.querySelector(querySelector)
    const oldBorder = utils.claseDeEstilo(oldTheme)
    const newBorder = utils.claseDeEstilo(newTheme)

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