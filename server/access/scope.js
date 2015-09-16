var _ = require( "lodash" );
var chance = require( "chance" ).Chance( );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Scope = function Scope( ){
	if( this instanceof Scope ){
		Model.call( this, "Scope" );

		this.scopes = [ 
			"referenceID",
			"reference",
			"scopeID",
			"domain"
		];

		this.searches = [
			"referenceID",
			"domain"
		];

		this.domains = {
		};

	}else{
		return new Scope( );
	}
};

util.inherits( Scope, Model );

Responsible( ).compose( Scope );

Scope.prototype.add = function add( scope ){
	var scopeData = _.extend( {
		"scopeID": this.scopeID,
		"hash": scope.hash,
		"domain": scope.domain,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, scopeData );

	return this;
};

Scope.prototype.update = function update( scope, reference ){
	var scopeData = _.extend( {
		"scopeID": this.scopeID || null,

		"hash": scope.hash || null,
		"domain": scope.domain || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	Model.prototype.update.call( this, scopeData, reference );

	return this;
};

Scope.prototype.createReferenceID = function createReferenceID( scope ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			scope.hash,
			scope.domain
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

/*:
	The scope id will be the hash using PBKDF2
*/
Scope.prototype.createScopeID = function createScopeID( scope ){
	var parameters = [
		scope.proposal, 
		chance.paragraph( { "sentences": 10 } ), 
		chance.integer( { "min": 9000, "max": 10000 } ),
		64,
		"sha512"
	];

	var scopeID = crypto.pbkdf2Sync.apply( null, parameters );

	scopeID = new Buffer( scopeID ).toString( "hex" );

	this.references.push( scopeID );

	this.scopeID = scopeID;

	return this;
};

global.Scope = Scope;
module.exports = Scope;