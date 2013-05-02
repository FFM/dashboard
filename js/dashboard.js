$(document).ready(function() {


  var StartView = Backbone.View.extend({
    template: "/templates/startpage.html",
   
    el: $("#app"),

    initialize: function() {
      },

    render: function() {
      var el=this.$el;
      $.get(this.template, function(t) {
        
        el.html(Mustache.render(t,{}));
        });
      }
   });

  var UserView = Backbone.View.extend({
    template: "/templates/user.html",
   
    el: $("#app"),

    initialize: function() {
      },

    render: function() {
      var el=this.$el;
      $.get(this.template, function(t) {
        
        el.html(Mustache.render(t,{}));
        });
      }
   });

  var NodeView = Backbone.View.extend({
    template: "/templates/node.html",
   
    el: $("#app"),

    initialize: function() {
      },

    render: function() {
      var el=this.$el;
      $.get(this.template, function(t) {
        
        el.html(Mustache.render(t,{}));

		// google maps
		var map;
		var mapOptions = {
		  zoom: 13,
		  center: new google.maps.LatLng(48.184864, 16.312241),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		  //mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		//console.log(map);

		var latlon = new google.maps.LatLng(48.184864, 16.312241);
		//var marker = new google.maps.Marker({
		//	      position: latlon,
		//	      map: map,
		//	      title:"nodeName!"
		//	  });
		// google.maps.event.addDomListener(window, 'load', initialize);
		var contentString = '<div id="content">'+
		  '<div id="siteNotice">'+
		  '</div>'+
		  '<h3 id="firstHeading" class="firstHeading">nodeName</h3>'+
		  '<div id="bodyContent">'+
		  '<p><b>nodeName</b>, also referred to as blaFasel has been online since: &lt;date&gt;<p/>' +
		  'It has x devices. Link qualities: .... <p/>'+
		  '<p><a href="http://en.wikipedia.org/wiki/Wanker">source</a><p/>'+
		  '</div>'+
		  '</div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		var marker = new google.maps.Marker({
			position: latlon,
			map: map,
			title: 'nodeName!'
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});

      });
    }	// end of render: function()
   });


  var AppRouter=Backbone.Router.extend({
    routes: {
      "user": "user", 
      "node": "node",
      "*var": "start"
      },

  
    user: function() {
      var v=new UserView;
      v.render();
      },
    
    node: function() {
      var v=new NodeView;
      v.render();
      },

    start: function() {
      console.log("start");
      var v=new StartView;
      v.render();
     },
  });

  var app_router=new AppRouter;
  Backbone.history.start();
});
