function showPopup(msg) {
    const btnClosePopup = document.querySelector(".close");
    const btnRestartPopup = document.querySelector(".restart");
    btnClosePopup.addEventListener("click", function () {
        popup.style.display = "none";
    });
    btnRestartPopup.addEventListener("click", function () {
        popup.style.display = "none";

    });
    const popup = document.getElementById("popup");
    if(arrX.length !== 5  || arrO.length !== 5) {
        let popupMessage = popup.getElementsByClassName("message")[0];
        popupMessage.style.fontFamily = 'Bruno Ace';
        popupMessage.innerText = `${msg}`;
    }else{
        let popupMessage = popup.getElementsByClassName("message")[0];
        popupMessage.innerText = `${msg}`;
        popupMessage.style.fontFamily = 'Bruno Ace';
    }
    popup.style.display = "block";

}

