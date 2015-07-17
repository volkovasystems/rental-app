//: @development-mode:
var decodePassphrase = function decodePassphrase( passphrase, stringFactor ){
	var hashFactor = XXH( stringFactor, 0xDEADDEAF ).toString( 10 );

	var shareCount = Math.floor( Math.sqrt( Math.sqrt( Math.sqrt( parseInt( hashFactor ) ) ) ) ) || 5;

	var threshold = Math.floor( Math.sqrt( shareCount ) ) || 2;

	var medianThreshold = Math.ceil( ( shareCount + threshold ) / 2 );

	var phrases = _( passphrase ).shuffle( ).take( medianThreshold ).value( );

	return secrets.hex2str( secrets.combine( phrases ) );
};
//: @end-development-mode