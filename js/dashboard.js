$(document).ready(function() {

  var base="https://nodedb2.confine.funkfeuer.at/api/";
  
  $.ajaxSetup({beforeSend: function(xhr) {
    xhr.setRequestHeader("Authorization",
      "Basic ") },
    xhrFields: {
      withCredentials: true}
      
      });

  var NodeModel = Backbone.Model.extend({
    urlRoot: base+"FFM-Node/",
    idAttribute: "pid",
    initialize: function() {
      this.on("change",this.attributesChanged);
        },
    
    attributesChanged: function() {
        var v=new NodeView({model: this});
        v.render();
        }

    });

  var NodeCollection = Backbone.Collection.extend({
    model: NodeModel,
    initialize: function() {
      this.on("change",this.modelsChanged);
      },

    modelsChanged: function() {
      console.log(models.changed);
      },

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

  var OverView = Backbone.View.extend({
    template: "/templates/overview.html",
   
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
      m=this.model;
      $.get(this.template, function(t) {
        console.log(m.toJSON()); 
        el.html(Mustache.render(t,m.toJSON().attributes));
        });
      }
   });


  var AppRouter=Backbone.Router.extend({
    routes: {
      "user": "user", 
      "overview": "overview", 
      "node/:id": "node",
      "*var": "start"
      },

  
    user: function() {
      var v=new UserView;
      v.render();
      },
    
    overview: function() {
      var v=new OverView;
      v.render();
      },

    node: function(id) {
      var m=new NodeModel({pid: id});
      m.fetch();
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
