app.controller('LoginCtrl', ['$scope', function ($scope) {
	
	var Locker = Parse.Object.extend("Locker");
	
	$scope.alert = { show: false,
					type: 'danger',
					msg: 'Oh snap! Change a few things up and try submitting again.'
				   };

	$scope.update = function (user) {
		Parse.User.logIn(user.name, user.password, {
			success: function(user) {

				window.location.assign('/main.html');

			},
			error: function (user, error) {
				$scope.alert.show = true;
			}
		});
	};
	
	$scope.hidealert = function (){
		$scope.alert.show = false;
	};
	
	
	var reset = function(){
		var query = new Parse.Query(Locker);
		var lockers = [];
		query.limit(60);
		query.ascending("number");
		query.find({
		    success: function (results) {
				alert("Successfully retrieved " + results.length + " scores.");
			  
			  	for(var x =0; x<results.length; x++){
				  if(results[x].get("inuse")){
				  	lockers.push(results[x]);
				  }
				
			  }
			for(var y=0; y<lockers.length;y++){
			console.log(y);
			lockers[y].set("inuse", false);
			lockers[y].set("user","");
			lockers[y].set("reserved_at","");
			lockers[y].save(null, {
		  success: function(llog) {
			// Execute any logic that should take place after the object is saved.
			  	alert("saved");
		  },
		  error: function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		  }
		});	
			}
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
		
		
		
	};

	//reset();
	$scope.showalert = function (){
		$scope.alert.show = true;
	};

		
}]);