var setURL = function setURL( name, path ){
	Object.defineProperty( function( ){ return window; }, "url",
		{
			"enumerable": false,
			"configurable": false,
			"get": function get( ){
				if( "ACCESS_ID" in window ){
					if( !( "accessID" in this ) ){
						this.accessID = ACCESS_ID; 
					}

					return path.replace( "@accessID", this.accessID );

				}else{
					throw new Error( "url needs access id" );
				}
			},
			"set": function set( ){
				if( this.isConfigured ){
					throw new Error( "possible url tampering" );	
				}
				
				this.isConfigured = true;

				Object.defineProperty( this( ), name,
					{
						"configurable": false,
						"enumerable": false,
						"get": ( function getURL( ){
							return this.url;
						} ).bind( this ),
						"set": ( function setURL( value ){
							this.url = value;
						} ).bind( this )
					} )
			}
		} ).url = null;
};