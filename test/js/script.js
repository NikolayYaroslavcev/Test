window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

});

let btns = document.querySelectorAll("*[data-modal-btn]");

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
        let name = btns[i].getAttribute('data-modal-btn');
        let modal = document.querySelector("[data-modal-window='" + name + "']");
        modal.style.display = 'block'
        let close = modal.querySelector('.close_modal_window');
        close.addEventListener('click', () => {
            modal.style.display = 'none'
            renderingContacts()
        })
    })
}
window.onclick = function (e) {
    if (e.target.hasAttribute('data-modal-window')) {
        let modals = document.querySelectorAll("*[data-modal-window]");
        for (let i = 0; i < btns.length; i++) {
            modals[i].style.display = "none";
            renderingContacts()
        }
    }
}

// =============================================================

const inputValue = document.getElementsByClassName('contacts__enter') [0]
const addTaskBtn = document.getElementsByClassName('_bWhiteCBlue') [0]
const saveTask = document.getElementsByClassName("save")[0]


addTaskBtn.addEventListener('click', () => {
    inputValue.classList.add("active")
    // showList()
})


// рисуем список option из local
function getOptions() {

    let groupsArray = JSON.parse(window.localStorage.getItem('groups'))
    let option = ''
    let select = document.querySelector(".contacts__select")

    if (groupsArray !== null) {

        groupsArray.map((el) => {
            option += `
             <option value=${el}>${el}</option>
    `
        })
    }
    select.innerHTML = option
}

const mainData = localStorage.getItem('mainData') ? JSON.parse(localStorage.getItem('mainData')) : {}


function hiddenTitle() {
    console.log("hiddenTitle")
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    const mainTitle = document.querySelector(".main__title")
    if (mainDataStore) {
        mainTitle.style.display = 'none'
    }
}


function showList() {

    let outPut = '';
    let taskListShow = document.querySelector('.contacts__lIstItem')
    let localItems = JSON.parse(localStorage.getItem('groups'))

    if (!localItems) {
        taskList = []
    } else {
        localItems.forEach(group => {
            mainData[group] = mainData[group] ? mainData[group] : [];
        })

        taskList = localItems;

        localStorage.setItem("mainData", JSON.stringify(mainData))
    }

    taskList.forEach((data, index) => {
        if (data !== "") {
            outPut += `
           <div class="contacts__delete delete">
           <p class="delete__text">${data}</p>
                    <button class="_icon-delete" onClick="deleteItem(${index}, '${data}')"></button>
                </div>`
        }
    });
    taskListShow.innerHTML = outPut;
    getOptions()

}

showList();


saveTask.addEventListener("click", (e) => {
    console.log("saveTask_KLIK")
    if (inputValue.value !== "") {
        taskList.push(inputValue.value)
        localStorage.setItem('groups', JSON.stringify(taskList))
        clearInput()
        showList();
        hiddenTitle()
        renderingContacts()
        inputValue.classList.remove("active")

    }
})

hiddenTitle()

function clearInput() {
    console.log("clearInput")
    inputValue.value = ""
}

function deleteItem(index, data) {
    console.log("deleteItem")
    console.log(data)
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    console.log(mainDataStore)
    let copy = {...mainDataStore}
    delete copy[data]
    console.log(copy)

    taskList.splice(index, 1)
    localStorage.setItem('groups', JSON.stringify(taskList))

    //  let localItems = JSON.parse(localStorage.getItem('groups'))

    localStorage.setItem('mainData', JSON.stringify(copy))

    showList();
}

/***************/

const inputName = document.getElementsByClassName("contacts__text")[0]
const inputPhone = document.getElementsByClassName("contacts__phone")[0]
const saveGroup = document.getElementsByClassName("_groups")[0]
let mainContacts = document.querySelector('.main__contacts')
let mainGroupsSelect = document.querySelector('.contacts__select')
let mainGroupsTitle = document.querySelector('.main__groups_title')


