var _ = require( "lodash" );
var events = require( "events" );
var util = require( "util" );

require( "./composite.js" );

/*:
	Blockable is a composite class that let's you override
		methods with empty ones.

	This let us do clean code while maintaining correct flow.
*/
var Blockable = function Blockable( ){
	return Composite.call( this, Blockable );
};

util.inherits( Blockable, Composite );

Blockable.prototype.block = function block( ){
	var inheritanceList = [ this.constructor ];
	var currentParent = this.constructor;

	while( "super_" in currentParent ){
		inheritanceList.push( currentParent.super_ );
		currentParent = currentParent.super_;
	}

	var methods = _( inheritanceList )
		.map( function onEachParent( parent ){
			return Object.getOwnPropertyNames( parent.prototype );
		} )
		.flatten( )
		.unique( )
		.without( "constructor" )
		.filter( ( function onEachMethodName( methodName ){
			return ( typeof this[ methodName ] == "function" );
		} ).bind( this ) )
		.value( );

	_.each( methods,
		( function onEachMethodName( methodName ){
			this[ methodName ] = ( function delegateMethod( ){
				return this;
			} ).bind( this );
		} ).bind( this ) );

	if( this instanceof events.EventEmitter ){
		this.emit( "blocked" );
	}

	return this;
};

global.Blockable = Blockable;

module.exports = Blockable;