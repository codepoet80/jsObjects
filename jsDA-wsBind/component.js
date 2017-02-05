// JavaScript Data Access Objects - Webservice Bind
// By: Jonathan Wise
// Created: July 2004

// Public constructor
// To be called by hosting page to create a new instance of the binder
var browser;
if (document.all)
	browser = "IE";
else
	browser = "MOZ";
		
function wsbindNew(wsbindName, wsURL, callBack)
{
	if (wsbindName == null || wsbindName == "")
		return false;

	var wsObject = wsbindPvtConstructwsbind(wsbindName, wsURL, callBack);
	return wsObject;
}

// Private constructor method
// Used to build the binder functions and properties
function wsbindPvtConstructwsbind(wsbindName, wsURL)
{
	var wsObject = new Object();
	//Add local members
	eval(wsbindName + ".describe = wsbindPubDescribe");	//method
	eval(wsbindName + ".url = wsURL");	//property
	//assignment and webservice functions
	eval("wsObject = " + wsbindName);	//assignment
	//try
	//{
		if (browser == "IE")
			wsObject = wsbindPvtBindIE(wsObject, wsURL, wsbindName);
		else
			wsObject = wsbindPvtBindMOZ(wsObject, wsURL, wsbindName);
	//}
	//catch(e)
	//{
	//	alert ("Unable to parse the web service response, could not bind to this service.");
	//}
	return wsObject;
}

// Used to bind the object to a webservice - IE Version
function wsbindPvtBindIE(wsObject, wsURL, wsbindName)
{
	//connect to url
	var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	if (getHost(wsURL) != document.location.host)
	{
		try 
		{
			xmlhttp.Open("GET", wsURL + "?WSDL", false);
		}
		catch(e)
		{
			return false;
		}
	}
	else
		xmlhttp.Open("GET", wsURL + "?WSDL", false);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send();
	
	//retreive wsdl information
	var wsdDoc = new ActiveXObject("MSXML2.DOMDocument");
	wsdDoc.async = false;
	wsdDoc.loadXML(replace(xmlhttp.responseText, "wsdl:", ""));
	wsRoot = wsdDoc.selectSingleNode("//definitions");
	wsObject.methods = new Object();
	wsObject.wsdl = wsRoot.xml;
	wsObject.namespace = wsRoot.attributes.getNamedItem("targetNamespace").value;
	wsRoot = wsdDoc.selectSingleNode("//service");
	wsObject.serviceName = wsRoot.attributes.getNamedItem("name").value;
	wsRoot = wsdDoc.selectSingleNode("//service/documentation");	
	if (wsRoot != null)
		wsObject.documentation = wsRoot.text;
	else
		wsObject.documentation = "not found";
	
	//find functions
	var nlMethods = wsdDoc.selectNodes("//definitions/binding/operation");
	for (var n=0;n<nlMethods.length;n++)
	{
		//find method members
		var nlElements = wsdDoc.selectNodes("//definitions/types/s:schema/s:element")
		for (var e=0;e<nlElements.length;e++)
		{
			if (nlElements[e].attributes.getNamedItem("name").value == nlMethods[n].attributes.getNamedItem("name").value)
			{
				var functionName = nlElements[e].attributes.getNamedItem("name").value;
				eval("wsObject.methods." + functionName + " = new Object()");
				var newFunction = nlElements[e].attributes.getNamedItem("name").value + "(";
				var membersDoc = new ActiveXObject("MSXML2.DOMDocument");
				membersDoc.async = false;
				membersDoc.loadXML(nlElements[e].xml);
				var nlParams = membersDoc.selectNodes("//s:sequence/s:element")
	
				for (var p=0;p<nlParams.length;p++)
				{
					type = "";
					if (nlParams[p].attributes.getNamedItem("type") != null)
						type = replace(nlParams[p].attributes.getNamedItem("type").value, "s:", "");
					eval("wsObject.methods." + functionName + "." + nlParams[p].attributes.getNamedItem("name").value + "='" + type + "'");
				}
			}	
		}
		//add function to method
		var functionBody = new Function("return wsbindServiceCall('" + functionName + "', arguments, this)");
		eval("wsObject." + functionName + " = functionBody");
	}
	return wsObject;
}

