// JavaScript User Interface Objects - HTMLEdit
// By: Jonathan Wise
// Created: December 2004

// Public constructor
// To be called by hosting page to create a new instance of the editor
function htmleditNew(htmleditName, skinName, htmleditParent, rootDir)
{
	if (htmleditName == null || htmleditName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-HTMLEdit", skinName, rootDir);
	
	if (htmleditParent == null || htmleditParent == "" || htmleditParent == undefined)
		htmleditParent = document.body;
	if (typeof(htmleditParent) != "object")
		htmleditParent = document.getElementById(htmleditParent);
		
	var hFrame = document.createElement("IFRAME");
	hFrame.id = htmleditName;
	hFrame.style.width = "100%";
	hFrame.style.height= "100%";
	hFrame.style.backgroundColor = "white";
	hFrame.style.fontFamily = "Arial";
	htmleditParent.appendChild(hFrame);
	setTimeout("HTMLEditStartEdit('" + htmleditName + "')", 100);
	var heObject = HTMLEditPvtConstructHTMLEdit(htmleditName, hFrame, htmleditParent, rootDir);
	return heObject;
}

// Private constructor method
// Used to attach grid elements and methods to a given instance of the grid
function HTMLEditPvtConstructHTMLEdit(htmleditName, htmleditFrame, htmleditParent, rootDir)
{
	var tbObject;
	eval(htmleditName + ".element = htmleditFrame");	//element
	eval(htmleditName + ".getText = HTMLEditGetText");	//method
	eval(htmleditName + ".getHTML = HTMLEditGetHTML");	//method
	eval(htmleditName + ".getEncodedHTML = HTMLEditGetEncodedHTML");  //method
	eval(htmleditName + ".loadHTML = HTMLEditLoadHTML");  //method
	eval(htmleditName + ".loadHTMLFile = HTMLEditLoadHTMLFile");  //method
	eval(htmleditName + ".toggleView = HTMLEditToggleView");  //method
	eval(htmleditName + ".changeStyle = HTMLEditChangeStyle");	//method
	eval(htmleditName + ".changeFont = HTMLEditChangeFont");	//method
	eval(htmleditName + ".changeSize = HTMLEditChangeSize");	//method
	eval(htmleditName + ".changeColor = HTMLEditChangeColor");	//method
	eval(htmleditName + ".changeFormat = HTMLEditChangeFormat");	//method
	eval(htmleditName + ".insertLink = HTMLEditInsertLink");	//method
	eval(htmleditName + ".insertImage = HTMLEditInsertImage");	//method
	eval(htmleditName + ".insertElement = HTMLEditInsertElement");	//method
	eval(htmleditName + ".oncontextmenu = ''");	//private event
	eval(htmleditName + ".HTMLEditParent = htmleditParent");	//property
	eval(htmleditName + ".viewType = ''");	//private property
	eval(htmleditName + ".viewType = ''");	//private property
	eval(htmleditName + ".rootDir = rootDir");	//private property
	eval(htmleditName + ".lastPath = '" + document.location + "'");	//private property
	eval(htmleditName + ".lastLink = '" + document.location + "'");	//private property
	eval(htmleditName + ".lastImage = '" + document.location + "'");	//private property
	eval(htmleditName + ".id = htmleditName");	//private property
	eval("heObject = " + htmleditName);	//assignment
	return heObject;
}

//Private function
//Used to configure iframe and control problematic events
function HTMLEditStartEdit(htmleditName, documentCSS)
{
	var editor = document.getElementById(htmleditName);
	editor.contentWindow.document.designMode = 'on';
	eval(htmleditName + ".viewType = 'live'");
	if (browser == "IE")
	{
		//disable ctrl key
		editor.contentWindow.document.onkeydown = function()
		{
			HTMLEditCheckKey(editor.contentWindow.event);
		}
		
		//disable context menu
		// optionally call external function
		editor.contentWindow.document.oncontextmenu = function()
		{
			HTMLEditCheckMouse(editor.contentWindow.event);
			var userHandler = eval(htmleditName + ".oncontextmenu");
			if (userHandler != null && userHandler != "" && userHandler != undefined)
				userHandler();
		}
	}
	if (browser == "MOZ")
	{
		//disable ctrl key
		editor.contentWindow.document.addEventListener("keypress", HTMLEditCheckKey, false);
		
		//disable context menu
		// optionally call external function
		editor.contentWindow.document.addEventListener("contextmenu", HTMLEditCheckMouse, false);
		var userHandler = eval(htmleditName + ".oncontextmenu");
		if (userHandler != null && userHandler != "" && userHandler != undefined)
			editor.contentWindow.document.addEventListener("contextmenu", userHandler, false);
	}
}

//Disables the control key
function HTMLEditCheckKey(e)
{
	if (e.ctrlKey)
	{
		e.returnValue = false;
        e.cancelBubble = true;

        if(browser == "IE"){
            e.keyCode = 0;
        }else{ //NS
            e.preventDefault();
            e.stopPropagation();
        }
        return false;
	}
}

//Disables the right mouse button
function HTMLEditCheckMouse(e)
{
	e.returnValue = false;
    e.cancelBubble = true;

    if(browser == "IE"){
        e.keyCode = 0;
    }else{ //NS
        e.preventDefault();
        e.stopPropagation();
    }
    return false;
}

// Private method with public pointer
// Used to load html into the editor
function HTMLEditLoadHTML(html)	//public name: loadHTML
{
	this.viewType = "live";
	this.element.contentWindow.document.body.innerHTML = html;
}

// Private method with public pointer
// Used to load html into the editor from a path
function HTMLEditLoadHTMLFile(path) //public name: loadHTMLFile
{
	this.viewType = "live";
	if (path == null || path == "" || path == undefined)
	{
		path = prompt("Please enter the URL to open for editing:", this.lastPath);
	}
	if (path != null)
	{
		if (browser == "IE")
		{
			var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			if (getHost(path) != document.location.host)
			{
				try 
				{
					xmlhttp.Open("GET", path, false);
				}
				catch(e)
				{
					return false;
				}
			}
			else
				xmlhttp.Open("GET", path, false);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send();
			this.element.contentWindow.document.body.innerHTML = xmlhttp.responseText;
		}
		
		//moz
		if (browser == "MOZ")
		{
			if (getHost(path) != document.location.host)
			{
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				}
				catch (e) {
					return false;
				}
			}
			//connect to url
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open ("GET", path, false);
			xmlhttp.send(null);
			this.element.contentWindow.document.body.innerHTML = xmlhttp.responseText
		}
		
		this.lastPath = path;
	}
}

