'use strict';
var Image = Backbone.Model.extend({
    // this url is only used for deleting & getting individual images
    // if there is no id, it's a new image that hasn't been saved to db
    // don't try to use a url with id
    url: function () {
        if(this.id) {
            return 'http://dev.dale.io:8888/images/' + this.id;
        }
        else {
            return 'http://dev.dale.io:8888/images'
        }
    },
    defaults: function() {
        return {
            cannonical_name: 'my image',
            file_name: 'my_image.jpg'
        };
    }
});
