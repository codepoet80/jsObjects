// JavaScript User Interface Objects - Calendar
// By: Jonathan Wise
// Created: December 2005

// Public constructor
// To be called by hosting page to create a new instance of the calendar
function calendarNew(calendarName, skinName, calendarParent, rootDir)
{
	if (calendarName == null || calendarName == "")
		return false;
	if (rootDir == null)
		rootDir = "http://" + document.location.host + "/jsobjects";
	jsUIGblAddSkin("jsUI-Calendar", skinName, rootDir);
	
	if (calendarParent == null || calendarParent == "" || calendarParent == undefined)
		calendarParent = document.body;
	if (typeof(calendarParent) != "object")
		calendarParent = document.getElementById(calendarParent);
		
	var cTable = document.createElement("TABLE");
	cTable.className = "webCalTable";
	cTable.id = "tbl" + calendarName;
	cTable.width = "100%";
	cTable.height = "100%";
	cTable.cellPadding = "0";
	cTable.cellSpacing = "0";
	cTable.border = "0";
	var cTBody = document.createElement("TBODY");
	cTable.appendChild(cTBody);
	
	//Header Row
	var cTopRow = document.createElement("TR");
	cTopRow.id = "cHeaderRow";
	var cTopRowCell = document.createElement("TD");
	cTopRowCell.id = "cHeaderCell";
	cTopRowCell.className = "webCalToolbar";
	
	//Controls
	var cTopControls = document.createElement("TABLE");
	cTopControls.id = calendarName + "ControlsTable";
	cTopControls.width = "100%";
	cTopControls.border = 0;
	cTopControls.cellPadding = 0;
	cTopControls.cellSpacing = 1;
	var cTopControlsBody = document.createElement("TBODY");
	var cTopControlsRow = document.createElement("TR");
	var cTopControlsBack = document.createElement("TD");
	cTopControlsBack.innerHTML = "&nbsp;<img src='" + rootDir + "/jsUI-Calendar/back.gif'>";
	cTopControlsBack.onclick = CalendarPvtMonthBack;
	cTopControlsBack.className = "webCalControl";
	cTopControlsRow.appendChild(cTopControlsBack);
	var cTopControlsTitle = document.createElement("TD");
	cTopControlsTitle.className = "webCalToolbarTitle";
	cTopControlsTitle.ondblclick = CalendarPvtTitleClick;
	cTopControlsTitle.colSpan = 5;
	cTopControlsTitle.align = "center";
	cTopControlsTitle.innerHTML = "&nbsp;";
	cTopControlsTitle.width = "100%";
	cTopControlsTitle.id = calendarName + "TitleCell";
	cTopControlsRow.appendChild(cTopControlsTitle);
	var cTopControlsNext = document.createElement("TD");
	cTopControlsNext.innerHTML = "<img src='" + rootDir + "/jsUI-Calendar/next.gif'>&nbsp;";
	cTopControlsNext.onclick = CalendarPvtMonthNext;
	cTopControlsNext.className = "webCalControl";
	cTopControlsNext.align = "right";
	cTopControlsRow.appendChild(cTopControlsNext);
	cTopControlsBody.appendChild(cTopControlsRow);
	cTopControls.appendChild(cTopControlsBody);
	cTopRowCell.appendChild(cTopControls)
	cTopRow.appendChild(cTopRowCell);
	cTBody.appendChild(cTopRow);
	
	//Calendar Row
	var cCalRow = document.createElement("TR");
	cCalRow.id = "cCalendarRow";
	cTBody.appendChild(cCalRow);
	var cCalRowCell = document.createElement("TD");
	cCalRowCell.id = "cCalendarCell";
	cCalRow.appendChild(cCalRowCell);
	var cCalRowCellTable = document.createElement("TABLE");
	cCalRowCellTable.width = "100%";
	cCalRowCellTable.style.height = "100%";
	cCalRowCell.appendChild(cCalRowCellTable);
	var cCalRowCellTBody = document.createElement("TBODY");
	cCalRowCellTable.appendChild(cCalRowCellTBody);
	
	//Days Row
	var cDaysRow = document.createElement("TR");
	cDaysRow.id = "cDaysHeaderRow";
	cDaysRow.className = "webCalToolbarDays";
	for (var d=0;d<7;d++)
	{
		var cDaysCell = document.createElement("TD");
		cDaysCell.width = "14%";
		if (calendarParent.scrollWidth < 470)
			cDaysCell.innerHTML = CalendarPvtGetDayInitial(d);
		else
			cDaysCell.innerHTML = CalendarPvtGetDayName(d);
		cDaysRow.appendChild(cDaysCell);
	}
	cTopControlsBody.appendChild(cDaysRow);

	//Week Rows
	for (var w=0;w<6;w++)
	{
		var cWeekRow = document.createElement("TR");
		for (var d=0;d<7;d++)
		{
			var cDayCell = document.createElement("TD");
			cDayCell.width = "14%";
			cDayCell.className = "webCalCell webCalCellInactive";
			cDayCell.innerHTML = "&nbsp;";
			cWeekRow.appendChild(cDayCell);
		}
		cCalRowCellTBody.appendChild(cWeekRow);
	}
	
	//Add Calendar
	calendarParent.appendChild(cTable);
	var tbObject = CalendarPvtConstructCalendar(calendarName, cTable, calendarParent, rootDir);
	return tbObject;
}

