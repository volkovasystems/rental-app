var _ = require( "lodash" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Analytics = function Analytics( ){
	if( this instanceof Analytics ){
		Model.call( this, "Analytics" );

		this.scopes = [ 
			"name", 
			"title", 
			"description", 
			"image", 
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
		return new Analytics( );
	}
};

util.inherits( Analytics, Model );

RESPONSIBLE( ).compose( Analytics );

Analytics.prototype.add = function add( analytics ){
	var analyticsData = _.extend( {
		"analyticsID": this.analyticsID,
		
		"name": analytics.name,
		"title": analytics.title,
		"description": analytics.description,
		"image": analytics.image,
		
		"scopes": this.scopes,
		"searches": this.searches
	}, this.modelData );

	Model.prototype.add.call( this, analyticsData );

	return this;
};

Analytics.prototype.update = function update( analytics, reference ){
	var analyticsData = _.extend( {
		"name": analytics.name || null,
		"title": analytics.title || null,
		"description": analytics.description || null,
		"image": analytics.image || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null
	}, this.modelData );

	Model.prototype.update.call( this, analyticsData, reference );

	return this;
};

Analytics.prototype.createReferenceID = function createReferenceID( analytics ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			analytics.name,
			analytics.title,
			analytics.image
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Analytics.prototype.createAnalyticsID = function createAnalyticsID( analytics ){
	var analytics = JSON.stringify( analytics );

	var analyticsID = crypto.createHash( "sha512" )
		.update( analytics )
		.digest( "hex" )
		.toString( );

	this.references.push( analyticsID );

	this.analyticsID = analyticsID;

	return this;
};

global.Analytics = Analytics;