var Get = function Get( URL ){
	if( this instanceof Get ){
		this.URL = URL;

		this.options = _.extend( { "headers": { } }, QWEST_OPTION );

		this.headers = { };

	}else{
		return new Get( URL );
	}
};

Get.prototype.set = function set( path, value ){
	this.URL.replace( [ "@", path ].join( "" ), value );

	return this;
};

Get.prototype.head = function head( headers ){
	this.headers = _.extend( this.headers, headers );

	return this;
};

Get.prototype.query = function query( data ){
	this.URL = new URI( this.URL ).setQuery( data ).toString( );

	return this;
};

Get.prototype.onResult = function onResult( handler ){
	this.resultHandler = handler;

	return this;
};

Get.prototype.onFailed = function onFailed( handler ){
	this.failedHandler = handler;

	return this;
};

Get.prototype.onError = function onError( handler ){
	this.errorHandler = handler;

	return this;
};

Get.prototype.send = function send( ){
	this.immediateID = setImmediate( ( function onSetImmediate( ){
		this.options.headers = _.extend( this.options.headers, this.headers );

		qwest
			.get( this.URL, null, this.options )

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