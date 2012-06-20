App.Models.User =  Backbone.Model.extend({
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
});