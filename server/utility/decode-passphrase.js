var _ = require( "lodash" );
var secrets = require( "secrets.js" );
var XXH = require( "xxhashjs" );

const PASSPHRASE_SEED = global.PASSPHRASE_SEED || 0xDEADDEAF;

/*:
	Decoding the passphrase is an internal function to the user-login.

	We don't expose this capability as user method.

	It will simply decode the passphrase array based on Shamir's Secret Sharing Algorithm.

	We will use the string factor to derive the sharing partition and threshold.

	Throw an error if there's a slight error in the process.
*/
var decodePassphrase = function decodePassphrase( passphrase, stringFactor ){
	var hashFactor = XXH( stringFactor, PASSPHRASE_SEED ).toString( 10 );

	var shareCount = Math.floor( Math.sqrt( Math.sqrt( Math.sqrt( parseInt( hashFactor ) ) ) ) ) || 5;

	var threshold = Math.floor( Math.sqrt( shareCount ) ) || 2;

	var medianThreshold = Math.ceil( ( shareCount + threshold ) / 2 );

	var phrases = _( passphrase ).shuffle( ).take( medianThreshold ).value( );

	return secrets.hex2str( secrets.combine( phrases ) );
};

module.exports = decodePassphrase;