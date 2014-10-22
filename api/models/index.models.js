module.exports = function modelHandler(dependencyBox) {
    'use strict';
    var bookshelf = dependencyBox.bookshelf;

    var Image = bookshelf.Model.extend({
        tableName: 'images',
        hasTimestamps: true
    });

    return {
        Image: Image
    };
};
