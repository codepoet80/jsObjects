// JavaScript User Interface Objects - Taskbar
// By: Jonathan Wise
// Created: May 2004

// Public constructor
// To be called by hosting page to create a new instance of the taskbar
function taskbarNew(taskbarName, skinName, taskbarParent, rootDir)
{
	if (taskbarName == null || taskbarName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Taskbar", skinName, rootDir);
	
	if (taskbarParent == null || taskbarParent == "" || taskbarParent == undefined)
		taskbarParent = document.body;
	if (typeof(taskbarParent) != "object")
		taskbarParent = document.getElementById(taskbarParent);
		
	var tbDiv = document.createElement("div");
	if (browser == "IE")
		tbDiv.style.height = "100%";
	tbDiv.style.overflow = "hidden";
	tbDiv.className = "TaskbarMain";
	tbDiv.id = taskbarName;
	taskbarParent.appendChild(tbDiv);
	var tbObject = TaskbarPvtConstructTaskbar(taskbarName, tbDiv, taskbarParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach taskbar elements and methods to a given instance of the taskbar
function TaskbarPvtConstructTaskbar(taskbarName, taskbarDiv, taskbarParent, rootDir)
{
	var tbObject;
	eval(taskbarName + ".element = taskbarDiv");	//element
	eval(taskbarName + ".createFolder = TaskbarPubCreateFolder");	//method
	eval(taskbarName + ".createTask = TaskbarPubCreateTask");	//method
	eval(taskbarName + ".taskbarResize = TaskbarPubResize");	//method
	eval(taskbarName + ".taskClick = doNothing");	//event
	eval(taskbarName + ".TaskbarParent = taskbarParent");	//private property
	eval(taskbarName + ".rootDir = rootDir");	//private property
	eval("tbObject = " + taskbarName);	//assignment
	return tbObject;
}

// Private method with a public pointer
// Used to create a new folder for a given instance of the taskbar
function TaskbarPubCreateFolder(folderID, folderName)	//public name: createFolder
{
	var tbFolder = document.createElement("div");
	tbFolder.id = folderID; 
	tbFolder.height = this.element.parentNode.clientHeight;
	for (var f=0;f<this.element.childNodes.length;f++)
	{
		this.element.childNodes[f].childNodes[1].style.display = "none";
	}
	
	var tbFolderHead = document.createElement("div");
	tbFolderHead.align = "center";
	if (browser == "IE")
		tbFolderHead.style.height = "20px";
	else
		tbFolderHead.style.height = "17px";
	tbFolderHead.onclick = TaskbarPubFolderClick;
	tbFolderHead.style.paddingTop = "2px";
	tbFolderHead.className = "TaskbarFolder";
	tbFolderHead.innerHTML = folderName;
	tbFolder.appendChild(tbFolderHead);
	
	var tbFolderBody = document.createElement("div");
	tbFolderBody.align = "center";
	tbFolderBody.style.overflow = "auto";
	tbFolderBody.style.height = "0px";
	tbFolder.appendChild(tbFolderBody);
	this.element.appendChild(tbFolder);
}

// Private method with public pointer
// Used when user clicks on a taskbar folder
function TaskbarPubFolderClick() //public name: associated with onclick event
{
	//if this can be associated with onresize then taskbars will always be the right size
	//if this can be called for the selected folder once filled, overflow will be adjusted
	var subHeight;
	for (var f=0;f<this.parentNode.parentNode.childNodes.length;f++)
	{
		subHeight = this.parentNode.parentNode.childNodes[f].childNodes[0].style.height;
		subHeight = replace(subHeight, "px", "") * 1;
		if (browser == "MOZ")
			subHeight = subHeight + 5;	//should discover border width
		this.parentNode.parentNode.childNodes[f].childNodes[1].style.display = "none";
	}
	subHeight = this.parentNode.parentNode.childNodes.length * subHeight;
	this.parentNode.childNodes[1].style.height = this.parentNode.parentNode.parentNode.scrollHeight - subHeight;
	this.parentNode.childNodes[1].style.display = "block";
}

// Private method with public pointer
// Used to create a new task in a folder for a given instance of the taskbar
function TaskbarPubCreateTask(taskID, taskText, taskIcon, folderID)	//public name: createTask
{
	var tbTask = document.createElement("span");
	tbTask.className = "TaskbarItemOut";
	tbTask.onmouseover = TaskbarPvtTaskOver;
	tbTask.onmouseout = TaskbarPvtTaskOut;
	tbTask.onclick = TaskbarPvtTaskClick;

	var tbImg = document.createElement("img");
	tbImg.src = taskIcon;
	tbImg.className = "TaskbarImgOut";
	tbImg.height = "32";
	tbImg.width = "32";
	tbImg.alt = taskText;
	tbImg.title = taskText;
	tbTask.id = taskID;
	tbTask.appendChild(tbImg);
	
	var tbSpacer = document.createElement("img");
	tbSpacer.src = "jsUI-Global/none.gif";
	tbSpacer.height = "45";
	tbSpacer.width = "100%";
	
	var tbText = document.createElement("span")
	tbText.innerHTML = "<br>" + taskText + "<br>";
	
	document.getElementById(folderID).childNodes[1].appendChild(tbSpacer);
	document.getElementById(folderID).childNodes[1].appendChild(tbTask);
	document.getElementById(folderID).childNodes[1].appendChild(tbText);
	objectEvent(document.getElementById(folderID).childNodes[0], "onclick", browser);
}

// Private method with public pointer
// Used to resize the taskbar when linked to the page's onresize event
function TaskbarPubResize()	//public name: taskbarResize()
{
	for (var f=0;f<this.element.childNodes.length;f++)
	{
		if (this.element.childNodes[f].childNodes[1].style.display == "block")
		{
			objectEvent(this.element.childNodes[f].childNodes[0], "onclick", browser)
		}
	}
}

function TaskbarPvtTaskClick()
{
	eval(this.parentNode.parentNode.parentNode.id + ".taskClick('" + this.id + "')")
}

function TaskbarPvtTaskOver()
{
	if (browser == "IE")
		this.className = "TaskbarItemOver";
	this.childNodes[0].className = "TaskbarImgOver"
}

function TaskbarPvtTaskOut()
{
	if (browser == "IE")
		this.className = "TaskbarItemOut";
	this.childNodes[0].className = "TaskbarImgOut"
}