// Private method with public pointer
// Used to switch between code and live (WYSIWYG) views
function HTMLEditToggleView() //public name: toggleView
{
	var frameContent = this.element.contentWindow.document.body;
	switch(this.viewType)
	{
		case "live":
		{
			this.viewType = "code";
			if (browser == "IE")
			{	
				frameContent.innerText = frameContent.innerHTML;
			}
			if (browser == "MOZ")
			{
				var html = document.createTextNode(frameContent.innerHTML);
				frameContent.innerHTML = "";
				frameContent.appendChild(html);
			}
			break;
		}
		case "code":
		{
			this.viewType = "live";
			if (browser == "IE")
			{	
				frameContent.innerHTML = frameContent.innerText;
			}
			if (browser == "MOZ")
			{
				var html = frameContent.ownerDocument.createRange();
				html.selectNodeContents(frameContent);
				frameContent.innerHTML = html.toString();
			}
			break;
		}
	}
}

// Private method with public pointer
// Used to get the text value in the editor
function HTMLEditGetText(type)	//public name: getText
{
	var wasCode = false;
	if (this.viewType == "code" && !type)
	{
		wasCode = true;
		this.toggleView();
	}
	
	var returnText = "";
	var frameContent = this.element.contentWindow.document.body;
	if (browser == "IE")
		returnText = frameContent.innerText;
	if (browser == "MOZ")
	{
		var content = frameContent.ownerDocument.createRange();
		content.selectNodeContents(frameContent);
		returnText = content.toString();
	}
	
	if (wasCode == true)
		this.toggleView();
	return returnText;
}

// Private method with public pointer
// Used to get the html value in the editor
function HTMLEditGetHTML()	//public name: getHTML
{
	if (this.viewType == "code")
		return this.getText("code");
	else
		return this.element.contentWindow.document.body.innerHTML;
}

// Private method with public pointer
// Used to get the encoded html value in the editor
function HTMLEditGetEncodedHTML()	//public name: getHTML
{
	if (this.viewType == "code")
		return HTMLEncode(this.getText("code"));
	return HTMLEncode(this.element.contentWindow.document.body.innerHTML);
}

// Private method with public pointer
// Used to change text style
function HTMLEditChangeStyle(style)	//public name: changeStyle
{
	if (this.viewType == "live")
	{
		if (browser == "MOZ")
			document.getElementById(this.id).contentWindow.document.execCommand('useCSS', false, null);
		if (style == null || style == "" || style == undefined)
			document.getElementById(this.id).contentWindow.document.execCommand('removeformat', false, null);
		else
			document.getElementById(this.id).contentWindow.document.execCommand(style, false, null);
	}
}

// Private method with public pointer
// Used to change text font
function HTMLEditChangeFont(font)	//public name: changeFont
{
	if (this.viewType == "live")
	{
		if (browser == "MOZ")
			document.getElementById(this.id).contentWindow.document.execCommand('useCSS', false, null);
		document.getElementById(this.id).contentWindow.document.execCommand("fontname", false, font);
	}
}

