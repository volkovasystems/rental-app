var header = function header( element ){
};

$( "[data-header]" )
	.ready( function onReady( ){
		$( "[data-header]" )
			.each( function onEachHeader( ){
				header( $( this ) );
			} );
	} );