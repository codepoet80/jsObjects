// JavaScript User Interface Objects - Toolbar
// By: Jonathan Wise
// Created: May 2004

// Public constructor
// To be called by hosting page to create a new instance of the toolbar
function toolbarNew(toolbarName, skinName, toolbarParent, rootDir)
{
	if (toolbarName == null || toolbarName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Toolbar", skinName, rootDir);
	
	if (toolbarParent == null || toolbarParent == "" || toolbarParent == undefined)
		toolbarParent = document.body;
	if (typeof(toolbarParent) != "object")
		toolbarParent = document.getElementById(toolbarParent);
		
	var tbDiv = document.createElement("div");
	tbDiv.className = "ToolbarMain";
	tbDiv.id = toolbarName;
    tbDiv.style.width = "10px";
	var tbHandle = document.createElement("img");
	tbHandle.src = rootDir + "/jsUI-Toolbar/handle.gif";
	tbHandle.align = "absmiddle";
	tbDiv.appendChild(tbHandle);
	toolbarParent.appendChild(tbDiv);
	var tbObject = ToolbarPvtConstructToolbar(toolbarName, tbDiv, toolbarParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach toolbar elements and methods to a given instance of the toolbar
function ToolbarPvtConstructToolbar(toolbarName, toolbarDiv, toolbarParent, rootDir)
{
	var tbObject;
	eval(toolbarName + ".element = toolbarDiv");	//element
	eval(toolbarName + ".createButton = ToolbarPubCreateButton");	//method
	eval(toolbarName + ".createSeperator = ToolbarPubCreateSeperator");	//method
	eval(toolbarName + ".createListItem = ToolbarPubCreateListItem");	//method
	eval(toolbarName + ".createList = ToolbarPubCreateList");	//method
	eval(toolbarName + ".itemClick = doNothing");	//event
	eval(toolbarName + ".ToolbarParent = toolbarParent");	//private property
	eval(toolbarName + ".rootDir = rootDir");	//private property
	eval("tbObject = " + toolbarName);	//assignment
	return tbObject;
}

// Private method with public pointer
// Used to create a new toolbar button in a given instance of the toolbar
function ToolbarPubCreateButton(taskID, taskText, taskIcon, taskSticky)	//public name: createButton
{
	var tbItem = document.createElement("span");
	if (browser == "IE")
		tbItem.className = "ToolbarItemOut";
	tbItem.id = taskID;
	tbItem.sticky = taskSticky;
	if (tbItem.sticky)
		tbItem.selected = false;

	var tbImg = document.createElement("img");
	tbImg.src = taskIcon;
	if (browser != "IE")
		tbImg.className = "ToolbarItemOut";
	tbImg.height = "16";
	tbImg.width = "16";
	tbImg.align = "absmiddle";
	tbImg.alt = taskText;
	tbImg.title = taskText;
	tbImg.onmouseover = ToolbarPvtItemOver;
	tbImg.onmouseout = ToolbarPvtItemOut;
	tbImg.onmousedown = ToolbarPvtItemDown;
	tbImg.onmouseup = ToolbarPvtItemUp;
	tbImg.onclick = ToolbarPvtItemClick;
	tbItem.appendChild(tbImg);
	var currWidth = replace(this.element.style.width, "px", "") * 1;
	currWidth += 22;
	this.element.style.width = currWidth;
	this.element.appendChild(tbItem);
}

// Private method with public pointer
// Used to create a new toolbar seperator in a given instance of the toolbar
function ToolbarPubCreateSeperator()	//public name: createSeperator
{
	var tbImg = document.createElement("img");
	tbImg.align = "absmiddle";
	tbImg.style.width = "4px";
	tbImg.style.height = "18px";
	tbImg.src = this.rootDir + "/jsUI-Toolbar/seperator.gif";
	var currWidth = replace(this.element.style.width, "px", "") * 1;
	currWidth += 4;
	this.element.style.width = currWidth;
	this.element.appendChild(tbImg);
}

function ToolbarPubCreateListItem(listItemID, listItemText, listItemValue)
{
	var listObj = new Object()
	listObj.id = listItemID;
	listObj.text = listItemText;
	listObj.value = listItemValue;
	return listObj;
}

// Private method with public pointer
// Used to create a new toolbar button in a given instance of the toolbar
function ToolbarPubCreateList(listID, listName, arrList, listWidth)	//public name: createColumn
{
    listWidth = listWidth * 1;
	var currList = document.createElement("select");
	currList.id = listID;
	currList.className = "ToolbarMain";
	currList.style.width = listWidth;
	currList.style.marginRight = "5px";
	currList.style.display = "inline";
	currList.onchange = ToolbarPvtListSelect;
	
	var topItem = document.createElement("option");
	topItem.value = "noneselected";
	topItem.text = listName;
	currList.options.add(topItem);
	
	for (var c=0;c<arrList.length;c++)
	{
		var currItem = document.createElement("option");
		currItem.value = arrList[c].value;
		currItem.text = arrList[c].text;
		currList.options.add(currItem);
	}
	var currWidth = replace(this.element.style.width, "px", "") * 1;
    currWidth += (listWidth + 5);
	this.element.style.width = currWidth;
	this.element.appendChild(currList);
}

function ToolbarPvtItemClick()
{
	if (browser == "IE")
	{
		if (this.parentNode.sticky)
		{
			this.parentNode.selected = (this.parentNode.selected == false) ? true : false;
			if (!this.parentNode.selected)
			{
				this.parentNode.className = "ToolbarItemOver";
			}
			else
			{
				this.parentNode.className = "ToolbarItemDown";
			}
		}
		else
		{
			this.parentNode.className = "ToolbarItemDown";
		}
	}
	else
	{
		if (this.parentNode.sticky)
		{
			this.parentNode.selected = (this.parentNode.selected == false) ? true : false;
			if (!this.parentNode.selected)
			{
				this.className = "ToolbarItemOver";
			}
			else
			{
				this.className = "ToolbarItemDown";
			}
		}
		else
		{
			this.className = "ToolbarItemDown";
		}
	}	

	eval(this.parentNode.parentNode.id + ".itemClick('" + this.parentNode.id + "')");
}

function ToolbarPvtItemOver()
{
	if (browser == "IE")
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			// don't do anything
		}
		else
		{
			this.parentNode.className = "ToolbarItemOver";
		}
	}
	else
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			// don't do anything
		}
		else
		{
			this.className = "ToolbarItemOver";
		}
	}
}

