var App = {
    Views: {},
    Models: {},
    Routers: {}
};

var ENTER_KEY_PRESS = 13;

$(document).ready(function() {
    var router = new App.Routers.ChatRouter();
    Backbone.history.start();
});