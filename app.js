var app=angular.module("flapperNews",['ui.router']);

app.factory('posts',[function () {
	var o={
		posts:[]
	};
	return o;
}]);

app.controller("MainCtrl",[
	'$scope','posts',
	function ($scope,posts) {
		$scope.posts=posts.posts;
		$scope.addPost=function () {
			if(!$scope.title||$scope.title===''){
				return ;
			}
			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes:0
			});
			$scope.title="";
			$scope.link="";
		};
		$scope.incrementUpvotes=function (post) {
			post.upvotes+=1;
		};
	}
	]);

app.controller('postsCtrl',[
	'$scope',
	'$stateParams',
	'posts',
	function ($scope,$stateParams,posts) {
		$scope.post=posts.posts[$stateParams.id];
		$scope.posts.push({
			title:$scope.title,
			link:$scope.link,
			upvotes:0,
			comments:[
				{author:'joy',body:'cool post',upvotes:0},
				{author:'bob',body:'mast',upvotes:2}
			]
		});
	}])
	app.config([
		'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider,$urlRouterProvider) {
		$stateProvider.state('home',{
			url:'/home',
			templateUrl:'/home.html',
			controller:'MainCtrl'
		});
		$stateProvider.state('posts',{
			url:'/posts/{id}',
			templateUrl:'/posts.html',
			controller: 'postsCtrl'
		});
	$urlRouterProvider.otherwise('home');
	}]);