// Private constructor method
// Used to attach grid elements and methods to a given instance of the grid
function CalendarPvtConstructCalendar(calendarName, calendarTable, calendarParent, rootDir)
{
	var tbObject;
	eval(calendarName + ".element = calendarTable");	//element
	//add members
	eval(calendarName + ".setDate = CalendarPubSetDate");	//method
	eval(calendarName + ".setStatus = CalendarPubSetStatus");	//method
	eval(calendarName + ".addEvent = CalendarPubAddEvent");	//method
	eval(calendarName + ".removeEvent = CalendarPubRemoveEvent");	//method
	eval(calendarName + ".redraw = CalendarPubRedraw");	//method
	eval(calendarName + ".dateChanged = doNothing");	//event
	eval(calendarName + ".dateClicked = doNothing");	//event
	eval(calendarName + ".eventClicked = null");	//event
	eval(calendarName + ".beforeCreateEvent = doNothing");	//event
	eval(calendarName + ".dateSelector = null");	//event
	var date = new Date();
	eval(calendarName + ".calendarDate = date");	//property
	eval(calendarName + ".selectedDate = date");	//property
	eval(calendarName + ".textChecker = null"); //public property
	eval(calendarName + ".events = new Array()");	//collection
	eval(calendarName + ".eventIDCount = 0");	//collection
	eval(calendarName + ".calendarParent = calendarParent");   //private property
	eval(calendarName + ".rootDir = rootDir");   //private property
	eval(calendarName + ".id = calendarName");	//private property
	eval("tbObject = " + calendarName);	//assignment
	return tbObject;
}

// Private method with public pointer
// Used to set the status text/behaviour of the calendar
function CalendarPubSetStatus(type, text)
{
	switch (type.toLowerCase())
	{
		case "working":
		{
		    if (this.element.scrollWidth < 470)
		       document.getElementById(this.id + "TitleCell").innerHTML = "<img align='absmiddle' alt='" + text + "' height='16' width='16' src='" + this.rootDir + "/jsUI-Calendar/working.gif'> &nbsp;";
		    else
		    {
		        document.getElementById(this.id + "TitleCell").innerHTML = "<img align='absmiddle' height='16' width='16' src='" + this.rootDir + "/jsUI-Calendar/working.gif'> &nbsp;";
			    document.getElementById(this.id + "TitleCell").innerHTML += text;
		    }
			break;
		}
		case "date":
		{
			var dateObj = this.calendarDate;
			if (document.getElementById("tbl" + this.id).scrollWidth < 470)
				document.getElementById(this.id + "TitleCell").innerHTML = CalendarPvtGetMonthInitial(dateObj.getMonth()) + " " + dateObj.getFullYear();
			else
				document.getElementById(this.id + "TitleCell").innerHTML = CalendarPvtGetMonthName(dateObj.getMonth()) + " " + dateObj.getFullYear();
			break;
		}
		case "change":
		{
			var titleCell = document.getElementById(this.id + "TitleCell");
			titleCell.innerHTML = "";
			var monthSelect = document.createElement("select");
			for (var m=0;m<=11;m++)
			{
			    var monthOpt = document.createElement("option");
			    monthOpt.value = m;
			    monthOpt.text = CalendarPvtGetMonthName(m);
			    monthSelect.options.add(monthOpt);
			}
			monthSelect.selectedIndex = this.calendarDate.getMonth();
			monthSelect.className = "webCalInput";
			titleCell.appendChild(monthSelect);
			var yearSelect = document.createElement("input");
			yearSelect.type = "text";
			yearSelect.style.width = "50px";
			yearSelect.value = this.calendarDate.getFullYear();
			if (this.textChecker != null)
			{
			    yearSelect.datatype = "integer";
			    yearSelect.dataChecker = this.textChecker.id;
			    yearSelect.onkeypress = this.textChecker.keyPress;
			}
			yearSelect.className = "webCalInput";
			titleCell.appendChild(yearSelect);
			var okBtn = document.createElement("input");
			okBtn.className = "webCalInput";
			okBtn.type = "button"
			okBtn.value = "OK";
			okBtn.onclick = CalendarPvtDoDateSelectorChange;
			titleCell.appendChild(okBtn);
			break;
		}
	}
}

