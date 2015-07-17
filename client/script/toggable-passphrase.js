( function module( ){
	var toggablePassphrase = function toggablePassphrase( container ){
		container.data( "toggable-passphrase-component", true );

		var passphraseInput = $( "input[type='password']", container );
		var textInput = $( "input[type='text']", container );

		var showControl = $( container ).next( "[data-control]" );
		var hideControl = $( showControl ).next( "[data-control]" );

		textInput
			.addClass( "hidden" )
			.removeClass( "shown" );

		passphraseInput
			.addClass( "shown" )
			.removeClass( "hidden" );

		showControl
			.addClass( "shown" )
			.removeClass( "hidden" );

		hideControl
			.addClass( "hidden" )
			.removeClass( "shown" );

		showControl.click( function onClick( ){
			textInput
				.addClass( "shown" )
				.removeClass( "hidden" );

			passphraseInput
				.addClass( "hidden" )
				.removeClass( "shown" );

			showControl
				.addClass( "hidden" )
				.removeClass( "shown" );

			hideControl
				.addClass( "shown" )
				.removeClass( "hidden" );
		} );

		hideControl.click( function onClick( ){
			textInput
				.addClass( "hidden" )
				.removeClass( "shown" );

			passphraseInput
				.addClass( "shown" )
				.removeClass( "hidden" );

			showControl
				.addClass( "shown" )
				.removeClass( "hidden" );

			hideControl
				.addClass( "hidden" )
				.removeClass( "shown" );
		} );
	};

	var bindToggablePassphrase = function bindToggablePassphrase( ){
		$( "[data-toggable-passphrase]" )
			.each( function onEachToggablePassphrase( ){
				var container = $( this );

				if( !container.data( "first-focus-component" ) ){
					toggablePassphrase( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedToggablePassphrase( ){
			bindToggablePassphrase( );
		} );

	$( "[data-toggable-passphrase]" )
		.ready( function onReady( ){
			bindToggablePassphrase( );
		} );
} )( );
