var createElement = require("./node_modules/virtual-dom/dist/virtual-dom.js").create
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h
var ko = require("./node_modules/knockout/build/output/knockout-latest.js");

var createKnockoutComponent = require("./createKnockoutComponent.js")

console.log(createKnockoutComponent)

var OddCounterWidget = createKnockoutComponent({
  viewmodel: function(params){

    var self = this;

    self.count = ko.observable(0);

    setInterval(function(){
      self.count(self.count()+1);
    }, 1000)
  },
  template: function(vm,children){
    return h("div",{},[vm.count()+""])
  },
})

var myCounter = new OddCounterWidget()
var currentNode = myCounter
var rootNode = createElement(currentNode)

// A simple function to diff your widgets, and patch the dom
var update = function(nextNode) {
  var patches = diff(currentNode, nextNode)
  rootNode = patch(rootNode, patches)
  currentNode = nextNode
}

document.body.appendChild(rootNode)
