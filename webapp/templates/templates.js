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