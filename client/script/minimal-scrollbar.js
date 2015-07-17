( function module( ){
	var resizeMinimalScrollbar = function resizeMinimalScrollbar( element ){
		var scrollHeight = 0;
		
		var referenceHeight = element.attr( "data-reference-height" );

		var verticalGap = parseInt( element.attr( "data-vertical-gap" ) ) || 0;

		if( referenceHeight == "@parent" ){
			scrollHeight = element.parent( ).height( );

			element.siblings( ).each( function onEachSibling( ){
				scrollHeight -= $( this ).height( );
			} );

			scrollHeight -= verticalGap;

			scrollHeight = Math.abs( scrollHeight );

		}else{
			scrollHeight = parseInt( element.data( "data-scroll-height" ) ) ||
				parseInt( element.attr( "data-scroll-height" ) ) ||
				$( referenceHeight ).height( );
		}
		
		var headerHeight = parseInt( element.data( "data-header-height" ) ) || 
			parseInt( element.attr( "data-header-height" ) ) ||
			( ( referenceHeight == "body" )? HEADER_HEIGHT : 0 );

		var footerHeight = parseInt( element.data( "data-footer-height" ) ) || 
			parseInt( element.attr( "data-footer-height" ) ) ||
			( ( referenceHeight == "body" )? FOOTER_HEIGHT : 0 );
			
		scrollHeight = scrollHeight - headerHeight - footerHeight;

		if( scrollHeight &&
			scrollHeight != element.height( ) )
		{
			element.height( scrollHeight );
		}
	};

	var minimalScrollbar = function minimalScrollbar( element ){
		element.data( "minimal-scrollbar-component", true );
		
		element.perfectScrollbar( {
			"suppressScrollX": true,
		} );

		resizeMinimalScrollbar( element );

		element.perfectScrollbar( "update" );

		$( window ).resize( function onResize( ){
			resizeMinimalScrollbar( element );

			element.perfectScrollbar( "update" );
		} );

		if( element.attr( "data-reference-height" ) == "@parent" ){
			handleDOMChange( element.parent( ),
				function onDOMChangedMinimalScrollbar( ){
					resizeMinimalScrollbar( element );

					element.perfectScrollbar( "update" );
				} );	
		}
	};

	var bindMinimalScrollbar = function bindMinimalScrollbar( ){
		$( "[data-minimal-scrollbar]" )
			.each( function onEachMinimalScrollbar( ){
				if( !$( this ).data( "minimal-scrollbar-component" ) ){
					minimalScrollbar( $( this ) );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedMinimalScrollbar( ){
			bindMinimalScrollbar( );
		} );

	$( "[data-minimal-scrollbar]" )
		.ready( function onReady( ){
			bindMinimalScrollbar( );
		} );
} )( );
