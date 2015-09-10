var _ = require( "lodash" );
var chance = require( "chance" ).Chance( );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Access = function Access( ){
	if( this instanceof Access ){
		Model.call( this, "Access" );

		this.scopes = [ 
			"referenceID",
			"reference",
			"accessID",
			"domain"
		];

		this.searches = [
			"referenceID",
			"domain"
		];

		this.domains = {
		};

	}else{
		return new Access( );
	}
};

util.inherits( Access, Model );

Responsible( ).compose( Access );

Access.prototype.add = function add( access ){
	var accessData = _.extend( {
		"accessID": this.accessID,
		"hash": access.hash,
		"domain": access.domain,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, accessData );

	return this;
};

Access.prototype.update = function update( access, reference ){
	var accessData = _.extend( {
		"accessID": this.accessID || null,

		"hash": access.hash || null,
		"domain": access.domain || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	Model.prototype.update.call( this, accessData, reference );

	return this;
};

Access.prototype.createReferenceID = function createReferenceID( access ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			access.hash,
			access.domain
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

/*:
	The access id will be the hash using PBKDF2
*/
Access.prototype.createAccessID = function createAccessID( access ){
	var parameters = [
		access.proposal, 
		chance.paragraph( { "sentences": 10 } ), 
		chance.integer( { "min": 9000, "max": 10000 } ),
		64,
		"sha512"
	];

	var accessID = crypto.pbkdf2Sync.apply( null, parameters );

	accessID = new Buffer( accessID ).toString( "hex" );

	this.references.push( accessID );

	this.accessID = accessID;

	return this;
};

global.Access = Access;



