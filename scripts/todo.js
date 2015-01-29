/*
	Bryce Sellars
	jQuery to-do list utilizing HTML5 local storage
	brycesellars.co.nz
*/

//Declared constants
var constants = {
	editBtn: "edit-button",
	todoTask: "todo-task",
	todoHeader: "task-header",
	todoDate: "task-date",
	todoDesc: "task-description",
	taskID: "task-",
	formID: "todo-form",
	deleteDiv: "delete-area" 
	},
	
	columns = {
		"1": "#pending",
		"2": "#inProgress",
		"3": "#completed"
	},
	
	//If todoData exists in local storage, store it in 'data'.
	data = JSON.parse(localStorage.getItem("todoData")) || {};

//Generate a task from the passed in object
var GenerateTask = function(params){
	
	var parent = $(columns[params.column]),
    wrapper;

    wrapper = $("<div />", {
	    "class" : constants.todoTask,
	    "id" : constants.taskID + params.id
	    //"data" : params.id
  	}).appendTo(parent);
 
	$("<div />", {
	    "class" : constants.todoHeader,
	    "text": params.title
	}).appendTo(wrapper);

	$("<button />", {
	    "id" : constants.editBtn + params.id,
	    "class" : constants.editBtn,
	    "onclick" : "editTask(this.id)"
	}).appendTo(wrapper);
	 
	$("<div />", {
	    "class" : constants.todoDate,
	    "text": params.date
	}).appendTo(wrapper);
	 
	$("<p />", {
	    "class" : constants.todoDesc,
	    "text": params.description
	}).appendTo(wrapper);

	//Task div is now draggable, and reverts to original position if it is not dropped
	//in a droppable element
	wrapper.draggable({
		helper: "clone",
		appendTo: "body",
		start: function(){
			$(this).hide();
		},
		stop: function(){
			$(this).show();
		},
		revert: "invalid", 
		revertDuration : 500
	});
};

//Remove task from DOM
var RemoveTask = function(params){
	$("#" + constants.taskID + params.id).remove();
};

//Adds delete functionality to delete div
var AddDeleteTaskFunctionality = function(){
	$("#" + constants.deleteDiv).droppable({
		drop: function(event, ui){
			var element = ui.draggable;
			var	styleId = element.attr("id");
			var	taskId = styleId.slice(5);
			var	task = data[taskId];
			//Remove task from the DOM	
			RemoveTask(task);
			//Delete the task object and update local storage
			delete data[taskId];
			localStorage.setItem("todoData", JSON.stringify(data));
		}
	});
};

//Clear the form 
var ClearForm = function(){
	$("#title").val("");
	$("#desc").val("");
	$("#todo-form .datepicker").val("");
};

//Clear all tasks
var ClearData = function(){
	data = {};
	localStorage.setItem("todoData", JSON.stringify(data));
	$("." + constants.todoTask).remove();
};

//Display all of the tasks in local storage
var DisplayStoredTasks = function(){
 	 $.each(data, function (index, params) {
        GenerateTask(params);
    });
};

var editTask = function(buttonID){
	var	taskID = buttonID.slice(11);
	var taskElementID = "#task-" + taskID;
	var	task = data[taskID];
	var editTitle = $("#edit-title");
	var editDate = $("#edit-date");
	var editDesc = $("#edit-desc");

	$("#dialog-box").dialog({
		modal: true,
		title: "Edit Task",
        height: 380,
        width: 400,

        open: function(){
	        editTitle.val(task.title);
			editDate.val(task.date);
			editDesc.val(task.description);
		},

		buttons: [{
			text: "Submit",
			click: function(){
				if (editTitle.val() == "" || editDate.val() == "" || editDesc.val() == "") {
					alert("Please fill out all fields");
				}
				else{
					//Update the object fields
					task.title = editTitle.val();
					task.date = editDate.val();
					task.description = editDesc.val();

					//Update the HTML elements
					$(taskElementID).find(".task-header").text(task.title);
					$(taskElementID).find(".task-date").text(task.date);
					$(taskElementID).find(".task-description").text(task.description);

					//Store the updated task in local storage
					data[taskID] = task;
					localStorage.setItem("todoData", JSON.stringify(data));

					//Close dialog box
					$(this).dialog("close");
				}	
			}
		}]
	});
};	

//Adds Droppable functionality to each column
var AddColumnDropFunctionality = function(){
	$.each(columns, function (colNum, col){
		$(col).droppable({
			drop: function(event, ui){
				var element = ui.draggable;
				var	styleId = element.attr("id");
				var	taskId = styleId.slice(5);
				var	task = data[taskId];

				//Remove the task	
				RemoveTask(task);
				//Set the new column number
				task.column = colNum;
				//Generate the updated task
				GenerateTask(task);
				//Store the updated task in local storage
				data[taskId] = task;
				localStorage.setItem("todoData", JSON.stringify(data));
			},
			tolerance: "intersect"
		});
	});
};

$(document).ready(function(){ 

	DisplayStoredTasks();
	AddColumnDropFunctionality();
	AddDeleteTaskFunctionality();

	$('form').submit(function(e){
		//Stops the page from reloading
		e.preventDefault();

		var title = $('#title').val();
		var	desc = $('#desc').val();
		var	date = $('#todo-form .datepicker').val();
		var	id = new Date().getTime();

		var	taskData = {
				id : id,
			    column: "1",
			    title: title,
			    date: date,
			    description: desc
			};

        if (!title.length || !desc.length || !date.length) {
        	alert("Please fill out all fields");
        }
        else {
        	
			//Store taskData object in 'data' with the id as its key	
			data[id] = taskData;

			//Update local storage
	        localStorage.setItem("todoData", JSON.stringify(data));
        	//Call the generateTask function and pass it the taskData object
  			GenerateTask(taskData);
  			ClearForm();
        }
	});
});