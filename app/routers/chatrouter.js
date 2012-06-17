App.Routers.ChatRouter = Backbone.Router.extend({
    routes: {
        ":user": "chatWithUser",
        "*other": "defaultRoute"
    },
    defaultRoute: function() {
        this.createChatWithUser("");
    },
    chatWithUser: function(user) {
        this.createChatWithUser(user);
    },
    createChatWithUser: function(user) {
        if (this.chatApp) {
            this.chatApp.remove();
        }
        this.chatApp = new App.Views.ChatApp(user);
        $('body').append(this.chatApp.render().el);
    }
});

