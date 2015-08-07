var _ = require( "lodash" );
var util = require( "util" );

require( "./composite.js" );

var Waitable = function Waitable( ){
	return Composite.call( this, Waitable );
};

util.inherits( Waitable, Composite );

Waitable.prototype.wait = function wait( ){
	if( this.waiting ){
		return this;
	}

	this.waiting = true;

	this.waitList = this.waitList || [ ];

	var inheritanceList = [ this.constructor ];
	var currentParent = this.constructor;
	while( "super_" in currentParent ){
		inheritanceList.push( currentParent.super_ );
		currentParent = currentParent.super_;
	}

	var methods = _( inheritanceList )
		.map( ( function onEachParent( parent ){
			if( !_.contains( this.exemptedClasses, parent.name ) ){
				return Object.getOwnPropertyNames( parent.prototype );
			}
		} ).bind( this ) )
		.compact( )
		.flatten( )
		.unique( )
		.without( "constructor" )
		.filter( ( function onEachMethodName( methodName ){
			return (
				!( "compositeOf" in this[ methodName ] ) &&
				!_.contains( this.exemptedMethods, methodName ) &&
				( typeof this[ methodName ] == "function" )
			);
		} ).bind( this ) )
		.filter( ( function onEachMethodName( methodName ){
			return (
				!( /\[\s*native\s*\]/ ).test( this[ methodName ].toString( ) ) ||
				"originalMethod" in this[ methodName ]
			);
		} ).bind( this ) )
		.value( );

	this.methods = methods;

	_.each( methods,
		( function onEachMethodName( methodName ){
			var originalMethod = this[ methodName ];

			this[ methodName ] = ( function delegateMethod( ){
				var parameters = _.toArray( arguments );

				this.waitList.push( ( function delegateMethod( ){
					return originalMethod.apply( this, parameters.concat( _.toArray( arguments ) ) );
				} ).bind( this ) );

				return this;
			} ).bind( this );

			this[ methodName ].originalMethod = originalMethod;
		} ).bind( this ) );

	this.waitList = this.waitList.reverse( );

	return this;
};

Waitable.prototype.notify = function notify( data ){
	var parameters = _.toArray( arguments );

	if( this.waiting &&
		this.waitList.length > 0 )
	{
		var waitList = this.waitList.reverse( );
		process.nextTick( ( function onTick( ){
			var self = this;

			while( self = waitList.pop( ).apply( self, parameters ), waitList.length );
		} ).bind( this ) );
	}

	return this.flush( );
};

Waitable.prototype.flush = function flush( ){
	if( "methods" in this ){
		_.each( this.methods,
			( function onEachMethodName( methodName ){
				this[ methodName ] = this[ methodName ].originalMethod.bind( this );
			} ).bind( this ) );
	}

	this.waitList = [ ];

	this.waiting = false;

	return this;
};

global.Waitable = Waitable;

exports.module = Waitable;
