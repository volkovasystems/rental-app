( function module( ){
	var list = function list( container ){
		container.data( "list-component", true );

		handleDOMChange( container, 
			function onDOMChangedList( ){
				updateList( container );
			} );

		updateList( container );
	};

	var emptyList = function emptyList( container ){
		container.data( "empty-list-component", true );

		handleDOMChange( container, 
			function onDOMChangedEmptyList( ){
				updateEmptyList( container );
			} );

		updateEmptyList( container );
	};

	var updateList = function updateList( container ){
		if( container ){
			var listLength = parseInt( container.attr( "data-list-length" ) || 0 );

			if( listLength ){
				container
					.addClass( "shown" )
					.removeClass( "hidden" );

			}else{
				container
					.addClass( "hidden" )
					.removeClass( "shown" );
			}

		}else{
			$( "[data-list]" )
				.each( function onEachList( ){
					if( $( this ).data( "list-component" ) ){
						updateList( $( this ) );
					}
				} );
		}
	};

	var updateEmptyList = function updateEmptyList( container ){
		if( container ){
			var listLength = parseInt( container.attr( "data-list-length" ) || 0 );

			if( listLength ){
				container
					.addClass( "hidden" )
					.removeClass( "shown" );
			}else{
				container
					.addClass( "shown" )
					.removeClass( "hidden" );
			}

		}else{
			$( "[data-empty-list]" )
				.each( function onEachEmptyList( ){
					if( $( this ).data( "empty-list-component" ) ){
						updateEmptyList( $( this ) );
					}
				} );
		}
	};

	var bindList = function bindList( ){
		$( "[data-list]" )
			.each( function onEachList( ){
				if( !$( this ).data( "list-component" ) ){
					list( $( this ) );
				}
			} );
	};

	var bindEmptyList = function bindEmptyList( ){
		$( "[data-empty-list]" )
			.each( function onEachEmptyList( ){
				if( !$( this ).data( "empty-list-component" ) ){
					emptyList( $( this ) );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedList( ){
			bindList( );
			bindEmptyList( );
			updateList( );
			updateEmptyList( );
		} );

	$( "[data-list]" )
		.ready( function onReady( ){
			bindList( );
		} );

	$( "[data-empty-list]" )
		.ready( function onReady( ){
			bindEmptyList( );
		} );
} )( );