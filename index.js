const close = document.getElementById("btn3");
const right = document.querySelector(".right");
let draggedTodo = null;

close.addEventListener("click", function () {
  right.classList.toggle("closed");
});

function renderTodos() {
  const selected = document.querySelector(".listBtn.selected");
  const selectedId = parseInt(selected.dataset.id);
  toDoContainer.innerHTML = "";
  const selectedList = lists.find(function (item) {
    return item.ID === selectedId;
  });

  let dateSelected = null;
  const current = document.querySelector(".c-numbers .selected");
  if (current) {
    dateSelected = `${current.textContent}-${month + 1}-${year}`;
  }
  selectedList.todos.forEach(function (todo) {
    if (dateSelected === null || todo.date === dateSelected) {
      createToDo(todo.name, todo.ID, todo.checked, selectedId, todo.date);
    }
  });
  if (toDoContainer.children.length === 0) {
    renderNoData();
  }
}
function renderNoData() {
  const noData = document.createElement("p");
  noData.textContent = "No Data";
  noData.classList.add("noData");
  toDoContainer.appendChild(noData);
}

const now = new Date();
const span1 = document.querySelector(".month-year");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let year = now.getFullYear();
let month = now.getMonth();
const numbersGrid = document.querySelector(".c-numbers");
const clear = document.getElementById("btn4");

const leftArrow = document.getElementById("b-l");
const rightArrow = document.getElementById("b-r");

leftArrow.addEventListener("click", function () {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar();
});
rightArrow.addEventListener("click", function () {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar();
});
function renderCalendar() {
  numbersGrid.innerHTML = "";
  span1.innerHTML = `${year} <br> ${months[month]}`;
  const firstDay = new Date(year, month, 1).getDay();
  for (let i = 0; i < firstDay; i++) {
    const eBlocks = document.createElement("span");
    numbersGrid.appendChild(eBlocks);
  }
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const numbers = document.createElement("span");
    numbers.textContent = i;
    numbersGrid.appendChild(numbers);
    numbers.addEventListener("click", function () {
      const current = document.querySelector(".c-numbers .selected");
      if (current) {
        current.classList.remove("selected");
      }
      numbers.classList.add("selected");
      renderTodos();
    });
    const selected = document.querySelector(".listBtn.selected");
    if (selected) {
      const selectedId = parseInt(selected.dataset.id);
      const selectedList = lists.find(function (item) {
        return item.ID === selectedId;
      });
      const dateString = `${i}-${month + 1}-${year}`;
      const hasTodo = selectedList.todos.some(function (todo) {
        return todo.date === dateString;
      });
      if (hasTodo) {
        numbers.classList.add("hasTask");
      }
    }
  }
}
clear.addEventListener("click", function () {
  const current = document.querySelector(".c-numbers .selected");
  if (current) {
    current.classList.remove("selected");
  }
  renderTodos();
});

let lists = [];

const buttonContainer = document.querySelector(".button-wrapper");

function createList(name, id) {
  let listBtn = document.createElement("span");
  listBtn.classList.add("listBtn");
  listBtn.dataset.id = id;

  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;
  nameSpan.contentEditable = "true";
  listBtn.appendChild(nameSpan);

  const deleteList = document.createElement("span");
  deleteList.textContent = "\u2716";
  deleteList.classList.add("deleteList");
  deleteList.contentEditable = "false";
  listBtn.appendChild(deleteList);

  buttonContainer.appendChild(listBtn);

  deleteList.addEventListener("click", function (event) {
    const position = lists.findIndex(function (item) {
      return item.ID === id;
    });
    lists.splice(position, 1);
    localStorage.setItem("lists", JSON.stringify(lists));
    listBtn.remove();
    event.stopPropagation();
    renderTodos();
    renderCalendar();
  });

  nameSpan.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      nameSpan.blur();
    }
  });

  nameSpan.addEventListener("blur", function () {
    const position = lists.findIndex(function (item) {
      return item.ID === id;
    });
    lists[position].name = nameSpan.textContent;
    localStorage.setItem("lists", JSON.stringify(lists));
  });
  listBtn.addEventListener("click", function () {
    const currentList = document.querySelector(".listBtn.selected");
    if (currentList) {
      currentList.classList.remove("selected");
    }
    listBtn.classList.add("selected");
    renderTodos();
    renderCalendar();
  });
}

let nextID = 1;
let nextToDoID = 1;
const addToDo = document.getElementById("addToDo");
const toDoContainer = document.getElementById("toDoContainer");

const saved = localStorage.getItem("lists");
if (saved) {
  lists = JSON.parse(saved);
  if (lists.length === 0) {
    nextID = 1;
  } else {
    nextID =
      Math.max(
        ...lists.map(function (item) {
          return item.ID;
        }),
      ) + 1;
  }
  lists.forEach(function (list) {
    createList(list.name, list.ID);
  });
  const allTodos = lists.flatMap(function (list) {
    return list.todos;
  });
  if (allTodos.length === 0) {
    nextToDoID = 1;
  } else {
    nextToDoID =
      Math.max(
        ...allTodos.map(function (todo) {
          return todo.ID;
        }),
      ) + 1;
  }
} else {
  lists.push({ ID: nextID, name: "New List", todos: [] });
  localStorage.setItem("lists", JSON.stringify(lists));
  createList("New List", nextID);
  nextID++;
}
const firstList = document.querySelector(".listBtn");
if (firstList) {
  firstList.classList.add("selected");
  renderTodos();
}

const newList = document.getElementById("btn2");
newList.addEventListener("click", function () {
  lists.push({ ID: nextID, name: "New List", todos: [] });
  localStorage.setItem("lists", JSON.stringify(lists));
  createList("New List", nextID);
  nextID++;
});

