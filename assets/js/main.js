var App = angular.module('ProRubric', ['ngRoute', 'ngTagsInput']);

            
App.config(function ($interpolateProvider, $routeProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardController'
            })
             .when('/degree/update/:id', {
                templateUrl: 'views/editDegree.html',
                controller: 'dashboardController'
            })
            
              .when('/course', {
                templateUrl: 'views/course.html',
                controller: 'courseController'
            })
            .when('/course/add/:id', {
                templateUrl: 'views/course.html',
                controller: 'courseController'
            })
            
              .when('/course/update/:id', {
                templateUrl: 'views/editCourse.html',
                controller: 'courseController'
            })
            
            .when('/rubric/new/:action/:course_id', {
                templateUrl: 'views/rubric.html',
                controller: 'rubricController'
            })
            .when('/rubric/create/:action/:title/:pid/:section/:gradeTiers', {
                templateUrl: 'views/rubric.html',
                controller: 'rubricController'
            })
            .otherwise({
                redirectTo: '#/'
            });
    });
    
App.factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
               });
            }
        };
    });
    
App.controller('dashboardController', function ($scope, $routeParams, $window, socket, GenFormData) {

    if($routeParams.id){
        socket.emit('degree req', $routeParams.id);
        socket.on('degree send', function(data){

        var degreeUpdate = function () {
            // Process the Generated Form's Captured Data
            var degreeUpdateData = $scope.dashboardUpdateFormData.extractFormData();
            // Inform the Server of the new Data
            socket.emit('update degree', degreeUpdateData);
            // Active Success feature of the form
            $scope.dashboardUpdateFormData.processed = true;
        };
        
            // Generate a form based upon this info
        $scope.dashboardUpdateFormData = new GenFormData({
                title: 'Update Degree',
                actionTitle: 'Update Degree',
                successMsg: 'Degree Updated!',
                aryInputs:[{
                        title: 'title', 
                        dispTitle: 'Title', 
                        value: data[0].title,
                    }, {
                        title: 'acronym', 
                        dispTitle: 'Acronym',
                        value: data[0].acronym,
                    },
                    {
                        title: 'id', 
                        value: data[0]._id,
                    }]
            });
            // {title: 'xxxx', content: 'yyyy'}
            $scope.actionAdd = degreeUpdate;
    });
     
    }
     
    var degreeAdd = function () {
        // Process the Generated Form's Captured Data
        var degreeNewData = $scope.dashboardFormData.extractFormData();
        // Inform the Server of the new Data
        socket.emit('add degree', degreeNewData);
        // Active Success feature of the form
        $scope.dashboardFormData.processed = true;
    };
        // Generate a form based upon this info
        $scope.dashboardFormData = new GenFormData({
            title: 'Create Degree',
            actionTitle: 'Create Degree',
            successMsg: 'New Degree Added!',
            aryInputs:[{
                    dispTitle: 'Degree Title', 
                    title: 'title', 
                    placeholder: 'Enter Degree Title'
                }, {
                    dispTitle: 'Acronym',
                    title: 'acronym', 
                    placeholder: 'Enter Degree Acronym'
                }]
        });
        // {title: 'xxxx', content: 'yyyy'}
        $scope.actionAdd = degreeAdd;

        $scope.$on('$viewContentLoaded', function () {
            socket.on('find degrees', function (data) {
                if (data.length) {
                    $scope.degreeView = data;
                } else {
                    console.log('You has no degrees :(');
                }
            });
            socket.on('find course', function (data) {
                if (data.length) {
                    $scope.courseView = data;
                } else {
                    console.log('You has no course :(');
                }
            });
      });
      
    $scope.reloadPage = function () {
            $window.location.reload();
    };
      
    $scope.degreeDelete = function (_data) {
        console.log(_data);
            socket.emit('delete degree', _data);
            $scope.reloadPage();
    };
      
});

