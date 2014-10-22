(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['delete_modal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"bbm-modal__topbar\">\n    <h3 class=\"bbm-modal__title\">DELETE IMAGE</h3>\n</div>\n<div class=\"bbm-modal__section\">\n    <p>Are you sure you wish to delete "
    + escapeExpression(((helper = (helper = helpers.file_name || (depth0 != null ? depth0.file_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"file_name","hash":{},"data":data}) : helper)))
    + "?</p>\n</div>\n<div class=\"bbm-modal__bottombar\">\n    <a href=\"#\" class=\"close-modal-btn bbm-button\">Cancel</a>\n    <a href=\"#\" class=\"delete-modal-delete-btn bbm-button\">Delete!</a>\n</div>";
},"useData":true});
templates['file_row'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<i class=\"fa fa-image fa-fw\"></i>\n<span class=\"filename\">"
    + escapeExpression(((helper = (helper = helpers.cannonical_name || (depth0 != null ? depth0.cannonical_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cannonical_name","hash":{},"data":data}) : helper)))
    + "</span>\n<span class=\"delete fr\">X</span>\n<span class=\"filetype fr\">"
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"useData":true});
templates['top_bar'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<span class=\"bar-file-name\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n<div class=\"upload-btn-container\">\n    <div class=\"upload-btn\">\n        <i class=\"fa fa-upload\"></i>\n        <span class=\"upload-txt\">UPLOAD</span>\n    </div>\n</div>\n";
},"useData":true});
templates['upload_modal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"bbm-modal__topbar\">\n    <h3 class=\"bbm-modal__title\">UPLOAD IMAGE</h3>\n</div>\n<div class=\"bbm-modal__section\">\n    <p class=\"message\">Select an image to upload with Browse, and then hit Upload!</p>\n    <p class=\"file-selected\">No file selected.</p>\n    <p class=\"error\"></p>\n</div>\n<div class=\"bbm-modal__bottombar\">\n    <a href=\"#\" class=\"close-modal-btn bbm-button\">Cancel</a>\n    <a href=\"#\" class=\"upload-modal-browse-btn bbm-button\">Browse</a>\n    <a href=\"#\" class=\"upload-modal-upload-btn bbm-button\">Upload</a>\n    <input id=\"hidden-file-input\" type=\"file\" accept=\"image/*\">\n</div>";
  },"useData":true});
})();
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

'use strict';
var ImageList = Backbone.Collection.extend({
    url: 'http://dev.dale.io:8888/images',
    model: Image
});
'use strict';

var AppView = Backbone.View.extend({
    el: $('.container'),
    initialize: function (options) {
        // get images from server & initialize subviews
        var image_collection = new ImageList();
        this.topBarView = new TopBarView({el: '.top-bar', collection: image_collection, eventer: options.eventer});
        this.fileBarView = new FileBarView({el: '.file-list', collection: image_collection, eventer: options.eventer});
        this.imageWindowView = new ImageWindowView({el: '.image-container', eventer: options.eventer});
    }
});

var TopBarView = Backbone.View.extend({
    template: Handlebars.templates.top_bar,
    events: {
        'click .upload-btn': 'initiateUpload'
    },
    initialize: function (options) {
        this.eventer = options.eventer;
        this.eventer.on('imageSelected', this.imageSelected, this);
        this.eventer.on('imageDeleted', this.imageDeleted, this);
        this.titleText = 'IMAGE GALLERY'; // initial value
        this.render();
    },
    render: function () {
        this.$el.html(this.template({name: this.titleText}));
    },
    imageSelected: function (model) {
        this.titleText = model.cannonical_name;
        this.render();
    },
    imageDeleted: function (model) {
        if(this.titleText === model.cannonical_name) {
            this.titleText = 'IMAGE GALLERY';
            this.render();
        }
    },
    initiateUpload: function () {
        var uploadModal = new UploadModalView({eventer: this.eventer, collection: this.collection });
        $('.modal').html(uploadModal.render().el);
    }
});

var FileBarView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, 'handleImageListFetch');
        this.eventer = options.eventer;
        this.eventer.on('imageUploaded', this.addNewImage, this);
        this.collection.fetch({
            success: this.handleImageListFetch
        });
    },
    render: function () {
        this.$el.empty();
        for(var i = 0; i < this.imageList.length; ++i) {
            var image = this.imageList.models[i];
            var imageRow = new FileRowView({model: image, eventer: this.eventer});
            this.$el.append(imageRow.el);
        }
    },
    handleImageListFetch: function (collection, response, options) {
        this.imageList = collection;
        this.render();
    },
    addNewImage: function (model_options) {
        // cut mime type to 3 letter representation
        model_options.type = model_options.type.slice( model_options.type.indexOf('/') + 1);
        // add new model
        var new_model = this.collection.create(model_options);
        var new_image_row = new FileRowView({model: new_model, eventer: this.eventer});
        this.$el.prepend(new_image_row.el);
        new_image_row.selectImage();
    }
});

