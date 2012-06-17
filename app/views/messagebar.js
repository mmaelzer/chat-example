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
