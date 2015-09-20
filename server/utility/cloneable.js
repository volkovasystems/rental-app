var _ = require( "lodash" );
var util = require( "util" );

require( "./composite.js" );

var Cloneable = function Cloneable( ){
	return Composite.call( this, Cloneable );
};

util.inherits( Cloneable, Composite );

/*:
	All composite methods will be cloneable.
*/
Cloneable.prototype.clone = function clone( name ){
	if( name in this &&
	 	this[ name ] )
	{
		return this[ name ];
	}

	var copy = new this.constructor( );

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

	_( this )
		.keys( )
		.filter( ( function onEachProperty( property ){
			return _.contains( this.cloneableProperties, property );
		} ).bind( this ) )
		.each( ( function onEachProperty( property ){
			Object.defineProperty( copy, property,
				{
					"get": ( function get( ){
						return this[ property ];
					} ).bind( this ),

					"set": ( function set( value ){
						this[ property ] = value;
					} ).bind( this )
				} );
		} ).bind( this ) );

	_.each( methods,
		( function onEachMethod( methodName ){
			copy[ methodName ] = ( function delegateMethod( ){
				return this[ methodName ].apply( copy, _.toArray( arguments ) );
			} ).bind( this );
		} ).bind( this ) );

	copy.self = this;
	copy.isClone = true;

	/*:
		@todo:
			Determine the clone level.
		@end-todo
	*/
	//copy.cloneLevel

	if( name ){
		this[ name ] = copy;
	}
	
	return copy;
};

global.Cloneable = Cloneable;
module.exports = Cloneable;
