( function module( ){
	resizeDashform = function resizeDashform( container ){
		var scrollHeight = 0;
		
		var referenceHeight = container.attr( "data-reference-height" );

		if( referenceHeight == "@parent" ){
			scrollHeight = container.parent( ).height( );

		}else{
			scrollHeight = parseInt( container.data( "data-scroll-height" ) ) ||
				parseInt( container.attr( "data-scroll-height" ) ) ||
				$( referenceHeight ).height( );
		}
		
		var headerHeight = parseInt( container.data( "data-header-height" ) ) || 
			parseInt( container.attr( "data-header-height" ) ) || 0;

		var footerHeight = parseInt( container.data( "data-footer-height" ) ) || 
			parseInt( container.attr( "data-footer-height" ) ) || 0;
			
		scrollHeight = scrollHeight - headerHeight - footerHeight;

		if( scrollHeight ){
			container.height( scrollHeight );
		}
	};

	var dashform = function dashform( container ){
		if( container.data( "dashform-component" ) ){
			return;
		}

		container.data( "dashform-component", true );

		var timeout = setTimeout( function onTimeout( ){
			resizeDashform( container );

			clearTimeout( timeout );
		}, 0 );

		$( window ).resize( function onResize( ){
			resizeDashform( container );
		} );

		handleDOMChange( container,
			function onDOMChangedDashform( ){
				resizeDashform( container );
			} );
	};

	var bindDashform = function bindDashform( ){
		$( "[data-dashform]" )
			.each( function onEachDashform( ){
				var container = $( this );

				if( !container.data( "dashform-component" ) ){
					dashform( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedDashform( ){
			bindDashform( );
		} );

	$( "[data-dashform]" )
		.ready( function onReady( ){
			bindDashform( );
		} );

	bindDashform( );
} )( );