var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const s3 = new AWS.S3(); 

export default function(event, context, callback){
    console.log('Received event:', JSON.stringify(event, null, 2));
    
/*     var writeResultsToS3 = (err, results) => {
        if ( err ) {
            console.log(err, err.stack);
            callback(err, 'There was an error');
        } else {
            var params = {Bucket: 'votingdemo', Key: 'data.json', Body: JSON.stringify(results)};
            s3.upload(params, callback);
        }
    }; */
    
    //dynamo.scan({ TableName: 'VoteTally', ConsistentRead: true }, writeResultsToS3);
    
	var params = {
	 //ProjectionExpression: "mapAttr", //This can be used to just select specific keys
	 TableName: "Requests"
	};

	dynamodb.scan(params, function(err, data) {
	  if (err) {
		console.log("Error", err);
	  }
	  else {
		console.log(JSON.stringify(data));
		}
	  });
};
