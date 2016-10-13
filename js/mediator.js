//Patterns For Large-Scale JavaScript Application Architecture

var mediator=function(){
  var subscribe=function(channel,fn){
    if(!mediator.channels[channel]) mediator.channels[channel]=[];
    mediator.channels[channel].push({context:this,callback:fn});
    return this;
  };

  var publish=function(channel){
    if(!mediator.channels[channel]) return false;
    var args=Array.prototype.slice(arguments,1);
    for(var i=0,ii=mediator.channels[channel].length;i<ii;i++){
      var subscription=mediator.channels[channel][i];
      var callback=subscription.callback;
      callback.apply(subscription.context,args);
    }
    return this;
  };

  return {
    channels:{},
    subscribe:subscribe,
    publish:publish,
    installTo:function(obj){
      obj.subscribe=subscribe;
      obj.publish=publish;
    }
  };
  
}();
