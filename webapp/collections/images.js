'use strict';
var ImageList = Backbone.Collection.extend({
    url: 'http://dev.dale.io:8888/images',
    model: Image
});