angular.module('starter')

.controller('AppCtrl', function($scope, $http, $state, $ionicPopup, AuthService, AUTH_EVENTS){
  $scope.username = AuthService.username();
   $scope.leavebalance = AuthService.leavebalance();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event){
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized',
      template: 'You are not Allowed to Access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session lost !',
      template: 'Sorry, You have to Log in again.'
    });
  });

  $scope.setCurrentUsername = function(name){

    var dt = $.jStorage.get("dataserve");

    $scope.username = dt.user_lastname;

  };


   $scope.setLeaveBalance = function(name){

    var at = $.jStorage.get("dataserve");

    $scope.leavebalance = at.user_leave_balance;

  };

})


 .controller('LoginCtrl',  function($scope, $state, $ionicPopup, AuthService){
    $scope.data = {};

    $scope.login = function(data){
      AuthService.login(data.username, data.password).then(function(authenticated){
        $state.go('main.dash', {}, {reload: true});
        $scope.setCurrentUsername(data.username);
        $scope.setLeaveBalance(data.username);
    }, function(err){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed !',
        template: 'Please check your credentials !'
      });
    });
  };
})



//  .controller('DashCtrller', function($scope, $http) {
//   $scope.application = "";
//   $http.get('http://localhost:3000/timeoffapi/application')
//     .success(function(data, status, headers,config){
//       console.log('data success');
//       console.log(data); 
//       console.log(data.application.appDate);
//       console.log(data.application.user_appDate);

//       $scope.application = data; 
//     })
//     .error(function(data, status, headers,config){
//       console.log('data error');
//     })
//     .then(function(application){
//       things = application.data;
//     });
// })

  .controller('DashCtrller',['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
        $scope.application = data.application;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        // console.log($scope.whichapplication);

        $scope.onItemDelete = function(item) {
          $scope.application.splice($scope.application.indexOf(item), 1);
        }

        $scope.doRefresh = function(){
          $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
            $scope.application = data.application;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }

        $scope.toggleStar = function(item){
            item.star = !item.star;
        }

        $scope.moveItem = function(item, fromIndex, toIndex){
          $scope.application.splice(fromIndex, 1);
          $scope.application.splice(toIndex, 0, item);
        };
  });

    $scope.Accept = function() {
      $http.put('http://localhost:3000/timeoffapi/application',1).success(function(){
            console.log("Accepted")
        }).error(function(data){
            console.log(":(")
        });

      }
}])

 // Apply for leave Controller 

.controller('AppleaveCtrl', function($scope, $http){

      $scope.value = 15;
      $scope.min = 1;
      $scope.max = 30;


    $scope.applyModel = {};

    $scope.onSubmit = function(valid) {

      if (valid) {
          console.log("Submitted!");
          console.log($scope.applyModel);

      $http.post('http://localhost:3000/timeoffapi/application', $scope.applyModel)
        .success(function(data){
            console.log(":)")
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid Form!");
      }
      



    };
})


// Create New User
.controller('NewUserCtrl', function($scope, $http){

      $scope.value = 15;
      $scope.min = 1;
      $scope.max = 30;


    $scope.userModel = {};

    $scope.onSubmit = function(valid) {

      if (valid) {
          console.log("New User Created!");
          console.log($scope.userModel);


      $http.post('http://localhost:3000/timeoffapi/biodatas', $scope.userModel)
        .success(function(data){
            console.log(":)")
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid User!");
      }

    };
})


// Accept 
.controller('superuserCtrller', function($scope, $http){
    $scope.Accept = function() {
      $http.put('http://localhost:3000/timeoffapi/application').success(function(){
            console.log("Accepted")
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid Appli!");
      }
      
    };
})



.controller('EmailCtrl', function($cordovaEmailComposer, $scope) {
$cordovaEmailComposer.isAvailable().then(function() {
   // is available
   alert("available");
    console.log("Hello!");
 }, function () {
   // not available
    console.log("Hello!");
   alert("not available");
 });
 $scope.sendEmail = function(){
  var email = {
     to: 'teste@example.com',
     cc: 'teste@example.com',
     bcc: ['john@doe.com', 'jane@doe.com'],
     attachments: [
       'file://img/logo.png',
       'res://icon.png',
       'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
       'file://README.pdf'
     ],
     subject: 'Mail subject',
     body: 'How are you? Nice greetings from Leipzig',
     isHtml: true
  };

 $cordovaEmailComposer.open(email).then(null, function () {
   // user cancelled email
  });
 console.log("Hello!");
 }
})



.controller('DashCtrl', function($scope, $state, $ionicPopup, $http, AuthService){
  $scope.logout = function(){
    AuthService.logout();
    $state.go('login');
  };
  $scope.performValidRequest = function(){
    $http.get('http://localhost:8100/valid').then(
      function(result){
        $scope.response = result;
      });
  };

  $scope.performUnauthorizedRequest = function(){
    $http.get('http://localhost:8100/notauthorized').then(
      function(result){ 
      }, function(err){
        $scope.response = err;
      });
  };

  $scope.performInValidRequest = function(){
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result){
      }, function(err){
        $scope.response = err;
      });
  };
});

