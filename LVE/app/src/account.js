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
const bodyWord = document.getElementById("bodyWord")
var t_totalWord = document.getElementById("t_totalWord")
var t_totalWordToday = document.getElementById("t_totalWordToday")
//check exist token
let myToken = window.localStorage.getItem("tokenlve")
let myAccountID = window.localStorage.getItem("accountIDlve")

if (myToken) {
    //show button logout
    showBtnLogout()
    handleInitData()
    // let myData = (async () => await fetchData(`account/getone/${myAccountID}`))().then((value) => {
    //     lb_fullName.innerHTML = "Xin chào, "+ value.AC_fullName
    // })
    //update gui
    // let analyticWord = (async () => await fetchDataOther(`word/getAnalyticWordByIdAccount/${myAccountID}`))().then((value) => {
    //     console.log(value);
    // })

} else {
    console.log("chưa đăng nhập");
    showBtnLogin()
    bodyWord.style.display = "none"
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
async function handleInitData(){
    let getAccountRequest = {
        AC_Id:myAccountID,
        S_Value: myToken
    }
   let account = await post("account/getone",getAccountRequest)
   console.log(account);
   lb_fullName.innerHTML = "Xin chào, "+ account.data[0].AC_fullName
    //init analytic word
    let analyticWord = await fetchDataOther(`word/getAnalyticWordByIdAccount/${myAccountID}`)
    console.log(analyticWord);
    t_totalWord.innerHTML = analyticWord.totalWord
    t_totalWordToday.innerHTML = analyticWord.totalWordToday
}
async function fetchDataOther(requestUrl) {
    let response = await fetch(`${URL_SERVER}${requestUrl}`);
    if (response.status === 200) {
        let data = await response.json();
        return data.data
    }
}
async function post(requestUrl, data) {
    let formBody = convertPostData(data)
    let response = await fetch(`${URL_SERVER}${requestUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    }).then(data => data.json())
    if (response.status === true) {
        return response
    }
    return false;
}

function convertPostData(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
}
//end check token
