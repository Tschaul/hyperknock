var diff = require("./node_modules/virtual-dom/dist/virtual-dom.js").diff
var patch = require("./node_modules/virtual-dom/dist/virtual-dom.js").patch
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h
var createElement = require("./node_modules/virtual-dom/dist/virtual-dom.js").create
var ko = require("./node_modules/knockout/build/output/knockout-latest.js");

module.exports = function(spec) {
        var Constructor = function(params, children) {
            this.params = params;
            this.children = children;

        };
        Constructor.prototype.type = "Widget"
        Constructor.prototype.init = function() {
            this.vm = new spec.viewmodel(this.params);
            this.renderedObservable = ko.computed(function(){
                return spec.template(this.vm,this.children);
            },this);

            var currentNode = this.renderedObservable()

            var rootNode = createElement(currentNode)

            this.renderedObservable.subscribe(function(nextNode){
                var patches = diff(currentNode, nextNode)
                rootNode = patch(rootNode, patches)
                currentNode = nextNode
            })

            return rootNode;
        }

        Constructor.prototype.update = function(previous, domNode) {
            return previous;
        }

        Constructor.prototype.destroy = function(domNode) {
        
        }

        return Constructor;
    }