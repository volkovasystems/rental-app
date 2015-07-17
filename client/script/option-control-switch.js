( function module( ){
	var optionControlSwitch = function optionControlSwitch( button ){
		button.data( "option-control-switch-component", true );

		var optionList = $( "[data-option-for='@optionReference']"
			.replace( "@optionReference", button.attr( "name" ) ) );
		
		var openControl = $( "[data-open-control]", button );

		var closeControl = $( "[data-close-control]", button );

		optionList.slideUp( );

		openControl
			.addClass( "shown" )
			.removeClass( "hidden" );

		closeControl
			.addClass( "hidden" )
			.removeClass( "shown" );

		button.data( "active-control", openControl );

		openControl.click( function onClick( event ){
			event.preventDefault( );
			event.stopPropagation( );

			openControl
				.addClass( "hidden" )
				.removeClass( "shown" );

			closeControl
				.addClass( "shown" )
				.removeClass( "hidden" );

			button.data( "active-control", closeControl );

			optionList.slideDown( );
		} );

		closeControl.click( function onClick( event ){
			event.preventDefault( );
			event.stopPropagation( );
			
			openControl
				.addClass( "shown" )
				.removeClass( "hidden" );

			closeControl
				.addClass( "hidden" )
				.removeClass( "shown" );

			button.data( "active-control", openControl );

			optionList.slideUp( );
		} );

		button.click( function onClick( event ){
			event.preventDefault( );
			event.stopPropagation( );

			button.data( "active-control" ).trigger( "click" );
		} );
	};

	var bindOptionControlSwitch = function bindOptionControlSwitch( ){
		$( "[data-option-control-switch]" )
			.each( function onEachOptionControlSwitch( ){
				var button = $( this );

				if( button.data( "option-control-switch-component" ) ){
					return;
				}

				optionControlSwitch( button );
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedOptionControlSwitch( ){
			bindOptionControlSwitch( );
		} );

	$( "[data-option-control-switch]" )
		.ready( function onReady( ){
			bindOptionControlSwitch( );
		} );
} )( );

