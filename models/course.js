module.exports = function() {
    
    var db          = require('../config/db'),
        mongoose    = require('mongoose');
        data        = require('../lib/sanitize.js');
    
    var courseSchema = mongoose.Schema({
        title : String,
        acronym : String,
        description : String,
        type:  String,
        degree_id : String,
        created_at : {type : Date, default: Date.now},
        updated_at : {type : Date, default: Date.now}
    }),
    
     _model = mongoose.model('courses', courseSchema);

    // ADD 
    var _save = function(course, success, fail){

        var newCourse = new _model({
            title:        course.title,
            acronym:      course.acronym,
            description:  course.description,
            degree_id:    course.degree_id
        });

        newCourse.save(function(err){
            
            if (err) {
                fail (err);
            } else {
                success(newCourse);
            }
        });
    },
    
    // UPDATE
    _update = function(course,success,fail){

        var cleanData = data.sanitize(course);

        if(cleanData){
            _model.update({'_id':course._id}, {$set:cleanData}, function(err,doc){
                if (err) {
                    fail(err);
                }else{
                    success(doc);
                }
            });
        }
    },
    
    // REMOVE
    _remove = function(course,success,fail){
        _model.findByIdAndRemove(course, function(err){
            if (err) {
                fail(err);
            }
        });
    },
    _findOne = function(data, success,fail){
            _model.find({_id:data}, function(err,doc) {
                if (err) {
                    fail(err);
                } else {
                    success(doc);
                }
            });
        },
    
    // FIND
     _findAll = function(success,fail){
            _model.find({}, function(err,doc){
                if (err) {
                    fail(err);
                }else{
                    success(doc);
                }
            });
        };
    
// Publicly Available
// ==========================================================================
    return {
        schema :        courseSchema,
        model :         _model,
        add :           _save,
        update :        _update,
        remove :        _remove,
        find :          _findAll,
        one:            _findOne
    };
}();



