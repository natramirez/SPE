// FOLLOWING CODE CREATES A DYNAMIC JS WEEK CALENDAR BASED ON CURRENT DATE


//GLOBAL VARIABLES:
//get current date and time
var d = new Date();

var todayDateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate()); //today's date without time

var selectedDateObj = new Date(todayDateObj.getTime()); //set current date as today

var dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var monthName = ['Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'];
var fullMonthName = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
var currentView = 'week'; //start with week view; options are: 'day','week','month'


window.onload = function(){
    $('#weekTab').toggleClass('active'); 

    getCalendar(selectedDateObj, currentView);

    // "next" click function creates and displays next week's calendar
    $('#calendar-header').delegate(".next", "click", function(){ 
        //modify selected date global variable
        if (currentView == 'day')       selectedDateObj.setDate(selectedDateObj.getDate() + 1);
        else if (currentView == 'week') selectedDateObj.setDate(selectedDateObj.getDate() + 7);
        else                            selectedDateObj.setMonth(selectedDateObj.getMonth() + 1);

        getCalendar(selectedDateObj, currentView); //next day/week/month calendar

        return false; 
    });

    // "prev" click function creates and displays previous week's calendar
    $('#calendar-header').delegate(".prev", "click", function(){ 
        //modify selected date global variable
        if (currentView == 'day')       selectedDateObj.setDate(selectedDateObj.getDate() - 1);
        else if (currentView == 'week') selectedDateObj.setDate(selectedDateObj.getDate() - 7);
        else                            selectedDateObj.setMonth(selectedDateObj.getMonth() - 1);

        getCalendar(selectedDateObj, currentView); //get previous week calendar

        return false; 
    });

    //changes view type keeping current selected date
    $('#dayTab').click(function() {
        //remove active class, add to THIS tab
        $('.tabs').removeClass('active'); 
        $(this).toggleClass('active'); 

        currentView = 'day';
        getCalendar(selectedDateObj, currentView);
    });

    $('#weekTab').click(function() {
        //remove active class, add to THIS tab
        $('.tabs').removeClass('active'); 
        $(this).toggleClass('active'); 

        currentView = 'week';
        getCalendar(selectedDateObj, currentView);
    });

    $('#monthTab').click(function() {
        //remove active class, add to THIS tab
        $('.tabs').removeClass('active'); 
        $(this).toggleClass('active'); 

        currentView = 'month';
        getCalendar(selectedDateObj, currentView);
    });

    $('#todayButton').click(function() {
        selectedDateObj = new Date(todayDateObj.getTime()); //set current date as today
        getCalendar(selectedDateObj, currentView);
    });
}

// chooses which calendar type to display based on currentView variable
function getCalendar(selectedDateObj, currentView) {
    if (currentView == 'day')       getDayCalendar(selectedDateObj);
    else if (currentView == 'week') getWeekCalendar(selectedDateObj);
    else                            getMonthCalendar(selectedDateObj);
}

// creates a day calendar based on current date globals
function getDayCalendar(selectedDateObj) {
    currentView = 'day';

    clearCalendarContainer();

    createDayHeader();

    //create and append day calendar table
    var calendarTable = document.createElement('table');
    calendarTable.appendChild(createWeekRow(1, selectedDateObj)); //weekday row
    document.getElementById("calendar-dates").appendChild(calendarTable);

    fillDayHeader();
    loadEventsToDayCalendar();
    //no hover effect needed because it's only one day shown at a time
    //no selected class added for the same reason
}

// creates a week calendar based on start date globals
function getWeekCalendar(selectedDateObj) {
    currentView = 'week';

    clearCalendarContainer();

    createWeekMonthHeader();

    var startDateObj = getStartDateObj(selectedDateObj);

    //create and append week calendar table
    var calendarTable = document.createElement('table');
    calendarTable.appendChild(createWeekRow(7, startDateObj)); //weekday row
    document.getElementById("calendar-dates").appendChild(calendarTable);
    
    $('#'+selectedDateObj.getFullYear()+'-'+selectedDateObj.getMonth()+'-'+selectedDateObj.getDate()).toggleClass('selected');

    fillWeekHeader(startDateObj, endDateObj);
    loadEventsToWeekCalendar();
    createWeekHoverEffect();
    addWeekDoubleClickEffect();
}

