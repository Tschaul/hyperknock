# hyperknock
Virtual Dom + Knockout = ❤️️

first run `npm install` to download dependencies.

run `npm run build` to compile jsx to js.

run `npm run serve` to start.

## Know Issues / Future Work

### Foreach

In the current example, when removing a product, all products after the removed one get re-initialized and rerendered. This is because neither virtual-dom nor the KnockoutComponent does keep track of the identity of the individual instances. Therefore during diffing of the Vtree all elements after the removed one appear changed.

#### Possible Solution

A ForEach-Widget that keeps track of the individual instances using knockouts trackArrayChanges feature. The API could look like the following:

```
template: function(vm){
  return (
    <h3>{vm.title()}</h3>
    <ForEach source={vm.todos} // required; vm.todos must be ObservableArray
      wrapper = { function(content){ return (<ul>{content}</ul>) } } //defaults to <div>{content}</div>
      sort = { function(a,b){...} } // optional
      filter = { function(item){...} } // optional
      map = { function(item){ // required 
        return (
          <li>{item.name()}</li>
        )
      }}
    />
  )
}
```

### Children

Currently child-elements that are passed into a KnockoutComponent are lost.

#### Possible Solution

A Children-Widget that is instantiated during the KnockoutComponents init-function and kept as reference. During update the new children are passed down to the Children-Widget which diffes and updated its content. Then the template function could eb passed the children elements as second parameter:

```
template: function(vm,children){
  return (
    <div className="fancy-header" ... >
      {children}
    </div>
  )
}

// ...

<FancyHeader>
  {"I am fancy!"}
</FancyHeader>
```

### Work around deep-equal

Currently during the update function of the KnockoutComponents the params are compared using deep-equal. If the params are not equal the component gets reinitialized by which it looses its state. Also in some cases this could potentially lead to performance issues.

#### Possible Solution

Make reinitialization behavior configurable ("never", "always", "compare" (uses deep-equal)). Add optional function "receiveNewParams" that is called instead of "init" when present.
