const API_URL = '/api/tasks'
let Tasks;
const userId = JSON.parse(document.querySelector('.user-tasks').dataset['id'])

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsAr = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const openModal = document.getElementById('open-modal');
const modal = document.querySelector('.add-div');
const blurDiv = document.querySelector('.blur');
const closeModal = document.querySelector('.close');
const tasksDiv = document.querySelector('.tasks-display');
const selectSort = document.querySelector('#sorter')


console.log(blurDiv);

[closeModal, blurDiv].forEach(el => {
    el.addEventListener('click', function () {
        modal.classList.add('hide');
        blurDiv.classList.add('hide');
    })
});

openModal.addEventListener('click', function () {
    modal.classList.remove('hide');
    blurDiv.classList.remove('hide');
});


// ############ Create New Task ############ \\
const addBTN = document.getElementById('add');
const addInp = document.getElementById('add-inp');
const addDate = document.getElementById('add-date');
const addCate = document.querySelector('#category');
addBTN.addEventListener('click', async (e) => {
    if (addDate.value != '' && addInp.value != "" && new Date() < new Date(addDate.value)) {

        const vals = { name: addInp.value, deadline: addDate.value, category: addCate.value, user: userId }
        const body = JSON.stringify(vals);
        await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        })

        addInp.value = '';
        addDate.value = '';
        updateUI();
        modal.classList.add('hide');
        blurDiv.classList.add('hide');
    } else {
        alert("ادخل تاريخ صحيح في المستقبل")
    };
})


// ############## UI Update ############## \\
// ############## UI Update ############## \\

const sortMids = arr => {
    return arr.sort(el => el.category === 'mid' ? 1 : -1)
}
const sortOthers = arr => {
    return arr.sort(el => el.category === 'others' ? 1 : -1)
}

async function updateUI() {
    Tasks = await fetch(`${API_URL}/user/${userId}`, {
        method: 'GET',
    }).then(res => res.json()).then(res => Tasks = res.data)

    const deletables = Tasks.filter(task => new Date(task.deadline) < new Date())

    deletables?.forEach(del => {
        fetch(`${API_URL}/${del.id}`, { method: "DELETE" });
    })

    Tasks = Tasks.filter(task => new Date(task.deadline) > new Date())

    Tasks = Tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline))

    if (selectSort.value === 'mid') {
        sortMids(Tasks)
    } else if (selectSort.value === 'others') {
        sortOthers(Tasks)
    }

    tasksDiv.innerHTML = ``
    for (const task of Tasks) {
        let taskDiv = document.createElement('div');

        const arabic = {
            deadLine: `${task.dateFromat.day ? `قبل ${task.dateFromat.day} ${monthsAr[task.dateFromat.month]}` : 'منقضي'}`,
            name: task.name,
            id: task._id,
            remaining: task.dateFromat.remaining ? `(${task.dateFromat.remaining > 2 ? task.dateFromat.remaining : ''} ${task.dateFromat.remaining > 10 ? "يوم" : (task.dateFromat.remaining > 2 ? "أيام" : (task.dateFromat.remaining == 2 ? 'يومين' : 'يوم واحد'))
                })` : "",
            finished: task.finished ? "finished" : ""
        }

        taskDiv.setAttribute('class', 'task')
        taskDiv.innerHTML = `
        <div class="task-info">

            <h6>${arabic.deadLine} <span><b>${arabic.remaining}</b></span></h6>
                    
            <h3 class="${arabic.finished}" contenteditable="false" data-id="${arabic.id}">${arabic.name}</h3>
        </div>
                
        <div class="control-position">
            <div class="control">
                <i class="fa-solid fa-pencil edit" data-id="${arabic.id}"></i>
                <i class="fa-regular fa-trash-can delete" data-id="${arabic.id}"></i>
            </div>
        </div>`
        tasksDiv.prepend(taskDiv)
    }


    // #######################################
    // #######################################
    const edits = document.querySelectorAll('.edit');
    const dels = document.querySelectorAll('.delete');

    for (const edit of edits) {

        const id = edit.dataset['id'];
        let h3 = edit.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling;
        if (h3.classList.contains('finished')) {
            edit.style.opacity = ".2";
        }
        const before = h3.innerText;

        edit.addEventListener('click', function () {
            if (edit.classList.contains('fa-pencil')) {
                h3.classList.toggle('editing');
                h3.setAttribute("contenteditable", "true");
                h3.focus();
                edit.classList.remove('fa-pencil');
                edit.classList.add('fa-check', 'fa-beat');
                edit.style.color = 'green';


            } else {
                h3.classList.toggle('editing');
                h3.blur();
                h3.setAttribute("contenteditable", "false");
                edit.classList.remove('fa-check', 'fa-beat');
                edit.classList.add('fa-pencil');
                edit.style.color = "var(--text)";

                if (before === h3.innerHTML) {
                    return;
                }
                const body = JSON.stringify({ name: h3.innerText });
                fetch(`${API_URL}/${id}`, {
                    method: "PATCH",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body
                })
            }
        })

        edit.addEventListener('mouseover', function (e) {
            edit.classList.add('fa-bounce');
            setTimeout(() => {
                edit.classList.remove('fa-bounce');
            }, 450)
        })

    }

    // // ############ Deletes ############ \\
    for (const del of dels) {
        del.addEventListener('click', async (e) => {
            let id = e.target.dataset['id'];
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            return updateUI()
        })

        del.addEventListener('mouseover', function () {
            del.classList.add('fa-shake');
            setTimeout(() => {
                del.classList.remove('fa-shake');
            }, 450)
        })
    };

}
updateUI();
selectSort.addEventListener('change', () => updateUI())