// Private method with public pointer
// Used to change text size
function HTMLEditChangeSize(size)	//public name: changeSize
{
	if (this.viewType == "live")
	{
		if (browser == "MOZ")
			document.getElementById(this.id).contentWindow.document.execCommand('useCSS', false, null);
		document.getElementById(this.id).contentWindow.document.execCommand("fontsize", false, size);
	}
}

// Private method with public pointer
// Used to change text format
function HTMLEditChangeFormat(format)	//public name: changeFormat
{
	if (this.viewType == "live")
	{
		if (browser == "MOZ")
			document.getElementById(this.id).contentWindow.document.execCommand('useCSS', false, null);
		document.getElementById(this.id).contentWindow.document.execCommand("formatblock", false, "<" + format + ">");
	}
}

// Private method with public pointer
// Used to change text color
function HTMLEditChangeColor(colour)	//public name: changeColor
{
	if (this.viewType == "live")
	{
		if (browser == "MOZ")
			document.getElementById(this.id).contentWindow.document.execCommand('useCSS', false, null);
		document.getElementById(this.id).contentWindow.document.execCommand("ForeColor", false, colour);
	}
}

// Private method with public pointer
// Used to insert a link
function HTMLEditInsertLink(link)	//public name: insertLink
{
	if (this.viewType == "live")
	{
		if (link != null || link != "" || link != undefined)
		{
			document.getElementById(this.id).contentWindow.focus();
			if (browser == "MOZ")
			{
				link = prompt("Please enter the URL to link to:", this.lastLink);
				if (link != null)
					document.getElementById(this.id).contentWindow.document.execCommand('createlink', false, link);
			}
			if (browser == "IE")
				document.getElementById(this.id).contentWindow.document.execCommand('createlink', true, null);	
		}	
		else
			document.getElementById(this.id).contentWindow.document.execCommand('createlink', false, link);
		this.lastLink = link;
	}
}

// Private method with public pointer
// Used to insert a link
function HTMLEditInsertImage(path, width, height, align)	//public name: insertLink
{
	if (this.viewType == "live")
	{
		document.getElementById(this.id).contentWindow.focus();
		if (path != null || path != "" || path != undefined)
			path = prompt("Please enter the URL of the image you want to use:", this.lastImage);
		if (path != null)
		{
			var nImg = document.getElementById(this.id).contentWindow.document.createElement("img");
			nImg.src = path;
			if (width != null && width != "")
				nImg.width = width;
			if (height != null && height != "")
				nImg.height = height;
			if (align != null && align != "")
				nImg.align = align;
			insertNodeAtSelection(document.getElementById(this.id).contentWindow, nImg);
			this.lastImage = path;
		}			
	}
}

// Private method with public pointer
// Used to insert a link
function HTMLEditInsertElement(element)	//public name: insertElement
{
	if (this.viewType == "live")
	{
		if (element != null && element != "" && element != undefined)
		{
			document.getElementById(this.id).contentWindow.focus();
			insertNodeAtSelection(document.getElementById(this.id).contentWindow, element);
		}
	}
}

// Private function for injecting code for use with Mozilla
// Taken from the Mozilla Midas Demo
// http://www.mozilla.org/editor/midasdemo/
// Modified for use with IE by Jonathan Wise, 2004
function insertNodeAtSelection(win, insertNode)
{
	if (browser == "IE")
	{
		var tr = win.document.selection.createRange();
		tr.pasteHTML(insertNode.outerHTML);
	}
	if (browser == "MOZ")
	{
		var sel = win.getSelection();
		var range = sel.getRangeAt(0);
		sel.removeAllRanges();
		range.deleteContents();
		var container = range.startContainer;
		var pos = range.startOffset;
		range=document.createRange();
		if (container.nodeType==3 && insertNode.nodeType==3) 
		{
			container.insertData(pos, insertNode.nodeValue);
			range.setEnd(container, pos+insertNode.length);
			range.setStart(container, pos+insertNode.length);
		} 
		else 
		{
			var afterNode;
			if (container.nodeType==3) 
			{
				var textNode = container;
				container = textNode.parentNode;
				var text = textNode.nodeValue;
				var textBefore = text.substr(0,pos);
				var textAfter = text.substr(pos);
				var beforeNode = document.createTextNode(textBefore);
				var afterNode = document.createTextNode(textAfter);
				container.insertBefore(afterNode, textNode);
				container.insertBefore(insertNode, afterNode);
				container.insertBefore(beforeNode, insertNode);
				container.removeChild(textNode);
			}
			else
			{
				afterNode = container.childNodes[pos];
				container.insertBefore(insertNode, afterNode);
			}
			range.setEnd(afterNode, 0);
			range.setStart(afterNode, 0);
		}
		sel.addRange(range);
	}
}