function createToDo(name, id, checked, listId, date) {
  const toDoWrapper = document.createElement("div");
  toDoContainer.appendChild(toDoWrapper);
  toDoWrapper.classList.add("toDoWrapper");
  toDoWrapper.draggable = true;
  toDoWrapper.dataset.id = id;
  const dragHandle = document.createElement("p");
  dragHandle.classList.add("dragHandle");
  toDoWrapper.appendChild(dragHandle);
  dragHandle.textContent = " ⋮⋮ ";

  const taskDiv = document.createElement("div");
  toDoWrapper.appendChild(taskDiv);
  taskDiv.classList.add("taskDiv");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = checked;
  checkbox.classList.add("checkbox");
  taskDiv.appendChild(checkbox);
  const input = document.createElement("input");
  input.classList.add("textInput");
  taskDiv.appendChild(input);
  input.setAttribute("placeholder", "New Task");
  input.value = name;

  const deleteTask = document.createElement("span");
  deleteTask.textContent = "\u2716";
  deleteTask.classList.add("deleteTask");
  deleteTask.contentEditable = "false";
  taskDiv.appendChild(deleteTask);

  toDoWrapper.addEventListener('dragstart', function() {
    draggedTodo = toDoWrapper;
    toDoWrapper.classList.add('dragging');
  });

  toDoWrapper.addEventListener('dragend', function() {
    toDoWrapper.classList.remove('dragging');
    draggedTodo = null;
  });

  toDoWrapper.addEventListener('dragover', function(event) {
    event.preventDefault();
    if (draggedTodo && draggedTodo !== toDoWrapper) {
      const rect = toDoWrapper.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      toDoWrapper.classList.remove('drag-over-top', 'drag-over-bottom');
      if (event.clientY < midpoint) {
        toDoWrapper.classList.add('drag-over-top');
      } else {
        toDoWrapper.classList.add('drag-over-bottom');
      }
    }
  });

  toDoWrapper.addEventListener('dragleave', function() {
    toDoWrapper.classList.remove('drag-over-top', 'drag-over-bottom');
  });

  toDoWrapper.addEventListener('drop', function(event) {
    event.preventDefault();
    const isTop = toDoWrapper.classList.contains('drag-over-top');
    toDoWrapper.classList.remove('drag-over-top', 'drag-over-bottom');
    
    if (draggedTodo && draggedTodo !== toDoWrapper) {
      if (isTop) {
        toDoContainer.insertBefore(draggedTodo, toDoWrapper);
      } else {
        toDoContainer.insertBefore(draggedTodo, toDoWrapper.nextSibling);
      }
    }
    const wrappers = toDoContainer.querySelectorAll(".toDoWrapper");
    const newOrder = [];
    wrappers.forEach(function(wrapper) {
      newOrder.push(parseInt(wrapper.dataset.id));
    });
    const selected = document.querySelector(".listBtn.selected");
    const selectedId = parseInt(selected.dataset.id);
    const selectedList = lists.find(function (item) {
      return item.ID === selectedId;
    });
    selectedList.todos = newOrder.map(function(todoId) {
      return selectedList.todos.find(function(todo) {
        return todo.ID === todoId;
      });
    });
    localStorage.setItem('lists', JSON.stringify(lists))
  });

  deleteTask.addEventListener("click", function (event) {
    const list = lists.find(function (item) {
      return item.ID === listId;
    });
    const position = list.todos.findIndex(function (item) {
      return item.ID === id;
    });
    list.todos.splice(position, 1);
    localStorage.setItem("lists", JSON.stringify(lists));
    toDoWrapper.remove();
    event.stopPropagation();
    if (list.todos.length === 0) {
      renderNoData();
    }
    renderCalendar();
  });
  checkbox.addEventListener("click", function () {
    const list = lists.find(function (item) {
      return item.ID === listId;
    });
    const position = list.todos.findIndex(function (item) {
      return item.ID === id;
    });
    list.todos[position].checked = checkbox.checked;
    localStorage.setItem("lists", JSON.stringify(lists));
  });
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    }
  });
  input.addEventListener("blur", function () {
    const list = lists.find(function (item) {
      return item.ID === listId;
    });
    const position = list.todos.findIndex(function (item) {
      return item.ID === id;
    });
    list.todos[position].name = input.value;
    localStorage.setItem("lists", JSON.stringify(lists));
  });
}
addToDo.addEventListener("click", function () {
  const selected = document.querySelector(".listBtn.selected");
  const selectedId = parseInt(selected.dataset.id);
  const selectedList = lists.find(function (item) {
    return item.ID === selectedId;
  });
  const noData = document.querySelector(".noData");

  let dateSelected = null;
  const current = document.querySelector(".c-numbers .selected");
  if (current) {
    dateSelected = `${current.textContent}-${month + 1}-${year}`;
  }

  if (noData) {
    noData.remove();
  }
  selectedList.todos.push({
    ID: nextToDoID,
    checked: false,
    name: "",
    date: dateSelected,
  });
  localStorage.setItem("lists", JSON.stringify(lists));
  createToDo("", nextToDoID, false, selectedId, dateSelected);
  nextToDoID++;
  const selectedDay = document.querySelector(".c-numbers .selected");
  const selectedDayText = selectedDay ? selectedDay.textContent : null;
  renderCalendar();
  if (selectedDayText) {
    const days = document.querySelectorAll(".c-numbers span");
    days.forEach(function (day) {
      if (day.textContent === selectedDayText) {
        day.classList.add("selected");
      }
    });
  }
});

/*-------------------------*/

renderCalendar();
renderTodos();