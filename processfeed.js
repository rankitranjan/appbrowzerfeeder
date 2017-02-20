var FeedParser = require('feedparser');
var request = require('request');    
var feedparser = new FeedParser();

var redis = require("redis");
var redis_subscriber = redis.createClient();
var redis_publisher  = redis.createClient();


var host = "http://asiatrotter.org:5111";
//var host = "http://localhost:5111";

redis_subscriber.subscribe("process_feed");

redis_subscriber.on("message", function (channel, categoryString) {
    if(channel == "process_feed"){
    	var splitted = categoryString.split('||');

    	var category = slugify(splitted[0]);
    	if(splitted[0] == "-"){
    		category = splitted[0];
    	}
    	var sub_category = slugify(splitted[1]);
    	if(splitted[1] == "-"){
			sub_category = splitted[1];
    	}
    	var url = splitted[2];


    	var req = request(url);

        var feedparser = new FeedParser();

        /*req.on('error', function (error) {
          // handle any request errors
        });*/
        req.on('response', function (res) {
            var stream = this;

            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            stream.pipe(feedparser);
        });


        /*feedparser.on('error', function(error) {
          // always handle errors
          console.log('Error');
        });*/
        var endpoint = host + "/post-feed/techcrunch/"+ category + "/" + sub_category
        feedparser.on('readable', function() {
          	// This is where the action is!
          	var stream = this;
          	var items = [];
            while (item = stream.read()) {
                var temp_item = {};
                temp_item['title'] = item.title;

                var link = item.origlink;

                if(link == null){
                	console.log(item.link)
                	link = item.link;
                }

                temp_item['link'] = [ { '$' : { 'href': link } } ]
                temp_item['updated'] = [ item.pubdate ]

                /*console.log('***********************************************')
                console.log(temp_item);
                console.log('***********************************************')*/

                items.push(temp_item);
            }
			var formData = {feed: {entry: items }}
            request.post({
            	url: endpoint, form: formData ,
            	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }, function callback(err, httpResponseBody, body) {
            	console.log(body);
            });
                    
        });

    }
});

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}