app.controller('MainCtrl', ['$scope', function ($scope) {
	
	var Locker = Parse.Object.extend("Locker");
	var Log = Parse.Object.extend("Log");

	$scope.lockers= [];
	$scope.logs =[];
	$scope.free = [];
	$scope.used = [];
	$scope.mode = 0;
	$scope.mode2=1;
	$scope.user = Parse.User.current().get("username");
	
	var getlogs = function(){
		
		var query = new Parse.Query(Log);
		query.ascending("createdAt");
		query.find({
		  success: function(results) {
			  	$scope.logs =[];

			 for(var x = 0; x<results.length;x++){
			 	$scope.logs.push({date: results[x].get("time"), message: results[x].get("message"), type: results[x].get("type")});
			 }
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
	}
	
	var getlockers = function(){

		var query = new Parse.Query(Locker);
		query.limit(60);
		query.ascending("number");
		query.find({
		  success: function(results) {
			  $scope.lockers = [];
			  $scope.free = [];
			$scope.used = [];
			  var test = [];
			  
			  for(var x =0; x<results.length; x++){
				  if(results[x].get("inuse")){
				  	$scope.used.push({ number: results[x].get("number"),
							 user:results[x].get("user"),
							 inuse: results[x].get("inuse"),
							 time:results[x].get("reserved_at")});
				  }else{
				  	$scope.free.push({ number: results[x].get("number"),
							 user:results[x].get("user"),
							 inuse: results[x].get("inuse"),
							 time:results[x].get("reserved_at")});
				  }
				  test.push({ number: results[x].get("number"),
							 user:results[x].get("user"),
							 inuse: results[x].get("inuse"),
							 time:results[x].get("reserved_at")});
				  if(x%3 ==2){
				  	$scope.lockers.push(test);
					  test = [];
				  }

			  }
			 console.log("yay");
			  $scope.makechart();
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		console.log($scope.lockers);
	};
	
	getlockers();
	getlogs();
	
	$scope.refresh = function(){
		getlockers();
		getlockers();
		getlogs();
		getlogs();
		var m = $scope.mode;
		
		$scope.setmode(2);
		$scope.setmode(m);
		
		
	}
	
	$scope.setmode = function(v){
		$scope.mode =v;
	}
	
	$scope.setmode2 = function(v){
		$scope.mode2 =v;
	}
	
	
	
	$scope.isavailable = function(locker){
		if(locker.inuse == true){
			return "not_available";
		}else{
			return "available";
		}
	}
	
	$scope.makechart = function(){
		var chart = AmCharts.makeChart( "chartdiv", {
	  "type": "pie",
	  "theme": "light",
	  "dataProvider": [ {
		"country": "Used",
		"lockers": $scope.used.length
	  }, {
		"country": "Free",
		"lockers": $scope.free.length
	  } ],
	  "valueField": "lockers",
	  "titleField": "country",
	   "balloon":{
	   "fixedPosition":true
	  },
	  "export": {
		"enabled": true
	  }
	} );
	}
	
	
}]);