// Private method with public pointer
// Used to redraw the calendar on resize
function CalendarPubRedraw()
{
	this.setDate(this.calendarDate);
	
	//Days Row
	var cDaysRow = this.element.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1];
	for (var d=0;d<cDaysRow.childNodes.length;d++)
	{
		if (this.calendarParent.scrollWidth < 470)
			cDaysRow.childNodes[d].innerHTML = CalendarPvtGetDayInitial(d);
		else
			cDaysRow.childNodes[d].innerHTML = CalendarPvtGetDayName(d);
	}
}

// Private method with public pointer
// Used to set the current date of the calendar
function CalendarPubSetDate(dateObj)
{		
	this.calendarDate = dateObj;
	this.setStatus("working", "Loading month...");
			
	var realDate = new Date();
	var theCal = document.getElementById("tbl" + this.id);
	theCal = theCal.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	
	dateObj.setDate(1);
	var rows = getAllDescendants(theCal, "TR");
	colCount = 0;	//move to first day cell

	// Clear out cells
	var cols = getAllDescendants(theCal, "TD");
	for (var c=colCount;c<=cols.length-1;c++)
	{
		cols[c].className = "webCalCell webCalCellInactive";
		cols[c].dayNum = null;
		cols[c].innerHTML = "&nbsp;";    
		cols[c].ondblclick = doNothing;
	}

	// Draw days
	var monthLength = CalendarPvtGetMonthLength(CalendarPvtGetMonthName(dateObj.getMonth()), dateObj);
	var cols = getAllDescendants(theCal, "TD");
	colCount += dateObj.getDay();
	var currNode = cols[colCount];
	for (var d=1;d<=monthLength;d++)
	{
		currNode.onmousedown = CalendarPvtSelectDay;
		currNode.ondblclick = CalendarPvtCreateEvent;
		currNode.className = "webCalCell webCalCellActive";
		currNode.innerHTML = d + "<br/>";
		currNode.dayNum = d;
		if (d == realDate.getDate() && dateObj.getMonth() == realDate.getMonth() && dateObj.getYear() == realDate.getYear())
			currNode.className = "webCalCell webCalCellToday";
        if (d == this.selectedDate.getDate() && dateObj.getMonth() == this.selectedDate.getMonth() && dateObj.getFullYear() == this.selectedDate.getFullYear())
		    currNode.className += " webCalCellSelected";
		colCount ++;
		currNode = cols[colCount];
	}
	
	CalendarPvtDrawEvents(this);
	this.setStatus("date");
}

// Private method with public pointer
// Used to add an event to the calendar
function CalendarPubAddEvent(uid, startTime, endTime, duration, title, summary, color, calendar)
{
	var objEvent = new Object();
    objEvent.id = calendar + this.eventIDCount;
	objEvent.uid = uid;
	objEvent.summary = summary;
	objEvent.title = title;
	objEvent.startTime = startTime;
	objEvent.year = startTime.getFullYear();
	objEvent.month = startTime.getMonth();
	objEvent.date = startTime.getDate();
	objEvent.duration = duration;
	objEvent.endTime = endTime;
	objEvent.color = color;
	objEvent.calendar = calendar;
	this.events[this.events.length] = objEvent;
	this.eventIDCount++;
	objectEvent(document.body, "click");
	CalendarPvtDrawEvents(this);
}

// Private method with public pointer
// Used to remove all, or a single event from the calendar
function CalendarPubRemoveEvent(uid)
{
    if (uid != null)
    {
        for (var e=0;e<this.events.length;e++)
        {
            if (this.events[e].uid == uid)
            {
                
                this.events.splice(e, 1);
            }
        }
    }
    if (uid == null)
    {
        this.events = new Array();
    }
    this.redraw();
}

