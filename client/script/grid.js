( function module( ){
	var grid = function grid( container ){
		container.data( "grid-component", true );

		handleDOMChange( container, 
			function onDOMChangedGrid( ){
				updateGrid( container );
			} );

		updateGrid( container );
	};

	var emptyGrid = function emptyGrid( container ){
		container.data( "empty-grid-component", true );

		handleDOMChange( container, 
			function onDOMChangedEmptyGrid( ){
				updateEmptyGrid( container );
			} );

		updateEmptyGrid( container );
	};

	var updateGrid = function updateGrid( container ){
		if( container ){
			var gridLength = parseInt( container.attr( "data-grid-length" ) || 0 );

			if( gridLength ){
				container
					.addClass( "shown" )
					.removeClass( "hidden" );

			}else{
				container
					.addClass( "hidden" )
					.removeClass( "shown" );
			}

		}else{
			$( "[data-grid]" )
				.each( function onEachGrid( ){
					if( $( this ).data( "grid-component" ) ){
						updateGrid( $( this ) );
					}
				} );
		}
	};

	var updateEmptyGrid = function updateEmptyGrid( container ){
		if( container ){
			var gridLength = parseInt( container.attr( "data-grid-length" ) || 0 );

			if( gridLength ){
				container
					.addClass( "hidden" )
					.removeClass( "shown" );
			}else{
				container
					.addClass( "shown" )
					.removeClass( "hidden" );
			}

		}else{
			$( "[data-empty-grid]" )
				.each( function onEachEmptyGrid( ){
					if( $( this ).data( "empty-grid-component" ) ){
						updateEmptyGrid( $( this ) );
					}
				} );
		}
	};

	var bindGrid = function bindGrid( ){
		$( "[data-grid]" )
			.each( function onEachGrid( ){
				if( !$( this ).data( "grid-component" ) ){
					grid( $( this ) );
				}
			} );
	};

	var bindEmptyGrid = function bindEmptyGrid( ){
		$( "[data-empty-grid]" )
			.each( function onEachEmptyGrid( ){
				if( !$( this ).data( "empty-grid-component" ) ){
					emptyGrid( $( this ) );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedGrid( ){
			bindGrid( );
			bindEmptyGrid( );
			updateGrid( );
			updateEmptyGrid( );
		} );

	$( "[data-grid]" )
		.ready( function onReady( ){
			bindGrid( );
		} );

	$( "[data-empty-grid]" )
		.ready( function onReady( ){
			bindEmptyGrid( );
		} );
} )( );