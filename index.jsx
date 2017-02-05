var createElement = require("./node_modules/virtual-dom/dist/virtual-dom.js").create
var ko = require("./node_modules/knockout/build/output/knockout-latest.js");

var hFactory = require("./hFactory.js");
/** @jsx hFactory */

var createKnockoutComponent = require("./createKnockoutComponent.js")

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
      return (
        <div>
          <button onclick={function(){vm.like()}}>{"Like it"}</button>,
          <button onclick={function(){vm.dislike()}}>{"Dislike it"}</button>,
        </div>
      )
    }else{
      return (
        <div>
          {"You "+vm.chosenValue()+" it"}
        </div>
      )
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
    return (
      <div>
      <ul>
        {vm.products().map(function(product){
          return (
            <li>
            <strong>{product.name}</strong>,
            <LikeWidget value={product.userRating}/>
            </li>
          )
        })}
      </ul>
      <button onclick= {function(){vm.addProduct()}} >{"Add Product"}</button>
      <button onclick= {function(){vm.removeRandomProduct()}} >{"Remove Product"}</button>
    </div>
    )
  }
})

var rootNode = createElement(<App/>)

document.body.appendChild(rootNode)
