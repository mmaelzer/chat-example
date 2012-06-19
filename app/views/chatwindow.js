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
        $(this.el).append(_.template($('#chat-msg-tmpl8').html(), { message: message }));
        $(this.el).scrollTop($(this.el).scrollHeight);
    }
});