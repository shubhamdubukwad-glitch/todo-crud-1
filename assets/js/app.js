const cl = console.log;

const todoForm = document.getElementById('todoForm')
const inputControl = document.getElementById('inputControl')
const addtodoBtn = document.getElementById('addtodoBtn')
const updatetodoBtn = document.getElementById('updatetodoBtn')
const todocontainer = document.getElementById('todocontainer')

const BASE_URL = `https://b-22-cruds-default-rtdb.asia-southeast1.firebasedatabase.app`;
const todo_url = `${BASE_URL}/todos.json`;

let todoArr = [];

//read-todo//
let xhr = new XMLHttpRequest()
xhr.open('GET', todo_url)
xhr.send(null)
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let res = JSON.parse(xhr.response)
        for (const key in res) {
            res[key].id = key;
            todoArr.push(res[key])
            readtodo(todoArr)
        }
    } else {
        cl(`somthing want wrong ..?`)
    }
}

// cl(todoArr)
function readtodo(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += `<li class="list-group-item d-flex justify-content-between" id="${ele.id}" >
                                <strong>${ele.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>
                            </li>`;
    });
    todocontainer.innerHTML = result;
}
//create todo//
function oncreatetodo(eve) {
    eve.preventDefault()
    let todoObj = {
        todoinput: inputControl.value

    }
    let xhr = new XMLHttpRequest()
    xhr.open('POST', todo_url)
    xhr.send(JSON.stringify(todoObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            let li = document.createElement('li');
            li.id = res.id;
            li.className = `list-group-item d-flex justify-content-between`;
            li.innerHTML = `
                                <strong>${todoObj.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>
                            </li>`;
            todocontainer.prepend(li)
            todoForm.reset()

            Swal.fire({
                title: "Create Successfully..!!!",
                text: "todo data created has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        } else {

        }
    }
}

//edit-todo//
function eidttodo(ele) {
    // cl(ele)
    let edit_id = ele.closest('li').id;
    // cl(edit_id)
    localStorage.setItem('UPDATE_ID', edit_id)
    let edit_url = `${BASE_URL}/todos/${edit_id}.json`;

    let xhr = new XMLHttpRequest()
    xhr.open('GET', edit_url)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res)
            inputControl.value = res.todoinput
            addtodoBtn.classList.add('d-none')
            updatetodoBtn.classList.remove('d-none')
        }
    }
}

//update-todo//
function onupdatetodo() {
    let UPDATE_ID = localStorage.getItem('UPDATE_ID')
    let updateObj = {
        todoinput: inputControl.value
    }
    // cl(updateObj)
    let update_url = `${BASE_URL}/todos/${UPDATE_ID}.json`;
    let xhr = new XMLHttpRequest()
    xhr.open("PATCH", update_url)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            let li = document.getElementById(UPDATE_ID)
            li.innerHTML = `<strong>${updateObj.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>`;

                 Swal.fire({
                title: "updated Successfully..!!!",
                text: "todo data updated has been successfully..!!",
                icon: "success",
                timer: 4000
            });
            todoForm.reset()
            addtodoBtn.classList.remove('d-none');
            updatetodoBtn.classList.add('d-none')
        } else {
            cl(`somthing want wrong..?`)
        }
    }
}

//delete-todo//
function deletetodo(ele) {
    let delete_id = ele.closest('li').id;
    //cl(delete_id)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/todos/${delete_id}.json`;
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', delete_url)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    ele.closest('li').remove()

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                }else{
                    cl(`somthing want wrong..?`)
                }
            }
        }
    });
}

todoForm.addEventListener('submit', oncreatetodo)
updatetodoBtn.addEventListener('click', onupdatetodo)