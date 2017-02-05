var createElement = require("./node_modules/virtual-dom/dist/virtual-dom.js").create
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h
var ko = require("./node_modules/knockout/build/output/knockout-latest.js");

var createKnockoutComponent = require("./createKnockoutComponent.js")

// console.log(createKnockoutComponent)

// var OddCounterWidget = createKnockoutComponent({
//   viewmodel: function(params){

//     var self = this;

//     self.count = ko.observable(0);

//     setInterval(function(){
//       self.count(self.count()+1);
//     }, 1000)
//   },
//   template: function(vm,children){
//     return h("div",{},[vm.count()+""])
//   },
// })

var LikeWidget = createKnockoutComponent({
  viewmodel: function(params){
    // Data: value is either null, 'like', or 'dislike'
    this.chosenValue = params.value;
      
    // Behaviors
    this.like = function() { this.chosenValue('like'); }.bind(this);
    this.dislike = function() { this.chosenValue('dislike'); }.bind(this);
  },
  template: function(vm){
    console.log("rendering product")
    if(!vm.chosenValue()){
      return h("div",{},[
        h("button",{onclick: function(){vm.like()}},"Like it"),
        h("button",{onclick: function(){vm.dislike()}},"Dislike it"),
      ])
    }else{
      return h("div",{},[
        "You "+vm.chosenValue()+" it"
      ])
    }
  }
})

function Product(name, rating) {
    this.name = name;
    this.userRating = ko.observable(rating || null);
}

var App = createKnockoutComponent({
  viewmodel: function(){

    var self = this;

    self.products = ko.observableArray(); // Start empty

    var pid = 1;

    self.addProduct = function() {
      var name = 'Product ' + (pid++);
      console.log(name+" added");
      self.products.push(new Product(name));
    }

    self.removeRandomProduct = function() {
      if(self.products().length>1){
        var rnd = Math.floor(Math.random()*self.products.length);
        console.log("removing Product " + (rnd+1) );
        self.products.splice(rnd,1);
      }
    }

  },
  template: function(vm){
    console.log("rendering vm")
    return h("div",{},[
      h("ul",{},vm.products().map(function(product){
        return h("li",{},[
          h("strong",{},product.name),
          new LikeWidget({value: product.userRating})
        ])
      })),
      h("button",{onclick: function(){vm.addProduct()} },"Add Product"),
      h("button",{onclick: function(){vm.removeRandomProduct()} },"Remove Product")
    ])
  }
})

var myCounter = new App()
var currentNode = myCounter
var rootNode = createElement(currentNode)

// A simple function to diff your widgets, and patch the dom
var update = function(nextNode) {
  var patches = diff(currentNode, nextNode)
  rootNode = patch(rootNode, patches)
  currentNode = nextNode
}

document.body.appendChild(rootNode)
