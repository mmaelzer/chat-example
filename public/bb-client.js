var App = {
    Views: {},
    Models: {},
    Routers: {}
};

var ENTER_KEY_PRESS = 13;

$(document).ready(function() {
    var router = new App.Routers.ChatRouter();
    Backbone.history.start();
});App.Models.User =  Backbone.Model.extend({
    defaults: {
        "name": "anonymous",
        "message": "",
        "initialized": false
    },
    initialize: function() {
        this.on('change:name', function() {
            this.set("initialized", true);
        });
    }
});App.Views.ChatApp = Backbone.View.extend({
    id: "chat-app",
    tagName: "div",
    initialize: function(user) {
        _(this).bindAll("joinChat", "sendMessage", "userJoined", "userLeft", "messageReceived");

        this.user = new App.Models.User();
        this.createUser = new App.Views.CreateUser(this.user);
        this.chatWindow = new App.Views.ChatWindow();
        this.messageBar = new App.Views.MessageBar(this.user);

        this.setupSocketIo();

        this.user.on("change:name", this.joinChat);
        this.user.on("change:message", this.sendMessage);

        if (user != "") this.user.set("name", user);
    },
    render: function() {
        $(this.el).html("<div id='header'>Chat</div>");
        $(this.el).append(this.createUser.render().el);
        $(this.el).append(this.chatWindow.render().el);
        $(this.el).append(this.messageBar.render().el);

        if (this.user.get("created")) {
            this.createUser.$el.hide();
        } else {
            this.messageBar.$el.hide();
        }

        return this;
    },
    joinChat: function() {
        this.socket.emit('joined',
            {
                username: this.user.get("name")
            });

        this.$('#header').text('Chat - ' + this.user.get("name"));
        this.createUser.$el.hide();
        this.messageBar.$el.show().focus();
    },
    messageReceived: function(message) {
        this.chatWindow.chatMessage(message.username, message.message);
    },
    sendMessage: function() {
        var newMessage = {
            username: this.user.get("name"),
            message: this.user.get("message")
        }
        this.socket.emit('message', newMessage);
        this.messageReceived(newMessage);
    },
    setupSocketIo: function() {
        this.socket = io.connect();
        this.socket.on('joined', this.userJoined);
        this.socket.on('message', this.messageReceived);
        this.socket.on('left', this.userLeft);
    },
    userLeft: function(message) {
        this.chatWindow.statusMessage(message.username, "left the chat");
    },
    userJoined: function(message) {
        this.chatWindow.statusMessage(message.username, "joined the chat");
    }
});App.Views.ChatWindow = Backbone.View.extend({
    id: "message-list",
    tagName: "div",
    className: "bubble",
    render: function() {
        return this;
    },
    statusMessage: function(username, message) {
        this.message('(' + username + ') ' + message)
    },
    chatMessage: function(username, message) {
        this.message(username + ': ' + message)
    },
    message: function(message) {
        $(this.el).append(_.template($('#chat-msg-tmpl8').html(), { message: message }));
        $(this.el).scrollTop($(this.el).scrollHeight);
    }
});App.Views.CreateUser = Backbone.View.extend({
    id: "create-user",
    tagName: "div",
    events: {
        "keyup .bubble" : "setName"
    },
    initialize: function(user) {
        this.user = user;
        _(this).bindAll("setName");
    },
    render: function() {
        var compiledTemplate = _.template($('#input-bubble-tmpl8').html(), { id: "username", message: "Enter username to join chat" });
        $(this.el).append(compiledTemplate);
        return this;
    },
    setName: function(e) {
        if (e.keyCode === ENTER_KEY_PRESS) {
            this.user.set("name", this.$('#username').val())
        }
    }
});App.Views.MessageBar = Backbone.View.extend({
    id: "messagebar",
    tagName: "div",
    events: {
        "keyup .bubble" : "enterMessage"
    },
    initialize: function(user) {
        _(this).bindAll('enterMessage');
        this.user = user;
    },
    render: function() {
        var compiledTemplate = _.template($('#input-bubble-tmpl8').html(), { id: "new-message", message: "Enter message to send" });
        $(this.el).append(compiledTemplate);
        return this;
    },
    enterMessage: function(e) {
        if (e.keyCode === ENTER_KEY_PRESS) {
            this.user.set("message", this.$('#new-message').val());
            this.$('#new-message').val("");
        }
    }
});
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

