module.exports = function() {

    var redis = require("redis");
    var redis_subscriber = redis.createClient();
    var redis_publisher  = redis.createClient();

    var techcrunch = {
        // 'Startups' : {
        //     'link' : 'http://feeds.feedburner.com/TechCrunch/startups'
        // },
        // 'Fundings and Exits' : {
        //     'link' : 'http://feeds.feedburner.com/TechCrunch/fundings-exits'
        // },
        // 'Social' : {
        //     'link' : 'http://feeds.feedburner.com/TechCrunch/social'
        // },
        'Mobile' : {
            'link' : 'http://feeds.feedburner.com/Mobilecrunch'
        },
        'Gadgets' : {
            'link' : 'http://feeds.feedburner.com/crunchgear'
        },
        'Europe' : {
            'link' : 'http://feeds.feedburner.com/Techcrunch/europe'
        },
        // 'Enterprise TechCrunchIT' : {
        //     'link' : 'http://feeds.feedburner.com/TechcrunchIT'
        // },
        'GreenTech' : {
            'link' : 'http://feeds.feedburner.com/TechCrunch/greentech'
        }
    }   

    var getAllFeeds = {
        techcrunch : function() {
            return techcrunch;
        },
    };

    Object.keys(getAllFeeds).forEach(function(publisher){
        categories = getAllFeeds[publisher]();
        for(category in categories){
            var categoryObj = categories[category];
            var publish_data = category + '||-||' + categoryObj['link'];
            redis_publisher.publish("process_feed", publish_data);
        }
    })    
}