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
		  zoom: 8,
		  center: new google.maps.LatLng(-34.397, 150.644),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		console.log(map);

		// google.maps.event.addDomListener(window, 'load', initialize);

        });
      }
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
