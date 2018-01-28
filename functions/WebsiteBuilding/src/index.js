var AWS = require("aws-sdk");
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var attr = require('dynamodb-data-types').AttributeValue;
const s3 = new AWS.S3(); 

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
				requestList.push(attr.unwrap(requestListRaw[i]));
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
