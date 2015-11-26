app.controller('EmulatorCtrl', function ($scope, $uibModal, $log) {

	var Locker = Parse.Object.extend("Locker");
	$scope.lockers = [];
	$scope.user = Parse.User.current().get("username");
	var getlockers = function () {

		var query = new Parse.Query(Locker);
		query.limit(60);
		query.ascending("number");
		query.find({
		    success: function (results) {
				alert("Emulator loaded, successfully retrieved " + results.length + " lockers.");
			 	$scope.lockers = [];
			  	var test = [];
			  
			  	for (var x =0; x<results.length; x++){
					test.push(results[x]);
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
		console.log($scope.lockers);
	};
	
	getlockers();
	
	$scope.refresh = function(){
		getlockers();
		
	}
	
	$scope.setmode = function(v){
		$scope.mode =v;
	}
	
	
	$scope.isavailable = function(locker){
		if(locker.get("inuse") == true){
			return "not_available";
		}else{
			return "available";
		}
	};
	
  	$scope.animationsEnabled = true;

  	$scope.open = function (locker) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        locker: function () {
          return locker;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, locker) {

    $scope.selected = locker;
	$scope.log = { lockernum : locker.get("number")};

	
    $scope.ok = function () {
		var Log = Parse.Object.extend("Log");
		var llog = new Log();
		llog.set("lockernum", $scope.log.lockernum);
		llog.set("user", $scope.log.user);
		var d = new Date();
		llog.set("time",d.toString() );
		if($scope.selected.get("user") != ""){
			llog.set("message", "Locker #"+$scope.log.lockernum + "  has been freed");
		}else{
			llog.set("message", "Locker #"+$scope.log.lockernum + " has been selected by " + $scope.log.user);
			llog.set("type", "alert alert-info");

		}
		$scope.selected.set("user",$scope.log.user);
		$scope.selected.set("inuse", true);
		$scope.selected.set("reserved_at", d.toString());
		c = $scope.selected.get("count");
		$scope.selected.set("count", c+1);
		$scope.selected.save(null, {
		  success: function(llog) {
			// Execute any logic that should take place after the object is saved.

		  },
		  error: function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		  }
		});

		llog.save(null, {
		  success: function(llog) {
			// Execute any logic that should take place after the object is saved.
			$uibModalInstance.close($scope.selected);

		  },
		  error: function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		  }
		});

    };
	
	$scope.checkout = function () {
		var Log = Parse.Object.extend("Log");
		var llog = new Log();
		llog.set("lockernum", $scope.log.lockernum);
		llog.set("user", $scope.log.user);
		var d = new Date();
		llog.set("time",d.toString() );
		if($scope.selected.get("user") == $scope.log.user){
			llog.set("message", "Locker #"+$scope.log.lockernum + " has been freed by " + $scope.log.user);
			llog.set("type", "alert alert-info");
			$scope.selected.set("user", "");
			$scope.selected.set("inuse", false);
			$scope.selected.set("reserved_at", "");
		}else{
			llog.set("message", "Attempt to open locker #"+$scope.log.lockernum + " by " + $scope.log.user);
			llog.set("type", "alert alert-danger");

		}
		
		$scope.selected.save(null, {
		  success: function(llog) {
			// Execute any logic that should take place after the object is saved.

		  },
		  error: function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Error updating locker' + error.message);
		  }
		});

		llog.save(null, {
		  success: function(llog) {
			// Execute any logic that should take place after the object is saved.
			$uibModalInstance.close($scope.selected);

		  },
		  error: function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Error Updating logs ' + error.message);
		  }
		});

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});