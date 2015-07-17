var ShowHidePageMixin = {
	"showPage": function showPage( ){
		$( "[data-page]", this.getElement( ) )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hidePage": function hidePage( ){
		$( "[data-page]", this.getElement( ) )
			.addClass( "hidden" )
			.removeClass( "shown" );
	}
};
