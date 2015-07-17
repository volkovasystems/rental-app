var link = function link( element ){
	$( element )
		.addClass( "btn-link" )
		.removeClass( "btn-default" );
};

$( "[data-link]" )
	.ready( function onReady( ){
		$( "[data-link]" )
			.each( function onEachLink( ){
				link( $( this ) );
			} );
	} );