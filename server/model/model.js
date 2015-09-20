var _ = require( "lodash" );
var async = require( "async" );
var events = require( "events" );
var harden = require( "harden" );
var moment = require( "moment" );
var mongoose = require( "mongoose" );
var util = require( "util" );

require( "../utility/emittable.js" );
require( "../utility/waitable.js" );
require( "../utility/blockable.js" );
require( "../utility/cloneable.js" );
require( "../utility/promising.js" );

var Model = function Model( namespace ){
	if( this instanceof Model ){
		Emittable.call( this );

		/*:
			Create a model with a namespace.
		*/
		if( "NAMESPACED_COLLECTION" in global &&
			global.NAMESPACED_COLLECTION )
		{
			var baseModel = [ namespace, "Model" ].join( "" );

			this.model = mongoose.model( baseModel ).discriminators[ namespace ];

		}else if( namespace ){
			this.model = mongoose.model( "Model" ).discriminators[ namespace ];

		}else{
			this.model = mongoose.model( "Model" );
		}

		//: We need this for logging.
		this.namespace = namespace || "Model";

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

			As well as user's interaction to specific endpoints.
		*/
		this.domains = { };

		this.taps = [ ];

		this.references = [ ];

		/*:
			We will use model data to carry single document 
				asociated with the model instance across different
				sub instances and their methods.
		*/
		this.modelData = { };

		this.on( "sync", this.sync );

		this.on( "log",	function onLog( type, message ){
			var parameters = [ 
					"\n",
					[ "\t", ( new Date( ) ), "\n" ].join( "" ) 
				].concat( _.toArray( arguments )
					.map( function onEachParameter( parameter ){
						return [  
							util.inspect( parameter )
								.split( "\n" )
								.map( function onEachLine( line ){
									return [ "\t", line ].join( "" );
								} )
								.join( "\n" ), 
							"\n" 
						].join( "" );
					} ) )
				.concat( [
					"\n"
				] );

			if( type in console ){
				console[ type ].apply( null, parameters );
			
			}else{
				console.log.apply( null, parameters );	
			}
		} );

		this.on( "error", function onError( error ){
			console.log( "error at", this.namespace, error );
		} );

		this.on( "uncaughtException", function onError( error ){
			this.emit( "error", new Error( util.inspect( {
				"type": "uncaught-exception",
				"error": error
			} ) ) );
		} );

		this.tap( function applyScope( container, callback ){
			if( this.disableScope ){
				callback( );

				return;
			}

			container.parameters = _( container.parameters )
				.map( ( function onEachParameter( parameter ){
					if( parameter === null ){
						return parameter;

					}else if( parameter &&
						typeof parameter == "object" &&
						"__t" in parameter )
					{
						if( this.useCustomScope ){
							return _.pick( parameter, this.scope );

						}else{
							return _.pick( parameter, parameter.scopes );	
						}

					}else if( Array.isArray( parameter ) &&
						typeof parameter[ 0 ] == "object" &&
						"__t" in parameter[ 0 ] )
					{
						return _.map( parameter,
							( function onEachData( data ){
								if( this.useCustomScope ){
									return _.pick( data, this.scopes );

								}else{
									return _.pick( data, data.scopes );	
								}
							} ).bind( this ) );

					}else{
						return parameter;
					}
				} ).bind( this ) )
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
			"composeReferences",
			"recordChange",
			"queryApplyLimitIndex",
			"queryApplyPagination",
			"queryApplySorting"
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

Promising( ).compose( Model );

harden.bind( Model )
	( "NUMBER_PATTERN", ( /^\d+$/ ) );

harden.bind( Model )
	( "SORT_PATTERN", ( /^\-?[a-zA-Z]+$/ ) );

harden.bind( Model )
	( "DEFAULT_SCOPES", 
		[
			"referenceID",
			"reference",
			"name",
			"title",
			"description",
			"tags"
		] );

harden.bind( Model )
	( "DEFAULT_SEARCHES", 
		[
			"name",
			"title",
			"description",
			"tags"
		] );

harden.bind( Model )
	( "DEFAULT_DOMAINS", 
		{

		} );

//: This should be used for initialization only.
Model.prototype.setScopes = function setScopes( scopes ){
	if( !_.isEmpty( this.scopes ) ){
		throw new Error( "scopes are already initialized" );
	}

	scopes = scopes || [ ];

	this.scopes = _.union( scopes, Model.DEFAULT_SCOPES );

	return this;
};

//: This should be used for initialization only.
Model.prototype.setSearches = function setSearches( searches ){
	if( !_.isEmpty( this.searches ) ){
		throw new Error( "searches are already initialized" );
	}

	searches = searches || [ ]; 

	this.searches = _.union( searches, Model.DEFAULT_SEARCHES );

	return this;
};

//: This should be used for initialization only.
Model.prototype.setDomains = function setDomain( domains ){
	if( !_.isEmpty( this.domains ) ){
		throw new Error( "domains are already initialized" );
	}

	domains = domains || { };

	this.domains = _.extend( domains, Model.DEFAULT_DOMAINS );

	return this;
};

/*:
	This is a helper function.
*/
Model.prototype.resolveAddData = function resolveAddData( data ){
	data = data || { };

	return ( function bind( rawData ){
		rawData = rawData || { };
		
		return _.extend( rawData,
			{
				"name": data.name,
				"title": data.title,
				"description": data.description,
				"tags": data.tags,

				"scopes": this.scopes,
				"searches": this.searches,
				"domains": this.domains			
			}, this.modelData );
	} ).bind( this );
};

/*:
	Note this will only add, it will not check if the document already exists.
*/
Model.prototype.add = function add( data ){
	var references = this.composeReferences( data.references, data.reference );

	data.references = references;

	data.referenceID = this.referenceID;

	( new this.model( data ) )
		.save( ( function onSave( error, modelData ){
			if( error ){
				this.result( error );	
			
			}else{
				this.result( null, modelData );

				this.recordChange( "add", modelData );			
			}
		} ).bind( this ) );

	this.emit( "sync" );

	return this;
};

/*:
	This is not part of the model but this is a reusable function
		for resolving update data.

	All data that is undefined will be marked null.

	We will check if the data is null and if the data is null then
		no update has been sent.

	Data such as string, boolean, and number can have falsy
		values so we don't evaluate them.

	Empty string means we will remove the data, zero value
		means we set the data to zero and false
		value means as is. Therefore we don't want to mark
		it null. We don't store null or 
*/
var resolveData = function resolveData( data ){
	for( var key in data ){
		if( typeof data[ key ] != "boolean" || 
			typeof data[ key ] != "number" ||
			typeof data[ key ] != "string" )
		{
			data[ key ] = data[ key ] || null;
		}
	}

	return data;
};

Model.prototype.resolveUpdateData = function resolveUpdateData( data ){
	data = data || { };

	return ( function bind( rawData ){
		rawData = rawData || { };

		return _.extend( resolveData( data ),
			resolveData( {
				"name": rawData.name,
				"title": rawData.title,
				"description": rawData.description,
				"tags": rawData.tags,

				"scopes": this.scopes,
				"searches": this.searches,
				"domains": this.domains			
			} ), 
			resolveData( this.modelData ) );
	} ).bind( this );
};

/*:
	This will update the entire document,
		but properties are selected.

	This will only update one document depending on
		the result of the query.
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

							

							If the array is empty
								it means we need to remove all.
								Note that this is different to null.
	
							If the array has less elements than the previous
								it means we need to replace all the elements
								with the new array.

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
						if( Array.isArray( modelData[ property ] ) &&
							Array.isArray( data[ property ] ) )
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

				modelData
					.save( ( function onSave( error, modelData ){
						if( error ){
							this.result( error );	
						
						}else{
							this.result( null, modelData );

							this.recordChange( "update", modelData );
						}
					} ).bind( this ) );
			}
		} ).bind( this ) );

	this.emit( "sync", query );

	return this;
};

/*:
	This is one property editing but it will edit
		as many documents based on the query.

	If no query is given it will resort to using the given reference.
*/
Model.prototype.edit = function edit( property, value, reference ){
	var references = this.composeReferences( reference );

	var query = { };
	if( !_.isEmpty( references ) ){
		query.references = {
			"$in": references
		};

	}else if( "query" in this &&
		typeof this.query == "object" )
	{
		for( var key in this.query ){
			query[ key ] = this.query[ key ];
		}

	}else{
		this.result( new Error( "query is empty" ) );

		return this;
	}

	this.modelQuery = this.model.find( query );

	this.queryApplySorting( );

	this.queryApplyLimitIndex( )
		.then( function onApplied( ){
			this.modelQuery.exec( ( function onEdit( error, modelDataList ){
				if( error ){
					this.drop( ).result( error );

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
								if( Array.isArray( modelData[ property ] ) &&
									Array.isArray( value ) )
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

								modelData
									.save( ( function onSave( error, modelData ){
										if( error ){
											callback( error );	
										
										}else{
											callback( null, modelData );

											this.recordChange( "edit", modelData );
										}
									} ).bind( this ) );
							} );
						} ),
						( function lastly( error, modelDataList ){
							this.drop( ).result( error, modelDataList );

							this.emit( "sync" );
						} ).bind( this ) );
				}
			} ).bind( this ) );
		} )
		.hold( function onError( error ){
			this.drop( ).result( error );
		} );

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

	return this;
};

