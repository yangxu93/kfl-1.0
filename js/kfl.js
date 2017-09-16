
var app = angular.module('kfl', ['ionic']);

//自定义服务
app.service('$kflHttp',
  ['$http', '$ionicLoading',
    function ($http, $ionicLoading) {
      this.sendRequest = function (url, handleSucc) {
        $ionicLoading.show({template: 'loading...'})
        $http
          .get(url)
          .success(function (data) {
            $ionicLoading.hide();
            handleSucc(data);
          })
      }

    }])


//配置状态
app.config(
  function ($stateProvider,
            $ionicConfigProvider,
            $urlRouterProvider) {
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
      .state('kflStart', {
        url: '/kflStart',
        templateUrl: 'tpl/start.html'
      })
      .state('kflMain', {
        url: '/kflMain',
        templateUrl: 'tpl/main.html',
        controller: 'MainCtrl'
      })
      .state('kflDetail', {
        url: '/kflDetail/:id',
        templateUrl: 'tpl/detail.html',
        controller: 'DetailCtrl'
      })
      .state('kflOrder', {
        url: '/kflOrder/:id',
        templateUrl: 'tpl/order.html',
        controller: 'OrderCtrl'
      })
      .state('kflMyOrder', {
        url: '/kflMyOrder',
        templateUrl: 'tpl/myOrder.html',
        controller: 'myOrderCtrl'
      })
      .state('kflCart', {
        url: '/kflCart',
        templateUrl: 'tpl/cart.html',
        controller: 'cartCtrl'
      })

    $urlRouterProvider.otherwise('/kflStart');

  })

//创建一个父控制器
app.controller('parentCtrl', ['$scope', '$state',
  function ($scope, $state) {

    $scope.jump = function (desState, arg) {
      $state.go(desState, arg);
    }
  }
]);

app.controller('MainCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    $scope.hasMore = true;
    //加载首页数据
    $kflHttp.sendRequest(
      'data/dish_getbypage.php',
      function (data) {
        console.log(data);
        $scope.dishList = data;
      })
    //给按钮定义一个处理函数：加载更多数据
    $scope.loadMore = function () {
      $kflHttp.sendRequest(
        'data/dish_getbypage.php?start=' + $scope.dishList.length,
        function (data) {
          if (data.length < 5) {
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      )
    }

    $scope.inputTxt = {kw: ''};

    //监听用户输入 的关键词进行搜索
    $scope.$watch('inputTxt.kw', function () {

      $kflHttp.sendRequest(
        'data/dish_getbykw.php?kw=' + $scope.inputTxt.kw,
        function (data) {
          if (data.length > 0) {
            $scope.dishList = data;
          }
        }
      )

    })
  }
])

app.controller('DetailCtrl',
  ['$scope', '$kflHttp', '$stateParams', '$ionicPopup',
    function ($scope, $kflHttp, $stateParams, $ionicPopup) {
      console.log($stateParams);
      $scope.addToCart = function () {
        $kflHttp.sendRequest(
          'data/cart_update.php?uid=1&did=' + $stateParams.id + "&count=-1",
          function (result) {
            console.log(result);
            $ionicPopup.alert({
              template: '添加到购物车成功'
            })
          }
        )
      }

      $kflHttp.sendRequest(
        'data/dish_getbyid.php?id=' + $stateParams.id,
        function (data) {
          console.log(data);
          $scope.dish = data[0];
        }
      )
    }
  ])

app.controller('myOrderCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    var userPhone = sessionStorage.getItem('phone');
    $kflHttp
      .sendRequest(
      'data/order_getbyphone.php?phone=' + userPhone,
      function (data) {
        console.log(data);
        $scope.orderList = data;
      }
    )
  }
])

app.controller('cartCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {

    $scope.editEnable = false;
    $scope.editText = '编辑'
    $scope.toggleEdit = function () {
      $scope.editEnable = !$scope.editEnable;
      if ($scope.editEnable) {
        $scope.editText = '完成'
      }
      else {
        $scope.editText = '编辑'
      }
    }








