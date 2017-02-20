module.exports = function() {
	var cron = require('cron');
	console.log("cron start every 10 minutes");
	var cronJob = cron.job("*/600 * * * * *", function(){
		require('./pollfeed')();
	});
	cronJob.start();
}
