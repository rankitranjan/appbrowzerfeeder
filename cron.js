module.exports = function() {
	var cron = require('cron');
	console.log("cron start every 5 minute");
	var cronJob = cron.job("*/300 * * * * *", function(){
		require('./pollfeed')();
	});
	cronJob.start();
}
