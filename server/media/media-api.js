var Media = MEDIA;

APP.get( "/api/:accessID/media/:mediaID",
	function onGetMedia( request, response ){
		Media( )
			.once( "result", 
				function onResult( error, media ){
					
				} )
			.get( "mediaID", request.params.mediaID );
	} );

/*:
	
*/
APP.post( "/api/:accessID/media/add",
	function onAddMedia( request, response ){
		var media = new Media( );

		media.once( "result", 
			function onResult( error ){
				
			} )
			.add( request.params );
	} );

APP.put( "/api/:accessID/media/update",
	function onUpdateMedia( request, response ){
		var media = new Media( );

		media.once( "result", 
			function onResult( error ){

			} )
			.update( request.params );
	} );

APP.put( "/api/:accessID/media/edit",
	function onEditMedia( request, response ){
		var media = new Media( );

		media.once( "result", 
			function onResult( error ){

			} )
			.edit( request.params );
	} );

APP[ "delete" ]( "/api/:access/media/remove/:mediaID",
	function onRemoveMedia( request, response ){
		var media = new Media( );

		var mediaID = request.params.mediaID;

		media.clone( )
			.once( "result", 
			function onResult( error ){
				if( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );

				}else{
					this.self.notify( )
				}
			} )
			.remove( mediaID )
			.self
			.wait( )
			.once( "result",
			function onResult( error, existing ){
				if( error ){
					this.reply( response, 500, "error", error.message );

				}else if( !existing ){
					this.reply( response, 200, "success" );
				
				}else{
					this.reply( response, 200, "failed" );
				}
			} )
			.exists( mediaID );
	} );