App.controller('courseController', function ($scope, $routeParams, $window, socket, GenFormData) {
    
 if($routeParams.id){
        socket.emit('course req', $routeParams.id);
        socket.on('course send', function(data){
            
        var courseUpdate = function () {
            // Process the Generated Form's Captured Data
            var courseUpdateData = $scope.courseUpdateFormData.extractFormData();
            // Inform the Server of the new Data
            socket.emit('update course', courseUpdateData);
            // Active Success feature of the form
            $scope.courseUpdateFormData.processed = true;
        };
        
            // Generate a form based upon this info
        $scope.courseUpdateFormData = new GenFormData({
                title: 'Update Course',
                actionTitle: 'Update Course',
                successMsg: 'Course Updated!',
                aryInputs:[{
                    
                        title: 'title', 
                        dispTitle: 'Title', 
                        value: data[0].title,
                        
                    }, {
                        
                        title: 'acronym', 
                        dispTitle: 'Acronym',
                        value: data[0].acronym,
                        
                    },
                    {
                        title : 'description',
                        dispTitle: 'description',
                        value : data[0].description,
                        
                    },
                    {
                        title: 'id', 
                        value: data[0]._id,
                    }]
            });
            // {title: 'xxxx', content: 'yyyy'}
            $scope.actionAdd = courseUpdate;
    });
     
    }
    
        var courseAdd = function () {
        // Process the Generated Form's Captured Data
        var courseNewData = $scope.courseFormData.extractFormData();
        
        // Inform the Server of the new Data
        socket.emit('add course', courseNewData);
        // Active Success feature of the form
        $scope.courseFormData.processed = true;
    };
        // Generate a form based upon this info
        $scope.courseFormData = new GenFormData({
            title: 'Create Course',
            actionTitle: 'Create Course',
            successMsg: 'New Course Added!',
            aryInputs:[
            {
                    dispTitle: 'Course Title', 
                    title: 'title', 
                    placeholder: 'Enter Degree Title'
                }, {
                    dispTitle: 'Acronym',
                    title: 'acronym', 
                    placeholder: 'Enter Course Acronym'
                },{
                    dispTitle: 'Description',
                    title: 'description',
                    placeholder: 'Enter Description'
                },{
                    dispTitle: 'Degree Id',
                    title: 'degree_id',
                    value: $routeParams.id
            }]
        });
        // {title: 'xxxx', content: 'yyyy'}
        $scope.actionAdd = courseAdd;
      
      $scope.$on('$viewContentLoaded', function () {
        socket.on('find course', function (data) {
                if (data.length) {
                    $scope.courseView = data;
                } else {
                    console.log('You has no course :(');
                }
            });
      });
      
    $scope.reloadPage = function () {
            $window.location.reload();
    };
      
    $scope.courseDelete = function (_data) {
        console.log(_data);
            socket.emit('delete course', _data);
            $scope.reloadPage();
    };
    
});

App.controller('rubricController', function ($scope, $routeParams, $window ,GenFormData,socket, $location) {

      $scope.$on('$viewContentLoaded', function () {
        socket.on('find rubrics', function (data) {
                if (data.length) {
                    $scope.rubricView = data;
                } else {
                    console.log('You has no rubrics :(');
                }
            });
      });
      
    if($routeParams.action === 'add'){
    
    var rubricAdd = function () {
        // Process the Generated Form's Captured Data
        var rubricNewData = $scope.rubricFormData.extractFormData();
        $location.path('/rubric/create/sections/'+rubricNewData.title+'/'+rubricNewData.parentId+'/'+rubricNewData.sections+'/'+rubricNewData.gradeTiers);
        
        // Active Success feature of the form
        $scope.rubricFormData.processed = true;
    };

    // Generate a form based upon this info
    $scope.rubricFormData = new GenFormData({
        
        title: 'Create Rubric',
        actionTitle: 'Create Rubric',
        successMsg: 'New Rubric Added!',
        aryInputs:[{
            
                dispTitle: 'Rubric Title', 
                title: 'title', 
                value: '', 
                placeholder: 'Enter Assignment Title'
            },
            {
                dispTitle: 'Sections',
                title: 'sections', 
                value: '', 
                placeholder: 'Enter Sections Followed by a comma (code, aethetics, design)'
            },
            {
                dispTitle: 'Grade Tiers',
                title: 'gradeTiers', 
                value: '', 
                placeholder: 'Enter Grade Tiers (100, 75, 50, 30, 0)'
            },
            {
                dispTitle: 'Course ID',
                title: 'parentId',
                value:  $routeParams.course_id,
            }]
    });
    // {title: 'xxxx', content: 'yyyy'}
    $scope.actionAdd = rubricAdd;   
      
    }
    
    if($routeParams.action === 'sections'){  
    
     var _data = {
            title: $routeParams.title,
            parentId: $routeParams.pid,
            section: $routeParams.section,
            gradeTiers: $routeParams.gradeTiers
        };
        
        var sectionString = _data.section,
            sectionArray = sectionString.split(","),
            gradeString = _data.gradeTiers,
            gradeArray = gradeString.split(",");
            
        $scope.inputArray=[];
        $scope.gradesArray=[];

        angular.forEach(sectionArray, function(input, key) {
         var _data = {
                dispTitle: input, 
                title: input,
                value: '',
                placeholder: 'Add description here'
            };
            $scope.inputArray.push(_data);
        });
        
        angular.forEach(gradeArray, function(input, key) {
            $scope.gradesArray.push(input);
        });

    var rubricSave = function () {

        socket.on('rubric find', function(data) {
            console.log(data);
            var rubricNewData = $scope.rubricFormData.extractFormData();
            $scope.rubricFormData.processed = true;

            
        });

    };
    
    // Generate a form based upon this info
    $scope.rubricFormData = new GenFormData({
        title: _data.title,
        actionTitle: 'Save',
        parentId: _data.parentId,
        successMsg: 'New Rubric Added!',
        aryInputs: [{
                dispTitle: 'Course ID',
                title: 'parentId',
                value:  $routeParams.pid,
            }]
    });
    
    for(var i=0; i<$scope.inputArray.length; i++){
        $scope.rubricFormData.inputs.push($scope.inputArray[i]);
    }
    
    $scope.rubricFormData.grades = $scope.gradesArray;

    socket.emit('rubric req', $scope.rubricFormData);

    // {title: 'xxxx', content: 'yyyy'}
    $scope.actionAdd = rubricSave;
    
    }
});

