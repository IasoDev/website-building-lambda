var AWS = require("aws-sdk");
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const s3 = new AWS.S3(); 

export default function(event, context, callback){
    console.log('Received event:', JSON.stringify(event, null, 2));

     var writeResultsToS3 = (err, result) => {
        if ( err ) {
            console.log(err, err.stack);
            callback(err, 'There was an error');
        } else {
			console.log(JSON.stringify(result));
			var requestList = result.Items;
			var data = "{'Requests':" + JSON.stringify(requestList) + "}";
			console.log(data);
            var params = {Bucket: 'notification-panel', Key: 'data.json', Body: JSON.stringify(requestList)};
            s3.upload(params, callback);
        }
    }; 
    var params = {
	 //ProjectionExpression: "mapAttr", //This can be used to just select specific keys
	 TableName: "Requests"
	};
    dynamoDB.scan(params, writeResultsToS3);
};
