var _ = require( "lodash" );
var crypto = require( "crypto" );
var secrets = require( "secrets.js" );
var XXH = require( "xxhashjs" );

const PASSPHRASE_SEED = global.PASSPHRASE_SEED || 0xDEADDEAF;

var encodePassphrase = function encodePassphrase( passphrase, stringFactor ){
	passphrase = crypto.createHash( "sha512" )
		.update( passphrase )
		.digest( "hex" )
		.toString( );

	var hashFactor = XXH( stringFactor, PASSPHRASE_SEED ).toString( 10 );

	var shareCount = Math.floor( Math.sqrt( Math.sqrt( Math.sqrt( parseInt( hashFactor ) ) ) ) ) || 5;

	var threshold = Math.floor( Math.sqrt( shareCount ) ) || 2;

	var medianThreshold = Math.ceil( ( shareCount + threshold ) / 2 );

	var subMedianThreshold = Math.ceil( ( threshold + medianThreshold ) / 2 );

	var phrases = secrets.share( secrets.str2hex( passphrase ), shareCount, subMedianThreshold );

	return phrases;
};

module.exports = encodePassphrase;