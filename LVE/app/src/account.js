document.getElementById('btn-game').addEventListener("click", () => {
    window.open("http://localhost:3000/");
});
document.getElementById('btn-manage').addEventListener("click", () => {
    window.open("http://localhost:3000/manage");
});
// get element / button login logout register
const URL_SERVER = "http://localhost:5000/"
const btnLogin = document.getElementById("btn-login-extension")
const btnRegister = document.getElementById("btn-register-extension")
const btnLogout = document.getElementById("btn-logout-extension")
const lb_fullName = document.getElementById("fullName")
//check exist token
let myToken = window.localStorage.getItem("tokenlve")
let myAccountID = window.localStorage.getItem("accountIDlve")

if (myToken) {
    //show button logout
    showBtnLogout()
    let myData = (async () => await fetchData(`account/getone/${myAccountID}`))().then((value) => {
        lb_fullName.innerHTML = "Xin chào, "+ value.AC_fullName
    })
    //update gui
} else {
    console.log("chưa đăng nhập");
    showBtnLogin()
}
function showBtnLogout() {
    btnLogin.style.display = "none"
    btnRegister.style.display = "none"
    btnLogout.style.display = "block"
}
function showBtnLogin() {
    btnLogin.style.display = "block"
    btnRegister.style.display = "block"
    btnLogout.style.display = "none"
}
//set onclick account btn
btnLogin.addEventListener("click", () => {
    window.open("http://localhost:3000/")
})
btnLogout.addEventListener("click", () => {
    localStorage.clear()
    window.location.reload()
})
btnRegister.addEventListener("click", () => {
    window.open("http://localhost:3000/");
})
// end set onclick account btn

async function fetchData(requestUrl) {
    let response = await fetch(`${URL_SERVER}${requestUrl}`);
    if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        if (data.status == true) return data.data[0]
    }
}
//end check token
//
