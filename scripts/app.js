let habbits = []
const HABBIT_KEY = "HABBIT_KEY"
let globalactivehabbitID; 

// utils


const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover__bar')
    },
    content: {
        daysContent: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day')
    },
    popup:{
        index: document.getElementById('aadd')

    }

}

function loadData(){
    const habbitString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitString);
    if(Array.isArray(habbitArray)){
        habbits = habbitArray;
    }
}

function saveData(){
    localStorage.setItem(HABBIT_KEY,JSON.stringify(habbits));
}

// init
function rerenderMenu(activehabbit){
    if(!activehabbit){
        return;
    }

    for(const habbit of habbits){
        const existed = document.querySelector(`[menu_habbit_id="${habbit.id}"]`) 
        if(!existed){
            const element = document.createElement('button')
            element.setAttribute('menu_habbit_id',habbit.id);
            element.classList.add('menu__item')
            element.addEventListener('click', ()=> rerender(habbit.id))
            element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="добавление привычки"/>`;
            if(activehabbit.id == habbit.id){
                element.classList.add('menu__item__active');
            }
            page.menu.append(element);
            continue;
        }
        if(activehabbit.id === habbit.id){
            existed.classList.add('menu__item__active');
        }else{
            existed.classList.remove('menu__item__active')
        }
    }

}

function renderHead(activehabbit){
    
    page.header.h1.innerText = activehabbit.name;
    const progress = activehabbit.days.length / activehabbit.target > 1 ? 100 : activehabbit.days.length / activehabbit.target * 100;
    page.header.progressPercent.innerText = progress.toFixed(0) + '%';
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function renderContent(activehabbit){
    page.content.daysContent.innerHTML = ''
    for(let day in activehabbit.days){
        const iconka = document.createElement('div');
        iconka.classList.add('habbit')
        iconka.innerHTML = `<div class="habbit__day">${Number(day) + 1} день</div>
        <div class="habbit__comment">${activehabbit.days[day].comment}</div>
        <button class="habbit__del" onclick="deleteItem(${day})">
            <img src="images/delete.svg" alt="иконка удалить" />
        </button>`;
        page.content.daysContent.appendChild(iconka);
    }
    page.content.nextDay.innerHTML = `День ${activehabbit.days.length + 1}`;
}

// form data api стоит выучить 
function addDays(event){
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form); // поянить эту строку
    const comment = data.get('comment'); // по имени коммент получаем элемент
    form['comment'].classList.remove('error')
    
    if(!comment){
        form['comment'].classList.add('error')
    }
    habbits = habbits.map(habbit => {// изменяем хэббит(изначальные данные  Json)  
        if(habbit.id === globalactivehabbitID){
            return{
                ...habbit,
                days: habbit.days.concat([{comment}])
            }
       } 
       return habbit;
    })
    
    form['comment'].value = '';
    rerender(globalactivehabbitID)
    saveData();

    
    
}

function deleteItem(day){
    habbits = habbits.map(habbit => {
        if(habbit.id === globalactivehabbitID){
            habbit.days.splice(day,1);
            return{
                ...habbit,
                days: habbit.days
            }
        }
        return habbit;
        
    })
    rerender(globalactivehabbitID)
    saveData();
     
}

function togglePopup(){
    if(page.popup.index.classList.contains('cover_hidden')){
        page.popup.index.classList.remove('cover_hidden')
    } else {
        page.popup.index.classList.add('cover_hidden')
    }

}

function rerender(activehabbitID){ 
    globalactivehabbitID = activehabbitID
    const activehabbit = habbits.find(habbit => habbit.id === activehabbitID)
    if(!activehabbit){
        return;
    }
    
    rerenderMenu(activehabbit)
    renderHead(activehabbit)
    renderContent(activehabbit)
}




(() =>{
    loadData();
    rerender(1)
})()




