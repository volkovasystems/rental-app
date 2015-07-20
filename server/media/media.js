var _ = require( "lodash" );

require( "./model.js" );

require( "./responsible.js" );

var Media = function Media( ){
	MODEL.call( this, "Medias" );
};

util.inherits( Media, MODEL );

RESPONSIBLE( ).compose( Media );

Media.prototype.add = function add( media ){
	var mediaData = _.extend( {
		"mediaID": this.mediaID,

		"hash": media.hash,
		"raw": media.raw,
		"URL": media.URL
	}, this.modelData );

	MODEL.prototype.add.call( this, mediaData );

	return this;
};

Media.prototype.update = function update( reference, media ){
	var mediaData = _.extend( {
		"hash": media.hash || null,
		"raw": media.raw || null,
		"URL": media.URL || null
	}, this.modelData );

	MODEL.prototype.update.call( this, reference, mediaData );

	return this;
};

global.MEDIA = Media;