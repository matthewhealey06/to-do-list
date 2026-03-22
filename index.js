const close = document.getElementById('btn3')
const right = document.querySelector('.right')

close.addEventListener('click', function(){
    right.classList.toggle('closed')
})

const now = new Date()
const span1 = document.querySelector('.month-year')
const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let year = now.getFullYear()
let month = now.getMonth()
const numbersGrid = document.querySelector('.c-numbers')
const clear = document.getElementById('btn4')

const leftArrow = document.getElementById('b-l')
const rightArrow = document.getElementById('b-r')

leftArrow.addEventListener('click', function(){
    month--
    if(month < 0){
        month = 11
        year--
    }
    renderCalendar()
})
rightArrow.addEventListener('click', function(){
    month++
    if(month > 11){
        month = 0
        year++
    }
    renderCalendar()
})
function renderCalendar() {
    numbersGrid.innerHTML = '';
    span1.innerHTML = `${year} <br> ${months[month]}`;
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        const eBlocks = document.createElement('span')
        numbersGrid.appendChild(eBlocks)
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const numbers = document.createElement('span')
        numbers.textContent = i
        numbersGrid.appendChild(numbers)
        numbers.addEventListener('click', function() {
            const current = document.querySelector('.c-numbers .selected');
            if (current) {
                current.classList.remove('selected');
            }
            numbers.classList.add('selected');
         })
    }
}
clear.addEventListener('click', function(){
    const current = document.querySelector('.c-numbers .selected');
    if (current) {
        current.classList.remove('selected');
    }
})

let lists = []

const buttonContainer = document.querySelector('.button-wrapper')

function createList(name, id) {
    let listBtn = document.createElement('span')
    listBtn.classList.add('listBtn')
    
    const nameSpan = document.createElement('span')
    nameSpan.textContent = name
    nameSpan.contentEditable = 'true'
    listBtn.appendChild(nameSpan)
    
    const deleteList = document.createElement('span')
    deleteList.textContent = '\u2716'
    deleteList.classList.add('deleteList')
    deleteList.contentEditable = 'false'
    listBtn.appendChild(deleteList)
    
    buttonContainer.appendChild(listBtn)
    
    deleteList.addEventListener('click', function(event){
        const position = lists.findIndex(function(item) {
            return item.ID === id
        })
        lists.splice(position, 1)
        localStorage.setItem('lists', JSON.stringify(lists))
        listBtn.remove()
        event.stopPropagation()
    })
    
    nameSpan.addEventListener('keydown', function(event){
        if(event.key === 'Enter'){
            event.preventDefault()
            nameSpan.blur()
        }
    })
    
    nameSpan.addEventListener('blur', function(){
    const position = lists.findIndex(function(item) {
        return item.ID === id
    })
    lists[position].name = nameSpan.textContent
    localStorage.setItem('lists', JSON.stringify(lists))
    })
    listBtn.addEventListener('click', function(){
        const currentList = document.querySelector('.listBtn.selected')
        if (currentList) {
                    currentList.classList.remove('selected');
                }
                listBtn.classList.add('selected');
    })
}

let nextID = 1

const saved = localStorage.getItem('lists')
if (saved) {
    lists = JSON.parse(saved)
    if (lists.length === 0) {
        nextID = 1
    } else {
        nextID = Math.max(...lists.map(function(item) {return item.ID})) + 1
    }
    lists.forEach(function(list) {
        createList(list.name, list.ID)
    })
} else {
    lists.push({ID:nextID , name: 'New List'})
    localStorage.setItem('lists', JSON.stringify(lists))
    createList('New List', nextID)
    nextID++
}
const firstList = document.querySelector('.listBtn')
if(firstList){
    firstList.classList.add('selected')
}

const newList = document.getElementById('btn2')
newList.addEventListener('click', function(){
    lists.push({ID:nextID , name: 'New List'})
    localStorage.setItem('lists', JSON.stringify(lists))
    createList('New List', nextID)
    nextID++
})


renderCalendar()