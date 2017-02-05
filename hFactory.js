
var h = require("./node_modules/virtual-dom/dist/virtual-dom.js").h

module.exports = function(tag,props,children){
    
    var args = Array.prototype.slice.call(arguments);

    if(args.length>3){
        children = args.slice(2);
    }

    if(typeof(tag)==="string"){
        return h(tag,props,children)
    }else{
        return new tag(props);
    }

}