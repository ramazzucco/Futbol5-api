window.onload = () => {

    // Muestra el formulario automaticamente al cargar la pagina.
    const modal = document.querySelector(".modal");

    if(modal){
        if(modal.className.includes("show")
            || modal.className.includes("succefull")
            || modal.className.includes("failed")){
                $(".modal").modal("show")
        }
    }

    // Agrega el estado activo de los links.
    const bttonpages = document.querySelectorAll(".bttonpage a");

    bttonpages.forEach( bttonpage => {
        const title = bttonpage.innerHTML;
        bttonpage.onclick = () => {
            bttonpages.forEach( page => {
                const newtitle = page.innerHTML;
                if(page.innerHTML != title && page.className.includes("pageActive")){
                    page.classList.remove("pageActive");
                    document.getElementById(`${newtitle}`).classList.toggle("d-none");
                }
                })
            document.getElementById(`${title}`).classList.toggle("d-none");
            bttonpage.classList.toggle("pageActive");
        }
    })

    // >>>>>>>>>>>>>>>>>>>>>>>>>>     VALIDATION FORM FRONT    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const form = document.querySelector(".form_reserve");
    const cancha = document.querySelector("form .cancha");
    const horario = document.querySelector("form .horario");
    const name = document.querySelector("form .name");
    const lastname = document.querySelector("form .lastname");
    const email = document.querySelector("form .email");
    const telefono = document.querySelector("form .telefono");

    function handlerEvents(array){
        array.map( field => {
            field.events.map(event => {

                if(event == "onchange"){
                    field.objectDom.onchange = () => {
                        if(field.objectDom.value != ""){
                            field.objectDom.classList.remove("is-invalid");
                            document.querySelector(`.error_${field.string}`).classList.add("d-none");
                        }
                    }
                }

                if(event == "onkeydown"){
                    field.objectDom.onkeydown = () => {

                        const minQuantity = field.string == "name" || field.string == "lastname" ? 3 : 8;
                        const maxQuantity = field.string == "name" || field.string == "lastname" ? 15 : 8;

                        if(field.objectDom.value != ""){
                            field.objectDom.classList.remove("is-invalid");
                            document.querySelector(`.error_${field.string}`).classList.add("d-none");
                        }

                        if(field.objectDom.value.trim() != ""
                            && field.objectDom.value.trim().length < minQuantity
                            || field.objectDom.value.trim().length > maxQuantity ){
                            field.objectDom.classList.add("is-invalid");
                        } else {
                            field.objectDom.classList.add("is-valid");
                        }

                        if(field.string == "email"){
                            const isemail = field.objectDom.value.trim().indexOf("@");

                            if(field.objectDom.value.trim() != "" && isemail != -1){
                                field.objectDom.classList.remove("is-invalid");
                                field.objectDom.classList.add("is-valid");
                            } else {
                                field.objectDom.classList.add("is-invalid");
                            }
                        }

                        if(field.string == "telefono"){
                            const quantity = field.objectDom.value.trim().length;

                            if(field.objectDom.value.trim() != "" && quantity == 9){
                                field.objectDom.classList.remove("is-invalid");
                                field.objectDom.classList.add("is-valid");
                            } else {
                                field.objectDom.classList.add("is-invalid");
                            }

                        }
                    }

                }

                if(event == "onfocusout"){

                    if(field.string == "name" || field.string == "lastname"){

                        field.objectDom.onfocusout = () => {

                            if(field.objectDom.value.trim() == ""){

                                if(field.objectDom.className.includes("is-valid")){
                                    field.objectDom.classList.remove("is-valid")
                                    field.objectDom.classList.add("is-invalid")
                                }
                            }

                        }

                    }

                }

            } )
        })
    }

    function getValidation(array){
        const errors = [];
        array.map(field => {
            field.validation.map( tovalidate =>{
                if(tovalidate == "required"){
                    console.log(field.objectDom.value)
                    if(field.objectDom.value.trim() == ""){
                        field.objectDom.classList.add("is-invalid");
                        errors.push(`${field.string}`,"Este campo es obligatorio.");
                    }
                }

                if(tovalidate == "characterquantity"){
                    const minQuantity = field.string == "name" || field.string == "lastname" ? 3 : 9;
                    const maxQuantity = field.string == "name" || field.string == "lastname" ? 15 : 9;
                    const message = field.string == "name" || field.string == "lastname"
                        ? "Minimo 3 caracteres y maximo 15 caracteres."
                        : "El numero no es válido.";

                    if(field.objectDom.value.trim() != ""
                        && field.objectDom.value.trim().length < minQuantity
                        || field.objectDom.value.trim().length > maxQuantity ){
                        field.objectDom.classList.add("is-invalid");
                        errors.push(`${field.string}`,`${message}`);
                    }
                }

                if(tovalidate == "isemail"){
                    if(field.objectDom.value.trim() != "" && field.objectDom.value.trim().indexOf("@") == -1 ){
                        field.objectDom.classList.add("is-invalid");
                        errors.push(`${field.string}`,"El mail no es válido.");
                    }
                }

            } )

        });
        return errors;
    }

    const fieldsEvents = [
        {string: "cancha",objectDom: cancha,events: ["onchange"]},
        {string: "horario",objectDom: horario,events: ["onchange"]},
        {string: "name",objectDom: name,events: ["onkeydown","onfocusout"]},
        {string: "lastname",objectDom: lastname,events: ["onkeydown","onfocusout"]},
        {string: "telefono",objectDom: telefono,events: ["onkeydown"]},
        {string: "email",objectDom: email,events: ["onkeydown"]}
    ]

    handlerEvents(fieldsEvents);

    form.onsubmit = (e) => {

        const fields = [
            {string: "cancha",objectDom: cancha,validation: ["required"]},
            {string: "horario",objectDom: horario,validation: ["required"]},
            {string: "name",objectDom: name,validation: ["required","characterquantity"]},
            {string: "lastname",objectDom: lastname,validation: ["characterquantity"]},
            {string: "telefono",objectDom: telefono,validation: ["required","characterquantity"]},
            {string: "email",objectDom: email,validation: ["isemail"]}
        ]

        const errors = getValidation(fields);

        if(errors.length) {

            e.preventDefault()

            for (let i = 0; i < errors.length; i=i+2) {

                if(document.querySelector(`.error_${errors[i]}`).className.includes("d-none")){
                    document.querySelector(`.error_${errors[i]}`).classList.remove("d-none");
                }
                document.querySelector(`.error_${errors[i]}`).innerHTML = `<i class="fas fa-exclamation-circle pr-3"></i>${errors[(i+1)]}`

           }
        } else {
            // Muestra el loading al enviar formulario de reserva.

            const modalLoading = document.querySelector(".loading");
            const modalBody = document.querySelector(".modal-body");
            const modalButton = document.querySelector(".modal button");

            form.classList.toggle("d-flex")
            form.classList.toggle("d-none");
            modalBody.classList.add("bg-info");
            modalLoading.classList.toggle("d-none");
            modalButton.classList.toggle("d-none");
        }


    }

    // Seleccionar horarios de una determinada cancha.

    if(cancha){
        cancha.onchange = (e) => {

            const canchaSelected = document.querySelectorAll(`.horario`);
            canchaSelected.forEach( horario => {
                if(horario.className.includes("d-flex") && !horario.className.includes(`cancha${e.target.value}`)){
                    horario.classList.remove("d-flex")
                }
                if(horario.className.includes(`cancha${e.target.value}`)){
                    horario.classList.add("d-flex");
                }
            })
            if(cancha.value != ""){
                cancha.classList.remove("is-invalid");
                document.querySelector(".error_cancha").classList.add("d-none")
            }

        }

    }

}