/*:
	Use this if you want to override or add additional properties
		not handled by other methods.

	@todo:
		We would like a way to determine if we are overriding
			private properties.
	@end-todo
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

	}else if( !_.isEmpty( arguments ) &&
		typeof property == "string" &&
		property &&
		typeof value != "undefined" &&
		value )
	{
		query[ property ] = value;
	
	}else{
		this.result( new Error( "empty query" ) );
	}

	this.modelQuery = this.model.find( query );

	this.queryApplySorting( );

	this.queryApplyPagination( )
		.then( function onResult( ){
			this.modelQuery
				.exec( ( function onResult( error, modelData ){
					if( error ){
						this.drop( ).result( error );
					
					}else{
						this.drop( ).result( null, modelData );
					}
				} ).bind( this ) );
		} )
		.hold( function onError( error ){
			this.drop( ).result( error );
		} );

	return this;
};

/*:
	Similar to get but return a single document based on the 
		given property and value.
*/
Model.prototype.pick = function pick( property, value ){
	var query = { };

	if( property === "references" ){
		query = { "references": { "$in": _.flatten( [ value ] ) } };

	}else if( !_.isEmpty( arguments ) &&
		typeof property == "string" &&
		property &&
		typeof value != "undefined" &&
		value )
	{
		query[ property ] = value;
	
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
		this.result( new Error( "empty query" ) );
	}

	var modelQuery = this.model.findOne( query );

	if( "index" in this &&
		( /^\d+$/ ).test( this.index.toString( ) ) )
	{
		var index = parseInt( this.index );

		modelQuery = modelQuery.skip( index );
	}

	modelQuery.exec( this.result.bind( this ) );

	this.emit( "sync", query );

	return this;
};

