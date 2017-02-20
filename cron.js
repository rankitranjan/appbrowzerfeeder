module.exports = function() {
	var cron = require('cron');
	console.log("cron start every 1 minute");
	var cronJob = cron.job("*/60 * * * * *", function(){
		require('./pollfeed')();
	});
	cronJob.start();
}
