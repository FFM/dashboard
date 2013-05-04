var user;

$(document).ready(function() {

  var base="https://nodedb2.confine.funkfeuer.at/api/";
 
  var UserModel = Backbone.Model.extend({

    initialize: function() {
      this.on("change",this.attributesChanged);
      cookies=_.reduce(_.map(document.cookie.split(";"),function(x) {
        return x.split("=") }),function(x,y) {x[y[0].substr(1)]=y[1]; 
        return x},{})
      this.set("rat",cookies.RAT);
      this.attributesChanged();},

    attributesChanged: function() {
      var v=new LoginView({model: this});
      v.render();
      },

    login: function() {
      d=$("#loginform").serializeArray()
      data=_.reduce(d,function(x,y) {x[y.name]=y.value; return x},
        {})
      var auth="https://nodedb2.confine.funkfeuer.at/RAT";
      var t=this;  
      $.ajax(auth, 
        {type: "POST", 
         data: data,
         success: function(d) {
          user.set("rat",d.RAT);
          document.cookie="RAT="+d.RAT;
          }}); },

    logout: function() {
      user.set("rat",undefined);
      document.cookie="RAT=;expires: -1";
      }
    })

  var NodeModel = Backbone.Model.extend({
    urlRoot: base+"FFM-Node/",
    idAttribute: "pid",
    initialize: function() {
      this.on("change",this.attributesChanged);
        },
    
    attributesChanged: function() {
        }

    });

  var NodeList = Backbone.Collection.extend({
    model: NodeModel,
    urlRoot: base+"FFM-Node",
    url: base+"FFM-Node?AQ=owner,EQ,106&verbose",
    initialize: function() {
      },

    listChange: function() {
      var v=new OverView({model: this});
      v.render();
      }
    });

  var LoginView= Backbone.View.extend ({
    login: "<form id='loginform'>"+
      "<input type='email' name='username' placeholder='Email' />"+
      "<input type='password' name='password' placeholder='Passwort' />"+
      "<div class='btn btn-small'>Login</a>"+
      "</form>",
    
    logout: "<div class='btn btn-small'>Logout</div>",

    el: $("#login"),

    initialize: function () {},

    render: function() {
      el= $("#login");
      if (this.model.get("rat")!=undefined) {
        el.html(this.logout);
        $("div.btn",this.$el).on("click",this.model.logout);
        }
      else {  
        el.html(this.login);
        $("div.btn",this.$el).on("click", this.model.login);
        }
      }
    });

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
   
  var NodeEdit = Backbone.View.extend({
    template: "/templates/node-edit.html",
   
    initialize: function() {
      },

    render: function() {
      var el=$("#node");
      var model=this.model;
      $.get(this.template, function(t) {
        el.html(Mustache.render(t,model.toJSON().attributes));
        });
      }
   });

  var NodeStats = Backbone.View.extend({
    template: "/templates/node-statistics.html",
   
    initialize: function() {
      },

    render: function() {
      var el=$("#statistics");
      var model=this.model;
      $.get(this.template, function(t) {
        el.html(Mustache.render(t,model.toJSON().attributes));
		    var map;
        var lat=model.get("attributes").position.lat;
        var lon=model.get("attributes").position.lon;
		    var mapOptions = {
		      zoom: 13,
		      center: new google.maps.LatLng(lat, lon),
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		    var latlon = new google.maps.LatLng(lat, lon);
		    var contentString = '<div id="content">'+
		      '<div id="siteNotice">'+
		      '</div>'+
		      '<h3 id="firstHeading" class="firstHeading">{{name}}</h3>'+
		      '<div id="bodyContent">'+
		      '<p><b>{{name}}</b><p/>' +
		      'It has x devices. Link qualities: .... <p/>'+
		      '<p><a href="http://en.wikipedia.org/wiki/Wanker">source</a><p/>'+
		      '</div>'+
		      '</div>';

		  var infowindow = new google.maps.InfoWindow({
			  content: Mustache.render(contentString,model.toJSON().attributes)
		  });

		  var marker = new google.maps.Marker({
			  position: latlon,
			  map: map,
			  title: model.get("attributes").name
		    });

		  google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
		  });


        });
      }
   });


  var OverView = Backbone.View.extend({
    template: "/templates/overview.html",
   
    el: $("#app"),

    initialize: function() {
      },

    render: function() {
      var el=this.$el;
      var m=this.model;
      $.get(this.template, function(t) {
        nodes=m.toJSON();
        nodes.shift();
        el.html(Mustache.render(t,{nodes: nodes}));
        _.each(m.models,function(d) {
          r=$("#"+d.get("pid"));
          $(".edit",r).on("click", function() {
            console.log("edit"+d.get("pid"));
            var v=new NodeEdit({model: d});
            v.render();
            var s=new NodeStats({model: d});
            s.render();
            });
          $(".name",r).on("click", function() {
            console.log("devices"+d.get("pid"));
            });
          });
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

  var DeviceView = Backbone.View.extend({
    template: "/templates/device.html",
   
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

  var InterfaceView = Backbone.View.extend({
    template: "/templates/interface.html",
   
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

  var AppRouter=Backbone.Router.extend({
    routes: {
      "user":       "user", 
      "node":       "node",
      "overview": "overview", 
      "device":     "device",
      "interface":  "interface",
      "*var":   "start"
      },

  
    user: function() {
      var v=new UserView;
      v.render();
      },
    
    overview: function() {

      var nl=new NodeList;
      nl.fetch().success(function(m,o,x) {
        _.each(m.entries, function(n) {
          var node=new NodeModel(n);
          nl.add(node);
        })
      nl.listChange();  
      })
      },
        

    node: function() {
      var v=new NodeView();
      v.render();
      },

    device: function() {
      var v=new DeviceView;
      v.render();
      },

    interface: function() {
      var v=new InterfaceView;
      v.render();
      },

    start: function() {
      console.log("start");
      var v=new StartView;
      v.render();
     },
  });
  
  user=new UserModel;
  var app_router=new AppRouter;
  Backbone.history.start();
});
