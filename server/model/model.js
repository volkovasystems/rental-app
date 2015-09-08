var _ = require( "lodash" );
var async = require( "async" );
var events = require( "events" );
var mongoose = require( "mongoose" );
var util = require( "util" );

require( "../utility/emittable.js" );
require( "../utility/waitable.js" );
require( "../utility/blockable.js" );
require( "../utility/cloneable.js" );

var Model = function Model( namespace ){
	if( this instanceof Model ){
		Emittable.call( this );

		/*:
			Create a model with a namespace.
		*/
		if( namespace ){
			this.model = mongoose.model( "Model" ).discriminators[ namespace ];

		}else{
			this.model = mongoose.model( "Model" );
		}

		/*:
			Scopes are used to limit the data to be returned.
		*/
		this.scopes = [ ];

		/*:
			Searches are used to limit what data can be
				used as search query.
		*/
		this.searches = [ ];

		/*:
			Domains are used to limit server to server
				interactions.
		*/
		this.domains = { };

		this.taps = [ ];

		this.references = [ ];

		this.modelData = { };

		this.on( "sync", this.sync );

		this.tap( function applyScope( container, callback ){
			if( this.disableScope ){
				callback( );

				return;
			}

			container.parameters = _( container.parameters )
				.map( function onEachParameter( parameter ){
					if( parameter === null ){
						return parameter;

					}else if( parameter &&
						typeof parameter == "object" &&
						"__t" in parameter )
					{
						return _.pick( parameter, parameter.scopes );

					}else if( parameter instanceof Array &&
						typeof parameter[ 0 ] == "object" &&
						"__t" in parameter[ 0 ] )
					{
						return _.map( parameter,
							function onEachData( data ){
								return _.pick( data, data.scopes );
							} );

					}else{
						return parameter;
					}
				} )
				.value( );

			callback( );
		} );
	}
};

util.inherits( Model, Emittable );

/*:
	Anything you configured as exempted,
		means we cannot wait on them once they're called,
		they will be executed.
*/
Waitable( ).compose( Model )
	.configure( {
		"exemptedClasses": [ "EventEmitter" ],
		"exemptedMethods": [
			"result",
			"sync",
			"tap",
			"tapping",
			"composeReferences"
		]
	} );

Cloneable( ).compose( Model )
	.configure( {
		"cloneableProperties": [
			"references",
			"reference",
			"modelData",
			"referenceID"
		]
	} );

Blockable( ).compose( Model );

/*:
	Note this will only add, it will not check if the document already exists.
*/
Model.prototype.add = function add( data ){
	var references = this.composeReferences( data.references, data.reference );

	data.references = references;

	data.timestamps = [ new Date( ) ];

	data.referenceID = this.referenceID;

	( new this.model( data ) ).save( this.result.bind( this ) );

	this.emit( "sync" );

	return this;
};

/*:
	This will update the entire document.
	But properties are selected.
*/
Model.prototype.update = function update( data, reference ){
	var references = this.composeReferences( reference );

	var query = { };
	if( !_.isEmpty( references ) ){
		query.references = {
			"$in": references
		}

	}else if( "query" in this ){
		for( var key in this.query ){
			query[ key ] = this.query[ key ];
		}

	}else{
		this.result( new Error( "query is empty" ) );

		return this;
	}

	this.model.findOne( query,
		( function onResult( error, modelData ){
			if( error ){
				this.result( error );

			}else{
				for( var property in data ){
					if( data[ property ] !== null ){
						/*:
							Update rule when dealing with arrays.

							If the array has one element
								it means we need to add it.

							If the array has less elements than the previous
								it means we need to replace all the elements
								with the new array.

							If the array is empty
								it means we need to remove all.
								Note that this is different to null.

							If the array is has more elements than the previous
								it means we need to replace all the elements
								with the new array.

							If there are no differences in lengths
								it means we need to replace all the elements
								with the new array.

							Exception:
								If the previous array has one element.
								And you want to remove and replace the previous
									one with the new one, then you need
									to provide a special format.
						*/
						if( modelData[ property ] instanceof Array &&
							data[ property ] instanceof Array )
						{
							if( data[ property ].length == 1 ){
								modelData[ property ] = _.union( modelData[ property ], data[ property ] );

							}else if( data[ property ].length == 0 ){
								modelData[ property ] = [ ];

							}else if( modelData[ property ].length != data[ property ].length ){
								modelData[ property ] = data[ property ];
							}

							if( "exempt" in data[ property ] &&
								!_.isEmpty( data[ property ].exempt ) )
							{
								modelData[ property ] = _.without.call( null, [ modelData[ property ] ]
									.concat( data[ property ].exempt ) );
							}

						}else{
							modelData[ property ] = data[ property ];
						}
					}
				}

				var references = this.composeReferences( modelData.references, data.reference );

				modelData.references = references;

				if( "timestamps" in modelData ){
					modelData.timestamps.push( new Date( ) );
				}

				modelData.save( this.result.bind( this ) );
			}
		} ).bind( this ) );

	this.emit( "sync" );

	return this;
};

