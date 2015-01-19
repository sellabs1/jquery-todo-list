/*
	Bryce Sellars
	jQuery to-do list utilizing HTML5 local storage
	brycesellars.co.nz
*/

//Declared constants
var constants = {
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
			var element = ui.draggable,
				styleId = element.attr("id"),
				taskId = styleId.slice(5),
				task = data[taskId];
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
	$("#date").val("");
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

//Adds Droppable functionality to each column
var AddColumnDropFunctionality = function(){
	$.each(columns, function (colNum, col){
		$(col).droppable({
			drop: function(event, ui){
				var element = ui.draggable,
					styleId = element.attr("id"),
					taskId = styleId.slice(5),
					task = data[taskId];

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

		var title = $('#title').val(),
			desc = $('#desc').val(),
			date = $('#date').val(),
			id = new Date().getTime(),

			taskData = {
				id : id,
			    column: "1",
			    title: title,
			    date: date,
			    description: desc
			};

		//Store taskData object in 'data' with the id as its key	
		data[id] = taskData;

		//Update local storage
        localStorage.setItem("todoData", JSON.stringify(data));

        //Call the generateTask function and pass it the taskData object
  		GenerateTask(taskData);
  		ClearForm();
	});
});