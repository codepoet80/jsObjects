// JavaScript User Interface Objects - Grid
// By: Jonathan Wise
// Created: May 2004

// Public constructor
// To be called by hosting page to create a new instance of the grid

function gridNew(gridName, skinName, gridParent, rootDir)
{
	if (gridName == null || gridName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Grid", skinName, rootDir);
	
	if (gridParent == null || gridParent == "" || gridParent == undefined)
		gridParent = document.body;
	if (typeof(gridParent) != "object")
		gridParent = document.getElementById(gridParent);
    	
	var gTable = document.createElement("TABLE");
	gTable.className = "GridMain";
	gTable.id = "tbl" + gridName;
	gTable.datatype = "grid";
	gTable.style.width = "25";
	gTable.cellPadding = "0";
	gTable.cellSpacing = "0";
	gTable.border = "0";
	var gTBody = document.createElement("TBODY");
	gTable.appendChild(gTBody);
	var gTopRow = document.createElement("TR");
	gTopRow.id = "gTopRow";
	gTBody.appendChild(gTopRow);
	gridParent.appendChild(gTable);
	var tbObject = GridPvtConstructGrid(gridName, gTable, gridParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach grid elements and methods to a given instance of the grid
function GridPvtConstructGrid(gridName, gridTable, gridParent, rootDir)
{
	var tbObject;
	eval(gridName + ".element = gridTable");	//element
	eval(gridName + ".createColumn = GridPubCreateColumn");	//method
	eval(gridName + ".createCell = GridPubCreateCell");	//method
	eval(gridName + ".createRow = GridPubCreateRow"); //method
	eval(gridName + ".editRow = GridPubEditRow"); //method
	eval(gridName + ".removeRow = GridPubRemoveRow"); //method
	eval(gridName + ".moveRow = GridPubMoveRow"); //method
	eval(gridName + ".newButton = GridPubNewButton"); //method
	eval(gridName + ".getGridData = GridPvtGetGridData"); //method
	eval(gridName + ".cellClick = doNothing");	//event
	eval(gridName + ".editDone = doNothing");	//event
	eval(gridName + ".deleteDone = doNothing"); //event
	eval(gridName + ".GridParent = gridParent");	//property
	eval(gridName + ".GridRowCount = 0");	//private property
	eval(gridName + ".CurrentCell = ''");	//private property
	eval(gridName + ".currentRow = ''");	//public property
	eval(gridName + ".rootDir = rootDir");	//private property
	eval(gridName + ".id = gridName");	//private property
	eval(gridName + ".textChecker = null"); //public property
	eval(gridName + ".readOnly = false");	//private property
	eval("tbObject = " + gridName);	//assignment
	return tbObject;
}

// Private method with public pointer
// Used to create a new grid button in a given instance of the grid
function GridPubCreateColumn(colID, colTitle, colIcon, colWidth, colIndex)	//public name: createColumn
{
	var colTD = document.createElement("TD");		
	if (colWidth == null)
		colWidth = "100";
	colTD.id = colID;
	colTD.style.overflow = "hidden";
	if (!colIndex)
	{
		if (colIcon)
		{
			if (colIcon == "checkmark")
				colIcon = this.rootDir + "/jsUI-Grid/checked.gif";
			colTD.innerHTML = "<img src='" + colIcon + "' align='absmiddle' alt='" + colTitle + "' style='padding-left: 3px; padding-right:3px'/>";
			colTD.align = "center"
		}
		else
			colTD.innerHTML = colTitle;
	}
	else
	{
		colTD.id = "indexCol";
		colTD.innerHTML = "<img src='" + this.rootDir + "/jsUI-Grid/none.gif" +"' width='28' height='18'>";
		colWidth = "28";
	}
	if (colWidth != "100%")
	{
		colTD.style.width = colWidth
		var currWidth = replace(this.element.style.width, "px", "") * 1;
		currWidth += colWidth * 1;
		this.element.style.width = currWidth;
		if (colWidth == 0)
		    colTD.style.display = "none";
	}
	else
		this.element.style.width = "100%";
	colTD.className = "GridTitleCell";
	colTD.style.height = "24px";
	this.element.childNodes[0].childNodes[0].appendChild(colTD);
}

function GridPubCreateCell(cellID, cellText, cellValue, cellType, cellLocked, cellMore)
{
	var cellObj = new Object()
	cellObj.id = cellID;
	cellObj.text = cellText;
	cellObj.value = cellValue;
	if (cellType != null && cellType != "")
		cellObj.type = cellType.toUpperCase();
	else
		cellObj.type = "TEXT";
	cellObj.locked = cellLocked;
	cellObj.more = cellMore;
	return cellObj;
}

// Private method with public pointer
// Used to create a new grid button in a given instance of the grid
function GridPubCreateRow(rowID, arrCells)	//public name: createRow
{
	var currTR = document.createElement("TR");
	currTR.id = rowID;
	currTR.className = "GridRowOut";
	this.GridRowCount += 1;
	
	//find out if there's an index cell by checking the first row
	var isIndex = 0;
	if(this.element.childNodes[0].childNodes[0].childNodes[0].id == "indexCol")
	{
		var currTD = document.createElement("TD");
		currTD.id = "indexCell";
		currTD.className = "GridTitleCell";
		currTD.align = "center";
		currTD.innerHTML = this.GridRowCount;
		currTD.onclick = GridPvtRowSelect;
		currTD.overflow = "hidden";
		currTR.appendChild(currTD);
		isIndex = 1;
	}
	for (var c=0;c<arrCells.length;c++)
	{
	    try
	    {
		    var currTD = document.createElement("TD");
		    currTD.id = arrCells[c].id;
		    currTD.className = "GridCell";
		    currTD.type = arrCells[c].type;
		    currTD.value = arrCells[c].value;
		    currTD.more = arrCells[c].more;
		    currTD.style.width = this.element.childNodes[0].childNodes[0].childNodes[c+isIndex].style.width;
		    if (this.element.childNodes[0].childNodes[0].childNodes[c+isIndex].style.display == "none")
		        currTD.style.display = "none";
		    currTD.noWrap = true;
		    switch (currTD.type)
		    {
			    case "CHECK":
			    {
			        currTD.onclick = GridPvtRowSelect;
			        //currTD.ondblclick = GridPvtRowSelect;
			        currTD.ondblclick = GridPvtCellEdit;
				    var editField = document.createElement("input");
				    editField.id = currTD.id + "check";
				    editField.type = "checkbox";
				    if (this.readOnly)
				        editField.disabled = true;
				    if (currTD.value == true)
				        editField.checked = true;
				
				    editField.onblur = GridPvtEditDone;
				    editField.onkeydown = GrivPvtKeyHandler;
				    if (browser == "MOZ")
				    {
				        editField.style.height = "10px";
					    editField.style.width = "10px";
					}
					else
					{
					    editField.style.height = "16px";
					    editField.style.width = "16px";
					}

				    currTD.appendChild(editField);
				    break;
			    }
			    case "ICON":
			    {
				    currTD.innerHTML = "<img src='" + currTD.value + "' align='absmiddle' alt='" + arrCells[c].text + "'>";
				    currTD.align = "middle";
				    break;
			    }
			    case "ELLIPSIS":
			    {
			        currTD.onclick = GridPvtRowSelect;
		            currTD.ondblclick = GridPvtCellEdit;
			        if (arrCells[c].text != "" && arrCells[c].text != null)
					    currTD.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>" + arrCells[c].text + "</div>";
				    else
					    currTD.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>&nbsp;</div>";
				    break;
			    }
			    default:
			    {
				    currTD.onclick = GridPvtRowSelect;
		            currTD.ondblclick = GridPvtCellEdit;
				    if (arrCells[c].text != "" && arrCells[c].text != null)
					    currTD.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>" + arrCells[c].text + "</div>";
				    else
					    currTD.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>&nbsp;</div>";
				    break;
			    }
		    }
		    currTR.appendChild(currTD);
		}
		catch(e)
		{
		    //do nothing
		}
	}
	this.element.childNodes[0].appendChild(currTR);
}

// Private method with public pointer
// Used to put a grid row in edit mode
function GridPubEditRow(rowID, e)	//public name: editRow
{
    var keyCode;
	if (browser == "IE")
	{
		obj = e.srcElement;
		keyCode = e.keyCode;
	}
	if (browser == "MOZ")
	{
		obj = e.target;
		if (e.target.tagName.toUpperCase() == "HTML")
		    obj = jsUIGblLastClickedElement;
		keyCode = e.which;
	}
	
	var currGrid = this.element;
	var currRows = getAllDescendants(currGrid, "TR");
	var tableData = "";
	
	var gridObj = new Object();
	gridObj.type = "grid";
	gridObj.id = currGrid.id;
	for (var r=0;r<currRows.length;r++)
	{
		if (currRows[r].id != "gTopRow")
		{
			if (rowID != null && rowID != undefined);
			{
				if (rowID == currRows[r].id)
				{
				    var currCols = getAllDescendants(currRows[r], "TD");
				    if (currCols.length > 0)
				    {
				        if (currCols[0].id == "indexCell")
				        {
				            if (currCols.length > 1)
				                objectEvent(currCols[1], "dblclick", browser);
				        }
				        else
				            objectEvent(currCols[0], "dblclick", browser);
				    } 
				}
			}
		}
	}
	return gridObj;
}

function GrivPvtKeyHandler(e)
{
	var keyCode;
	var currNode = this;
	if (currNode.id == "btnEllipsis")
	    currNode = this.parentNode.parentNode.parentNode.parentNode.parentNode;
	    
	var currGrid = GridPvtFindRootObject(currNode);
	var currTD;
	if (browser == "IE")
	{
		obj = window.event.srcElement;
		e = window.event;
		keyCode = e.keyCode;
	}
	if (browser == "MOZ")
	{
		obj = e.target;
		keyCode = e.which;
	}
	if (obj.id == "btnEllipsis")
	{
	    //objectEvent(obj, "blur", browser);
	    currTD = currNode;
	}
	else
	    currTD = obj.parentNode;
	    
	if (keyCode==13 || (keyCode==9 && !e.shiftKey) || keyCode == 39)  //enter, tab, right
	{
	    if (keyCode==9 || keyCode==13 || (obj.tagName == "INPUT" && obj.type != "text"))
	    {
		    var nextTD = currTD.nextSibling;
		    if (nextTD == null)
		    {
		        if (currTD.parentNode.nextSibling != null)
                    nextTD = currTD.parentNode.nextSibling.childNodes[0];
            }
            if (nextTD != null)
            {
                
                if (nextTD.id == "indexCell")
                    nextTD = nextTD.nextSibling;
                if (nextTD.style.width == "0px")
                    nextTD = nextTD.nextSibling;
                if (nextTD != null)
                {
		            objectEvent(obj, "blur", browser);
		            objectEvent(nextTD, "dblclick", browser);
		        }
		        e.cancelBubble = true;
	            if (browser == "MOZ")
	            {
		            e.stopPropagation();
		            e.preventDefault();
	            }
	            return false;
	        }
	    	
	    }
	}
	else if (keyCode==37 || (keyCode==9 && e.shiftKey))  //left, shift tab
	{
	    if (keyCode==9 || (obj.tagName == "INPUT" && obj.type != "text"))
	    {
	        var nextTD = currTD.previousSibling;
	        if (nextTD == null || nextTD.id == "indexCell")
	        {
	            if (currTD.parentNode.previousSibling != null)
	                nextTD = currTD.parentNode.previousSibling.childNodes[currTD.parentNode.previousSibling.childNodes.length-1];
	            if (currTD.parentNode.previousSibling.style.width == "0px")
	                nextTD = currTD.parentNode.previousSibling.childNodes[currTD.parentNode.previousSibling.childNodes.length-1];
	        }
	        if (nextTD != null)
            {
		        objectEvent(obj, "blur", browser);
		        objectEvent(nextTD, "dblclick", browser);
		    }
		    e.cancelBubble = true;
	        if (browser == "MOZ")
	        {
		        e.stopPropagation();
		        e.preventDefault();
	        }
	    }
	}
	else if (keyCode == 38) //up
	{
	    objectEvent(obj, "blur", browser);
	    GridPubMoveRow(currGrid.currentRow, "up");
	}
	else if (keyCode == 40) //down
	{
	    objectEvent(obj, "blur", browser);
	    GridPubMoveRow(currGrid.currentRow, "down");
	}
	else
	{
	    if (obj.id == "btnEllipsis" && keyCode != 16 && keyCode != 32)
	        objectEvent(document.getElementById("btnEllipsis"), "click");
	}
}

function GridPubNewButton(newFunc)
{
	var currGrid = this.element;
	var newbutton = document.createElement("button");
	newbutton.innerHTML = "new";
	newbutton.style.height = "21px";
	newbutton.style.width = "37px";
	newbutton.style.backgroundColor = "buttonface";
	newbutton.style.fontSize = "12px";
	newbutton.style.borderTop = "1px solid threedhighlight";
	newbutton.style.borderLeft = "1px solid threedhighlight";
	newbutton.style.borderBottom = "1px solid threedshadow";
	newbutton.style.borderRight = "1px solid threedshadow";
	if (newFunc != null)
		newbutton.onclick=newFunc;
	currGrid.parentNode.appendChild(newbutton);
}

function GridPvtRowSelect()
{
	currGrid = GridPvtFindRootObject(this);
	if (this.id != currGrid.CurrentCell || this.id == "indexCell")
	{
		for (var r=0;r<this.parentNode.parentNode.childNodes.length;r++)
		{
			var currRow = this.parentNode.parentNode.childNodes[r];
			for (var c=0;c<currRow.childNodes.length;c++)
			{
				var currCell = currRow.childNodes[c];
				if (currCell.className != "GridTitleCell")
					currCell.className = "GridCell";
			}
		}
		for (var c=0;c<this.parentNode.childNodes.length;c++)
		{
			if (this.parentNode.childNodes[c].className != "GridTitleCell")
				this.parentNode.childNodes[c].className = "GridCellOver";
		}
		currGrid.currentRow = this.parentNode.id;
		if (this.childNodes.length > 0)
		{
		    if (this.firstChild.type == "checkbox")
		    {
		        currGrid.CurrentCell = this.id;
		        this.firstChild.focus();
		    }
		}
	}
	currGrid.rowClick(this.parentNode);
}

// Private method with public pointer
// Used to remove a grid row
function GridPubRemoveRow(rowID)	//public name: removeRow
{
	var currGrid = this.element;
	var currRows = getAllDescendants(currGrid, "TR");
	var tableData = "";
	var currObject = eval(replace(currGrid.id, "tbl", ""));
	
	var allowRemove;
	try
	{
	    if (currObject.deleteDone != doNothing)
	        allowRemove = currGrid.deleteDone
	    else
	        allowRemove = true;
	}
	catch(e)
	{
	    allowRemove = false;
	}
	if (allowRemove)
	{
	    var gridObj = new Object();
	    gridObj.type = "grid";
	    gridObj.id = currGrid.id;
	    for (var r=0;r<currRows.length;r++)
	    {
		    if (currRows[r].id != "gTopRow")
		    {
			    if (rowID != null && rowID != undefined);
			    {
				    if (rowID == currRows[r].id || rowID == "all")
				    {
				        currRows[r].parentNode.removeChild(currRows[r]);
				        this.GridRowCount --;
				    }
			    }
		    }
	    }
	}
	return gridObj;
}

// Private method with public pointer
// Used to move the row selection up or down
function GridPubMoveRow(rowID, direction)	//public name: moveRow
{
 	var currGrid = this.element;
	var nextRow;
	try
	{
	    if (direction.toUpperCase() == "UP")
    	    nextRow = document.getElementById(rowID).previousSibling.firstChild;
	    if (direction.toUpperCase() == "DOWN")
    	    nextRow = document.getElementById(rowID).nextSibling.firstChild;
    }
    catch(e)
    {
        nextRow = null;
    }
    if (nextRow != null)
        objectEvent(nextRow, "click", browser);
}

function GridPvtGetGridData(rowID)
{
	currGrid = this.element;
	var currRows = getAllDescendants(currGrid, "TR");
	var tableData = "";
	
	var gridObj = new Object();
	gridObj.type = "grid";
	gridObj.id = currGrid.id;
	for (var r=0;r<currRows.length;r++)
	{
		if (currRows[r].id != "gTopRow")
		{
			var rowObj = new Object();
			rowObj.type = "row";
			rowObj.id = currRows[r].id;
			
			var currCells = getAllDescendants(currRows[r], "TD");
			for (var c=0;c<currCells.length;c++)
			{
				if (currCells[c].id != "indexCell")
				{
					var cellObj = new Object();
					cellObj.type = "cell";
					cellObj.id = currCells[c].id;
					var celltype = currCells[c].type;
					if (celltype == "CHECK")
					{
					   	if (!currCells[c].firstChild.checked)
							cellObj.value = false;
						else
							cellObj.value = true;
						cellObj.datatype = "boolean";
					}
					else if (celltype == "ELLIPSIS")
					{
						if (currCells[c].firstChild.innerHTML != "&nbsp;")
							cellObj.value = HTMLEncode(currCells[c].firstChild.innerHTML);
						else
							cellObj.value = "";
					    cellObj.datatype = "alphanumeric";
					}
					else
					{
						if (currCells[c].firstChild.innerHTML != "&nbsp;")
							cellObj.value = HTMLEncode(currCells[c].firstChild.innerHTML);
						else
							cellObj.value = "";
						if (celltype == "icon")
							cellObj.datatype = "alphanumeric";
					    else
					        cellObj.datatype = celltype;
					}
					
					cellObj.celltype = celltype;
					eval("rowObj." + currCells[c].id + "= new Object();");
					eval("rowObj." + currCells[c].id + "= cellObj;");
				}
			}
			
			if (rowID != null && rowID != undefined);
			{
				if (rowID == currRows[r].id)
					return rowObj;
			}
			eval("gridObj." + currRows[r].id + "= new Object();");
			eval("gridObj." + currRows[r].id + "= rowObj;");
		}
	}

	return gridObj;
}

function GridPvtCellEdit()
{
	currGrid = GridPvtFindRootObject(this);
	if (currGrid.CurrentCell != "" && browser != "MOZ")
		alert ('finish editing!');
	if (!currGrid.readOnly)
	{
		currGrid.CurrentCell = this.id;		
		for (var r=0;r<this.parentNode.parentNode.childNodes.length;r++)
		{
			var currRow = this.parentNode.parentNode.childNodes[r];
			for (var c=0;c<currRow.childNodes.length;c++)
			{
				var currCell = currRow.childNodes[c];
				if (currCell.className != "GridTitleCell")
					currCell.className = "GridCell";
			}
		}
		for (var c=0;c<this.parentNode.childNodes.length;c++)
		{
			if (this.parentNode.childNodes[c].className != "GridTitleCell")
				this.parentNode.childNodes[c].className = "GridCellOver";
			else
			{
				if (this.parentNode.childNodes[c].id == "indexCell")
				{
					this.parentNode.childNodes[c].style.height="21px";
					this.parentNode.childNodes[c].innerHTML = "<img id='" + this.parentNode.childNodes[c].innerHTML + "' src='" + currGrid.rootDir + "/jsUI-Grid/rowEdit.gif" + "' align='absmiddle'>";
				}
			}
		}

		switch (this.type)
		{
			case "ELLIPSIS":
			{
				this.className = "GridEllipsisClicked";
				this.oldValue = this.innerText;
				var eTable = document.createElement("table");
				eTable.border = "0";
				eTable.cellPadding = "0";
				eTable.cellSpacing = "0";
				eTable.style.width = "80%";
				//eTable.align = "left";
				var eTB = document.createElement("tbody");
				var eTR = document.createElement("tr");
				var eTD1 = document.createElement("td");
				var currWidth = replace(this.style.width, "px", "");
				currWidth = currWidth * 1;
				eTable.style.width = (currWidth-3) + "px";
				//eTable.style.paddingLeft = "3px";
				//eTD1.style.width = currWidth-25 + "px";
				//currCell.innerHTML = "<div noWrap style='width:" + currCell.style.width + ";overflow:hidden'>&nbsp;</div>";
				
				eTD1.className = "EditText";
				eTD1.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>" + this.firstChild.innerHTML + "</div>";
				eTR.appendChild(eTD1);
				var eTD2 = document.createElement("td");
				eTD2.align = "right";
				var eBtn = document.createElement("input");
				eBtn.type = "button";
				eBtn.value = "...";
				eBtn.id = "btnEllipsis";
				eBtn.className = "EditEllipsis";
				eBtn.onclick = GridPvtExpandClick;
				if (browser == "MOZ")
					eBtn.style.width = "18px";
				eBtn.style.height = this.clientHeight - 2;
				eBtn.onblur = GridPvtEditExpand;
				eBtn.onkeydown = GrivPvtKeyHandler;
				eTD2.appendChild(eBtn);
				eTR.appendChild(eTD2);
				eTB.appendChild(eTR);
				eTable.appendChild(eTB);
				this.innerHTML = "";
				this.appendChild(eTable);
				document.getElementById("btnEllipsis").focus();
				eBtn.focus();
				break;
			}
			case "CHECK":
			{
				setTimeout("document.getElementById('" + this.firstChild.id + "').focus()", 100);
				break;
			}
			case "ICON":
			{
			    //do nothing
			    break;
			}
			default:
			{
				this.className = "GridTextClicked";
				this.oldValue = this.innerText;
				var editField = document.createElement("input");
				editField.id = "txtGridEditField";
				editField.type = "text";			
                var namedItem = document.createAttribute("datatype");
                namedItem.value = this.type;
                editField.attributes.setNamedItem(namedItem);      
                
                if (currGrid.textChecker != null)
                {
                    var namedItem = document.createAttribute("datachecker");
                    namedItem.value = currGrid.textChecker.id;
                    editField.attributes.setNamedItem(namedItem);
                }
				
				if (this.childNodes[0].innerHTML != "&nbsp;")
					editField.value = this.childNodes[0].innerHTML;	//inside of the div, not the cell
				editField.className = "EditTextField";
				editField.size = "2";
				if (browser == "MOZ")
				{
					editField.style.border = "0px solid black";
					editField.style.height = this.scrollHeight - 1;
					editField.style.width = this.scrollWidth - 8;
				}
				else
				{
					editField.style.border = "0px solid black";
					editField.style.height = this.clientHeight - 2;
					editField.style.width = this.clientWidth - 10;
				}
				editField.onkeydown = GrivPvtKeyHandler;
				if (currGrid.textChecker != null)
				{
				    editField.onkeypress = currGrid.textChecker.keyPress;
				}
				editField.onblur = GridPvtEditDone;
				this.innerHTML = "";
				this.appendChild(editField);
				editField.focus();
				setTimeout("document.getElementById('txtGridEditField').focus()", 100);
				break;
			}
		}
	}
	currGrid.cellClick(this);
}

var checkBlur = true;
function GridPvtEditExpand()
{
	if (checkBlur)
	{
		var currTable = this.parentNode.parentNode.parentNode.parentNode;
		currTable.onblur = GridPvtEditDone;
		objectEvent(currTable, "blur", browser);
	}
}

function GridPvtExpandClick()
{
	checkBlur = false;
	var currCell = this.parentNode.parentNode.parentNode.parentNode.parentNode;
	this.parentNode.parentNode.childNodes[0].innerHTML = "<div noWrap style='width:" + this.parentNode.parentNode.childNodes[0].firstChild.style.width + ";overflow:hidden'>" + currCell.more(currCell) + "</div>";
	checkBlur = true;
	this.focus();
}

function GridPvtEditDone(e)
{
	currGrid = GridPvtFindRootObject(this.parentNode);	
	currGrid.CurrentCell = "";

	var currCell = this.parentNode;
	currCell.className = "GridCellOver";
	
	if (currCell.parentNode.childNodes[0].id == "indexCell")
	{
	    if (currCell.parentNode.childNodes[0].innerHTML.indexOf("rowEdit.gif") != -1)
		    currCell.parentNode.childNodes[0].innerHTML = currCell.parentNode.childNodes[0].childNodes[0].id;
    }
					
	switch (currCell.type)
	{
		case "CHECK":
		{
			if (this.checked == true)
				currCell.value = true;
			else
				currCell.value = false;

			if (currCell.oldValue != currCell.value)
				currGrid.editDone(currCell);
			break;
		}
		case "ELLIPSIS":
		{	
			var valueCell = this.childNodes[0].childNodes[0].childNodes[0];
			currCell.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>" + valueCell.firstChild.innerHTML + "</div>";
			if (currCell.oldValue != this.value)
			{
				currCell.value = currCell.firstChild.innerHTML;
				currGrid.editDone(currCell);
			}
			break;
		}
		case "ICON":
		{
		    //do nothing
		}
		default:
		{
			if (this.value == "" || this.value == null)
				currCell.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>&nbsp;</div>";
			else
				currCell.innerHTML = "<div noWrap style='width:100%;overflow:hidden'>" + this.value + "</div>";
			if (currCell.oldValue != this.value)
			{
				currCell.value = this.value;
				currGrid.editDone(currCell);
			}
			break;
		}
	}
	if (!e)
		var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) 
		e.stopPropagation();
    return false;
}

function GridPvtFindRootObject(currObject)
{
	while(currObject.tagName != "TABLE")
		currObject = currObject.parentNode;
	currObject = eval(replace(currObject.id, "tbl", ""));
	return currObject;
}