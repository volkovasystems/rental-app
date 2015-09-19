var _ = require( "lodash" );
var crypto = require( "crypto" );
var events = require( "events" );
var uuid = require( "node-uuid" );
var util = require( "util" );

require( "./composite.js" );

/*:
	Promising is a composite class that let's you
		do promises for a chainable flow.

*/
var Promising = function Promising( ){
	return Composite.call( this, Promising );
};

util.inherits( Promising, Composite );

Promising.prototype.getPromise = function getPromise( ){
	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	return _.last( this.promiseList );
};

Promising.prototype.resolve = function resolve( value ){
	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	var promiseList = this.promiseList.reverse( );

	var promise = { };
	for( var index = 0; index < promiseList.length; index++ ){
		promise = promiseList[ index ];

		if( "resolve" in promise &&
			typeof promise.resolve == "function" )
		{
			promise.resolve( value );

			break;
		}
	}

	return this;
};

Promising.prototype.reject = function reject( reason ){
	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	var promiseList = this.promiseList.reverse( );

	var promise = { };
	for( var index = 0; index < promiseList.length; index++ ){
		promise = promiseList[ index ];

		if( "reject" in promise &&
			typeof promise.reject == "function" )
		{
			promise.reject( value );

			break;
		}
	}

	return this;
};

Promising.prototype.handleRejection = function handleRejection( reason ){
	console.log( "unhandled rejection", reason );

	if( this instanceof events.EventEmitter ){
		this.emit( [ "promise-error", this.deferredPromise.hash ].join( "@" ), reason );
	}
};

Promising.prototype.promise = function promise( ){
	this.deferredPromise = new Promise( ( function onResolve( resolve, reject ){
		this.promise.resolve = resolve;
		this.promise.reject = reject;
	} ).bind( this ) );

	this.deferredPromise.hash = crypto.createHash( "sha512" )
		.update( _.flatten( [
			uuid.v1( ),
			uuid.v4( )
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.promiseList = [ this.deferredPromise ];

	if( this instanceof events.EventEmitter ){
		this.getPromise( )
			.catch( ( function onError( error ){
				this.emit( [ "promise-error", this.deferredPromise.hash ].join( "@" ), error );
			} ).bind( this ) );
	
	}else{
		process.on( "unhandledRejection", this.handleRejection );
	}

	return this;
};

Promising.prototype.then = function then( resolved, async ){
	if( typeof resolved != "function" ){
		throw new Error( "invalid resolved parameter" );
	}

	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	if( async ){
		this.later( resolved, async );

		return this;
	}

	var promise = this.getPromise( )
		.then( ( function onResolve( ){
			var result = resolved.apply( this, _.toArray( arguments ) );

			if( result ){
				if( result instanceof this.constructor &&
					!_.isEmpty( result.promise ) &&
					result.promise instanceof Promise )
				{
					this.promiseList.push( result.promise );
				
					return true;
				}	

				//: You can still chain the promise.
				return result;

			}else if( result === false ){
				this.drop( ).done( );
			}
		} ).bind( this ) );

	this.promiseList.push( promise );

	return this;
};

Promising.prototype.later = function later( resolved, async ){
	if( typeof resolved != "function" ){
		throw new Error( "invalid resolved parameter" );
	}

	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	process.nextTick( ( function onNextTick( ){
		this.then( resolved, async );
	} ).bind( this ) );
	
	return this;
};

Promising.prototype.hold = function hold( rejected, async ){
	if( typeof rejected != "function" ){
		throw new Error( "invalid rejected parameter" );
	}

	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	if( async ){
		this.holding( rejected, async );

		return this;
	}

	if( !( this instanceof events.EventEmitter ) ){
		var promise = this.getPromise( )
			.catch( ( function onReject( error ){
				//: Always return true if you're going to do asynchronous.
				var result = rejected.call( this, error );

				if( result ){
					if( result instanceof this.constructor &&
						!_.isEmpty( result.promise ) &&
						result.promise instanceof Promise )
					{
						this.promiseList.push( result.promise );
					
						return true;
					}

					//: You can still chain the promise.
					return result;

				}else if( result === false ){
					this.drop( ).done( );
				}
			} ).bind( this ) );

		this.promiseList.push( promise );
	
	}else{
		this.once( [ "promise-error", this.deferredPromise.hash ].join( "@" ),
			( function onError( error ){
				var result = rejected.call( this, error );

				if( !result ){
					//: Drop the promise if the rejected result is falsy.
					this.drop( ).done( );
				}
			} ).bind( this ) );
	}

	return this;
};

Promising.prototype.holding = function holding( rejected, async ){
	if( typeof resolved != "function" ){
		throw new Error( "invalid rejected parameter" );
	}

	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		//: Promise is probably dropped.
		throw new Error( "promise is empty or dropped" );
	}

	process.nextTick( ( function onNextTick( ){
		this.hold( rejected, async );
	} ).bind( this ) );
	
	return this;
};

Promising.prototype.drop = function drop( ){
	this.lastly = this.deferredPromise.lastly;

	this.deferredPromise = { };

	this.promiseList = [ ];

	process.removeListener( "unhandledRejection", this.handleRejection );

	return this;
};

/*:
	Drop the promise first before calling done.
*/
Promising.prototype.done = function done( lastly, forceDrop ){
	if( _.isEmpty( this.deferredPromise ) &&
		_.isEmpty( this.promiseList ) )
	{
		if( typeof lastly == "function" &&
			_.isEmpty( this.lastly ) )
		{
			lastly.apply( this );

		}else if( typeof this.lastly == "function" ){
			this.lastly.apply( this );
			
			this.lastly = null;
		
		}else{
			console.log( "promise chain has ended" );
		}
	
	}else{
		if( typeof lastly == "function" ){
			this.deferredPromise.lastly = lastly;

		}else{
			console.log( "cannot end the promise chain if not dropped" );
		}
	}

	return this;
};

global.Promising = Promising;

module.exports = Promising;