var FileRowView = Backbone.View.extend({
    template: Handlebars.templates.file_row,
    tagName: 'li',
    className: 'file-item',
    events: {
        'click': 'selectImage',
        'click .delete': 'requestImageDelete'
    },
    initialize: function (options) {
        this.eventer = options.eventer;
        this.render();
    },
    render: function () {
        this.$el.html( this.template(this.model.toJSON() ));
    },
    selectImage: function () {
        $('.file-item').removeClass('selected');
        this.$el.addClass('selected');
        this.eventer.trigger('imageSelected', this.model.toJSON());
    },
    requestImageDelete: function (event) {
        event.stopImmediatePropagation(); // prevent event from bubbling up dom
        var deleteModal = new DeleteModalView({eventer: this.eventer, model: this.model, view: this });
        $('.modal').html(deleteModal.render().el);
    },
    deleteImage: function () {
        this.eventer.trigger('imageDeleted', this.model.toJSON());
        this.model.destroy();
        this.remove();
    }
});

var ImageWindowView = Backbone.View.extend({
    initialize: function (options) {
        this.eventer = options.eventer;
        this.eventer.on('imageSelected', this.changeImage, this);
        this.eventer.on('imageDeleted', this.clearImage, this);
    },
    render: function () {
    },
    changeImage: function (model) {
        this.$el.css('background', "url(" + model.url + ") center center no-repeat");
    },
    clearImage: function () {
        this.$el.css('background', "none");
    }
});

var DeleteModalView = Backbone.Modal.extend({
    template: Handlebars.templates.delete_modal,
    cancelEl: '.close-modal-btn',
    events: {
        'click .delete-modal-delete-btn': 'requestDelete'
    },
    initialize: function (options) {
        this.view = options.view;
        this.eventer = options.eventer;
    },
    requestDelete: function () {
        this.view.deleteImage();
        this.close();
    }
});

var UploadModalView = Backbone.Modal.extend({
    template: Handlebars.templates.upload_modal,
    cancelEl: '.close-modal-btn',
    events: {
        'click .upload-modal-upload-btn': 'initiateUpload',
        'click .upload-modal-browse-btn': 'initiateFileBrowse'
    },
    initialize: function (options) {
        _.bindAll(this, 'onUploadProgress');
        _.bindAll(this, 'onUploadSuccess');
        _.bindAll(this, 'onUploadError');
        this.eventer = options.eventer;
    },
    initiateUpload: function () {
        // check for file selection
        var input_val = $('#hidden-file-input').val();
        if(!input_val) {
            $('.error').html('ERROR: No file selected!');
            return;
        }
        $('.error').empty();
        // check for duplicates, get file name
        var input_name = input_val.slice( input_val.lastIndexOf('\\') + 1);
        var dupe = this.collection.findWhere({
            file_name: input_name

        });
        if(dupe) {
            $('.error').html('ERROR: File already added!');
            return;
        }

        // looks good, time to upload
        $('.error').html('Uploading...');
        var S3Uploader = new S3Upload({
            s3_sign_put_url: 'http://dev.dale.io:8888/sign_s3',
            file_dom_selector: 'hidden-file-input',
            onProgress: this.onUploadProgress,
            onFinishS3Put: this.onUploadSuccess,
            onError: this.onUploadError
        });
    },
    initiateFileBrowse: function () {
        $('#hidden-file-input')
            .trigger('click')
            .change(this.updateFileName);
    },
    updateFileName: function () {
        var input_val = $('#hidden-file-input').val();
        $('.file-selected').html(input_val);
    },
    onUploadProgress: function (percent, message) {
        console.log(percent);
    },
    onUploadSuccess: function (public_url, name, cannonical_name, mime_type) {
        this.eventer.trigger('imageUploaded', {
            url: public_url,
            file_name: name,
            cannonical_name: cannonical_name,
            type: mime_type
        });
        this.close();

    },
    onUploadError: function (status) {
        $('.error').html('ERROR: Please hit "Upload" to try again!');
    }
});

// create event pub/sub to send messages across views
var eventer = _.extend({}, Backbone.Events);
var App = new AppView({eventer: eventer});
