app.controller('MainCtrl', ['$scope','$uibModal',function ($scope, $uibModal) {
	
	var Locker = Parse.Object.extend("Locker");
	var Log = Parse.Object.extend("Log");

	$scope.lockers= [];
	$scope.logs =[];
	$scope.free = [];
	$scope.used = [];
	$scope.stats = [];
	$scope.mode = 0;
	$scope.mode2=1;
	$scope.user = Parse.User.current().get("username");
	
	var getlogs = function(){
		
		var query = new Parse.Query(Log);
		query.descending("createdAt");
		query.find({
		  success: function(results) {
			  	$scope.logs =[];

			 for(var x = 0; x<results.length;x++){
			 	$scope.logs.push({date: results[x].get("time"), message: results[x].get("message"), type: results[x].get("type"), lockernum: results[x].get("lockernum")});
			 }
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
	}
	
	$scope.getstats = function(){
		var pop = new Parse.Query(Locker);
		pop.descending("count");
		var mru =new Parse.Query(Locker);
		mru.descending("reserved_at");
		mru.limit(1);
		pop.find({
		  success: function(results) {
			  	$scope.stats.push({msg: "Most used locker: " + results[0].get("number")});
			  $scope.stats.push({msg: "Least used locker: " + results[results.length-1].get("number")});
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		mru.find({
		  success: function(results) {
			  	$scope.stats.push({msg: "Most recently reserved: " + results[0].get("number")});
			
		  },
		  error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		  }
		});
		
		for(var x; x < $scope.logs.length; x++){
			if( $scope.logs[x].message.indexOf("freed") != -1){
				$scope.stats.push({msg: "Most recently freed: " + $scope.logs[x].lockernum});
				break;

			}
		}
		
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
		$scope.getstats();
	};
	
	getlockers();
	getlogs();
	
	$scope.refresh = function(){
		getlockers();
		getlockers();
		getlogs();
		getlogs();
		$scope.getstats();
		var m = $scope.mode;
		
		$scope.setmode(2);
		$scope.setmode(m);
		
		
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
	
	$scope.setmode = function(v){
		$scope.mode =v;
	}
	
	$scope.setmode2 = function(v){
		$scope.mode2 =v;
		if(v ==1){
			$scope.makechart();
		}
	}
	
	$scope.isavailable = function(locker){
		if(locker.inuse == true){
			return "not_available";
		}else{
			return "available";
		}
	}
	
	$scope.getmin = function(locker){
		var d1 = new Date();
		var d2 = new Date(locker.time);
		var res = d1.getTime() - d2.getTime();
		return Math.round(res/60000) + " minutes"
	}
	
	$scope.open = function (locker) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent2.html',
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


}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, locker) {

    $scope.selected = locker;
	$scope.log = { lockernum : locker.number};

	
    $scope.ok = function () {
		$uibModalInstance.close($scope.selected);
    };
	

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});