/*:
	This is one property editing.
*/
Model.prototype.edit = function edit( property, value, reference ){
	var references = this.composeReferences( reference );

	var query = { };
	if( !_.isEmpty( references ) ){
		query.references = {
			"$in": references
		}

	}else if( "query" in this ){
		for( var key in this.query ){
			query[ key ] = this.query[ key ];
		}

	}else{
		this.result( new Error( "query is empty" ) );

		return this;
	}

	var modelQuery = this.model.find( query );

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	modelQuery.exec( ( function onEdit( error, modelDataList ){
		if( error ){
			this.result( error );

		}else{
			async.parallel( _.map( modelDataList,
				function onEachModelData( modelData ){
					return ( function editModelData( callback ){
						/*:
							Update rule when dealing with arrays.

							If the array has one element
								it means we need to add it.

							If the array has less elements than the previous
								it means we need to replace all the elements
								with the new array.

							If the array is empty
								it means we need to remove all.
								Note that this is different to null.

							If the array is has more elements than the previous
								it means we need to replace all the elements
								with the new array.

							If there are no differences in lengths
								it means we need to replace all the elements
								with the new array.
						*/
						if( modelData[ property ] instanceof Array &&
							value instanceof Array )
						{
							if( value.length == 1 ){
								modelData[ property ] = _.union( modelData[ property ], value );

							}else if( value.length == 0 ){
								modelData[ property ] = [ ];

							}else if( modelData[ property ].length != value.length ){
								modelData[ property ] = value;
							}

						}else{
							modelData[ property ] = value;
						}

						modelData.save( callback );
					} );
				} ),
				( function lastly( error, modelDataList ){
					this.result( error, modelDataList );
				} ).bind( this ) );
		}
	} ).bind( this ) );

	this.emit( "sync" );

	return this;
};

/*:
	Note that remove is per document.

	We will still decide what flow should we implement on multiple
		removals to ensure that once we removed it, we can still
		revert the changes.
*/
Model.prototype.remove = function remove( reference ){
	var references = this.composeReferences( reference );

	var query = { };
	if( !_.isEmpty( references ) ){
		query.references = {
			"$in": references
		}

	}else if( "query" in this ){
		for( var key in this.query ){
			query[ key ] = this.query[ key ];
		}

	}else{
		this.result( new Error( "query is empty" ) );

		return this;
	}

	this.model.remove( query, this.result.bind( this ) );

	this.emit( "sync" );

	return this;
};

/*:
	Use this if you want to override or add additional properties
		not handled by other methods.
*/
Model.prototype.set = function set( property, value ){
	if( typeof value != "undefined" ){
		this[ property ] = value;
	}

	return this;
};

