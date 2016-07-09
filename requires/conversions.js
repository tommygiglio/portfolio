module.exports = {
  daysSince: function (now, then) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  // need to make a constants file of variables
    var numberOfDays = (now.getTime() - then.getTime())/(oneDay);
  // need to reorder calcuation above    
    return numberOfDays;
  },

  getFeet: function (meters) {
  	return meters*3.28084;
  },

  getHours: function (seconds) {
    return seconds*0.000277778;
  },

  getHours: function (seconds) {
    return seconds*0.000277778;
  },

  getMiles: function (meters) {
    return meters*0.000621371192;
  },

  milesPerHour: function (meters) {
    return meters*2.23694;
  }
};