// function creates a month calendar based on selected date
function getMonthCalendar(selectedDateObj) {
    currentView = 'month';

    clearCalendarContainer();

    createWeekMonthHeader();

    var selectedDateMonth = selectedDateObj.getMonth();
    var selectedDateYear = selectedDateObj.getFullYear();

    //to determine day_no and days variables
    var day_no = get_day_no(selectedDateMonth, selectedDateYear);   //1

    var days; //30
    if (selectedDateMonth != 11) days = new Date(selectedDateYear, selectedDateMonth+1, 0).getDate();
    else                         days = new Date(selectedDateYear+1, 0, 0).getDate();

    var calendar = createMonthCalTable(day_no, days, selectedDateMonth, selectedDateYear);

    //fill month header
    document.getElementById("month-week").innerHTML = fullMonthName[selectedDateMonth];
    document.getElementById("year").innerHTML = selectedDateYear;
    document.getElementById("calendar-dates").appendChild(calendar);

    $('#'+selectedDateObj.getFullYear()+'-'+selectedDateObj.getMonth()+'-'+selectedDateObj.getDate()).toggleClass('selected');

    loadEventsToMonthCalendar();
    createMonthHoverEffect();
    addMonthDoubleClickEffect();
}

// hover over cell dates and change their color
function createWeekHoverEffect() {
    $(".weekdays").on("mouseover", function(){ // trigger the mouseover event
        $(this).find('.divBoxCont').css("background-color", "#EEDEE5");
        $(this).find('.divBox').css("background-color", "#C52052");
    });
    $(".weekdays").on("mouseout", function(){ // trigger the mouseout event
        $(this).find('.divBoxCont').css("background-color", "");
        $(this).find('.divBox').css("background-color", "");
    })
}

// hover over cell dates and change their color
function createMonthHoverEffect() { 
    $(".monthDays").on("mouseover", function(){ // trigger the mouseover event
        if ($(this).hasClass('todayBox')) {
            $(this).css("background-color", "#EEDEE5");
        }
        else $(this).css("background-color", "#EEDEE5");
    }); 
    $(".monthDays").on("mouseout", function(){ // trigger the mouseout event
        if ($(this).hasClass('todayBox')) {
            $(this).css("background-color", "");
        }
        else $(this).css("background-color", "");
    });
}

// adds click select and double-click link functionality to table cell dates (week view)
function addWeekDoubleClickEffect() {
    $('.weekdays').on("click", function() {
        if ($(this).hasClass('selected')) { //then go to day view
            $('.tabs').removeClass('active'); 
            $('#dayTab').toggleClass('active'); 

            currentView = 'day';
            getCalendar(selectedDateObj, currentView);
        } 
        else {
            var dateId = $(this).attr("id");
            var dateArray = dateId.split("-"); //retrieve and split up date id of clicked element

            $('.weekdays').removeClass('selected'); //remove any selected class elements
            $(this).toggleClass('selected'); //add selected classto clicked element
            selectedDateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
        }       
    });
}

// adds click select and double-click link functionality to table cell dates (month view)
function addMonthDoubleClickEffect() {
    $('.monthDays').on("click", function(e) {
        if ($(e.target).is('.eventButtons')) {
            //don't do anything
        }
        else if ($(this).hasClass('selected')) { //then go to day view
            $('.tabs').removeClass('active'); 
            $('#dayTab').toggleClass('active'); 

            currentView = 'day';
            getCalendar(selectedDateObj, currentView);
        } 
        else {
            var dateId = $(this).attr("id"); //gets id w/ date info
            var dateArray = dateId.split("-");

            $('.monthDays').removeClass('selected');
            $(this).toggleClass('selected');
            selectedDateObj = new Date(dateArray[0], dateArray[1], dateArray[2]);
        }     
    });
}

