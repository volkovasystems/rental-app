var events = require( "events" );
var util = require( "util" );

var Emittable = function Emittable( ){
	if( this instanceof Emittable ){
		events.EventEmitter.call( this );

		this.setMaxListeners( 0 );	
	}
};

util.inherits( Emittable, events.EventEmitter );

global.Emittable = Emittable;

module.exports = Emittable;