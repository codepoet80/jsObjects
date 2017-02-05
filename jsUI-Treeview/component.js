// JavaScript User Interface Objects - Treeview
// By: Jonathan Wise
// Created: May 2004

// Public constructor
// To be called by hosting page to create a new instance of the treeview
function treeviewNew(treeviewName, skinName, treeviewParent, rootDir)
{
	if (treeviewName == null || treeviewName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Treeview", skinName, rootDir);
	
	if (treeviewParent == null || treeviewParent == "" || treeviewParent == undefined)
		treeviewParent = document.body;
	if (typeof(treeviewParent) != "object")
		treeviewParent = document.getElementById(treeviewParent);
		
	var tvDiv = document.createElement("div");
	tvDiv.style.height = "100%";
	tvDiv.style.width = "100%";
	tvDiv.style.overflow = "auto";
	tvDiv.className = "TreeviewMain";
	tvDiv.id = treeviewName;
	treeviewParent.appendChild(tvDiv);
	var tbObject = TreeviewPvtConstructTaskbar(treeviewName, tvDiv, treeviewParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach taskbar elements and methods to a given instance of the treeview
function TreeviewPvtConstructTaskbar(treeviewName, treeviewDiv, treeviewParent, rootDir)
{
	var tbObject;
	eval(treeviewName + ".element = treeviewDiv");	//element
	eval(treeviewName + ".createItem = TreeviewPubCreateItem");	//method
	eval(treeviewName + ".itemClick = doNothing");	//event
	eval(treeviewName + ".itemExpand = doNothing");	//event
	eval(treeviewName + ".TreeviewParent = treeviewParent");	//private property
	eval(treeviewName + ".rootDir = rootDir");	//private property
	eval("tbObject = " + treeviewName);	//assignment
	return tbObject;
}

function TreeviewPubCreateItem(itemID, itemName, itemImg, hasChildren, preload, show, parentID)	//public name: createItem
{
	var tbItem = document.createElement("ul");
	tbItem.id = itemID;
	if (parentID == null)
		tbItem.style.marginBottom = "0px";
	tbItem.className = "TreeviewItem";
	tbItem.style.overflow = "hidden";
	tbItem.hasChildren = hasChildren;
	tbItem.preload = preload;
	tbItem.onmouseover = TreeviewPvtItemOver;
	tbItem.onmouseout = TreeviewPvtItemOut;
	if (!show)
		tbItem.style.display = "none";
	var tbImg = document.createElement("img");
	if (hasChildren == false)
		tbImg.src = this.rootDir + "/jsUI-Treeview/dot.gif";
	else if (hasChildren == true)
		tbImg.src = this.rootDir + "/jsUI-Treeview/plus.gif";
	else
		tbImg.src = this.rootDir + "/jsUI-Treeview/unknown.gif";
	tbImg.onclick = TreeviewPvtExpandClick;
	tbItem.appendChild(tbImg);

	var tbIcon = document.createElement("img");
	if (itemImg != null)
		tbIcon.src = itemImg;
	else
		tbIcon.src = this.rootDir + "/jsUI-Global/none.gif";
	tbIcon.onclick = TreeviewPvtItemClick;
	tbIcon.ondblclick = TreeviewPvtExpandClick;
	tbIcon.style.marginRight = "4px";
	tbIcon.align = "absmiddle";
	tbItem.appendChild(tbIcon);
	
	var tbText = document.createElement("span");
	tbText.className = "TreeviewItemTextOut";
	tbText.onclick = TreeviewPvtItemClick;
	tbText.ondblclick = TreeviewPvtExpandClick;
	tbText.innerHTML += itemName;
	tbItem.appendChild(tbText);
	if (parentID == null || parentID == "")
		this.element.appendChild(tbItem);
	else
	{
		var parentObj = document.getElementById(parentID);
		if (parentObj.hasChildren != false)
		{
			parentObj.appendChild(tbItem);
			if (show)
			{
				parentObj.childNodes[0].src = this.rootDir + "/jsUI-Treeview/minus.gif";
				//see if there are hidden children and show them too
				var allArray = parentObj.childNodes;
				if (allArray.length > 0)
				{
					for (var a=0;a<allArray.length;a++)
					{
						if (allArray[a].tagName == "UL")
							allArray[a].style.display = "block";
					}
				}
			}
			if (!show)
				parentObj.childNodes[0].src = this.rootDir + "/jsUI-Treeview/plus.gif";
		}
	}
}

var oldClass = "";
function TreeviewPvtItemOver(e)
{
	if (this.childNodes[2].className != "TreeviewItemTextOver")
		oldClass = this.childNodes[2].className;
	if (this.childNodes[2].className != "TreeviewItemTextClicked")
		this.childNodes[2].className = "TreeviewItemTextOver";
	if (!e)
		var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) 
		e.stopPropagation();
}

function TreeviewPvtItemOut(e)
{
	this.childNodes[2].className = oldClass;
	if (!e) 
		var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) 
		e.stopPropagation();
}

function TreeviewPvtItemClick(e)
{
	if (!e)
		var e = window.event;

	var currTree = TreeviewPvtFindRootObject(this);
	node = currTree.element;

	var allArray = getAllDescendants(node, "UL");
	for (var a=0;a<allArray.length;a++)
		allArray[a].childNodes[2].className="TreeviewItemTextOut";
	
	this.parentNode.childNodes[2].className = "TreeviewItemTextClicked";
	oldClass = "TreeviewItemTextClicked";

	currTree.itemClick(this.parentNode.id);
	
	e.cancelBubble = true;
	if (e.stopPropagation) 
		e.stopPropagation();
	e.returnValue = false;
}

function TreeviewPvtExpandClick(e)
{
	if (!e)
		var e = window.event;
	
	var currTree = TreeviewPvtFindRootObject(this);
	var node = this.parentNode.childNodes[0];
	var currSrc = node.src;
	currSrc = currSrc.split("jsUI-Treeview/");
	if (currSrc[1] == "plus.gif")
	{
		var allArray = this.parentNode.childNodes;
		var hiddenChildren = false;
		if (allArray.length > 0)
		{
			for (var a=0;a<allArray.length;a++)
			{
				if (allArray[a].tagName == "UL")
				{
					allArray[a].style.display = "block";
					hiddenChildren = true;
				}
			}
			node.src = currTree.rootDir + "/jsUI-Treeview/minus.gif";
		}
		if (!hiddenChildren)
			node.src = currTree.rootDir + "/jsUI-Treeview/minus.gif";
		currTree.itemExpand(this.parentNode.id);
	}
	else if (currSrc[1] == "minus.gif")
	{
		node.src = currTree.rootDir + "/jsUI-Treeview/plus.gif";
		var allArray = getAllDescendants(node.parentNode, "UL");
		for (var a=0;a<allArray.length;a++)
		{
			if (allArray[a].preload)
			{
				if (allArray[a].parentNode == node.parentNode)
					allArray[a].style.display = "none";
			}
			else
			{
				if (allArray[a].parentNode == node.parentNode)
					allArray[a].parentNode.removeChild(allArray[a]);
			}
		}
	}
	else if (currSrc[1] == "unknown.gif")
		currTree.itemExpand(this.parentNode.id);
	else if (currSrc[1] == "dot.gif")
		objectEvent(node.parentNode.childNodes[1], "onclick", browser);
		
	e.cancelBubble = true;
	if (e.stopPropagation) 
		e.stopPropagation();
	e.returnValue = false;
}

function TreeviewPvtFindRootObject(currTree)
{
	while(currTree.tagName != "DIV")
		currTree = currTree.parentNode;
	currTree = eval(currTree.id);
	return currTree;
}