// loads events to calendar through a post request to a file connecting to a MySQL database
function loadEventsToDayCalendar() {
    var firstCalDay = $('table tr:eq(0) td').attr("id");
    firstCalDay = addZerosToDate(firstCalDay);

    var lastCalDay = $('table tr:eq(0) td').attr("id");
    lastCalDay = addZerosToDate(lastCalDay);

    $.post("mysql_get_day.php", {
        firstCalDay: firstCalDay,
        lastCalDay: lastCalDay
        },
        function(data, status){
            var buttonCount = 0;
            data = JSON.parse(data);
            var lastDate = data[0].event_date;

            for (var i = 0; i < data.length; i++) { 
                var currentDate = data[i].event_date;

                if (lastDate != currentDate) { //if different date
                    //create buttoncount div
                    $('<div class="eventCount">' + buttonCount + ' Total</div>').insertBefore('.divBoxCont');
                    lastDate = currentDate;
                    buttonCount = 0;
                }
                if (i == data.length-1) { //if last button
                    buttonCount++;
                    //create buttoncount div
                    $('<div class="eventCount">' + buttonCount + ' Total</div>').insertBefore('.divBoxCont');
                }
                
                //create button for current date
                var currentButton = '<button class="eventButtons" id="'+ data[i].event_id +'"> <b>' + data[i].start_time + '</b> ' + data[i].event_name + ' ' + data[i].club_name + '</button><br/>';
                $(currentButton).appendTo('.divBoxCont');
                buttonCount++;
            }
    });
}

// loads events to calendar through a post request to a file connecting to a MySQL database
function loadEventsToWeekCalendar() {
    var firstCalDay = $('table tr:eq(0) td:first-child').attr("id");
    firstCalDay = addZerosToDate(firstCalDay);

    var lastCalDay = $('table tr:eq(0) td:last-child').attr("id");
    lastCalDay = addZerosToDate(lastCalDay);

    $.post("mysql_get_day.php", {
        firstCalDay: firstCalDay,
        lastCalDay: lastCalDay
        },
        function(data, status){
            var buttonCount = 0;
            data = JSON.parse(data);
            var lastDate = data[0].event_date;

            for (var i = 0; i < data.length; i++) { 
                var currentDate = data[i].event_date;
                var index = $('.weekdays').index($('#' + removeZerosFromDate(currentDate))); //index of date id cell within .weekdays

                if (lastDate != currentDate) { //if different date
                    var indexLast = $('.weekdays').index($('#' + removeZerosFromDate(lastDate))); //index of date id cell within .weekdays
                    //create buttoncount div
                    $('<div class="eventCount">' + buttonCount + ' Total</div>').insertBefore($('td:eq('+indexLast+') .divBoxCont button:first-child'));
                    lastDate = currentDate;
                    buttonCount = 0;
                }
                if (i == data.length-1) { //if last button create buttoncount div
                    buttonCount++;
                    if (buttonCount == 1) $('<div class="eventCount">' + buttonCount + ' Total</div>').appendTo($('td:eq('+index+') .divBoxCont'));
                    else                  $('<div class="eventCount">' + buttonCount + ' Total</div>').insertBefore($('td:eq('+index+') .divBoxCont button:first-child'));
                }
                //create button for current date
                var currentButton = '<button class="eventButtons" id="'+ data[i].event_id +'"> <b>' + data[i].start_time + '</b> ' + data[i].event_name + ' ' + data[i].club_name + '</button><br/>';
                $(currentButton).appendTo($('td:eq('+index+') .divBoxCont'));
                buttonCount++;
            }
    });
}

