var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Media = function Media( ){
	if( this instanceof Media ){
		Model.call( this, "Media" );

		this.scopes = [ 
			
		];

		this.searches = [ 
			
		];

		this.domains = {

		};

	}else{
		return new Media( );
	}
};

util.inherits( Media, Model );

Responsible( ).compose( Media );

Media.prototype.add = function add( media ){
	var mediaData = _.extend( {
		"mediaID": this.mediaID,

		"hash": media.hash,
		"raw": media.raw,
		"URL": media.URL

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, mediaData );

	return this;
};

Media.prototype.update = function update( media, reference ){
	var mediaData = _.extend( {
		"hash": media.hash || null,
		"raw": media.raw || null,
		"URL": media.URL || null

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.update.call( this, mediaData, reference );

	return this;
};

Media.prototype.createReferenceID = function createReferenceID( media ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			media.raw,
			media.URL
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Media.prototype.createMediaID = function createMediaID( media ){
	var mediaData = JSON.stringify( media );

	var mediaID = crypto.createHash( "sha512" )
		.update( mediaData )
		.digest( "hex" )
		.toString( );

	this.references.push( mediaID );

	this.mediaID = mediaID;

	return this;
};

global.Media = Media;