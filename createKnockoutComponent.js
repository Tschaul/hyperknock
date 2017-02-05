var diff = require("./node_modules/virtual-dom/dist/virtual-dom.js").diff
var patch = require("./node_modules/virtual-dom/dist/virtual-dom.js").patch
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h
var createElement = require("./node_modules/virtual-dom/dist/virtual-dom.js").create

var ko = require("./node_modules/knockout/build/output/knockout-latest.js");

var deepEuqal = require("./node_modules/deep-equal/index.js")

function s4(){
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
}

module.exports = function(spec) {

    // var componentId = s4()+s4()+s4()+s4();

    var Constructor = function(params) {
        this.params = params;
        console.log("constructor")
    };
    Constructor.prototype.type = "Widget";
    //Constructor.prototype.name = componentId;
    //Constructor.prototype.id = componentId;
    Constructor.prototype.init = function() {
        this.vm = new spec.viewmodel(this.params);
        this.renderedObservable = ko.computed(function(){
            return spec.template(this.vm);
        },this);

        var currentNode = this.renderedObservable()

        var rootNode = createElement(currentNode)

        this.renderedObservable.subscribe(function(nextNode){
            // console.log("event fired")
            // console.log(currentNode,nextNode)
            var patches = diff(currentNode, nextNode)
            // console.log("diffed")
            // console.log(patches)
            rootNode = patch(rootNode, patches)
            //console.log("patched")
            currentNode = nextNode
        })

        console.log("init")

        return rootNode;
    }

    Constructor.prototype.update = function(previous, domNode) {
        console.log("update")
        if(!deepEuqal(this.params,previous.params)){
            return this.init();
        }
        // return domNode;
    }

    Constructor.prototype.destroy = function(domNode) {
    
    }

    return Constructor;
}
    