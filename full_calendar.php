<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>This Week</title>
	<link type="text/css" rel="stylesheet" href="nav_bars.css">
	<link type="text/css" rel="stylesheet" href="full_calendar.css">
	<script src="jquery.min.js"></script>
	<script type="text/javascript" src="full_calendar.js"></script>	
	</head>
<body>

<!-- <ul class="topnav">
  <li><a href="#home">Home</a></li>
  <li><a href="#news">News</a></li>
  <li class="right_topnav"><a href="#contact">Contact</a></li>
  <li class="right_topnav"><a href="#about">About</a></li>
  <li class="icon">
    <a href="javascript:void(0);" onclick="myFunction()">&#9776;</a>
  </li>
</ul> -->

<!--<div id="main">-->
<ul class="tabsnav">
  <li id="dayTab" class="tabs" title="Day View">Day<!-- <a id="dayTab" href="" title="See today's events">Day</a> --></li>
  <li id="weekTab" class="tabs" title="Week View">Week<!-- <a id="weekTab" href="this_week.php" title="See this week's events">Week</a>  --></li>
  <li id="monthTab" class="tabs" title="Month View">Month<!-- <a id="monthTab" class="active" href="test_from.php" title="See this month's events">Month</a> --></li>
  <li class="floatrt">
    <form id="form" action="formsubmit.php" method="get">View date: 
      <input type="date" id="inputDate" name="yyyy/mm/dd" title="Choose a date to view"/>
      <select id="viewType" name="viewtype" title="Choose view type">
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      <input type="submit" id="submitButton" name="submit" value="Submit">
    </form>
  </li>
  <li class="floatrt tabs" id="todayButton" title="Today">Today<!-- <a id="todayButton" href="test_from.php">Today</a> --></li>
</ul>

<div id="calendar-container">
	<div id="calendar-header"></div>
	<div id="calendar-dates"><!--contains table made by javascript--></div>
</div>


</body>
</html>