var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Invoice = function Invoice( ){
	if( this instanceof Invoice ){
		MODEL.call( this, "Invoice" );

		this.scopes = [
			"referenceID",
		];

		this.searches = [

		];

		this.domains = {

		};

	}else{
		return new Invoice( );
	}
};

util.inherits( Invoice, Model );

Responsible( ).compose( Invoice );

Invoice.prototype.add = function add( invoice ){
	var invoiceData = _.extend( {
		"invoiceID": this.invoiceID,



		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, invoiceData );

	return this;
};

Invoice.prototype.update = function update( invoice, reference ){
	var invoiceData = _.extend( {


		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.update.call( this, invoiceData, reference );

	return this;
};

Invoice.prototype.createReferenceID = function createReferenceID( invoice ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [


		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Invoice.prototype.createInvoiceID = function createInvoiceID( invoice ){
	var invoiceData = JSON.stringify( invoice );

	var invoiceID = crypto.createHash( "sha512" )
		.update( invoiceData )
		.digest( "hex" )
		.toString( );

	this.references.push( invoiceID );

	this.invoiceID = invoiceID;

	return this;
};

global.Invoice = Invoice;