// loads events to calendar through a post request to a file connecting to a MySQL database
function loadEventsToMonthCalendar() {
    var firstCalDay = $('table tr:eq(1) td:first-child').attr("id"); //eq(1) b/c eq(0) is weekdays row
    firstCalDay = addZerosToDate(firstCalDay);

    var lastCalDay = $('table tr:last-child td:last-child').attr("id");
    lastCalDay = addZerosToDate(lastCalDay);

    // console.log('lastcalday: ' + lastCalDay);

    $.post("mysql_get_day.php", {
        firstCalDay: firstCalDay,
        lastCalDay: lastCalDay
        },
        function(data, status){
            var buttonCount = 0;
            data = JSON.parse(data);
            var lastDate = data[0].event_date;

            for (var i = 0; i < data.length; i++) { 
                var currentDate = data[i].event_date;

                if (lastDate != currentDate) { //if different date
                    //create buttoncount div
                    $('<div class="monthEventCount">' + buttonCount + ' Total</div>').insertAfter($('#' + removeZerosFromDate(lastDate)).find('.monthDivBox'));
                    lastDate = currentDate;
                    buttonCount = 0;
                }
                if (i == data.length-1) { //if last button
                    buttonCount++;
                    //create buttoncount div
                    $('<div class="monthEventCount">' + buttonCount + ' Total</div>').insertAfter($('#' + removeZerosFromDate(currentDate)).find('.monthDivBox'));
                }
                //create button for current date
                var currentButton = '<button class="eventButtons" id="'+ data[i].event_id +'"> <b>' + data[i].start_time + '</b> ' + data[i].event_name + ' ' + data[i].club_name + '</button><br/>';
                $(currentButton).appendTo($('#' + removeZerosFromDate(currentDate)).find('.eventsBox'));
                buttonCount++;
            }
            clickButtons();
    });
}

