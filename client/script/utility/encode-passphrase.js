var encodePassphrase = function encodePassphrase( passphrase, stringFactor ){
	var shaObject = new jsSHA( passphrase, "TEXT" );

	passphrase = shaObject.getHash( "SHA-512", "HEX" );

	var hashFactor = XXH( stringFactor, 0xDEADDEAF ).toString( 10 );

	var shareCount = Math.floor( Math.sqrt( Math.sqrt( Math.sqrt( parseInt( hashFactor ) ) ) ) ) || 5;

	var threshold = Math.floor( Math.sqrt( shareCount ) ) || 2;

	var medianThreshold = Math.ceil( ( shareCount + threshold ) / 2 );

	var subMedianThreshold = Math.ceil( ( threshold + medianThreshold ) / 2 );

	var phrases = secrets.share( secrets.str2hex( passphrase ), shareCount, subMedianThreshold );

	return phrases;
};