/*:
	reference here is the given shortid.

	Note that refer is similar to pick but you can only
		use references to pick a document.

	The reference format here is based on the result of
		short id algorithm and not based on the
		hash of the data.
*/
Model.prototype.refer = function refer( reference ){
	var query = { };

	if( "reference" in this &&
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

	}else if( !_.isEmpty( arguments ) && 
		typeof reference == "string" &&
		reference )
	{
		query.reference = reference;

	}else{
		this.result( new Error( "query is empty" ) );

		return;
	}

	this.model
		.findOne( query )
		.exec( this.result.bind( this ) );

	this.emit( "sync", query );

	return this;
};

Model.prototype.all = function all( ){
	this.modelQuery = this.model.find( { } );

	this.queryApplySorting( )
		.queryApplyPagination( )
		.then( function execute( ){
			this.modelQuery
				.exec( ( function onResult( error, allModelData ){
					if( error ){
						this.drop( ).result( error );
					
					}else{
						this.drop( ).result( null, allModelData );
					}
				} ).bind( this ) );
		} )
		.hold( function onError( error ){
			this.drop( ).result( error );
		} );

	return this;
};

/*:
	@note:
		We do not count by pages. We count
			based on either the query or
			the limit and index.
	@end-note
*/
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

	this.modelQuery = this.model.count( query );

	this.queryApplyLimitIndex( )
		.then( function onResult( ){
			this.modelQuery
				.exec( ( function onCount( error, count ){
					if( error ){
						this.drop( ).result( error );

					}else{
						this.drop( ).result( null, count );
					}
				} ).bind( this ) );		
		} )
		.hold( function onError( error ){
			this.drop( ).result( error );
		} );

	return this;
};

