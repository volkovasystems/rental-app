var urlJoin = function urlJoin( container, reference ){
	if( !( reference in container ) ){
		throw new Error( [ "cannot create url joiner for", reference ].join( " " ) );
	}

	var referenceValue = container[ reference ];

	if( referenceValue.constructor.name == "URLJoiner" ){
		throw new Error( [ "url joiner has been created for", reference ].join( " " ) );
	}

	var URLJoiner = function URLJoiner( ){
		this.referenceValue = referenceValue;
	};

	URLJoiner.prototype.join = function join( path ){
		this.referenceValue = [ this.referenceValue, path ].join( "/" );

		return this;
	};

	URLJoiner.prototype.port = function port( portNumber ){
		this.referenceValue = this.referenceValue.replace( /\:\d+/, portNumber );
		
		return this;
	};

	URLJoiner.prototype.secure = function secure( ){
		if( ( /^http/ ).test( referenceValue ) &&
			!( /^https/ ).test( referenceValue ) )
		{
			this.referenceValue = this.referenceValue.replace( /^http\:/, "https:" );
		}

		return this;
	};

	URLJoiner.prototype.toString = function toString( ){
		return this.referenceValue;
	};

	URLJoiner.prototype.valueOf = function valueOf( ){
		return this.referenceValue;
	};

	URLJoiner.prototype.path = function path( ){
		return this.referenceValue;
	};

	Object.defineProperty( container, reference,
		{
			"enumerable": false,
			"configurable": false,
			"get": function get( ){
				return new URLJoiner( );
			},
			"set": function set( ){ }
		} );
};

module.exports = urlJoin;