function renderingContacts() {
    console.log("renderingContacts")
    let groupsArray = JSON.parse(window.localStorage.getItem('groups'))
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    let newContact = '';

    if (mainDataStore) {
        for (const [key, value] of Object.entries(mainDataStore)) {
            let users = ""
            value.map((user, index) => {
                    users += `
                        <div class="main__block">
                                <span class="main__block_name">${user.name}</span>
                                <span>${user.phone}</span>
                                <button class="_icon-delete" onClick="deleteContact('${user.phone}', ${key})"></button>
                                <button class="_icon-correct" onClick="updateContact(${index}, ${key}, '${user.phone}','${user.name}')"></button>
                       </div>
         `
                }
            )
            newContact += `
                <div class="list-group">
                     <div class="list-group-item list-header" data-name="spoiler-title">
                          ${key}
                          <div class=" _icon-arrow"></div>
                     </div>
                          <div class="list-content spoiler-body">
                          ${users}
                     </div>
                </div>
                    `
        }
    }
    mainContacts.innerHTML = newContact
    openSpoiler()
}

renderingContacts()


saveGroup.addEventListener("click", () => {
    console.log("saveGroup_KLICK")

    if (inputName.value && inputPhone.value) {

        let contactNew = {name: inputName.value, phone: inputPhone.value}
        const contact = localStorage.getItem('contact') ? JSON.parse(localStorage.getItem('contact')) : [];
        contact.push(contactNew)
        mainData[`${mainGroupsSelect.value}`] = mainData[`${mainGroupsSelect.value}`] ? mainData[`${mainGroupsSelect.value}`] : [];
        mainData[`${mainGroupsSelect.value}`].push(contactNew)
        localStorage.setItem("mainData", JSON.stringify(mainData))

        inputName.value = "";
        inputPhone.value = "";
        showList();
        renderingContacts()
    }

})

renderingContacts()

const button = document.getElementsByTagName("button")


function deleteContact(phone, key) {
    console.log("deleteContact")

    console.log(key)
    console.log(phone)
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    const stateCopy = {...mainDataStore}
    const tasks = stateCopy[key].filter(el => el.phone !== phone);
    stateCopy[key] = tasks;
    localStorage.setItem('mainData', JSON.stringify(stateCopy))

    renderingContacts()
}


function updateContact(index, key, phone, name) {
    console.log("updateContact")

    let modal = document.querySelector(".modal1");
    modal.style.display = 'block'
    let close = modal.querySelector('.close_modal_window');
    close.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    let saveindex = document.getElementById("saveindex");
    saveindex.value = index;
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    const openPopUp = document.querySelectorAll("._icon-correct")
    const closePopUp = document.querySelector('#popup_close')
    const popUp = document.querySelector('#popup')

    openPopUp.forEach(el => {
        el.addEventListener('click', () => {
            popUp.classList.add('active');
        })
    })
    closePopUp.addEventListener('click', () => {
        popUp.classList.remove('active')
        renderingContacts()
    })

    inputPhone.value = mainDataStore[key][index].phone
    inputName.value = mainDataStore[key][index].name
    // addclass()
}


const changeBtn = document.querySelector(".change")

changeBtn.addEventListener("click", () => {
    console.log("changeBtn_CLICK")

    let newPhone = inputPhone.value
    let newName = inputName.value
    let key = mainGroupsSelect.value
    let saveindex = document.getElementById("saveindex").value;
    let mainDataStore = JSON.parse(window.localStorage.getItem('mainData'))
    const stateCopy = {...mainDataStore}
    const tasks = stateCopy[key].map((el, index) => index === +saveindex ? {...el, name: newName, phone: newPhone} : el)
    stateCopy[key] = tasks;
    localStorage.setItem("mainData", JSON.stringify(stateCopy))

    inputName.value = "";
    inputPhone.value = "";

    renderingContacts()

})
renderingContacts()


function openSpoiler() {
    console.log("openSpoiler")

    const headers = document.querySelectorAll("[data-name='spoiler-title']");
    const IconArrow = document.querySelectorAll(".list-group-item");

    headers.forEach(function (item, index) {
        item.addEventListener("click", () => {
            item.nextElementSibling.classList.toggle("spoiler-body")
            IconArrow[index].classList.toggle("arrow")
        });
    });
}



