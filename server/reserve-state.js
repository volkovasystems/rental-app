var _ = require( "lodash" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var ReserveState = function ReserveState( ){
	if( this instanceof ReserveState ){
		MODEL.call( this, "ReserveState" );

		this.scopes = [ 
			"name",
			"title",
			"description",
			"referenceID"
		];

		this.searches = [ 
			"name",
			"title",
			"description"	 
		];

		this.domains = {

		};
		
	}else{
		return new ReserveState( );
	}
};

util.inherits( ReserveState, MODEL );

RESPONSIBLE( ).compose( ReserveState );

ReserveState.prototype.add = function add( reserveState ){
	var reserveStateData = _.extend( {
		"reserveStateID": this.reserveID,

		"name": reserve.name,
		"title": reserve.title,
		"description": reserve.description,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, reserveStateData );

	return this;
};

ReserveState.prototype.update = function update( reference, reserveState ){
	var reserveStateData = _.extend( {
		"name": reserveState.name || null,
		"title": reserveState.title || null,
		"description": reserveState.description || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, reference, reserveStateData );

	return this;
};

ReserveState.prototype.createReferenceID = function createReferenceID( reserveState ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			reserveState.name,
			reserveState.title
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

ReserveState.prototype.createReserveStateID = function createReserveStateID( reserveState ){
	var reserveState = JSON.stringify( reserveState );

	var reserveStateID = crypto.createHash( "sha512" )
		.update( reserveState )
		.digest( "hex" )
		.toString( );

	this.references.push( reserveStateID );

	this.reserveStateID = reserveStateID;

	return this;
};

global.RESERVE_STATE = ReserveState;