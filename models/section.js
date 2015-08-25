module.exports = function() {
    
    var db          = require('../config/db'),
        mongoose    = require('mongoose'),
        data        = require('../lib/sanitize.js');


    var sectionSchema = mongoose.Schema({
        title : String,
        gradeWeight : Number,
        rubric_id : {type : Number, default : 0},
        created_at : {type : Date, default: Date.now},
        updated_at : {type : Date, default: Date.now}
    }),


    _model = mongoose.model('sections', sectionSchema),

    // ADD
    _save = function(section, success, fail){

        var cleanData = data.sanitize(section);

        if (cleanData){
            var newSection = new _model({
                title:      cleanData.title,
                gradeWeight:  cleanData.gradeWeight
            });
            _model.save(function(err){
                if (err) {
                    fail(err);
                }else{
                    success(newSection);
                }
            });
        }


    },
    
    // UPDATE 
    _update = function(section,fail,success){

        var cleanData = data.sanitize(section);
            if(cleanData){
                _model.update({'_id':cleanData._id}, {$set:cleanData}, function(err,doc){
                    if (err) {
                        fail(err);
                    }else{
                        success(doc);
                    }
                });
            }
    },
    // REMOVE
    _remove = function(section, fail, success){

        var cleanData = data.sanitize(section);

        if(cleanData){

            _model.findByIdAndRemove({'_id':cleanData._id}, function(err,doc){
                if (err) {
                    fail(err);
                }else{
                    success(doc);
                }
            });

        }


    };

    _all = function(success,fail){

        _model.find({}, function(err,doc){

            if (err) {
                fail(err);
            }else{
                success(doc);
            }
        });
        // }


    };
    
    
// Publicly Available
// ==========================================================================
    return {
        schema :        sectionSchema,
        model :         _model,
        add :           _save,
        update :        _update,
        remove :        _remove,
        all :           _all
    };
}();