App.directive('genForm', function() {

    return {
        restrict: 'E',
        scope: { 
            payload: '=', // '=' Two-way binding
            callback: '&' // '&' Method Binding
        },
        template:   '<div class="form">' +
                        '<div ng-show="payload.processed"><h1> {[{ payload.successMsg }]} </h1></div>' +
                        '<div ng-hide="payload.processed">' +
                            '<h1> {[{ payload.title }]} </h1>' +
                            '<label data-ng-repeat="input in payload.inputs track by $index"><span> {[{ input.dispTitle }]} </span>' +
                                '<input type="text" data-ng-model="input.value" placeholder="{[{ input.placeholder }]}" />' +
                            '</label>' +
                            '<button data-ng-click="callback(payload)"> {[{ payload.actionTitle }]} </button>' +
                        '</div>' +
                    '</div>',
    };
});

App.service('GenFormData', function() {
    var GenForm = function(args) {
        this.title          = args.title         || '';
        this.inputs         = args.aryInputs     || [];
        this.actionTitle    = args.actionTitle   || '';
        this.successMsg     = args.successMsg    || 'Success';
        this.processed      = false;
        this.extractedData;
    };
    GenForm.prototype.addInput = function(input){
        this.inputs.push({
            title: input.title,
            dispTitle: input.dispTitle, 
            placeholder: input.placeholder,
            value: ''
        });
            
    };
    GenForm.prototype.setActionTitle = function(str){
        this.actionTitle = str;
    };
    GenForm.prototype.setTitle = function(str){
        this.title = str;
    };
    GenForm.prototype.extractFormData = function(){
        var objDataCollection = {};
        var aryTargetProps = ['title','value'];

        // Loop all generated inputs
        angular.forEach(this.inputs, function(input, key){
            var objExtration = {};

            // Loop all properties on each input
            for(var prop in input){
                
                // Only target the props in aryTargetProps
                if(aryTargetProps.indexOf(prop) >= 0){

                    // Transpose property and value onto temp obj, building throught the loop
                    objExtration[prop] = input[prop];
                    
                }    
                
            }

            // Once each input has all targeted props fully stripped and transposed pair up the data from the input
            objDataCollection[objExtration.title] = objExtration.value;
        });
        this.extractedData = objDataCollection;
        return this.extractedData;
    };

    return GenForm;
});

