( function module( ){
	var expandableView = function expandableView( container ){
		container.data( "expandable-view-component", true );

		var minimalViewComponent = $( "[data-minimal-view]", container );
		var fullViewComponent = $( "[data-full-view]", container );

		var expandableControl = $( "[data-expandable-control]", container );
		var openControl = $( "[data-open-control]", expandableControl );
		var closeControl = $( "[data-close-control]", expandableControl );

		fullViewComponent.addClass( "hidden" )
			.removeClass( "shown" );

		minimalViewComponent.addClass( "shown" )
				.removeClass( "hidden" );

		openControl.click( function onClick( event ){
			event.preventDefault( );
			event.stopPropagation( );

			container.addClass( "expanded" );

			fullViewComponent.addClass( "shown" )
				.removeClass( "hidden" );

			minimalViewComponent.addClass( "hidden" )
				.removeClass( "shown" );
		} );

		closeControl.click( function onClick( event ){
			event.preventDefault( );
			event.stopPropagation( );

			container.removeClass( "expanded" );

			fullViewComponent.addClass( "hidden" )
				.removeClass( "shown" );

			minimalViewComponent.addClass( "shown" )
				.removeClass( "hidden" );
		} );
	};

	var bindExpandableView = function bindExpandableView( ){
		$( "[data-expandable-view]" )
			.each( function onEachExpandableView( ){
				var container = $( this );

				if( !container.data( "expandable-view-component" ) ){
					expandableView( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedExpandableView( ){
			bindExpandableView( );		
		} );

	$( "[data-expandable-view]" )
		.ready( function onReady( ){
			bindExpandableView( );
		} );
} )( );