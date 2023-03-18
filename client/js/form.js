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
    let data = {
        email: document.getElementById('email').value,
        pass: document.getElementById('password').value
    };
    if(inputValidation(Object.values(data))){
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
    }else{
        alert("Ensure all fields are filled");
    }
}

function registerBtnClick() {
    let data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        pass: document.getElementById('password').value
    };
    if(inputValidation(Object.values(data))){
        authPostReq("register", data).then((res) => {
            if(res.status === 201){
                window.location.replace("./index.html");
            }else{
                alert("An error occurred whilst trying to register");
            }
            console.log(res); // JSON data parsed by `data.json()` call
        });
    }else{
        alert("Ensure all fields are filled");
    }
}

function inputValidation(values) {
    // Simple validation to ensure no fields are empty
    // TODO: Better validation
    let valid = true;
    values.forEach((val)=>{
        if(val.length === 0){
            valid = false;
        }
    });
    return valid;
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