Model.prototype.countAll = function countAll( ){
	var modelQuery = this.model.count( { } );

	modelQuery
		.exec( ( function onCount( error, total ){
			if( error ){
				this.result( error );

			}else{
				this.result( null, total );
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
				this.result( error, count === expectedCount );

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

Model.prototype.result = function result( ){
	var parameters = _.toArray( arguments );

	//: Do not tap if there are errors.
	if( parameters[ 0 ] instanceof Error ){
		this.emit( "log", "error", parameters[ 0 ] );

		var isEmitted = this.emit.apply( this, [ "result" ].concat( parameters ) );

		if( !isEmitted ){
			this.emit( "error", new Error( "no listener for result for " + this.namespace ) );
		}

		return this;
	}

	this.tapping( parameters,
		( function callback( error, parameters ){
			if( error ){
				this.emit( "log", "error", parameters[ 0 ] );

				this.emit( "error", error );

				return;			
			}

			var isEmitted = this.emit.apply( this, [ "result" ].concat( parameters ) );

			if( !isEmitted ){
				this.emit( "error", new Error( "no listener for result for " + this.namespace ) );
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

var synchronize = function synchronize( query ){
	var references = this.composeReferences( );
	
	if( _.isEmpty( query ) ){
		if( !_.isEmpty( references ) ){
			query = { "references": { "$in": references } };
		
		}else{
			console.log( "cannot sync on empty query" );

			this.modelData = { };
			return;
		}
	}

	this.model.findOne( query,
		( function onResult( error, modelData ){
			if( error ){
				console.log( "error syncing", error );

			}else if( !_.isEmpty( modelData ) ){
				this.modelData = modelData.toObject( );

			}else{
				this.modelData = { };
			}

			this.emit( "synced", error, this.modelData );

			clearTimeout( this.syncTimeout );

			delete this.syncTimeout;
		} ).bind( this ) );
};

Model.prototype.sync = function sync( query ){
	if( "syncTimeout" in this &&
		this.syncTimeout )
	{
		console.log( "syncing is currently active" );
		return this;
	}

	process.nextTick( ( function onTick( ){
		this.syncTimeout = setTimeout( ( synchronize ).bind( this ), 1000, query );
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

	async.series( taps, 
		function delegateCallback( error ){
			callback( error, container.parameters );
		} );

	return this;
};

var Change = mongoose.model( "Change" ); 

/*:
	Logged changes to the document.
*/
Model.prototype.recordChange = function recordChange( event, data ){
	var changes = data.changes || ( data.changes = [ ] );

	( new Change( { 
		"log": {
			"namespace": this.namespace,
			"event": event
		},
		"change": data
	} ) )
	.save( ( function onSave( error, change ){
		if( error ){
			this.emit( "error", error );
		
		}else{
			changes.push( {
				"reference": change.reference,
				"timestamp": change.timestamp
			} );

			if( typeof data.save == "function" ){
				data.save( ( function onSave( error ){
					if( error ){
						this.emit( "error", error );
					}
				} ).bind( this ) );	
			
			}else{
				this.emit( "error", new Error( "cannot save changes for " + this.namespace ) );
			}
		}
	} ).bind( this ) );

	return this;
};

Model.prototype.queryApplyLimitIndex = function queryApplyLimitIndex( ){
	if( !( "modelQuery" in this && 
		this.modelQuery ) )
	{
		throw new Error( "empty model query" );
	}

	if( "index" in this &&
		Model.NUMBER_PATTERN.test( this.index.toString( ) ) )
	{
		this.index = parseInt( this.index );
	}

	if( "limit" in this &&
		Model.NUMBER_PATTERN.test( this.limit.toString( ) ) )
	{
		this.limit = parseInt( this.limit );
	}

	this
		.promise( )
		.clone( )
		.once( "error",
			( function onError( error ){
				this.reject( error );
			} ).bind( this ) )
		.once( "result",
			( function onResult( error, total ){
				if( error ){
					this.reject( error );

				}else{
					this.total = total;

					if( this.index > total ){
						this.index = 0;
					}

					if( this.limit > total ){
						this.limit = total;
					}

					this.modelQuery = this.modelQuery.skip( this.index );

					this.modelQuery = this.modelQuery.limit( this.limit );

					this.resolve( );
				}
			} ).bind( this ) )
		.countAll( );

	return this;
};

/*:
	This should only be used internally.
*/
Model.prototype.queryApplyPagination = function queryApplyPagination( modelQuery ){
	if( !( "modelQuery" in this && 
		this.modelQuery ) )
	{
		throw new Error( "empty model query" );
	}

	if( "page" in this &&
		Model.NUMBER_PATTERN.test( this.page.toString( ) ) &&
		"size" in this &&
		Model.NUMBER_PATTERN.test( this.size.toString( ) ) )
	{
		this.page = parseInt( this.page );
		this.size = parseInt( this.size );

		this.index = ( this.page - 1 ) * this.size;
		this.limit = this.size;
			
		return this.queryApplyLimitIndex( );

	}else{
		return this.queryApplyLimitIndex( );		
	}
};

Model.prototype.queryApplySorting = function queryApplySorting( ){
	if( !( "modelQuery" in this && 
		this.modelQuery ) )
	{
		throw new Error( "empty model query" );
	}

	if( "sort" in this &&
		typeof this.sort == "string" &&
		this.sort &&
		Model.SORT_PATTERN.test( this.sort ) )
	{
		this.modelQuery = this.modelQuery.sort( this.sort );
	}

	return this;
};

global.Model = Model;
module.exports = Model;