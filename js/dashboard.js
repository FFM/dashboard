var user;

$(document).ready(function() {

  var base="https://nodedb2.confine.funkfeuer.at/api/";
 
  var UserModel = Backbone.Model.extend({

	urlRoot : base+"PAP-Person/",
	idAttribute: "pid",

    initialize: function() {
      this.on("change",this.attributesChanged);
      cookies=_.reduce(_.map(document.cookie.split("; "),function(x) {
        return x.split("=") }),function(x,y) {x[y[0]]=y[1]; 
        return x},{})
      this.set("rat",cookies.RAT);
	  this.set("email",cookies.email);
      this.attributesChanged();},

    attributesChanged: function() {
      if (this.get("rat")!=undefined) {
        var u=base+
        "PAP-Person_has_Account?verbose&closure&AQ=right.name,EQ,"+
        this.get("email");
        $.getJSON(u,function(d) {
          // TODO IMPLEMENT
		  if (d.entries[0] != undefined) {
			var u=d.entries[0].attributes.left;
			user.set("pid",u.pid);
			user.fetch();
		  };
          });
        }

      var v=new LoginView({model: this});
      v.render();
	  if (this.get("attributes") != undefined) {
		$(".firstname").html(this.get("attributes").first_name)
	  }
      },

    login: function() {
      d=$("#loginform").serializeArray()
      data=_.reduce(d,function(x,y) {x[y.name]=y.value; return x},
        {})
      var auth="https://nodedb2.confine.funkfeuer.at/RAT";
      var t=this;  
      user.set("email",data.username);
	  document.cookie="email="+user.get("email");
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
  var DeviceModel = Backbone.Model.extend({
    urlRoot: base+"FFM-Device/",
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
  var DeviceList = Backbone.Collection.extend({
    model: DeviceModel,
    urlRoot: base+"FFM-Device",

    //url: function() {
    //  return "FFM-Device?verbose&AQ=node,EQ,"+this.node.get("pid")
    //  },

    url: "",

    seturl: function(node) {
      this.url=base+
        "FFM-Net_Device?verbose&AQ=node,EQ,"+node.get("pid")
        },
        

    initialize: function() {
      },

    listChange: function() {
      var v=new DeviceListView({model: this});
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

  var DeviceListView = Backbone.View.extend({
    template: "/templates/device-list.html",
   
    el: $("#node"),

    initialize: function() {
      },

    render: function() {
      var el=$("#node");
      var m=this.model;
      $.get(this.template, function(t) {
        var devices=m.toJSON();
        devices.shift();
        el.html(Mustache.render(t,{devices: devices}));
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
        if (model.get("attributes").position!=undefined) {
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
        };


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
        el.html(Mustache.render(t,{nodes: nodes,user: user}));
        _.each(m.models,function(d) {
          r=$("#"+d.get("pid"));
          $(".edit",r).on("click", function() {
            var v=new NodeEdit({model: d});
            v.render();
            var s=new NodeStats({model: d});
            s.render();
            $("#nodelist tr").removeClass("success");
            $("#"+d.get("pid")).addClass("success");
            });
          $(".name",r).on("click", function() {
            var s=new NodeStats({model: d});
            s.render();
            dl=new DeviceList;
            dl.seturl(d);
            dl.fetch().success(function(m) {
              _.each(m.entries, function(n) {
              var node=new NodeModel(n);
              dl.add(node);
              });
            dl.listChange();  
            $("#nodelist tr").removeClass("success")
            $("#"+d.get("pid")).addClass("success");
            });
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
        


    device: function() {
      var v=new DeviceView;
      v.render();
      },

    interface: function() {
      var v=new InterfaceView;
      v.render();
      },

    start: function() {
      var v=new StartView;
      v.render();
     },
  });
  
  user=new UserModel;
  var app_router=new AppRouter;
  Backbone.history.start();
});
