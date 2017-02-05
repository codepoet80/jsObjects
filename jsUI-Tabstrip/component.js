// JavaScript User Interface Objects - Tabstrip
// By: Jonathan Wise
// Created: January 2005

// Public constructor
// To be called by hosting page to create a new instance of the tabstrip
function tabstripNew(tabstripName, skinName, tabLocation, tabstripParent, rootDir)
{
	if (tabstripName == null || tabstripName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Tabstrip", skinName + tabLocation, rootDir);
	
	if (tabstripParent == null || tabstripParent == "" || tabstripParent == undefined)
		tabstripParent = document.body;
	if (typeof(tabstripParent) != "object")
		tabstripParent = document.getElementById(tabstripParent);
			
	var tbTable = document.createElement("TABLE");
	tbTable.className = "TabstripMain";
	tbTable.id = tabstripName;
	tbTable.cellPadding = 0;
	tbTable.cellSpacing = 0;
	var tbBody = document.createElement("TBODY");
	tbTable.appendChild(tbBody);
	var tbRow = document.createElement("TR");
	tbBody.appendChild(tbRow);
	tabstripParent.appendChild(tbTable);
	var tbObject = TabstripPvtConstructTabstrip(tabstripName, tbTable, tabstripParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach tabstrip elements and methods to a given instance of the tabstrip
function TabstripPvtConstructTabstrip(tabstripName, tabstripTable, tabstripParent, rootDir)
{
	var tbObject;
	eval(tabstripName + ".element = tabstripTable");	//element
	eval(tabstripName + ".createTab = TabstripPubCreateTab");	//method
	eval(tabstripName + ".removeTab = TabstripPubRemoveTab");	//method
	eval(tabstripName + ".clickTab = TabstripPubClickTab");	//method
	eval(tabstripName + ".itemClick = doNothing");	//event
	eval(tabstripName + ".highlight = 'default'");	//public property
	eval(tabstripName + ".currentTab = ''");	//public property
	eval(tabstripName + ".TabstripParent = tabstripParent");	//private property
	eval(tabstripName + ".rootDir = rootDir");	//private property
	eval("tbObject = " + tabstripName);	//assignment
	return tbObject;
}

// Private method with public pointer
// Used to create a new tab in a given instance of the tabstrip
function TabstripPubCreateTab(taskID, taskText, taskIcon, taskWidth, selected)	//public name: createTab
{
	var tbItem = document.createElement("td");
	if (selected)
	{
		tbItem.className = "TabstripItemSelected";
		if (this.highlight != 'default')
			tbItem.style.backgroundColor = this.highlight;
	    this.currentTab = taskID;
	}
	else
		tbItem.className = "TabstripItemOut";
    if (taskWidth == null || taskWidth == undefined || taskWidth == "")
        taskWidth = 100;
	tbItem.id = taskID;
	tbItem.style.width = taskWidth + "px";
	tbItem.onmouseover = TabstripPvtItemOver;
	tbItem.onmouseout = TabstripPvtItemOut;
	tbItem.onmousedown = TabstripPvtItemDown;
	tbItem.onmouseup = TabstripPvtItemUp;
	tbItem.onclick = TabstripPvtItemClick;
	
	tbItem.innerHTML = "";
	if (taskIcon != null && taskIcon != "" && taskIcon != undefined)
		tbItem.innerHTML += "<img src='" + taskIcon + "' align='absmiddle'>&nbsp;";
	tbItem.innerHTML += taskText;
	var currWidth = replace(this.element.style.width, "px", "") * 1;
	currWidth += taskWidth;
	this.element.style.width = currWidth;
	var row = this.element.childNodes[0];
	row = row.childNodes[0];
	row.appendChild(tbItem);
}

// Private method with public pointer
// Used to remove a tab, by id, in a given instance of the tabstrip
function TabstripPubRemoveTab(taskID)	//public name: createTab
{
    var currGrid = this.element;
	var currTabs = getAllDescendants(currGrid, "TD");
	
	for (var r=0;r<currTabs.length;r++)
	{
	    if (currTabs[r].id == taskID || taskID == null || taskID == "all")
	    {
	    	var tabWidth = replace(currTabs[r].style.width, "px", "") * 1;
	    	var currWidth = replace(this.element.style.width, "px", "") * 1;
	        currWidth -= tabWidth;
	        currTabs[r].parentNode.removeChild(currTabs[r]);
	        this.element.style.width = currWidth;
	    }
	}
}

// Private method with public pointer
// Used to allow external code to fake a tab click
function TabstripPubClickTab(taskID)	//public name: createTab
{
    var currGrid = this.element;
	var currTabs = getAllDescendants(currGrid, "TD");
	for (var r=0;r<currTabs.length;r++)
	{
	    if (currTabs[r].id == taskID || taskID == null)
	    {
	        objectEvent(currTabs[r], "click", browser);
	    }
	}
}

function TabstripPvtItemClick()
{
	cells = this.parentNode.childNodes;
	for (var c=0;c<cells.length;c++)
	{
		cells[c].className = "TabstripItemOut";
		cells[c].style.backgroundColor = "";
	}
	var currTabStrip = eval(this.parentNode.parentNode.parentNode.id);
	currTabStrip.currentTab = this.id;
	this.className = "TabstripItemSelected";
	var highlight = this.parentNode.parentNode.parentNode.id;
	highlight = eval(highlight + ".highlight");
	if (highlight != 'default')
		this.style.backgroundColor = highlight;
	eval(this.parentNode.parentNode.parentNode.id + ".itemClick('" + this.id + "')");
}

function TabstripPvtItemOver()
{
	if (this.className != "TabstripItemSelected")
		this.className = "TabstripItemOver";
}

function TabstripPvtItemDown()
{
	this.className = "TabstripItemSelected";	
}

function TabstripPvtItemUp()
{
	this.className = "TabstripItemOver";
}

function TabstripPvtItemOut()
{
    var currStrip = eval(this.parentNode.parentNode.parentNode.id);
    cells = this.parentNode.childNodes;
	for (var c=0;c<cells.length;c++)
	{
	    if (cells[c].id != currStrip.currentTab)
		{
		    cells[c].className = "TabstripItemOut";
		    cells[c].style.backgroundColor = "";
		}
	}
	
}
