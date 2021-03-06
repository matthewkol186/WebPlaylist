(function(){
'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['LocalStorageModule']);

app.config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
});

app.directive('site', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue.indexOf(".com") > -1 || 
        	viewValue.indexOf(".net") > -1 || 
        	viewValue.indexOf(".org") > -1 || 
        	viewValue.indexOf(".biz") > -1 || 
        	viewValue.indexOf(".edu") > -1 || 
        	viewValue.indexOf(".gov") > -1 ) {
          // it is valid
          ctrl.$setValidity('site', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('site', false);
          return undefined;
        }
      });
    }
  };
});

var curr = 0;

var curinlist = false;

var playnames = ['Cool', 'Bad',];

var links = [
	[
		{
			name: 'Time',
			url: 'http://www.time.com',
			notes: 'Check out this nifty news site!'

		},

		{
			name: 'Imgur',
			url: 'http://www.imgur.com',
			notes: 'The cat on page 3 is so cute!'
		},

		{
			name: 'Agilex',
			url: 'https://www.agilex.com/',
			notes: 'What an awesome company!'
		},

	], 

	[
		{
			name: 'Video',
			url: 'http://www.dailymotion.com/embed/video/x1ddusq',
			notes: 'Check out this nifty software site!'

		},

		{
			name: 'Facts',
			url: 'http://www.youtube.com/embed/DfgkAJmp9-A',
			notes: 'This is an awesome video!'
		},

		{
			name: 'Details',
			url: 'http://www.ninds.nih.gov/disorders/brain_basics/know_your_brain.htm',
			notes: 'This is an awesome educational resource.'
		},

		{
			name: 'Journal',
			url: 'http://www.journals.elsevier.com/neuroscience/',
			notes: 'This is an awesome educational resource.'
		},
	],
];


app.controller('ListController', ['$scope', 'localStorageService', function($scope, localStorageService){

	this.numon = curr;

	this.listnames = playnames;

	this.multilist = links;

	if(localStorageService.get('playlists') != null)
	{
		var x = localStorageService.get('playlists');
		this.multilist = x;
		this.listnames = localStorageService.get('playlistnames');
	}

	this.inlist = curinlist;

	this.list = links[this.numon];

	this.playing = false;

	this.play = function(){
		this.playing = (!this.playing);
		console.log(this.playing);
	};

	this.currentlyPlaying = function(){
		return this.playing;
	};

	this.remove = function(index){
		this.multilist[this.numon].splice(index, 1);
		localStorageService.set('playlists', this.multilist);
		localStorageService.set('playlistnames', this.listnames);
	}

	this.removePlaylist = function(index){
		this.listnames.splice(index, 1); 
		this.multilist.splice(index, 1);
		localStorageService.set('playlists', this.multilist);
		localStorageService.set('playlistnames', this.listnames);
	}

	this.shorten = function(str){
		if(str.length>6)
		{
			return str.substring(0, 6) + '...';
		}
		else
		{
			return str;
		}
	}

	this.shortenlong = function(str){
		if(str.length>20)
		{
			return str.substring(0, 20) + '...';
		}
		else
		{
			return str;
		}
	}

	this.shortenlongest = function(str){
		if(str.length>45)
		{
			return str.substring(0, 45) + '...';
		}
		else
		{
			return str;
		}
	}

	this.select = function(temp){
		this.inlist = true;
		this.numon = temp;
		this.list = links[temp];
	}
}]);

app.controller('AddController', ['$scope', 'localStorageService', function($scope, localStorageService){
	var clicked = false;

	this.site = {};

	this.setClick = function(){
		this.clicked = (!this.clicked);
		console.log(this.clicked);
	};

	$scope.resetForm = function(){
	    $scope.AddSite.$setPristine();
	};

	this.addSite = function(list, numon){
			this.site.url = "http://www." + this.site.url;
			list[numon].push(this.site);
			localStorageService.set('playlists', list);
			this.site = {};
			$scope.resetForm();
	};

}]);

app.controller('AddListController', ['$scope', 'localStorageService', function($scope, localStorageService){
	this.clicked = false;

	this.listname = '';

	this.setClick = function(){
		this.clicked = (!this.clicked);
		console.log(this.clicked);
	};

	$scope.resetForm = function(){
	    $scope.AddList.$setPristine();
	};

	this.addList = function(multilist, listnames){
		var emptyarr = [];
		multilist.push(emptyarr);
		listnames.push(this.listname);
		this.listname = '';
		localStorageService.set('playlists', multilist);
		localStorageService.set('playlistnames', listnames);
		$scope.resetForm();
	};

}]);

app.controller('PlayController', function(){
	this.num = 0;

	this.next = function(length){
		if(this.num!=length-1)
		{
			this.num += 1;
		}
	}

	this.prev = function(){
		if(this.num!=0)
		{
			this.num -= 1;
		}
	}
});

})()


