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
