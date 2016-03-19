var app=angular.module("flapperNews",['ui.router'])
.config([
	'$stateProvider',
'$urlRouterProvider',
function ($stateProvider,$urlRouterProvider) {
	$stateProvider.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'MainCtrl',
		resolve:{
			postPromise: ['posts',function (posts) {
				return posts.getAll();
			}]
		}
	});
	$stateProvider.state('posts',{
		url:'/posts/{id}',
		templateUrl:'/posts.html',
		controller: 'postsCtrl'
	});
$urlRouterProvider.otherwise('home');
}])
.controller("MainCtrl",[
	'$scope','posts',
	function ($scope,posts) {
		$scope.posts=posts.posts;
		$scope.addPost=function () {
			if(!$scope.title||$scope.title===''){
				return ;
			}
			posts.create({
				title:$scope.title,
				link:$scope.link
			});
			$scope.title="";
			$scope.link="";
		};

		$scope.incrementUpvotes=function (post) {
			posts.upvote(post);
		};
	}
	])
.controller('postsCtrl',[
	'$scope',
	'$stateParams',
	'posts',
	function ($scope,$stateParams,posts) {
		$scope.post=posts.posts[$stateParams.id];
		$scope.incrementUpvotes=function (comment) {
			comment.upvotes+=1;
		}
		$scope.addComment= function() {
			if (!$scope.body||$scope.body=='') {
					return;
			}
			$scope.post.comments.push({
				author:'user',
				body:$scope.body,
				upvotes:0
			});
			$scope.body="";
		};
	}])
.factory('posts',['$http',function ($http) {
		var o={
			posts:[]
		};
		o.create=function (post) {
			return $http.post('/posts',post).success(function (data) {
				o.posts.push(data);
			});
		}
		o.getAll=function () {
			return $http.get('/posts').success(function (data) {
				angular.copy(data, o.posts);
			});
		};
		o.upvote=function (post) {
			return $http.put('/posts/'+post.id+'/upvote').success(function (data) {
				post.upvotes+=1;
			});
		}
		o.get=function (id) {
			return $http.get('/posts/'+id).then(function (res) {
				return res.data;
			});
		}
		return o;
	}]);
