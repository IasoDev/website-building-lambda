var AWS = require("aws-sdk");
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var attr = require('dynamodb-data-types').AttributeValue;
const s3 = new AWS.S3(); 
var userIdPatientMap = {
"amzn1.ask.account.AGE32LURM75ARCMWXHNLEWGHD5WQ7BS4TQQN2FSGVNTRO43XT22R2THH5EH5RRDFJSS5PS4AM7HAKUAYLBVI3AMAGXABCALSTTUH635ANFL545DZFV76DEVFHDY3V6LBMQIC3DM5NS5XHYIPZ6FHI35QW6QPDXPHITXVK65UNTAT7JIPADYCLMNBM7YNC7I6IZBPTTOM4Q5VJTA":{
	name: "Herr Heinrich",
	room: "13"
	}
};

export default function(event, context, callback){
    console.log('Received event:', JSON.stringify(event, null, 2));

     var writeResultsToS3 = (err, result) => {
        if ( err ) {
            console.log(err, err.stack);
            callback(err, 'There was an error');
        } else {	
			console.log(JSON.stringify(result));
			var requestListRaw = result.Items;
			var requestList = [];
			for (var i = 0; i < requestListRaw.length; i++) {
				var itemUnwrapped = JSON.parse(JSON.stringify(attr.unwrap(requestListRaw[i])));
				var requestIdSplitted = itemUnwrapped.requestId.split(".");
				requestIdSplitted.splice(requestIdSplitted.length -1,1);
				var userId = requestIdSplitted.join('.');
				var user = userIdPatientMap[userId];
				console.log(requestIdSplitted);
				console.log(userId);
				console.log(user);
				console.log(itemUnwrapped);
				itemUnwrapped["room"] = user.room;
				itemUnwrwapped["name"] = user.name;
				requestList.push(itemUnwrapped);
			}
			var data = "{\"Requests\":" + JSON.stringify(requestList) + "}";
			console.log(data);
            var params = {Bucket: 'notification-panel', Key: 'data.json', Body: data};
            s3.upload(params, callback);
        }
    }; 
    var params = {
	 //ProjectionExpression: "mapAttr", //This can be used to just select specific keys
	 TableName: "Requests"
	};
    dynamoDB.scan(params, writeResultsToS3);
};
