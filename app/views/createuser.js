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
        var compiledTemplate = _.template($('#input-bubble-tmpl8').html(), { id: "username", message: "Enter username to join chat" });
        $(this.el).append(compiledTemplate);
        return this;
    },
    setName: function(e) {
        if (e.keyCode === ENTER_KEY_PRESS) {
            this.user.set("name", this.$('#username').val())
        }
    }
});