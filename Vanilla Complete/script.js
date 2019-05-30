document.querySelector(".input form").addEventListener("submit", event => {
  event.preventDefault();

  const input = document.querySelector(".input input");
  const inputBox = document.querySelector(".input");

  if (input.value !== "") {
    inputBox.after(CreateTodo(input));
  }
  document.querySelector(".mark-all i").classList.remove("hide");
  document.querySelector(".mark-all").addEventListener("click", SelectAllTodos);
  document.querySelector(".input form").reset();
  CountTodos();
  SaveToLocalStorage();
});

function CreateTodo(input) {
  const todo = document.createElement("div");
  todo.classList.add("todos");
  const checkbox = document.createElement("div");
  checkbox.classList.add("checkbox");
  const circle = document.createElement("div");
  circle.classList.add("circle");
  const iCheck = document.createElement("i");
  iCheck.classList.add("hide");
  const todoText = document.createElement("div");
  todoText.classList.add("todo-text");
  const form = document.createElement("form");
  const text = document.createElement("input");
  text.value = input.value;
  text.disabled = true;
  text.classList.add("text");
  const iTimes = document.createElement("i");
  iTimes.textContent = "X";

  circle.appendChild(iCheck);
  checkbox.appendChild(circle);
  todo.appendChild(checkbox);
  form.appendChild(text);
  todoText.appendChild(form);
  todoText.appendChild(iTimes);
  todo.appendChild(todoText);

  circle.addEventListener("click", CircleClick);
  iTimes.addEventListener("click", RemoveTodo);
  text.parentElement.addEventListener("dblclick", UpdateTodo);

  return todo;
}

function CircleClick() {
  const checkMark = this.firstChild;
  const text = this.parentElement.nextSibling.firstChild.firstChild;
  const circle = this;

  if (getComputedStyle(checkMark).visibility === "hidden") {
    checkMark.classList.remove("hide");
    text.classList.add("line-through");
    circle.classList.add("circle-check");
  } else {
    checkMark.classList.add("hide");
    text.classList.remove("line-through");
    circle.classList.remove("circle-check");
  }
  CorrectFilterOnLoad();
  CheckForSelectedTodos();
  CountTodos();
  SaveToLocalStorage();
}

function UpdateTodo() {
  const text = this.firstChild;
  text.disabled = false;
  text.parentElement.parentElement.parentElement.firstChild.classList.add(
    "hide"
  );
  text.parentElement.nextSibling.classList.add("display-under");
  text.form.addEventListener("submit", event => {
    event.preventDefault();
    text.disabled = true;
    text.parentElement.nextSibling.classList.remove("display-under");
    text.parentElement.parentElement.parentElement.firstChild.classList.remove(
      "hide"
    );
    SaveToLocalStorage();
    if (text.value === "") {
      this.parentElement.parentElement.remove();
      CountTodos();
    }
  });
  text.form.addEventListener("focusout", event => {
    event.preventDefault();
    text.disabled = true;
    text.parentElement.nextSibling.classList.remove("display-under");
    text.parentElement.parentElement.parentElement.firstChild.classList.remove(
      "hide"
    );
    SaveToLocalStorage();
    if (text.value === "") {
      this.parentElement.parentElement.remove();
      CountTodos();
    }
  });
}

function RemoveTodo() {
  const grandparent = this.parentElement.parentElement;
  grandparent.remove();
  CountTodos();
  CheckForSelectedTodos();
  localStorage.clear();
  SaveToLocalStorage();
}

function CountTodos() {
  const todos = document.querySelectorAll(".circle");
  if (todos.length > 0) {
    document.querySelector(".footer").classList.remove("hide");
  } else {
    document.querySelector(".footer").classList.add("hide");
    document.querySelector(".mark-all i").classList.add("hide");
  }

  let counter = 0;
  todos.forEach(t => {
    if (t.firstChild.classList.contains("hide")) {
      counter += 1;
    } else {
    }
  });
  if (counter === 1) {
    document.querySelector(".plural").classList.add("display-none");
  } else {
    document.querySelector(".plural").classList.remove("display-none");
  }
  document.querySelector(".counter").textContent = counter;
}

function CheckForSelectedTodos() {
  const icons = document.querySelectorAll(".circle i");
  let checked = [];
  icons.forEach(i => {
    if (getComputedStyle(i).visibility === "visible") {
      checked.push(i);
    }
  });
  if (checked.length > 0) {
    document.querySelector(".clear-completed button").classList.remove("hide");
    document.querySelector(".mark-all i").classList.remove("opacity-3");
  } else {
    document.querySelector(".clear-completed button").classList.add("hide");
    document.querySelector(".mark-all i").classList.add("opacity-3");
  }
  return checked.length;
}