function ToolbarPvtItemDown()
{
	if (browser == "IE")
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			// don't do anything
		}
		else
		{
			this.parentNode.className = "ToolbarItemDown";
		}
	}
	else
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			// don't do anything
		}
		else
		{
			this.className = "ToolbarItemDown";
		}
	}
}

function ToolbarPvtItemUp()
{
	if (browser == "IE")
	{
		if (this.parentNode.sticky)
		{
			// I SAW NOTHING.... NOTHING....
		}
		else
		{
			this.parentNode.className = "ToolbarItemOver";
		}
	}
	else
	{
		if (this.parentNode.sticky)
		{
			/// I SAW NOTHING.... NOTHING....
		}
		else
		{
			this.className = "ToolbarItemOver";
		}
	}
}

function ToolbarPvtItemOut()
{
	if (browser == "IE")
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			// I SAW NOTHING.... NOTHING....
		}
		else
		{
			this.parentNode.className = "ToolbarItemOut";
		}
	}
	else
	{
		if (this.parentNode.sticky && this.parentNode.selected)
		{
			/// I SAW NOTHING.... NOTHING....
		}
		else
		{
			this.className = "ToolbarItemOut";
		}

	}
}

function ToolbarPvtListSelect(e)
{
	if (browser == "IE")
		e = window.event;
	var srcElement = e.srcElement? e.srcElement : e.target;
	var parentElement = document.getElementById(this.parentNode.id);
	eval(this.parentNode.id + ".itemClick('" + srcElement.id + "')");
}

function ToolbarPvtFindRootObject(currNode)
{
	while(currNode.tagName != "DIV")
		currNode = currNode.parentNode;
	return currNode;
}