/*:
	Either we get through the use of references like referenceID,
		or a custom property value.

	This will return an array.
*/
Model.prototype.get = function get( property, value ){
	var query = { };

	if( property === "references" ){
		query = { "references": { "$in": _.flatten( [ value ] ) } };

	}else if( "reference" in this &&
		_.isEmpty( arguments ) )
	{
		query = { "references": { "$in": [ this.reference ] } };

	}else if( "referenceID" in this &&
		_.isEmpty( arguments ) )
	{
		/*:
			@todo:
				We store the referenceID as part of the model,
					maybe we can use OR here?
			@end-todo
		*/
		query = { "references": { "$in": [ this.referenceID ] } };

	}else if( "references" in this &&
		_.isEmpty( arguments ) )
	{
		query = { "references": { "$in": this.references } };

	}else{
		query[ property ] = value;
	}

	var modelQuery = this.model.find( query );

	if( "sort" in this ){
		 modelQuery = modelQuery.sort( this.sort );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

/*:
	Similar to get but return a single document.
*/
Model.prototype.pick = function pick( property, value ){
	var query = { };

	if( property === "references" ){
		query = { "references": { "$in": _.flatten( [ value ] ) } };

	}else if( "reference" in this &&
		_.isEmpty( arguments ) )
	{
		query = { "references": { "$in": [ this.reference ] } };

	}else if( "referenceID" in this &&
		_.isEmpty( arguments ) )
	{
		/*:
			@todo:
				We store the referenceID as part of the model,
					maybe we can use OR here?
			@end-todo
		*/
		query = { "references": { "$in": [ this.referenceID ] } };

	}else if( "references" in this &&
		_.isEmpty( arguments ) )
	{
		query = { "references": { "$in": this.references } };

	}else{
		query[ property ] = value;
	}

	var modelQuery = this.model.findOne( query );

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

Model.prototype.all = function all( ){
	var modelQuery = this.model.find( { } );

	if( "sort" in this ){
		 modelQuery = modelQuery.sort( this.sort );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

Model.prototype.count = function count( data ){
	var query = { };

	if( "referenceID" in this ){
		query.referenceID = this.referenceID;
	}

	if( !_.isEmpty( data ) ){
		_.each( this.scopes,
			function onEachScope( scope ){
				if( scope in data ){
					query[ scope ] = data[ scope ];
				}
			} );
	}

	var modelQuery = this.model.count( query );

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( ( function onCount( error, count ){
		if( error ){
			this.result( error );

		}else{
			this.result( null, count );
		}
	} ).bind( this ) );

	return this;
};

/*:
	This is for reference check.
*/
Model.prototype.exists = function exists( reference, expectedCount ){
	var references = this.composeReferences( reference );

	var query = { "references": { "$in": references } };

	this.model.count( query,
		( function onCount( error, count ){
			if( typeof expectedCount == "number" &&
				expectedCount )
			{
				this.result( error, count == expectedCount );

			}else{
				this.result( error, count >= 1 );
			}
		} ).bind( this ) );

	return this;
};

/*:
	This functions as a check if certain
		value pair was contained in the
		collection at the least.
*/
Model.prototype.has = function has( value, property ){

	var query = { };
	query[ property ] = value;

	if( property === "references" ){
		query = { "references": { "$in": _.flatten( [ value ] ) } };
	}

	this.model.count( query,
		( function onCount( error, count ){
			this.result( error, count >= 1 );
		} ).bind( this ) );

	return this;
};

Model.prototype.have = function have( value, property, expectedCount ){
	if( typeof expectedCount != "number" ||
		expectedCount === 0 )
	{
		this.result( new Error( "invalid expected count" ) );

		return;
	}

	var query = { };
	query[ property ] = value;

	if( property === "references" ){
		query = { "references": { "$in": _.flatten( [ value ] ) } };
	}

	this.model.count( query,
		( function onCount( error, count ){
			this.result( error, count == expectedCount );
		} ).bind( this ) );

	return this;
};

/*:
	This will check if the given data exists.

	This is a bulk check.
*/
Model.prototype.confirm = function confirm( data, expectedCount ){
	var query = { };

	if( "referenceID" in this ){
		query.referenceID = this.referenceID;
	}

	var references = this.composeReferences( );

	if( !_.isEmpty( references ) ){
		query.references = {
			"$in": references
		}
	}

	if( "query" in this ){
		for( var key in this.query ){
			query[ key ] = this.query[ key ];
		}
	}

	_.each( this.scopes,
		function onEachScope( scope ){
			if( scope in data ){
				query[ scope ] = data[ scope ];
			}
		} );

	this.model.count( query,
		( function onCount( error, count ){
			if( typeof expectedCount == "number" &&
				expectedCount )
			{
				this.result( error, count == expectedCount );

			}else{
				this.result( error, count >= 1 );
			}
		} ).bind( this ) );

	return this;
};

/*:
	A boolean function for checking
		if the collection contains data.
*/
Model.prototype.populated = function populated( ){
	this.clone( )
		.once( "result",
			function onResult( error, count ){
				if( error ){
					this.self.result( error );

				}else if( count >= 1 ){
					this.self.result( null, true );

				}else{
					this.self.result( null, false );
				}
			} )
		.set( "limit", this.limit )
		.set( "index", this.index )
		.count( );

	return this;
};

Model.prototype.search = function search( value ){
	var queries = [ ];

	var regexValue = new RegExp( value.replace( /\W/g,"\\$&" ), "i" );

	_.each( this.searches, function onEachSearch( search ){
		var query = { };

		query[ search ] = value;

		queries.push( query );

		query = { };

		query[ search ] = {
			"$regex": regexValue
		};

		queries.push( query );
	} );

	var modelQuery = this.model.find( {
		"$or": queries
	} );

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

Model.prototype.contains = function contains( value ){
	var queries = [ ];

	var regexValue = new RegExp( value.replace( /\W/g,"\\$&" ), "i" );

	_.each( this.searches, function onEachSearch( search ){
		var query = { };

		query[ search ] = {
			"$regex": regexValue
		};

		queries.push( query );
	} );

	var modelQuery = this.model.find( {
		"$or": queries
	} );

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

Model.prototype.matches = function matches( value ){
	var queries = [ ];

	_.each( this.searches, function onEachSearch( search ){
		var query = { };

		query[ search ] = value;

		queries.push( query );
	} );

	var modelQuery = this.model.find( {
		"$or": queries
	} );

	if( "limit" in this &&
		( /^\d+$/ ).test( this.limit.toString( ) ) )
	{
		var limit = parseInt( this.limit );

		modelQuery = modelQuery.limit( limit );
	}

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( this.result.bind( this ) );

	return this;
};

Model.prototype.result = function result( ){
	var parameters = _.toArray( arguments );

	//: Do not tap if there are errors.
	if( parameters[ 0 ] instanceof Error ){
		var isEmitted = this.emit.apply( this, [ "result" ].concat( parameters ) );

		if( !isEmitted ){
			this.emit( "error", new Error( "no listener for result" ) );
		}

		return this;
	}

	this.tapping( parameters,
		( function callback( error, parameters ){
			if( error ){
				this.emit( "error", error );

				parameters = [ error ];
			}

			var isEmitted = this.emit.apply( this, [ "result" ].concat( parameters ) );

			if( !isEmitted ){
				this.emit( "error", new Error( "no listener for result" ) );
			}
		} ).bind( this ) );

	return this;
};

/*:
	This will unify all references into
		an array of distinct references.

	Note that, anything that refer to the document
		should be placed in references.

		References follow an invisible hierarchy for
		prioritization. Secret references, public references
		and sessioned references.

		Public references are restricted by domain.

		Secret references are restricted by users.

		Session references are restricted by time.
*/
Model.prototype.composeReferences = function composeReferences( reference ){
	return _( this.references
		.concat( [ _.toArray( arguments ), this.reference, this.referenceID ] ) )
		.flatten( )
		.compact( )
		.unique( )
		.value( );
};

/*:
	Execute method of model let's you insert
		interactive method that inhibits a wait and notify.

*/
Model.prototype.execute = function execute( method, data ){
	this.wait( );

	var result = ( method.bind( this ) )( data );

	if( ( typeof result == "boolean" &&
		result !== false ) ||
		typeof result != "undefined" )
	{
		this.notify( result );
	}

	return this;
};

var synchronize = function synchronize( ){
	if( !_.isEmpty( this.references ) ){
		var query = { "references": { "$in": [ this.references ] } };

		this.model.findOne( query,
			( function onResult( error, modelData ){
				if( error ){

				}else if( !_.isEmpty( modelData ) ){
					for( var property in modelData ){
						this.modelData[ property ] = modelData[ property ];
					}

				}else{
					//: @todo: Do something here!
				}

				this.emit( "synced", error, modelData );
			} ).bind( this ) );
	}

	clearTimeout( this.syncTimeout );
};

Model.prototype.sync = function sync( ){
	process.nextTick( ( function onTick( ){
		this.syncTimeout = setTimeout( ( synchronize ).bind( this ), 1000 );
	} ).bind( this ) );

	return this;
};

/*:
	Add a tap function for applying changes
		after the data retrieval.
*/
Model.prototype.tap = function tap( handler ){
	this.taps.push( handler );

	return this;
};

/*:
	Apply the accumulated taps.

	The last tap function will be executed first.

	This is because, higher overrides may contain
		tap functions and are the last ones to apply tap functions.
*/
Model.prototype.tapping = function tapping( parameters, callback ){
	var container = {
		"parameters": _.clone( parameters )
	};

	var taps = this.taps.reverse( )
		.map( ( function onEachTap( tap ){
			return ( function delegateTap( callback ){
				return tap.call( this, container, callback );
			} ).bind( this );
		} ).bind( this ) );

	async.series( taps, function delegateCallback( error ){
		callback( error, container.parameters );
	} );

	return this;
};

global.Model = Model;
