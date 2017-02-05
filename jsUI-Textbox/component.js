// JavaScript User Interface Objects - Textbox
// By: Jonathan Wise
// Created: January 2005

// Public constructor
// To be called by hosting page to create a new instance of the textbox object
function textboxNew(textboxName, skinName, textboxParent, rootDir)
{
	if (document.all)
		browser = "IE";
	else
		browser = "MOZ";
		
	if (textboxName == null || textboxName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	if (skinName != null)
	    jsUIGblAddSkin("jsUI-Textbox", skinName, rootDir);
	
	if (textboxParent == null || textboxParent == "" || textboxParent == undefined)
		textboxParent = document.body;
	if (typeof(textboxParent) != "object")
		textboxParent = document.getElementById(textboxParent);
		
	var tbObject = TextboxPvtConstructTextbox(textboxName, textboxParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach taskbar elements and methods to a given instance of the taskbar
function TextboxPvtConstructTextbox(textboxName, textboxParent, rootDir)
{
	var tbObject;
	eval(textboxName + ".id = '" + textboxName + "'");	//property
	eval(textboxName + ".keyPress = TextboxPvtKeyPress");	//private method
	eval(textboxName + ".disable = TextboxPubDisable");	//public method
	eval(textboxName + ".enable = TextboxPubEnable");	//public method
	eval(textboxName + ".formatNumeric = TextboxPubFormatNumeric");	//public method
	eval(textboxName + ".keyFailed = doNothing");	//event
	eval(textboxName + ".rootDir = rootDir");	//private property
	eval("tbObject = " + textboxName);	//assignment
	
	var childArray = new Array();
	childArray = getAllDescendants(textboxParent, "INPUT");
	for (var c=0;c<childArray.length;c++)
	{
		if (childArray[c].attributes.getNamedItem("datatype") != null && childArray[c].attributes.getNamedItem("datatype") != "" && childArray[c].attributes.getNamedItem("datatype") != undefined)
		{
			if (childArray[c].attributes.getNamedItem("datatype").value == "readonly")
			{
				childArray[c].className="TextBoxInputDisabled";
				childArray[c].onfocus=TextboxPrivateTabOff;
			}
			else
				childArray[c].className="TextBoxInput";
			if (browser == "IE")
			{
				childArray[c].attachEvent("onkeypress", eval(textboxName + ".keyPress"));
			}
			if (browser == "MOZ")
			{
				childArray[c].addEventListener("keypress", eval(textboxName + ".keyPress"), true);
			}
            var attrChecker = document.createAttribute("datachecker");
            attrChecker.value = textboxName;
            childArray[c].attributes.setNamedItem(attrChecker);
		}
	}
	childArray = getAllDescendants(textboxParent, "SPAN");
	for (var c=0;c<childArray.length;c++)
	{
		if (childArray[c].className=="TextBoxCaption" || childArray[c].className=="TextBoxCaptionDisabled")
		{
			childArray[c].onfocus=TextBoxPrivateCaptionFocusOff;
		}
	}
	return tbObject;
}

function TextboxPubDisable(target)
{

}

function TextboxPubEnable(target)
{

}

function TextBoxPrivateCaptionFocusOff(e)
{
	if (!e)
		e = window.event;
	if (!e.target)
		target = e.srcElement;
	else
		target = e.target;
	try
	{
	    target.nextSibling.nextSibling.focus();
	}
	catch(e)
	{
	    //do nothing
	}
}

function TextboxPrivateTabOff(e)
{
	if (!e)
		e = window.event;
	if (!e.target)
		target = e.srcElement;
	else
		target = e.target;
	var siblings = getAllDescendants(document.body, "INPUT");
	for (var s=0;s<siblings.length;s++)
	{
		if (siblings[s].id == target.id)
		{
			if (e.shiftKey == true && browser != "MOZ")
			{
				if (siblings[s-1] != null)
					siblings[s-1].focus();
			}
			else
			{
				if (siblings[s+1] != null)
					siblings[s+1].focus();
				
			}
		}
	}

}

// Private method with a public pointer
// Used to check the textbox on before the key appears
function TextboxPvtKeyPress(e)	//public name: keyPress
{
	var keyCode;
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

	var datatype = obj.attributes.getNamedItem("datatype").value.toLowerCase();
	var rootObj = obj.attributes.getNamedItem("datachecker").value;
	rootObj = eval(rootObj);
	var maxLength;
	var maxDecimals;
	try
	{
		maxLength = obj.attributes.getNamedItem("datalength").value.toLowerCase();
	}
	catch(exception)
	{
		maxLength = "9999999";
	}
	var key = String.fromCharCode(keyCode);
	switch (datatype)
	{
		case "any":
		{
			break;
		}
		case "integer":
		{
			if(!TextboxPvtCheckInteger(key, keyCode, maxLength, obj))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "float":
		{
			if(!TextboxPvtCheckFloat(key, keyCode, maxLength, obj))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "alphanumeric":
		{
			if(!TextboxPvtCheckAlphaNumeric(key, keyCode, maxLength, obj))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "alpha":
		{
			if(!TextBoxPvtCheckAlpha(key, keyCode, maxLength, obj))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "readonly":
		{
			if (browser == "IE")
				e.returnValue = false;
			if (browser == "MOZ")
			{
				e.stopPropagation();
				e.preventDefault();
			}
			try
			{
				rootObj.keyFailed(key, keyCode, obj.id);
			}
			catch(e)
			{
				//do nothing
			}
			break;
		}
		case "date":
		{
			if(!TextboxPvtCheckDateTime(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "monthyear":
		{
			if(!TextboxPvtCheckMonthYear(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "datetime":
		{
			if(!TextboxPvtCheckDateTime(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "time":
		{
			if(!TextboxPvtCheckTime(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "phonenumber":
		{
			if(!TextboxPvtCheckPhoneNumber(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "creditcard":
		{
			if(!TextboxPvtCheckCreditCard(key, keyCode, maxLength, obj, datatype))
			{
				if (browser == "IE")
					e.returnValue = false;
				if (browser == "MOZ")
				{
					e.stopPropagation();
					e.preventDefault();
				}
				try
				{
				    rootObj.keyFailed(key, keyCode, obj.id);
				}
				catch(e)
				{
				    //do nothing
				}
			}
			break;
		}
		case "keycodes":
		{
			obj.value += keyCode + " ";
			return false;
			break;
		}
	}
}

function TextboxPvtCheckInteger(key, keyCode, maxLength, obj)
{
	//allow modify characters
	if (obj.value.indexOf("-") != -1)
		maxLength++;
	
	if ((keyCode <  48 || keyCode > 57) && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 45)
		return false;
	if (obj.value.length > 0 && keyCode == 45)
		return false;
	
	if (obj.value.length >= maxLength && keyCode !=13 && keyCode != 8 && keyCode != 0)
		return false;
	return true;
}

function TextboxPvtCheckFloat(key, keyCode, maxLength, obj)
{
    var maxDecimals;
    if (maxLength.indexOf(".") != -1)
	{
		maxLength = maxLength.split(".");
		maxDecimals = maxLength[maxLength.length-1]*1;
		maxLength = maxLength[0]*1;
	}
	//allow modify characters
	if (obj.value.indexOf("-") != -1)
		maxLength++;
	if (obj.value.indexOf(".") != -1)
		maxLength++;
	if (obj.value.length > 0 && keyCode == 45)
		return false;
	if (obj.value.indexOf(".") != -1 && keyCode == 46)
		return false;
	if ((keyCode <  48 || keyCode > 57) && keyCode !=13 && keyCode !=46 && keyCode !=45 && keyCode != 8 && keyCode != 0)
		return false;
	var currVal = obj.value.split(".");
	if (currVal.length > 1)
	{
	    if (currVal[currVal.length-1].length >= maxDecimals)
	        return false;
	}
	if (currVal[0].length >= maxLength && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 46)
		return false;
	return true;
}

function TextboxPvtCheckAlphaNumeric(key, keyCode, maxLength, obj)
{
	if (((keyCode < 65 || (keyCode > 90 && keyCode < 97) || keyCode > 122) && (keyCode <  48 || keyCode > 57)) && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	
	if (obj.value.length >= maxLength && keyCode !=13 && keyCode != 8 && keyCode != 0)
		return false;
	return true;
}

function TextBoxPvtCheckAlpha(key, keyCode, maxLength, obj)
{
	if (keyCode < 65 || (keyCode > 90 && keyCode < 97) || keyCode > 122 && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false
	
	if (obj.value.length >= maxLength && keyCode !=13 && keyCode != 8 && keyCode != 0)
		return false;
	return true;
}

function TextboxPvtCheckDateTime(key, keyCode, maxLength, obj, datatype)
{
	if ((keyCode <  48 || keyCode > 57) && keyCode != 47 && keyCode != 58 && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	if (keyCode == 32)
	{
		if (obj.value.length != 10)
			return false
	}
	if (keyCode == 47) //If they add slashes
	{
		if (obj.value.length == 1)
		{
			obj.value = "0" + obj.value + "/";
			return false;
		}
		if (obj.value.length == 2 || obj.value.length == 3)
		{
			return true;
		}
		else if (obj.value.length == 4)
		{
			var valPart1 = obj.value.substr(0, obj.value.length-1);
			var valPart2 = obj.value.substr(obj.value.length-1, obj.value.length);
			obj.value = valPart1 + "0" + valPart2 + "/";
			return false;
		}
		else
			return false;
	}
	if (keyCode == 58 && obj.value.length < 10)
		return false;
	else
	{
		if (obj.value.length == 1)
		{
			if ((obj.value * 1) > 1)
				return false;
			if (key > 2 && (obj.value * 1) > 0)
				return false;
			obj.value = obj.value + "" + key + "/";
			return false;
		}
		if (obj.value.length == 2)
		{
			obj.value += "/"+ key;
			return false;
		}
		if (obj.value.length == 4)
		{
			valPart = obj.value.split("/");
			monthPart = valPart[0];
			var maxDays;
			if (monthPart == "01" || monthPart == "03" || monthPart == "05" || monthPart == "07" || monthPart == "08" || monthPart == "10" || monthPart == "12")
				maxDays = 31;
			if (monthPart == "04" || monthPart == "06" || monthPart == "09" || monthPart == "11")
				maxDays = 30;
			if (monthPart == "02")
				maxDays = 28;
			valPart = valPart[valPart.length-1];
			if ((valPart * 1) > 3)
				return false;
			if (((valPart + "" + key) * 1) > maxDays)
				return false;
			obj.value = obj.value + "" + key + "/";
			return false;
		}
		if (obj.value.length == 5)
		{
			if (key != "/")
			{
				obj.value += "/" + key;
				return false;
			}
		}
		if (obj.value.length == 9 && datatype == "datetime")
		{
			obj.value = obj.value + "" + key + " ";	
			return false;
		}
		if (obj.value.length >= 10 && datatype == "date")
			return false;
		if (obj.value.length == 10 && datatype == "datetime")
		{
			if (keyCode != 8)
			{
				obj.value += " ";
				if (keyCode != 32)
					obj.value += key;
				return false;
			}
			return true;
		}
		if (obj.value.length == 11)
		{
			if ((key * 1) > 2)
				return false;
		}
		if (obj.value.length == 12)
		{
			valPart = obj.value.split(" ");
			if (keyCode == 58)
			{
				obj.value = valPart[0] + " 0" + valPart[valPart.length-1] + ":";
				return false;				
			}
			valPart = valPart[valPart.length-1];
			if ((valPart * 1) == 2)
			{
				if ((key * 1) > 3)
					return false
			}
			obj.value = obj.value + "" + key + ":";	
			return false;
		}
		if (obj.value.length == 13)
		{
			if (keyCode != 58)
				return false;
		}
		if (obj.value.length == 14 && (key * 1) > 5)
			return false;
		if (obj.value.length == 15 && keyCode == 58)
		{
			valPart = obj.value.split(" ");
			obj.value = valPart[0];
			valPart = valPart[valPart.length-1];
			valPart = valPart.split(":");
			obj.value += " " + valPart[0];
			valPart = valPart[valPart.length-1];
			obj.value += ":0" + valPart + ":";
			return false;
		}
		if (obj.value.length == 16)
		{
			if ((key * 1) > 5)
				return false
			else
			{
				obj.value = obj.value + ":" 
				if (keyCode != 58)
					obj.value += key;
				return false;
			}
		}
		if (obj.value.length == 17 && (key *1) > 5)
			return false;
		if (obj.value.length >= 19)
			return false;
	}
	return true;
}

function TextboxPvtCheckMonthYear(key, keyCode, maxLength, obj, datatype)
{
	if ((keyCode <  48 || keyCode > 57) && keyCode != 47 && keyCode != 58 && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	if (keyCode == 32)
	{
		if (obj.value.length != 10)
			return false
	}
	if (keyCode == 47) //If they add slashes
	{
		if (obj.value.length == 1)
		{
			obj.value = "0" + obj.value + "/";
			return false;
		}
		if (obj.value.length == 2)
		{
			return true;
		}
		else if (obj.value.length == 4)
		{
			var valPart1 = obj.value.substr(0, obj.value.length-1);
			var valPart2 = obj.value.substr(obj.value.length-1, obj.value.length);
			obj.value = valPart1 + "0" + valPart2 + "/";
			return false;
		}
		else
			return false;
	}
	if (keyCode == 58 && obj.value.length < 10)
		return false;
	else
	{
		if (obj.value.length == 1)
		{
			if ((obj.value * 1) > 1)
				return false;
			if (key > 2 && (obj.value * 1) > 0)
				return false;
			obj.value = obj.value + "" + key + "/";
			return false;
		}
		if (obj.value.length == 2)
		{
			obj.value += "/"+ key;
			return false;
		}
		if (obj.value.length > 6)
			return false;
	}
	return true;
}

function TextboxPvtCheckTime(key, keyCode, maxLength, obj, datatype)
{
	if ((keyCode <  48 || keyCode > 57) && keyCode != 47 && keyCode != 58 && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	if (obj.value.length == 0)
	{
		if ((key * 1) > 2)
		    return false;
		else
		    return true;
	}
	if (obj.value.length == 1)
	{
		valPart = obj.value.split(" ");
		if (keyCode == 58)
		{
			obj.value = valPart[0] + " 0" + valPart[valPart.length-1] + ":";
			return false;				
		}
		valPart = valPart[valPart.length-1];
		if ((valPart * 1) == 2)
		{
			if ((key * 1) > 3)
				return false
		}
		obj.value = obj.value + "" + key + ":";	
		return false;
	}
	if (obj.value.length == 2)
	{
		if (keyCode != 58)
			return false;
	}
	if (obj.value.length == 3 && (key * 1) > 5)
		return false;
	if (obj.value.length == 4 && keyCode == 58)
	{
		valPart = obj.value.split(" ");
		obj.value = valPart[0];
		valPart = valPart[valPart.length-1];
		valPart = valPart.split(":");
		obj.value += " " + valPart[0];
		valPart = valPart[valPart.length-1];
		obj.value += ":0" + valPart + ":";
		return false;
	}
	if (obj.value.length == 5)
	{
		if ((key * 1) > 5)
			return false
		else
		{
			obj.value = obj.value + ":" 
			if (keyCode != 58)
				obj.value += key;
			return false;
		}
	}
	if (obj.value.length == 6 && (key *1) > 5)
		return false;
	if (obj.value.length >= 8)
		return false;
	return true;
}

function TextboxPvtCheckPhoneNumber(key, keyCode, maxLength, obj, datatype)
{
	if ((keyCode <  48 || keyCode > 57) && keyCode != 45 && keyCode != 120 && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	if (keyCode == 58 && obj.value.length < 10)
		return false;
	if (obj.value.length >= maxLength && keyCode !=13 && keyCode != 8 && keyCode != 0)
		return false;
	return true;
}

function TextboxPvtCheckCreditCard(key, keyCode, maxLength, obj, datatype)
{
	if ((keyCode <  48 || keyCode > 57) && keyCode !=13 && keyCode != 8 && keyCode != 0 && keyCode != 32)
		return false;
	else
	{
		if (obj.value.length == 4 || obj.value.length == 9 || obj.value.length == 14)
		{
			if (keyCode != 32)
			{
			    obj.value += " " + key;
			    return false;
			}
		}
		else
		{
		    if (keyCode == 32)
		        return false
		}
		if (obj.value.length > 18)
		    return false;
	}
	return true;
}

function TextboxPubFormatNumeric(obj, focus) 
{
    if (focus == "in")
        obj.value = replace(obj.value, ",", "");
    if (focus == "out")
    {
        var maxDecimals = 2;
        try
        {
            maxDecimals = obj.attributes.getNamedItem("datalength").value;
            if (maxDecimals.indexOf(".") != -1)
	        {
		        maxDecimals = maxDecimals.split(".");
		        maxDecimals = maxDecimals[maxDecimals.length-1]*1;
	        }
	        else
	            maxDecimals = 2;
	    }
	    catch(e)
	    {
	        //do nothing
	    }
	    obj.value = TextboxPvtRoundNumber(obj.value, maxDecimals);
	    
	    var parts = obj.value.split(".");
	    number = parts[0];
	    number = '' + number;
	    if (number.length > 3) 
	    {
		    var mod = number.length % 3;
		    var output = (mod > 0 ? (number.substring(0,mod)) : '');
		    for (i=0 ; i < Math.floor(number.length / 3); i++) 
		    {
			    if ((mod == 0) && (i == 0))
				    output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
			    else
				    output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
		    }
		    if (parts.length > 1)
		        output = output + "." + parts[1];
		    obj.value = output;
	    }
	    else
	    {
	        output = number;
	        if (parts.length > 1)
		        output = output + "." + parts[1];
		    obj.value = output;
        }
    }
}

function TextboxPvtRoundNumber(value, rlength) 
{
	if (!rlength)
	    var rlength = 2; // The number of decimal places to round to
	var newnumber = Math.round(value*Math.pow(10,rlength))/Math.pow(10,rlength);
	var isDecimal = newnumber + "";
	if (isDecimal.indexOf(".") == -1)
	{
	    newnumber += ".";
	    for (var r=0;r<rlength;r++)
	    {
	        newnumber+="0";
	    }
    }
	return newnumber;
}