App.service('Audit', function() {
        // TODO Static Data currently. Feed this from the DB and create this data structure.
        this.data = {
                auditMatrix:[],     // Not from the Database
                totalLineItems: 8,  // Not from the Database
                auditProgress: 0,   // Not from the Database
                auditGrade: 0,      // Not from the Database
                _id:        '1324567896543',
                title:      'Deployment Day II',
                content:    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed libero sem, volutpat eget massa et, mattis accumsan velit. Praesent fermentum a est vel pulvinar. Maecenas vestibulum rutrum erat, sit amet venenatis mi scelerisque non. Integer elementum laoreet velit eu convallis. ',
                gradeTiers: [1,0.75,0.40,0],
                course:     { _id : '9876345345', title: 'Deployment of Web Projects', acronym : 'DWP'},
                sections:   [
                                { 
                                    _id:            '44343433',
                                    title:          'Design',
                                    gradeWeight:    0.5,
                                    lineItems:      [
                                                        { _id : '22233232323', title : 'Branding', content: 'Project utilizes consistent and pleasing color palette and font choices. Accents and contrast are used to highlight important elements. All visual elements complement the selected branding and design aesthetic.' },
                                                        { _id : '22233232324', title : 'User Flow', content: 'Users should be able to intuitively navigate through the project. All areas are accessible and user actions are prompted with appropriate feedback.' },
                                                        { _id : '22233232325', title : 'User Experience', content: 'The project implements logical UI patterns and the cognitive load of the user is relatively light. A well designed mobile experienced is delivered to the user utilizing positive subtle messaging to draw the user further into the application.' },
                                                        { _id : '22233232326', title : 'Information Hierarchy', content: 'Attention is clearly and cleanly drawn to various elements depending on their well planned structured hierarchy of importance.' },
                                                    ]
                                },
                                { 
                                    _id:            '44343434',
                                    title:          'Code',
                                    gradeWeight:    0.5,
                                    lineItems:      [
                                                        { _id : '22233232327', title : 'Semantics', content: 'The study of meaning. In this situation we’re interested in the meaning of your code. Variables, functions, classes, objects, CSS Classes, HTML tags, etc. should all be named clearly, cleanly and semantically to represent the content they contain.' },
                                                        { _id : '22233232328', title : 'Comprehension', content: 'The ability for a 3rd party developer or peer reviewer to transverse your code easily. Unnecessarily complex code structures, code not in use or heavily commented out code are considered bad practices and will be penalized accordingly.' },
                                                        { _id : '22233232329', title : 'MVC File Structure', content: 'Proper file structure and organization for an MVC framework. Views, Models, and Controllers are handled properly.' },
                                                        { _id : '22233232320', title : 'Formatting, Comments, & Logs', content: 'All code should be formatted and commented professionally. Its highly recommended to adopt a consistent pattern and follow it, look into phpDocumentor for references. Additionally, labeled console.log()’s, when used, should be used appropriately and in moderation as to not bombard the reviewer / developer.' },
                                                    ]
                                }
                    ]

            };
    });


App.controller('AuditController', function( $scope, Audit ){
        
        // Setup base var to run audits against.
        $scope.rubric          = Audit.data;

        // Update the Audit Grade
        $scope.calculateGrade   = function(){

            // temp Array
            var aryGrades = [];

            // Loop through the matrix and break out the values into a clean array
            for(var key in $scope.rubric.auditMatrix){
                aryGrades.push($scope.rubric.auditMatrix[key]);
            }
            
            // Calculate the sum of an array
            $scope.rubric.auditGrade = aryGrades.reduce(function(previousValue, currentValue, index, array) {
              return previousValue + currentValue;
            });
        };

        // Determine % completed
        $scope.calculateAuditProgress = function(lineItemID, grade, sectionWeight, totalSectionItems){

            // Add / Update Line Item's grade in the Audit Matix
            $scope.rubric.auditMatrix[lineItemID] = grade * (sectionWeight / totalSectionItems);


            // How many Line Items have been Audited
            var currentAudited = Object.keys($scope.rubric.auditMatrix).length;
            

                // Calculate Grade after change 
                $scope.calculateGrade();                

            
            // Create % of total Line Items Audited
            $scope.rubric.auditProgress = ((currentAudited / $scope.rubric.totalLineItems)*100);

            return $scope.rubric.auditProgress;
        };

        // User Clicks on a grade weight of a Line Item
        $scope.actionGrade  = function (lineItemID, grade) {

            // Error handling for loop not finding supplied ID
            var matchedLineItem = false;

            // TODO clean up this double loop to find the target lineItem based on ID
            angular.forEach($scope.rubric.sections, function (section, sectionKey) {
                angular.forEach(section.lineItems, function (lineItem, lineItemKey) {

                    // Match the ID Supplied against the section's loop's line item loop
                    if(lineItem._id === lineItemID){
                        lineItem.grade = grade;
                        matchedLineItem = lineItem;
                        // console.log(section.lineItems.length);
                        // Calculate Grade's Affect on Overall Audit
                        $scope.calculateAuditProgress(lineItemID, grade, section.gradeWeight, section.lineItems.length);
                    }
                });
            });

            // Error Handling
            if(!matchedLineItem){
                console.log('Error: No Item ID Matched for this Rubric');
            }
        };

        // TODO Enhance Output displayed to user.
        $scope.actionOutput = function(){
             console.log($scope.rubric);
        };

    });