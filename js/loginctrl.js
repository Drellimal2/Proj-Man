app.controller('LoginCtrl', ['$scope', function ($scope) {
	
	var Locker = Parse.Object.extend("Locker");
	
	
	$scope.update = function(){
		Parse.User.logIn("LabTech", "labtech", {
  		success: function(user) {

			window.location.assign('/main.html');

  		},
  		error: function(user, error) {
			alert("Error");
		}
		});
	};
	
	
		
	
}]);