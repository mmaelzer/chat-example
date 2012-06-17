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