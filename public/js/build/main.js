var socket=io.connect();angular.module("ProRubric",["ngRoute"]),angular.module("ProRubric").config(["$interpolateProvider","$routeProvider",function(e,o){e.startSymbol("{[{"),e.endSymbol("}]}"),o.when("/",{templateUrl:"views/home.html",controller:"secondController"}).when("/rubric/:action/",{templateUrl:"views/rubricForm.html",controller:"rubricController"}).when("/rubric/:action/:id",{templateUrl:"views/rubricForm.html",controller:"rubricController"}).when("/addComment",{templateUrl:"views/comment.html",controller:"rubricController"}).when("/se",{templateUrl:"views/text.html",controller:"secondController"}).when("/addSection",{templateUrl:"views/addSection.html",controller:"secondController"}).when("/addLineItem",{templateUrl:"views/addLineItem.html",controller:"lineItemController"})}]),angular.module("ProRubric").controller("mainController",["$scope",function(e){e.degreeAdd=function(){var o={title:e.degreeTitle,acronym:e.degreeAcronym};socket.emit("add degree",o)},socket.once("find degrees",function(e){angular.forEach(e,function(e){$(".columns").append('<div class="pin"><img src="http://placehold.it/140x100"> <h2 class="classname">'+e.title+'</h2> <a href="#">Delete Degree</a></div>')})})}]),angular.module("ProRubric").controller("sectionController",["$scope",function(e){e.addSection=function(){var o={title:e.sectionTitle,gradeWeight:e.gradeWeights};socket.emit("add section",o)}}]),angular.module("ProRubric").controller("rubricController",["$scope","$routeParams",function(e,o){"add"===o.action?console.log("adding"):"update"===o.action&&(socket.emit("find rubric",o.id),socket.on("returned id",function(e){console.log(e)}),e.editRubric=function(){socket.emit("edit rubric",e.newRubric),socket.on("edit rubric",function(e){console.log(e)}),socket.on("error",function(o){e.error=o.text})}),e.rubricAdd=function(){var o={title:e.rubricTitle,content:e.rubricContent};socket.emit("add rubric",o)},e.editRubric=function(){socket.emit("edit rubric",e.newRubric),socket.on("edit rubric",function(e){console.log(e)}),socket.on("error",function(o){e.error=o.text})}}]),angular.module("ProRubric").controller("lineItemController",["$scope",function(e){e.lineItemAdd=function(){var o={title:e.itemTitle,content:e.itemContent};socket.emit("add lineItem",o)}}]);