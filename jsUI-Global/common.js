var browser;
if (document.all)
	browser = "IE";
else
	browser = "MOZ";

function replace(oldString, findString, replaceString)
{
	stringParts = oldString.split(findString);
	newString = "";
	for (s=0;s<stringParts.length;s++)
	{
		newString += stringParts[s];
		if (s < stringParts.length - 1)
			newString += replaceString;
	}	
	return newString;
}

function objectEvent(target, eventType, currbrowser)
{
	var ieEvent, mozEvent;
	if(!currbrowser)
	    currbrowser = browser;
	if (typeof(target)!="object")
		target = document.getElementById(target);
	try
	{
	    //standardize event names
	    if (eventType.indexOf("on") != -1)
	    {
	        ieEvent = eventType;
	        mozEvent = replace(eventType, "on", "");
	    }
	    else
	    {
	        ieEvent = "on" + eventType;
	        mozEvent = eventType;
	    }
    	
	    if (currbrowser == "IE")
	    {
		    target.fireEvent(ieEvent);
		    return true;
		}
	    else
	    {
		    oEvent = document.createEvent("MouseEvents");
		    oEvent.initMouseEvent(
		    mozEvent,    // the type of mouse event
		    true,       // do you want the event to
					    // bubble up through the tree?  (sure)
		    true,       // can the default action for this
					    // event, on this element, be cancelled? (yep)
		    window,     // the 'AbstractView' for this event,
					    // which I took to mean the thing sourcing
					    // the mouse input.  Either way, this is
					    // the only value I passed that would work
		    1,          // details -- for 'click' type events, this
					    // contains the number of clicks. (single click here)
		    1,          // screenXArg - I just stuck 1 in cos I
					    // really didn't care
		    1,          // screenYArg - ditto
		    1,          // clientXArg - ditto
		    1,          // clientYArg - ditto
		    false,      // is ctrl key depressed?
		    false,      // is alt key depressed?
		    false,      // is shift key depressed?
		    false,      // is meta key depressed?
		    0,          // which button is involved?
					    // I believe that 0 = left, 1 = right,
					    // 2 = middle
		    target      // the originator of the event
					    // if you wanted to simulate a child
					    // element firing the event you'd put
					    // its handle here, and call this method
					    // on the parent catcher.  In this case,
					    // they are one and the same.
		    );
		    target.dispatchEvent(oEvent);
	    }
	    return true;
    }
    catch(ex)
    {
        return false;
    }
}

function getAllDescendants(node, tagName)
{
	if (tagName != null && tagName != "" && tagName != undefined)
		tagName = tagName.toUpperCase();
	else
		tagName = "ALL";
	
	if (typeof(node)!="object")
		node = document.getElementById(node);

	var objArray = new Array();
	for(var c=0;c<node.childNodes.length;c++)
	{
		if (node.childNodes[c].tagName == tagName || tagName == "ALL" && node.childNodes[c].tagName != undefined)
		{
			objArray[objArray.length] = node.childNodes[c];
		}
		if (node.childNodes[c].childNodes.length > 0)
		{
			var subChildren = getAllDescendants(node.childNodes[c], tagName);
			for (var s=0;s<subChildren.length;s++)
				objArray[objArray.length] = subChildren[s];
		}	
	}
	return objArray;
}

function doNothing()
{
	return false;
}

function getHost(url)
{
    url = url + "";
	url = url.split("/");
	return url[2];	
}

function getQueryString(path)
{
	var queryString = new Object();
	if (path == null || path == "" || path == undefined)
		path = document.location + "";
	var pathParts = path.split("?");
	if (pathParts.length > 1)
	{
		pathParts = pathParts[1].split("&");
		for (var p=0;p<pathParts.length;p++)
		{
			var paramParts = pathParts[p].split("=");
			if (paramParts.length > 1)
			{
			    paramParts[1] = replace(paramParts[1], "%20", " ");
				eval ("queryString." + paramParts[0] + "=\"" + paramParts[1] + "\"");
			}
		}
	}
	return queryString;
}

