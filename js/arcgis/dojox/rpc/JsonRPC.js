//>>built
define("dojox/rpc/JsonRPC",["dojo","dojox","dojox/rpc/Service","dojo/errors/RequestError"],function(c,d,h,f){function e(b){return{serialize:function(a,g,d,e){a={id:this._requestId++,method:g.name,params:d};b&&(a.jsonrpc=b);return{data:c.toJson(a),handleAs:"json",contentType:"application/json",transport:"POST"}},deserialize:function(a){if("Error"==a.name||a instanceof f)a=c.fromJson(a.responseText);if(a.error){var b=Error(a.error.message||a.error);b._rpcErrorObject=a.error;return b}return a.result}}}
d.rpc.envelopeRegistry.register("JSON-RPC-1.0",function(b){return"JSON-RPC-1.0"==b},c.mixin({namedParams:!1},e()));d.rpc.envelopeRegistry.register("JSON-RPC-2.0",function(b){return"JSON-RPC-2.0"==b},c.mixin({namedParams:!0},e("2.0")))});