function SelectAllTodos() {
  const icons = document.querySelectorAll(".circle i");
  const circles = document.querySelectorAll(".circle");
  const markIcon = document.querySelector(".mark-all i");
  const clear = document.querySelector(".clear-completed button");
  const textFields = document.querySelectorAll(".text");
  const checkedTodos = CheckForSelectedTodos();

  if (
    getComputedStyle(markIcon).opacity === "0.3" ||
    checkedTodos < icons.length
  ) {
    icons.forEach(i => {
      i.classList.remove("hide");
      i.parentElement.classList.add("circle-check");
      markIcon.classList.remove("opacity-3");
      clear.classList.remove("hide");
    });
    textFields.forEach(t => {
      t.classList.add("line-through");
    });
  } else {
    icons.forEach(i => {
      i.classList.add("hide");
      markIcon.classList.add("opacity-3");
      clear.classList.add("hide");
      i.parentElement.classList.remove("circle-check");
    });
    textFields.forEach(t => {
      t.classList.remove("line-through");
    });
  }
  CountTodos();
}

//Clear Completed
document
  .querySelector(".clear-completed button")
  .addEventListener("click", () => {
    document.querySelectorAll(".todos").forEach(t => {
      if (t.firstChild.firstChild.firstChild.classList.contains("hide")) {
      } else {
        t.remove();
      }
    });
    localStorage.clear();
    SaveToLocalStorage();
    CheckForSelectedTodos();
    CountTodos();
  });

//Events for filter buttons
document.querySelectorAll(".filters").forEach(el =>
  el.addEventListener("click", () => {
    const filters = document.querySelectorAll(".filters");
    filters.forEach(f => {
      if (f !== el) {
        f.classList.remove("active");
      }
    });
    el.classList.add("active");
    ApplyFilter(el);
  })
);

function ApplyFilter(filter) {
  switch (filter.textContent) {
    case "All":
      ShowAll(filter);
      break;
    case "Active":
      ShowActive(filter);
      break;
    case "Completed":
      ShowCompleted(filter);
      break;
    default:
      break;
  }
}

function ShowAll(filter) {
  const todos = document.querySelectorAll(".circle i");
  todos.forEach(t => {
    if (t.classList.contains("hide")) {
      t.parentElement.parentElement.parentElement.classList.remove(
        "display-none"
      );
    } else {
      t.parentElement.parentElement.parentElement.classList.remove(
        "display-none"
      );
    }
  });
  FilterButtonHighlighter(filter);
}

function ShowActive(filter) {
  const todos = document.querySelectorAll(".circle i");
  todos.forEach(t => {
    if (t.classList.contains("hide")) {
      t.parentElement.parentElement.parentElement.classList.remove(
        "display-none"
      );
    } else {
      t.parentElement.parentElement.parentElement.classList.add("display-none");
    }
  });
  FilterButtonHighlighter(filter);
}

function ShowCompleted(filter) {
  const todos = document.querySelectorAll(".circle i");
  todos.forEach(t => {
    if (t.classList.contains("hide")) {
      t.parentElement.parentElement.parentElement.classList.add("display-none");
    } else {
      t.parentElement.parentElement.parentElement.classList.remove(
        "display-none"
      );
    }
  });
  FilterButtonHighlighter(filter);
}

function FilterButtonHighlighter(filter) {
  document.querySelectorAll(".filters").forEach(f => {
    if (f !== filter) {
      f.classList.remove("active");
    } else {
      filter.classList.add("active");
    }
  });
}

window.addEventListener("hashchange", () => {
  switch (this.location.hash) {
    case "#/All":
      ShowAll(document.querySelector("#all"));
      break;
    case "#/Active":
      ShowActive(document.querySelector("#active"));
      break;
    case "#/Completed":
      ShowCompleted(document.querySelector("#completed"));
      break;
    default:
      break;
  }
});

function SaveToLocalStorage() {
  const todos = document.querySelectorAll(".todos");
  todos.forEach((t, i) => {
    localStorage.setItem(i, [
      t.childNodes[1].firstChild.firstChild.value,
      t.outerHTML
    ]);
  });
}

window.addEventListener("load", () => {
  const input = document.querySelector(".input");
  let reAppliedTodo;
  let savedHtml;
  for (let i = localStorage.length; i >= 0; i--) {
    savedHtml = localStorage[i];
    if (typeof savedHtml !== "undefined") {
      const array = savedHtml.split(",");
      reAppliedTodo = HtmlToElement(array[1]);
      reAppliedTodo.childNodes[1].firstChild.firstChild.value = array[0];
      reAppliedTodo.firstChild.firstChild.addEventListener(
        "click",
        CircleClick
      );
      reAppliedTodo.childNodes[1].childNodes[1].addEventListener(
        "click",
        RemoveTodo
      );
      reAppliedTodo.childNodes[1].firstChild.addEventListener(
        "dblclick",
        UpdateTodo
      );
      input.after(reAppliedTodo);
    }
  }
  document.querySelector(".mark-all i").classList.remove("hide");
  document.querySelector(".mark-all").addEventListener("click", SelectAllTodos);
  CountTodos();
  CheckForSelectedTodos();
  CorrectFilterOnLoad();
});

function HtmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function CorrectFilterOnLoad() {
  switch (window.location.hash) {
    case "#/All":
      ShowAll(document.querySelector("#all"));
      break;
    case "#/Active":
      ShowActive(document.querySelector("#active"));
      break;
    case "#/Completed":
      ShowCompleted(document.querySelector("#completed"));
      break;
    default:
      break;
  }
}

document.querySelector("#all").classList.add("active");
