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
        }

    });

  var NodeList = Backbone.Collection.extend({
    model: NodeModel,
    urlRoot: base+"FFM-Node",
    url: base+"FFM-Node?AQ=owner,EQ,106&verbose",
    initialize: function() {
      this.on("add",this.listChange);
      },

    listChange: function() {
      var v=new OverView({model: this});
      v.render();}
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
      var m=this.model;
      $.get(this.template, function(t) {
        nodes=m.toJSON();
        nodes.shift();
        el.html(Mustache.render(t,{nodes: nodes}));
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

      var nl=new NodeList;
      nl.fetch().success(function(m,o,x) {
        _.each(m.entries, function(n) {
          var node=new NodeModel(n);
          nl.add(node);
        })
      })
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
