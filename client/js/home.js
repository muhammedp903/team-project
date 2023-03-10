
async function logoutBtnClick() {
    // Default options are marked with *
    fetch(`http://localhost:3000/logout`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            // "Content-Type": "application/json",

            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
        .then((res) => {
        if(res.status === 200){
            window.location.replace("./login.html");
        }else{
            alert("An error occurred");
        }
        console.log(res); // JSON data parsed by `data.json()` call
    });
}

function getTasks() {
    // TODO: GET request to retrieve tasks from the database for the current user
}

getTasks(); // Store the returned tasks to show later

window.addEventListener('load', () =>{

    const logoutBtn = document.getElementsByClassName('logout')[0];
    if(logoutBtn != null){
        logoutBtn.addEventListener(
            'click',
            logoutBtnClick
        );
    }

    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // TODO: Display the tasks retrieved from the database

    form.addEventListener('submit' , (e) => {
        e.preventDefault();
        
        const task = input.value;

        if (!task) {
            alert("Please fill out the task");
            return;
        }

        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");
        
        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value  = task;
        task_input_el.setAttribute("readonly" , "readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("edit");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        const taskDateEl = document.createElement("input");
        taskDateEl.classList.add("date");
        taskDateEl.type = "date";

        task_actions_el.appendChild(taskDateEl);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        input.value = "";

        task_edit_el.addEventListener('click' , () =>{
            if(task_edit_el.innerText.toLowerCase() === "edit" ){
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
             task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly" , "readonly");
                task_edit_el.innerText = "Edit";
            }
        });

        task_delete_el.addEventListener('click' , () =>{
            list_el.removeChild(task_el);

            
        });

        

    });


    
});
