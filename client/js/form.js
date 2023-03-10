const form = [...document.querySelector('.form').children];

form.forEach((item,i) => {
    setTimeout( () => {
        item.style.opacity = 1;
    }, i*100);
})

async function authPostReq(url, data) {
    // Default options are marked with *
    return await fetch(`http://localhost:3000/${url}`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",

            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }); // parses JSON response into native JavaScript objects
}

function loginBtnClick() {
    // TODO: Validate the form before trying to authenticate
    let data = {
        email: document.getElementById('email').value,
        pass: document.getElementById('password').value
    };
    authPostReq("login", data).then((res) => {
        if(res.status === 201){
            window.location.replace("./index.html");
        }else if(res.status === 401){
            alert("Incorrect email/password");
        }else{
            alert("An error occurred whilst trying to sign in");
        }
        console.log(res); // JSON data parsed by `data.json()` call
    });
}

function registerBtnClick() {
    // TODO: Validate the form before trying to authenticate
    // TODO: Add username to the database
    let data = {
        // name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        pass: document.getElementById('password').value
    };
    authPostReq("register", data).then((res) => {
        if(res.status === 201){
            window.location.replace("./index.html");
        }else{
            alert("An error occurred whilst trying to register");
        }
        console.log(res); // JSON data parsed by `data.json()` call
    });
}

window.onload = async () => {
    const loginBtn = document.getElementById('login-btn');
    if(loginBtn != null){
        loginBtn.addEventListener(
            'click',
            loginBtnClick
        );
    }

    const regBtn = document.getElementById('register-btn');
    if(regBtn != null){
        regBtn.addEventListener(
            'click',
            registerBtnClick
        );
    }
}
