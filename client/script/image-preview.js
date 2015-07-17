( function module( ){
	var updateImagePreview = function updateImagePreview( container ){
		var imageURI = container.attr( "data-image" );

		if( _.isEmpty( imageURI ) ){
			return;
		}

		container.data( "image", imageURI );

		container.css( {
			"background-image": "url(@imageURI)".replace( "@imageURI", imageURI ),
			"background-repeat": "no-repeat",
			"background-origin": "content-box",
			"background-position": "center",
			"background-size": "cover"
		} );	
	};

	var imagePreview = function imagePreview( container ){
		container.data( "image-preview-component", true );

		updateImagePreview( container );

		handleDOMChange( container, 
			function onDOMChangeImagePreview( ){
				var imageURI = container.attr( "data-image" );

				if( imageURI != container.data( "image" ) ){
					updateImagePreview( container );	
				}
			} );
	};

	var bindImagePreview = function bindImagePreview( ){
		$( "[data-image-preview]" )
			.each( function onEachImagePreview( ){
				var container = $( this );

				if( !container.data( "image-preview-component" ) ){
					imagePreview( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedImagePreview( ){
			bindImagePreview( );
		} );

	$( "[data-image-preview]" )
		.ready( function onReady( ){
			bindImagePreview( );
		} );
} )( );