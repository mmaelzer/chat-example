var App = {};

App.Views = {};
App.Models = {};
App.Routers = {};

var ENTER_KEY_PRESS = 13;

/*
Views
 */

App.Views.ChatApp = Backbone.View.extend({
    id: "chat-app",
    tagName: "div",
    initialize: function() {
        _(this).bindAll("joinChat", "sendMessage", "userJoined", "userLeft", "messageReceived");

        this.user = new App.Models.User();
        this.createUser = new App.Views.CreateUser(this.user);
        this.chatWindow = new App.Views.ChatWindow();
        this.messageBar = new App.Views.MessageBar(this.user);

        this.setupSocketIo();

        this.user.on("change:name", this.joinChat);
        this.user.on("change:message", this.sendMessage);
    },
    render: function() {
        $(this.el).html("<div id='header'>Chat</div>");
        $(this.el).append(this.createUser.render().el);
        $(this.el).append(this.chatWindow.render().el);
        $(this.el).append(this.messageBar.render().el);

        this.messageBar.$el.hide();

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
        this.socket.emit('message',
            {
                username: this.user.get("name"),
                message: this.user.get("message")
            });
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
});

App.Views.CreateUser = Backbone.View.extend({
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
        $(this.el).append('<input id="username" class="bubble" placeholder="Enter username to join chat">');
        return this;
    },
    setName: function(e) {
        if (e.keyCode === ENTER_KEY_PRESS) {
            this.user.set("name", this.$('#username').val())
        }
    }
});

App.Views.ChatWindow = Backbone.View.extend({
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
        $(this.el).append('<div>' + message + '</div>');
        $(this.el).scrollTop($(this.el).scrollHeight);
    }
});

App.Views.MessageBar = Backbone.View.extend({
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
        $(this.el).append('<input id="new-message" class="bubble" placeholder="Enter message to send" >');
        return this;
    },
    enterMessage: function(e) {
        if (e.keyCode === ENTER_KEY_PRESS) {
            this.user.set("message", this.$('#new-message').val());
            this.$('#new-message').val("");
        }
    }
});

/*
Models
 */

App.Models.User =  Backbone.Model.extend({
    defaults: {
        "name": "anonymous",
        "message": ""
    },
    initialize: function(name) {
        if (name) {
            this.set("name", name);
        }
    }
});

/*
Routers
 */

App.Routers.ChatRouter = Backbone.Router.extend({
    routes: {
        "*other": "defaultRoute"
    },
    defaultRoute: function() {
        this.chatApp = new App.Views.ChatApp();
        $('body').append(this.chatApp.render().el);
    }
});

$(document).ready(function() {
    var router = new App.Routers.ChatRouter();
    Backbone.history.start();
});