// clears children of "calendar-header" and "calendar-dates" sections
function clearCalendarContainer() {
    //delete previous "calendar-header"
    var node = document.getElementById("calendar-header");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    //delete previous "calendar-dates"
    var node = document.getElementById("calendar-dates");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

// create day header DOM elements 
function createDayHeader() {

    var calendarHeader = document.getElementById('calendar-header');
        var headerList = document.createElement('ul');
            var listItemPrev = document.createElement('li');
            listItemPrev.setAttribute("class", "prev");
            listItemPrev.setAttribute("title", "View previous week");
            listItemPrev.innerHTML = '❮';
        headerList.appendChild(listItemPrev);
            var listItemNext = document.createElement('li');
            listItemNext.setAttribute("class", "next");
            listItemNext.setAttribute("title", "View next week");
            listItemNext.innerHTML = '❯';
        headerList.appendChild(listItemNext);
            var listItemTitle = document.createElement('li');
            listItemTitle.setAttribute("id", "date-line");
        headerList.appendChild(listItemTitle);
    calendarHeader.appendChild(headerList);
}

// create week and/or month header DOM elements 
function createWeekMonthHeader() {

    var calendarHeader = document.getElementById('calendar-header');
        var headerList = document.createElement('ul');
            var listItemPrev = document.createElement('li');
            listItemPrev.setAttribute("class", "prev");
            listItemPrev.setAttribute("title", "View previous week");
            listItemPrev.innerHTML = '❮';
        headerList.appendChild(listItemPrev);
            var listItemNext = document.createElement('li');
            listItemNext.setAttribute("class", "next");
            listItemNext.setAttribute("title", "View next week");
            listItemNext.innerHTML = '❯';
        headerList.appendChild(listItemNext);
            var listItemTitle = document.createElement('li');
            listItemTitle.style.textAlign = "center";
                var monthWeekSpan = document.createElement('span');
                monthWeekSpan.setAttribute("id", "month-week");
                linebreak = document.createElement("br");
            listItemTitle.appendChild(monthWeekSpan);
            listItemTitle.appendChild(linebreak);
                var yearSpan = document.createElement('span');
                yearSpan.setAttribute("id", "year");
                yearSpan.style.fontSize = "18px";
            listItemTitle.appendChild(yearSpan);
        headerList.appendChild(listItemTitle);
    calendarHeader.appendChild(headerList);
}

// fills in header info based on current selected days's date objects
function fillDayHeader() {
    document.getElementById("date-line").innerHTML = monthName[selectedDateObj.getMonth()]
     + " " + selectedDateObj.getDate() + ", " + selectedDateObj.getFullYear();
}

// fills header info based on current week's start and end date objects
function fillWeekHeader(startDateObj, endDateObj) {
    var startDate = startDateObj.getDate();
    var startMonth = startDateObj.getMonth();
    var startYear = startDateObj.getFullYear();

    var endDate = endDateObj.getDate();
    var endMonth = endDateObj.getMonth();
    var endYear = endDateObj.getFullYear();

    //if start and end dates have...
    if (startMonth != endMonth) { //diff months
        if (startYear != endYear) { //and diff years
            document.getElementById("month-week").innerHTML = monthName[startMonth] + " " + startDate + ", " + startYear + " -";
            document.getElementById("year").innerHTML = monthName[endMonth] + " " + endDate + ", " + endYear;
        }
        else { //diff months only
            document.getElementById("month-week").innerHTML = monthName[startMonth] + " " + startDate + " - " + monthName[endMonth] + " " + endDate;
            document.getElementById("year").innerHTML = startYear;
        }
    }
    else { //same month and year
        document.getElementById("month-week").innerHTML = monthName[startMonth] + " " + startDate + " - " + endDate;
        document.getElementById("year").innerHTML = startYear;
    }
}

// creates and returns a row 'tr' with weekdays and dates (used by day and week view)
function createWeekRow(columns, startDateObj) {

    var tr = document.createElement('tr');
    var countDateObj = new Date(startDateObj.getTime()); //initialize count date to week start date

    //loop adds in week row cells
    for (var c = 0; c < columns; c++) {
        var td = document.createElement('td');
        if (columns == 1) td.setAttribute("class", "currentday");
        else              td.setAttribute("class", "weekdays");
        td.setAttribute("id", countDateObj.getFullYear() + "-" + countDateObj.getMonth() + "-" + countDateObj.getDate());

        //add divBox class for weekdays
        var divBox = document.createElement('div');
        divBox.setAttribute("class", "divBox");
        divBox.innerHTML = setWeekdayFormat(columns, countDateObj);
        td.appendChild(divBox);

        //sets active day
        if (countDateObj.getTime() == todayDateObj.getTime()) {
            td.className+=" todayWeekday";
        }
        if (c == columns-1 && columns > 1) { //sets right column & end date 
            td.className+= " rightCol";
            endDateObj = new Date(countDateObj.getTime()); //GLOBAL VAR  ///USE EVEN FOR 1 COLUMN????????
        }
        //add divBoxCont class for event containers
        var divBoxCont = document.createElement('div');
        divBoxCont.setAttribute("class", "divBoxCont");
        td.appendChild(divBoxCont);

        countDateObj.setDate(countDateObj.getDate()+1); //increments count date
        tr.appendChild(td);
    }
    return tr;
}

// creates and returns a calendar table for the month view
function createMonthCalTable(day_no, days, cal_month, cal_year){
    var table = document.createElement('table');
    var tr = document.createElement('tr');
    
    //row for the days of the week
    for (var c = 0; c <= 6; c++) {
        var td = document.createElement('td');
        td.setAttribute("class", "monthWeekdays");
        if (c == 6) { //sets right column
            td.className+= " right-col";
        }
        td.innerHTML = dayName[c];
        tr.appendChild(td);
    }
    table.appendChild(tr);

    if (day_no != 0) { //if first date of cal_month isn't on a Sunday
        var prevStartDateObj = getPrevMonthStartDate(selectedDateObj);
        var prevStartDate = prevStartDateObj.getDate();
        var prevStartMonth = prevStartDateObj.getMonth();
        var prevStartYear = prevStartDateObj.getFullYear();
    }
    
    //second row
    tr = document.createElement('tr');
    var c;
    //insert previous month dates if any
    for (c = 0; c <= 6; c++) { 
        if(c == day_no) { //breaks as soon as first day of month is reached
            break;    //if first date of cal_month is on Sunday, will break
        }
        var td = document.createElement('td');
        td.setAttribute("class", "monthDays");

        if (c == 6) { //sets right column
            td.className+= " right-col";
        }
        var divBox = document.createElement('div');
        divBox.setAttribute("class", "monthDivBox");
        
        td.setAttribute("id", prevStartYear + "-" + prevStartMonth + "-" + prevStartDate);
        td.className+= " prevMonthDays";
        divBox.innerHTML = prevStartDate;
        td.appendChild(divBox);

        var eventsBox = document.createElement('div');
        eventsBox.setAttribute("class", "eventsBox");
        td.appendChild(eventsBox);

        //sets active day
        if (prevStartDate == todayDateObj.getDate() && prevStartMonth == todayDateObj.getMonth() && prevStartYear == todayDateObj.getFullYear()) {
            td.className+= " todayBox";
        }
        
        tr.appendChild(td);
        prevStartDate++;
    }
    //begin adding days
    var count = 1;
    for (; c <= 6; c++) {
        var td = document.createElement('td');
        td.setAttribute("class", "monthDays");
        if (c == 6) { //sets right column
            td.className+= " right-col";
        }
        
        var divBox = document.createElement('div');
        divBox.setAttribute("class", "monthDivBox");

        td.setAttribute("id", cal_year + "-" + cal_month + "-" + count);
        divBox.innerHTML = count;
        td.appendChild(divBox);


        //add events div
        var eventsBox = document.createElement('div');
        eventsBox.setAttribute("class", "eventsBox");
        td.appendChild(eventsBox);

        //sets active day
        if (count == todayDateObj.getDate() && cal_month == todayDateObj.getMonth() && cal_year == todayDateObj.getFullYear()) {
            td.className+= " todayBox";
        }
        count++;
        tr.appendChild(td);
    }
    table.appendChild(tr);
    
    //rest of the date rows
    for (var r = 3; r <= 7; r++) {
        if (count <= days) {
            tr = document.createElement('tr');
            for (var c = 0; c <= 6; c++) {
                //if all days already inserted
                if (count > days) {
                    //set next month start date
                    var nextStartDate = 1;
                    var nextStartMonth = cal_month + 1;
                    var nextStartYear = cal_year;
                    if (cal_month == 11) {
                        nextStartMonth = 0;
                        nextStartYear = cal_year+1;
                    }

                    for (; c <= 6; c++) { //insert next month dates 
                        var td = document.createElement('td');
                        td.setAttribute("class", "monthDays");
                        if (c == 6) { //sets right column
                            td.className+= " right-col";
                        }
                        var divBox = document.createElement('div');
                        divBox.setAttribute("class", "monthDivBox");
                        
                        td.setAttribute("id", nextStartYear + "-" + nextStartMonth + "-" + nextStartDate);
                        td.className+= " nextMonthDays";
                        divBox.innerHTML = nextStartDate;
                        td.appendChild(divBox);

                        //add events div
                        var eventsBox = document.createElement('div');
                        eventsBox.setAttribute("class", "eventsBox");
                        td.appendChild(eventsBox);
                                        
                        //sets active day
                        if (nextStartDate == todayDateObj.getDate() && nextStartMonth == todayDateObj.getMonth() && nextStartYear == todayDateObj.getFullYear()) {
                            td.className+= " todayBox";
                        }

                        tr.appendChild(td);
                        nextStartDate++;
                    }
                    table.appendChild(tr);
                    return table;
                }
                //day not yet inserted
                var td = document.createElement('td');
                td.setAttribute("class", "monthDays");
                if (c == 6) { //sets right column
                    td.className+= " right-col";
                }
                var divBox = document.createElement('div');
                divBox.setAttribute("class", "monthDivBox");

                td.setAttribute("id", cal_year + "-" + cal_month + "-" + count);
                divBox.innerHTML = count;
                td.appendChild(divBox);

                //add events div
                var eventsBox = document.createElement('div');
                eventsBox.setAttribute("class", "eventsBox");
                td.appendChild(eventsBox);
            
                if (count == todayDateObj.getDate() && cal_month == todayDateObj.getMonth() && cal_year == todayDateObj.getFullYear()) {
                    td.className+= " todayBox";
                }
                count++;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
    return table;
}

// Determines the format in which the "weekday row" will display date information (day or week view)
function setWeekdayFormat(columns, dateObj) {
    if (columns == 1) return dayName[dateObj.getDay()];
    else return dayName[dateObj.getDay()] + " " + (dateObj.getMonth()+1) + "/" + dateObj.getDate();
}

// Pass in pivotDateObj date object and return date object with 
// the start date of a week.
function getStartDateObj(pivotDateObj){
    var pivDateObj = new Date(pivotDateObj.getTime()); //defensive copy
    var pivWeekday = pivDateObj.getDay(); //0-6
    var pivDate = pivDateObj.getDate();

    pivDateObj.setDate(pivDate - pivWeekday);

    return new Date(pivDateObj.getFullYear(), pivDateObj.getMonth(), pivDateObj.getDate(), 0);
}

// Pass in calendar month and year, returns date object with Sunday's date 
// of calendar month's first week (likely from prev month)
function getPrevMonthStartDate(selectedDateObj) {
    var prevStartDate;
    var prevStartMonth; 
    var prevStartYear;

    var selectedDateMonth = selectedDateObj.getMonth();
    var selectedDateYear = selectedDateObj.getFullYear();

    if (selectedDateMonth != 0) { //set prev month start month and year
        prevStartMonth = selectedDateMonth-1;
        prevStartYear = selectedDateYear;
    }
    else {
        prevStartMonth = 11;
        prevStartYear = selectedDateYear-1;
    }
    var day_no = get_day_no(selectedDateMonth, selectedDateYear); // index of day of week of 1st day of selectedDateMonth

    if (day_no == 0) { //start date is first day of current month
        return new Date(selectedDateYear, selectedDateMonth, 1, 0);
    }

    else {
        var prevMonthDays = new Date(selectedDateYear, selectedDateMonth, 0).getDate(); //# of days in previous month
       
        // goes into previous month's dates and finds Sunday's date (prevStartDate)
        for (var c = day_no; c > 1; c--) {
            prevMonthDays--;
        }
        prevStartDate = prevMonthDays;
        return new Date(prevStartYear, prevStartMonth, prevStartDate, 0);
    }
}

// Gets index of the day of the week of the first day of the month (used in getPrevMonthStartDate(), getMonthCalendar())
function get_day_no(month, year) {
    var first_date = fullMonthName[month] + " " + 1 + " " + (year);
    var tmp = new Date(first_date).toDateString();
    var first_day = tmp.substring(0, 3);
    var day_no = dayName.indexOf(first_day);
    return day_no;
}

// Adds zeros to a date in yyyy-m-d format to create yyyy-mm-dd format (used in loadEventsToCalendar... functions)
function addZerosToDate(origDate) {
    var origDateParts = origDate.split('-');
   
    var newDate =  origDateParts[0] + '-';

    if (origDateParts[1] < 10) newDate += '0' + (Number(origDateParts[1]) + 1) + '-';
    else                       newDate += (Number(origDateParts[1]) + 1) + '-';
    
    if (origDateParts[2] < 10) newDate += '0' + (Number(origDateParts[2]));
    else                       newDate += (Number(origDateParts[2]));

    return newDate;
}

// Removes zeros from date in yyyy-mm-dd to create yyyy-m-d format (used in loadEventsToCalendar... functions)
function removeZerosFromDate(dateStamp) {
    var dateStampParts = dateStamp.split('-');
    
    if (dateStampParts[1].length == 2 && dateStampParts[1].substring(0,1) == '0') {
        dateStampParts[1] = dateStampParts[1].substring(1);
    }
    if (dateStampParts[2].length == 2 && dateStampParts[2].substring(0,1) == '0') {
        dateStampParts[2] = dateStampParts[2].substring(1);
    }

    return dateStampParts[0] + "-" + (dateStampParts[1]-1) + "-" + dateStampParts[2];
}

// Adds click functionality to event buttons and displays event details
function clickButtons() {
    $(document).on("click", '.eventButtons', function() {
    // $('.eventButtons').click(function() {
        var id = $(this).attr('id');
        $.post(
            "mysql_get_event.php", {
            event_id: id
            },
            function(data){
                data = JSON.parse(data);
                $('#calendar-container').append('<div id="response"></div>');
                $('#response').html(data.event_name + "<br>" + data.club_name + "<br>" + data.location + "<br>" + data.date_entered);
            }
        );
    });
}