// Used to bind the object to a webservice - Mozilla version
function wsbindPvtBindMOZ(wsObject, wsURL, wsbindName)
{
    if (wsURL.indexOf("http://") != -1)
    {
	    if (getHost(wsURL) != document.location.host)
	    {
		    try {
			    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		    }
		    catch (e) {
		    	return false;
		    }
	    }
	}
	//connect to url
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open ("GET", wsURL + "?WSDL", false);
	xmlhttp.send(null);
	xmlParser = new DOMParser();
	var responseText = replace(xmlhttp.responseText, "wsdl:", "");
	responseText = replace(responseText, "<?xml version=\"1.0\" encoding=\"utf-8\"?>", "");
    wsdDoc = xmlParser.parseFromString(responseText, 'text/xml');

    var wsRoot = wsdDoc.getElementsByTagName("definitions");
    wsObject.methods = new Object();
	wsObject.wsdl = wsdDoc.xml;
    wsObject.namespace = wsRoot[0].getAttribute("targetNamespace");
    wsRoot = wsdDoc.getElementsByTagName("service");
    wsObject.serviceName = wsRoot[0].getAttribute("name");
	try
	{
		wsRoot = wsRoot[0].getElementsByTagName("documentation");
		wsObject.documentation = wsRoot[0].firstChild.nodeValue;
	}
	catch(e)
	{
		wsObject.documentation = "";
	}

	var nlMethods = wsdDoc.getElementsByTagName("definitions");
	nlMethods = nlMethods[0].getElementsByTagName("binding");
	nlMethods = nlMethods[0].getElementsByTagName("operation");
	for (var n=0;n<nlMethods.length;n++)
	{
		var nlElements = wsdDoc.getElementsByTagName("definitions");
		nlElements = nlElements[0].getElementsByTagName("types");
		nlElements = nlElements[0].getElementsByTagName("schema");
		nlElements = nlElements[0].getElementsByTagName("element");
		for (var e=0;e<nlElements.length;e++)
		{
			if (nlElements[e].getAttribute("name") == nlMethods[n].getAttribute("name") && nlMethods[n].getAttribute("name") != null)
			{
				var functionName = nlElements[e].getAttribute("name");
				eval("wsObject.methods." + functionName + " = new Object()");
				var newFunction = nlElements[e].getAttribute("name") + "(";
				var nlParams = nlElements[e].getElementsByTagName("sequence");
				if (nlParams.length > 0)
					nlParams = nlParams[0].getElementsByTagName("element");
				for (var p=0;p<nlParams.length;p++)
				{
					type="";
					if (nlParams[p].getAttribute("type") != null)
						type = replace(nlParams[p].getAttribute("type"), "s:", "");
					eval("wsObject.methods." + functionName + "." + nlParams[p].getAttribute("name") + "='" + type + "'");
				}
			}
		}
		//add function to method
		var functionBody = new Function("return wsbindServiceCall('" + functionName + "', arguments, this)");
		eval("wsObject." + functionName + " = functionBody");
	}
	return wsObject;
}

// Private method with a public pointer
// Used to return a service description
function wsbindPubDescribe(describeType)
{
	if (describeType == null || describeType == "" || describeType == "basic")
	{
		var msg = "";
		var currObject = this.methods;
		for (var i in currObject)
		{
			msg += i + "(";
			var tcount = 0;
			var count = 0;
			for (var m in currObject[i])
				tcount++;

			for (var m in currObject[i])
			{
				count++;
				msg += currObject[i][m]+ " ";
				msg += m;
				if (count < tcount)
					msg += ",";
			}
			msg += ")\n";
		}
		return (msg);
	}
	else
		return this.wsdl;
}

// Private method with multiple public pointers
// The handler for all instances a javascript webservice function - IE Version
function wsbindServiceCall(caller, args, objSender, callBack)
{
	wsCall = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
	wsCall += "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
	wsCall += "<soap:Body>";
	wsCall += "<" + caller + " xmlns=\"" + objSender.namespace + "\">";
	for (var i in objSender.methods)
	{
		if (i == caller)
		{
			var a=0;
			for (var m in objSender.methods[i])
			{
				wsCall += "<" + m + ">";
				wsCall += args[a];
				wsCall += "</" + m + ">";
				a++;
			}
		}
	}
	wsCall += "</" + caller + ">"
	wsCall += "</soap:Body>";
	wsCall += "</soap:Envelope>";
	if (args.length > a)
		var callBack = args[args.length-1];
	if (browser == "IE")
		var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	else
		var xmlhttp = new XMLHttpRequest();
	if (callBack)
	{
		xmlhttp.open("POST",objSender.url, true);
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == 4)
			{
				if (browser == "IE")
					callBack(xmlhttp.responseXML.xml);
				else
				{
					callBack(xmlhttp.responseText);
				}
			}
		}
	}
	else
		xmlhttp.open("POST",objSender.url, false);

	xmlhttp.setRequestHeader("Host", getHost(objSender.url));
	xmlhttp.setRequestHeader("Content-type", "text/xml");
	xmlhttp.setRequestHeader("SOAPAction", objSender.namespace + "/" + caller);
	//alert (wsCall);
	xmlhttp.send(wsCall);
	if (!callBack)
	{
		if (browser == "IE")
			return xmlhttp.responseXML.xml;
		else
			return xmlhttp.responseText;
	}
	else
		return wsCall;
}

//For Mozilla compatibility
if (browser == "MOZ")
{
	Node.prototype.__defineGetter__("xml", _Node_getXML);
}
function _Node_getXML() 
{
    var objXMLSerializer = new XMLSerializer;
    var strXML = objXMLSerializer.serializeToString(this);
    return strXML;
}