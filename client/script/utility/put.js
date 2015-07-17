var Put = function Put( URL ){
	if( this instanceof Put ){
		this.URL = URL;

		this.options = _.extend( { "headers": { } }, QWEST_OPTION );

		this.headers = { };

		this.data = { };

	}else{
		return new Put( URL );
	}
};

Put.prototype.set = function set( path, value ){
	this.URL.replace( [ "@", path ].join( "" ), value );

	return this;
};

Put.prototype.head = function head( headers ){
	this.headers = _.extend( this.headers, headers );

	return this;
};

Put.prototype.body = function body( data ){
	this.data = _.extend( this.data, data );

	return this;
};

Put.prototype.query = function query( data ){
	this.URL = new URI( this.URL ).setQuery( data ).toString( );

	return this;
};

Put.prototype.onSuccess = function onSuccess( handler ){
	this.successHandler = handler;

	return this;
};

Put.prototype.onFailed = function onFailed( handler ){
	this.failedHandler = handler;

	return this;
};

Put.prototype.onError = function onError( handler ){
	this.errorHandler = handler;

	return this;
};

Put.prototype.send = function send( ){
	this.immediateID = setImmediate( ( function onSetImmediate( ){
		this.options.headers = _.extend( this.options.headers, this.headers );

		qwest
			.put( this.URL, this.data, this.options )

			.complete( function onComplete( ){
				var status = this.response.status;

				var data = this.response.data;

				switch( status ){
					case "error":
						if( typeof this.errorHandler == "function" ){
							this.errorHandler( data, this );
						}

						break;

					case "failed":
						if( typeof this.failedHandler == "function" ){
							this.failedHandler( data, this );
						}

						break;

					case "success":
						if( typeof this.successHandler == "function" ){
							this.successHandler( data, this );
						}

						break;

					default:
						throw new Error( "status unsupported" );
				}

				clearImmediate( this.immediateID );
			} );
	} ).bind( this ) );


	return this;
};
