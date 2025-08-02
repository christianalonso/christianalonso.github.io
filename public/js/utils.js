const utils = (()=>{
    const self = this

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

    return self
})()

