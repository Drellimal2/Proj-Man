app.controller('MainCtrl', ['$scope', function ($scope) {
	
	var Locker = Parse.Object.extend("Locker");
	$scope.lockers= [];
	$scope.showlockers = false;
	$scope.user = Parse.User.current().get("username");
	var getlockers = function(){
		
		var query = new Parse.Query(Locker);
		query.limit(60);
		query.ascending("number");
		query.find({
		  success: function(results) {
			alert("Successfully retrieved " + results.length + " scores.");
			  var test = [];
			  for(var x =0; x<results.length; x++){
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

			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
	};
	
	getlockers();
	
	
	$scope.setlockers = function(){
			$scope.showlockers = true;

	};
	
	$scope.isavailable = function(locker){
		if(locker.inuse == true){
			return "not_available";
		}else{
			return "available";
		}
	}
		
	
}]);