// Private method
// Navigates back one month in the calendar
function CalendarPvtMonthBack()
{
	var currCal = CalendarPvtFindRootObject(this);
	var setDate = new Date();
	var currMonth = currCal.calendarDate.getMonth();
	var currYear = currCal.calendarDate.getFullYear();
	if (currMonth > 0)
		currMonth --;
	else
	{
		currMonth = 11;
		currYear --;
	}
	setDate.setDate(1);
	setDate.setMonth(currMonth);
	setDate.setFullYear(currYear);
	
	currCal.setDate(setDate);
	currCal.dateChanged();
}

// Private method
// Navigates forward one month in the calendar
function CalendarPvtMonthNext()
{
	var currCal = CalendarPvtFindRootObject(this);
	var setDate = new Date();
	var currMonth = currCal.calendarDate.getMonth();
	var currYear = currCal.calendarDate.getFullYear();
	if (currMonth < 11)
		currMonth ++;
	else
	{
		currMonth = 0;
		currYear ++;
	}
	setDate.setDate(1);
	setDate.setMonth(currMonth);
	setDate.setFullYear(currYear);
	
	currCal.setDate(setDate);
	currCal.dateChanged(setDate);
}

// Private method
// Used to fire public event for creating event
function CalendarPvtCreateEvent()
{
	var objCal = CalendarPvtFindRootObject(this);
	var newEventDate = new Date();
	newEventDate.setFullYear(objCal.calendarDate.getFullYear());
	newEventDate.setMonth(objCal.calendarDate.getMonth());
	newEventDate.setDate(this.dayNum);
	objCal.beforeCreateEvent(newEventDate);
}

// Private method
// Used highlight a day on the calendar and fire a public event
function CalendarPvtSelectDay()
{
    var objCal = CalendarPvtFindRootObject(this);
    var findCalCells = objCal.element.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	var cols = getAllDescendants(findCalCells, "TD");
	var realDate = new Date();
	if (this.className != "webCalCell webCalCellInactive")
	{
	    for (var d=0;d<=cols.length-1;d++)
	    {
		    if (cols[d].className != "webCalCell webCalCellInactive")
		    {
		        if (cols[d].dayNum == realDate.getDate() && objCal.calendarDate.getMonth() == realDate.getMonth() && objCal.calendarDate.getFullYear() == realDate.getFullYear())
		            cols[d].className = "webCalCell webCalCellToday";
		        else
		            cols[d].className = "webCalCell webCalCellActive";
		    }
	    }
        this.className += " webCalCellSelected";
        var selectedDate = new Date();
        selectedDate.setDate(this.dayNum);
        selectedDate.setMonth(objCal.calendarDate.getMonth());
        selectedDate.setFullYear(objCal.calendarDate.getFullYear());
        objCal.selectedDate = selectedDate;
        objCal.dateClicked(selectedDate);
    }
}

// Private method
// Draws events on the calendar
function CalendarPvtDrawEvents(objCal)
{
	objCal.setStatus("working", "Populating events...");
	var events = objCal.events;
	for (var e=0;e<events.length;e++)
	{
		if (!document.getElementById(events[e].id))
		{
			if (events[e].year == objCal.calendarDate.getFullYear() && events[e].month == objCal.calendarDate.getMonth())
			{
				var findCalCells = objCal.element.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
				var cols = getAllDescendants(findCalCells, "TD");
                var divHeight;
                divHeight = cols[1].parentNode.scrollHeight;
                if (objCal.element.scrollWidth < 600)
                    divHeight = divHeight - Math.round(divHeight/2.5);
                else
                    divHeight = divHeight - Math.round(divHeight/3.5);
				for (var d=1;d<=cols.length-1;d++)
				{
					if (cols[d].dayNum == events[e].date)
					{
					    if (cols[d].innerHTML.toLowerCase().indexOf("div") == -1)
					    {
					        var divWidth = Math.round(cols[d].parentNode.scrollWidth / 7);
					        divWidth = divWidth - 10;
					        var eventHTML = "<div style='width:" + divWidth + "px;height:" + divHeight + "px;overflow:hidden'>";
					        eventHTML += "</div>"
					        cols[d].innerHTML += eventHTML;
					    }
					    if (events[e].endTime != "none")
                        {
					        if ((events[e].endTime.getTime() - events[e].startTime.getTime()) == 86400000)
					        {
					            if (objCal.element.scrollWidth < 470)
							        cols[d].childNodes[2].innerHTML += "<span onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='height: 10px;color: white;background-color:" + events[e].color + "'>&bull;&nbsp;</span>";
						        else
							        cols[d].childNodes[2].innerHTML += "<div onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='margin-bottom:0px; width:100%;color: white;background-color:" + events[e].color + "'>" + events[e].summary + "</div>";
					        }
					        else
					        {
						        if (objCal.element.scrollWidth < 470)
							        cols[d].childNodes[2].innerHTML += "<span onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='color:" + events[e].color + "'>&bull;</span>";
						        else
							        cols[d].childNodes[2].innerHTML += "<span onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='color:" + events[e].color + "'>&bull;" + events[e].summary + "</span><br/>";
					        }
					    }
					    else
					    {
						    if (objCal.element.scrollWidth < 470)
							    cols[d].childNodes[2].innerHTML += "<span onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='color:" + events[e].color + "'>&bull;</span>";
						    else
							    cols[d].childNodes[2].innerHTML += "<span onclick='CalendarPvtEventClick(this)' name='" + events[e].uid + "' title=\"" + events[e].title + "\" id='" + events[e].id + "' class='webCalEvent' style='color:" + events[e].color + "'>&bull;" + events[e].summary + "</span><br/>";
					    }
					}
				}
			}
		}
	}
	objCal.setStatus("date");
}

