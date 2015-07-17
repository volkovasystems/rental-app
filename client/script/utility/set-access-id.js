Object.defineProperty( function( ){ return window; }, "ACCESS_ID",
	{
		"enumerable": false,
		"configurable": false,
		"get": function get( ){
			return this[ this.hashedAccessID ];
		},
		"set": function set( accessID ){
			var CALL_COUNT_LIMIT = 50;

			if( !this.isConfigured ){
				this.isConfigured = true;

				this.callCount = 0;

				Object.defineProperty( this( ), "ACCESS_ID",
					{
						"configurable": false,
						"enumerable": false,
						"get": ( function getAccessID( ){
							if( this.callCount > CALL_COUNT_LIMIT ){
								throw new Error( "possible security breach" );
							}

							this.callCount++;

							return this.ACCESS_ID;
						} ).bind( this ),
						"set": ( function setAccessID( accessID ){
							if( this.callCount > CALL_COUNT_LIMIT ){
								throw new Error( "possible security breach" );
							}

							this.callCount++;

							this.ACCESS_ID = accessID;
						} ).bind( this )
					} );
			
			}else if( "hashedAccessID" in this ){
				throw new Error( "possible access id tampering" );

			}else{
				var shaObject = new jsSHA( accessID, "TEXT" );
				hashedAccessID = shaObject.getHash( "SHA-512", "HEX" );

				this.hashedAccessID = hashedAccessID;

				Object.defineProperty( this, hashedAccessID,
					{
						"configurable": false,
						"enumerable": false,
						"writable": false,
						"value": accessID
					} );
			}
		}
	} ).ACCESS_ID = null;