function serializeObject(currObject)
{
	var XMLString = "";
	for (var i in currObject)
	{
		var nodeType = typeof(currObject[i]);
		if (nodeType != "object" && currObject[i] != null)
			XMLString += "<" + nodeType + " name=\"" + i + "\" value=\"" + currObject[i] + "\"/>";
		else
        {
            try
            {
                if(currObject.getDate())
			        nodeType = "date";
			}
            catch(e)
            {
                if (currObject[i] != null)
                {
			        if (typeof(currObject[i].length)!=undefined)
				        nodeType = "array";
			        else
				        nodeType = "object";
				}
		    }
		    if (currObject[i] != null)
			    XMLString += "<" + nodeType + " name=\"" + i + "\">";
			if (nodeType != "date" && currObject[i] != null)
			    XMLString += serializeObject(currObject[i]);
			else
			{
			    if (currObject[i] != null)
			        XMLString += currObject[i];
			}
			if (currObject[i] != null)
    			XMLString += "</" + nodeType+ ">";
		}
	}
	return XMLString;
}

function getFormData(startNode)
{
    if (startNode == null || startNode == undefined || startNode == "")
        startNode = document.body;
    if (typeof(startNode)!="object")
		startNode = document.getElementById(startNode);
    try
    {
	    var childArray = new Array();
	    childArray = getAllDescendants(startNode);
	    var dataObj = new Object();
	    for (var c=0;c<childArray.length;c++)
	    {
		    if (childArray[c].id != null && childArray[c].id != "")
		    {
			    var tagType;
			    tagType = childArray[c].tagName.toUpperCase();
			    switch(tagType)
			    {
				    case "INPUT":
				    {
					    var inputObj = new Object();
					    inputObj.type = childArray[c].type;
					    inputObj.id = childArray[c].id;
					    if (childArray[c].type.toLowerCase() == "checkbox")
					        inputObj.value = childArray[c].checked;
					    else
					        inputObj.value = HTMLEncode(childArray[c].value);
					    if (childArray[c].attributes.getNamedItem("datatype") != null && childArray[c].attributes.getNamedItem("datatype") != "" && childArray[c].attributes.getNamedItem("datatype") != undefined)
						    inputObj.datatype = childArray[c].attributes.getNamedItem("datatype").value;
					    eval("dataObj." + childArray[c].id + "= new Object();");
					    eval("dataObj." + childArray[c].id + "= inputObj;");
					    break;
				    }
				    case "SELECT":
				    {
				        var inputObj = new Object();
					    inputObj.type = "select";
					    inputObj.id = HTMLEncode(childArray[c].id);
					    //inputObj.value = childArray[c].options[childArray[c].selectedIndex].value;
					    inputObj.value = childArray[c].value;
					    eval("dataObj." + childArray[c].id + "= new Object();");
					    eval("dataObj." + childArray[c].id + "= inputObj;");
					    break;
				    }
				    case "TEXTAREA":
				    {
				        var inputObj = new Object();
					    inputObj.type = "textarea";
					    inputObj.id = childArray[c].id;
					    inputObj.value = replace(HTMLEncode(childArray[c].value), "\r\n", "&linebreak;");
					    eval("dataObj." + childArray[c].id + "= new Object();");
					    eval("dataObj." + childArray[c].id + "= inputObj;");
					    break;
				    }
				    case "TABLE":
				    {
					    if (childArray[c].className == "GridMain")
					    {  
					        var gridName = replace(childArray[c].id, "tbl", "");
						    var data = eval(gridName + ".getGridData()");
						    eval("dataObj." + gridName + "= new Object();");
						    eval("dataObj." + gridName + "= data;");
					    }
					    break;
				    }
			    }
		    }
	    }
	    return dataObj;
	}
    catch(e)
    {
        alert (e.message);
    }
}

function HTMLEncode(htmldata)
{
	htmldata = replace(htmldata, "<", "&lt;");
	htmldata = replace(htmldata, ">", "&gt;");
	//htmldata = replace(htmldata, "\"", "'");
	htmldata = replace(htmldata, "#", "&#163;");
	htmldata = replace(htmldata, "&", "&amp;");
	return htmldata;
}

function xmlDecode(xmldata)
{
	xmldata = replace(xmldata, "&amp;", "&");
	xmldata = replace(xmldata, "&lt;", "<");
	xmldata = replace(xmldata, "&gt;", ">");
	xmldata = replace(xmldata, "&#163;", "#");
	xmldata = replace(xmldata, "&#x0024;", "$");
	return xmldata;
}