// Private method
// Used to display month/year navigation
function CalendarPvtTitleClick()
{
    var objCal = CalendarPvtFindRootObject(this);
    if (objCal.dateSelector != null)
        objCal.dateSelector();
    else
        objCal.setStatus("change");
}

// Private method
// Sets date according to internal month/year navigator
function CalendarPvtDoDateSelectorChange()
{
    var objCal = CalendarPvtFindRootObject(this);
    var titleCell = document.getElementById(objCal.id + "TitleCell");
    var newDate = new Date();
    newDate.setDate(1);
    newDate.setMonth(titleCell.childNodes[0].options[titleCell.childNodes[0].selectedIndex].value);
    newDate.setFullYear(titleCell.childNodes[1].value);
    objCal.setDate(newDate);
    objCal.dateChanged();
}

// Private method
// Fires a public event when a calendar event is clicked
function CalendarPvtEventClick(objEvent)
{
    var objCal = CalendarPvtFindRootObject(objEvent);
    if (objCal.eventClicked != null)
    {
        for (var e=0;e<objCal.events.length;e++)
        {
            if (objEvent.name == objCal.events[e].uid)
                objCal.eventClicked(objCal.events[e]);
        }
    }
}

// Private method
// Looks up full day names
function CalendarPvtGetDayName(day)
{
	var days=new Array(7);
	days[0]="Sunday";
	days[1]="Monday";
	days[2]="Tuesday";
	days[3]="Wednesday";
	days[4]="Thursday";
	days[5]="Friday";
	days[6]="Saturday";
	return days[day];
}

// Private method
// Looks up short day names	
function CalendarPvtGetDayInitial(day)
{
	var days=new Array(7);
	days[0]="Su";
	days[1]="M";
	days[2]="T";
	days[3]="W";
	days[4]="Th";
	days[5]="F";
	days[6]="Sa";
	return days[day];
}

// Private method
// Looks up full month names
function CalendarPvtGetMonthName(month)
{
	var months=new Array(12);
	months[0]="January";
	months[1]="February";
	months[2]="March";
	months[3]="April";
	months[4]="May";
	months[5]="June";
	months[6]="July";
	months[7]="August";
	months[8]="September";
	months[9]="October";
	months[10]="November";
	months[11]="December";
	return months[month];
}

// Private method
// Looks up short month names
function CalendarPvtGetMonthInitial(month)
{
	var months=new Array(12);
	months[0]="Jan";
	months[1]="Feb";
	months[2]="Mar";
	months[3]="Apr";
	months[4]="May";
	months[5]="June";
	months[6]="July";
	months[7]="Aug";
	months[8]="Sept";
	months[9]="Oct";
	months[10]="Nov";
	months[11]="Dec";
	return months[month];
}

// Private method
// Looks up the length of a given month
function CalendarPvtGetMonthLength(month, dateObj)
{
	month = month.toLowerCase();
	var january = 31;
	if (dateObj.getFullYear() % 4 == 0)
		var february = 29;
	else
		var february = 28;
	var march = 31;
	var april = 30;
	var may = 31;
	var june = 30;
	var july = 31;
	var august = 31;
	var september = 30;
	var october = 31;
	var november = 30;
	var december = 31;
	return eval(month);
}

// Private method
// Finds the root object
function CalendarPvtFindRootObject(currObject)
{
	while(currObject.className != "webCalTable")
		currObject = currObject.parentNode;
	var currID = replace(currObject.id, "tbl", "");
	currID = replace(currID, "ControlsTable", "");
	currObject = eval(currID);
	return currObject;
}