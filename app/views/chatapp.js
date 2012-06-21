App.Views.ChatApp = Backbone.View.extend({
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
        $(this.el).append("<div id='header'>Chat</div>");
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
});