var ShowHideComponentMixin = {
	"showComponent": function showComponent( ){
		$( this.getElement( ) )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideComponent": function hideComponent( ){
		$( this.getElement( ) )
			.addClass( "hidden" )
			.removeClass( "shown" );
	}
};
