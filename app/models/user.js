App.Models.User =  Backbone.Model.extend({
    defaults: {
        "name": "anonymous",
        "message": "",
        "created": false
    },
    initialize: function() {
        this.on('change:name', function() {
            this.set("created", true);
        });
    }
});