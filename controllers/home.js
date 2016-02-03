// Require these modules
var strava = require("strava-v3");
var async = require("async");

// Functions to be used below
function daysSince(now, then) {
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var numberOfDays = Math.abs((then.getTime() - now.getTime())/(oneDay));    
  return numberOfDays;
}

function getFeet(i) {
    return i*3.28084;
}

function getHours(i) {
    return i*0.000277778;
}

function getMiles(i) {
     return i*0.000621371192;
}

function milesPerHour(i) {
  return i*2.23694;
}

function milesRemaining(i) {
  return 3000-i;
}

// homeController that supplies Strava content to the homepage
exports.index = function(request, response) {  
  async.parallel([
  function(callback){
    strava.athlete.listActivities({
      'after':'1451606400', // time after Jan 1 2016
      'id':'2412583', // my account id
      'access_token':process.env.ACCESS_TOKEN
    },function(err,payload) {
      callback(err,payload);
    });
  },
  function(callback){
    strava.athletes.stats({
      'id':'2412583',
      'access_token':process.env.ACCESS_TOKEN
    },function(err,payload) {
      callback(err,payload);
    });
  }
], function(err, results) {
    var athlete = results[1];
    var ytdDistance = getMiles(athlete.ytd_ride_totals.distance).toFixed(0);
    var milesToGo = milesRemaining(ytdDistance);
    var ytdTime = getHours(athlete.ytd_ride_totals.moving_time).toFixed(0);
    var ytdClimbing = getFeet(athlete.ytd_ride_totals.elevation_gain).toFixed(0);

    var activities = results[0];
    var recentActivity = activities[activities.length - 1];
    var recentActivityName = recentActivity.name;
    var recentActivityID = recentActivity.id;

    // Recent activity date variables
    var today = new Date();
    var recentActivityDate = new Date (recentActivity.start_date_local);
    var daysSinceLastRide = Math.floor(daysSince(today, recentActivityDate));

    // YTD average speed variables
    var averageSpeed = 0;
    for (i = 0; i < activities.length; i++) {
        averageSpeed += activities[i].average_speed;
    }
    var ytdAverageSpeed = milesPerHour(averageSpeed/activities.length).toFixed(1);

    response.render('pages/index', {
      daysSinceLastRide: daysSinceLastRide,
      milesToGo: milesToGo,
      recentActivityDate: recentActivityDate,
      recentActivityID: recentActivityID,
      recentActivityName: recentActivityName,
      ytdAverageSpeed: ytdAverageSpeed,
      ytdClimbing: ytdClimbing,
      ytdDistance: ytdDistance,
      ytdTime: ytdTime
    });
  }); 
};