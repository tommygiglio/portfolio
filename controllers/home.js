// Require these modules
var strava = require("strava-v3");
var async = require("async");

// Require these files
var conversions = require('../requires/conversions');

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
    // Variables needed to pass content
    var activities = results[0];
    var athlete = results[1];
    var recentActivity = activities[activities.length-1];
    var recentActivityDate = new Date (recentActivity.start_date_local);
    var today = new Date();
    
    var averageSpeed = 0;
    
//MAKE INTO A FUNTION AND PUT IN CONVERSIONS.JS
    // Loop to calculate average speed across all activities
    for (i = 0; i < activities.length; i++) {
        averageSpeed += activities[i].average_speed;
    }

    // Pass content below to the browser
    var content = {}; 
    content.recentActivityID = recentActivity.id;
    content.recentActivityName = recentActivity.name;
    content.ytdClimbing = conversions.getFeet(athlete.ytd_ride_totals.elevation_gain).toFixed(0);
    content.ytdDistance = conversions.getMiles(athlete.ytd_ride_totals.distance).toFixed(0);
    content.ytdTime = conversions.getHours(athlete.ytd_ride_totals.moving_time).toFixed(0);   
    content.daysSinceLastRide = Math.floor(conversions.daysSince(today, recentActivityDate));
    content.ytdAverageSpeed = conversions.milesPerHour(averageSpeed/activities.length).toFixed(1);

    response.render('pages/index', {content: content});
  }); 
};