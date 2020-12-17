window.onload = () => {

    const card = document.querySelector(".card");
    const input = document.querySelector("input");
    const label = document.querySelector("label");
    const error = document.querySelector(".error p");
    const button = document.querySelector("input.btn");


    if(error){
        if(error.innerHTML == "Contraseña Incorrecta"){
            card.classList.remove("bg-dark")
            card.setAttribute("style", "background-color: rgba(217,83,79);");
            card.classList.remove("text-white");
            card.classList.add("text-dark");
            button.classList.remove("btn-outline-secondary");
            button.classList.add("btn-outline-dark");
        }

    }

}