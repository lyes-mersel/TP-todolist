// The most important DOM Elements
const counterDOM = document.getElementById("counter");
const todoFormDOM = document.getElementById("add-task");
const todoListDOM = document.getElementById("todo-list");
const taskInputDOM = document.getElementById("task-input");
const saveClearFormDOM = document.getElementById("save-form");

/********************  ( Event Listeners ) ********************/
// window : is loaded
window.addEventListener("load", initScreen);

// add-task : submit
todoFormDOM.addEventListener("submit", addNewTask);

// todo-list : click
todoListDOM.addEventListener("click", handleClicksOnList);

// todo-list : mouseover
todoListDOM.addEventListener("mouseover", mouseIsOverTask);

// todo-list : mouseout
todoListDOM.addEventListener("mouseout", mouseIsOutTask);

// save-form : reset
saveClearFormDOM.addEventListener("reset", resetHandler);

// save-form : save
saveClearFormDOM.addEventListener("submit", saveHandler);

/********************  ( Functions ) ********************/
/** Display (counter + todo-list) on the screen */
function initScreen() {
	setCounter(0);
	// load the tasks from the db
	fetch("../controllers/init.php", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			data.forEach((task) => {
				const text = task.txt;
				const taskNode = document.createElement("li");
				addTaskChildren(taskNode, text);
				todoListDOM.appendChild(taskNode);
				updateCounter(1);
			});
		});
}

/** Event handler : submit new task */
function addNewTask(event) {
	event.preventDefault();
	const inputNoSpace = taskInputDOM.value.replaceAll(" ", "");
	if (inputNoSpace !== "") {
		const taskNode = document.createElement("li");
		addTaskChildren(taskNode, taskInputDOM.value);
		todoListDOM.appendChild(taskNode);
		updateCounter(1);
		taskInputDOM.value = "";
	}
}

/** DOM : add the children of a task node */
function addTaskChildren(taskNode, text) {
	taskNode.innerHTML = text;
	const btnUp = document.createElement("button");
	const btnDown = document.createElement("button");
	const btnEdit = document.createElement("button");
	const btnDelete = document.createElement("button");
	btnUp.className = "actions up hide";
	btnDown.className = "actions down hide";
	btnEdit.className = "actions edit hide";
	btnDelete.className = "actions delete hide";
	taskNode.appendChild(btnDelete);
	taskNode.appendChild(btnEdit);
	taskNode.appendChild(btnDown);
	taskNode.appendChild(btnUp);
}

/** Event handler : clicks in the todo-list */
function handleClicksOnList(event) {
	if (event.target.tagName === "BUTTON") {
		const button = event.target;
		const task = button.closest("li");
		const classes = button.classList;
		if (classes.contains("up")) {
			moveUpTask(task);
			return;
		}
		if (classes.contains("down")) {
			moveDownTask(task);
			return;
		}
		if (classes.contains("edit")) {
			editContentTask(task);
			return;
		}
		if (classes.contains("delete")) {
			deleteTask(task);
			return;
		}
	}
}

/** move up a task node*/
function moveUpTask(task) {
	const prevTask = task.previousElementSibling;
	if (prevTask) {
		todoListDOM.insertBefore(task, prevTask);
	}
}

/** move down a task node*/
function moveDownTask(task) {
	const nextTask = task.nextElementSibling;
	if (nextTask) {
		todoListDOM.insertBefore(nextTask, task);
	}
}

/** delete a task node */
function deleteTask(task) {
	task.remove();
	updateCounter(-1);
}

/** edit the content of a task node */
function editContentTask(task) {
	const taskContent = task.textContent;
	const form = replaceTaskByForm(task);
	const input = form.querySelector("input");

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		input.blur();
	});
	input.addEventListener("blur", () => {
		const inputNoSpace = input.value.replaceAll(" ", "");
		if (inputNoSpace === "") {
			input.value = taskContent;
		}
		addTaskChildren(task, input.value);
	});
}

/**
 * replace the content of a task by a form
 * @param {*} task the task node
 * @returns Node : the form created
 */
function replaceTaskByForm(task) {
	const text = task.textContent;
	task.innerHTML = "";
	const form = document.createElement("form");
	const input = document.createElement("input");
	input.type = "text";
	input.value = text;
	form.appendChild(input);
	const submit = document.createElement("input");
	submit.type = "submit";
	submit.value = "";
	submit.className = "actions ok";
	form.appendChild(submit);
	task.appendChild(form);
	input.focus();
	return form;
}

/** event handler: the mouse is over a task => display the action buttons */
function mouseIsOverTask(event) {
	const task = event.target.closest("li");
	if (task) {
		const buttons = task.getElementsByClassName("actions");
		for (let i = 0; i < buttons.length; i++) {
			const button = buttons[i];
			button.classList.remove("hide");
		}
	}
}

/** event handler: the mouse is out a task => hide the action buttons */
function mouseIsOutTask(event) {
	const task = event.target.closest("li");
	if (task) {
		const buttons = task.getElementsByClassName("actions");
		for (let i = 0; i < buttons.length; i++) {
			const button = buttons[i];
			button.classList.add("hide");
		}
	}
}

/** set the counter */
function setCounter(num) {
	counterDOM.textContent = num;
	if (num === 0) {
		counterDOM.classList.add("hide");
	}
}

/** update the counter : change == (-1/+1) */
function updateCounter(change) {
	counterDOM.textContent = parseInt(counterDOM.textContent) + change;
	if (counterDOM.textContent == 0) {
		counterDOM.classList.add("hide");
	}
	if (counterDOM.textContent == 1 && change === 1) {
		counterDOM.classList.remove("hide");
	}
}

/** Event handler : delete tasks & reset db */
function resetHandler() {
	fetch("../controllers/reset.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	todoListDOM.innerHTML = "";
	setCounter(0);
}

/** Event handler : save the tasks in db */
function saveHandler(event) {
	event.preventDefault();

	const listItemsDOM = todoListDOM.querySelectorAll("li");
	const data = [];
	listItemsDOM.forEach((item) => data.push(item.textContent));

	fetch("../controllers/save.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
}
