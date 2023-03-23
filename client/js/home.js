let myTasks = [];
let list_el;

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
        console.log(res);
    });
}

function getTasks() {
    // Default options are marked with *
    fetch(`http://localhost:3000/tasks`, {
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
                const list_el = document.querySelector("#tasks");
                myTasks = res.json().then((tasks)=>{
                    tasks.forEach((item)=>{
                        console.log(item);
                        let task_el = createTaskElement(item.taskID, item.content);
                        list_el.appendChild(task_el);
                    });
                });
            }else{
                alert("An error occurred");
            }
            console.log(res);
        });
}

async function addTask(content) {
    let data = {
        content: content,
    };
    console.log(data);
    // Default options are marked with *
    return await fetch(`http://localhost:3000/addTask`, {
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
        body: JSON.stringify(data),
    });
}

async function removeTask(id) {
    let data = {
        taskID: id,
    };
    // Default options are marked with *
    return await fetch(`http://localhost:3000/removeTask`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",

            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data),
    });
}

function createTaskElement(id, task){
    const task_el = document.createElement("div");
    task_el.classList.add("task");
    task_el.setAttribute('id', id)

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

    // TODO: Update date in db when changed
    const taskDateEl = document.createElement("input");
    taskDateEl.classList.add("date");
    taskDateEl.type = "date";

    task_actions_el.appendChild(taskDateEl);

    task_el.appendChild(task_actions_el);

    // TODO: Edit tasks from db
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
        removeTask(task_el.id).then((res) => {
            if(res.status !== 200){
                alert("An error occurred")
            }
            console.log(res); // JSON data parsed by `data.json()` call
            list_el.removeChild(task_el);
        });
    });

    return task_el
}

window.addEventListener('load', () =>{

    const logoutBtn = document.getElementsByClassName('logout')[0];
    if(logoutBtn != null){
        logoutBtn.addEventListener(
            'click',
            logoutBtnClick
        );
    }

    getTasks(); // Retrieve and display existing tasks

    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    list_el = document.querySelector("#tasks");

    form.addEventListener('submit' , (e) => {
        e.preventDefault();
        
        const taskContent = input.value;
        if (!taskContent) {
            alert("Please fill out the task");
            return;
        }


        // POST request to add the task to the database
        // TODO: Add the date as well
        addTask(taskContent).then((res) => {
            if(res.status !== 201){
                alert("An error occurred")
            }
            console.log(res); // JSON data parsed by `data.json()` call
            res.json().then((json)=>{
                console.log(json.taskID);
                let task_el = createTaskElement(json.taskID, taskContent);
                list_el.appendChild(task_el);
            });
        });

        input.value = "";
    });

});
