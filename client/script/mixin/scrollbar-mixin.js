var ScrollbarMixin = {
    "componentDidMount": function componentDidMount( ){
    	var height = $( "[data-scrollbar]", this.getElement( ) )[ 0 ].offsetHeight;
        height = height * 0.8;

        $( "[data-scrollbar]", this.getElement( ) )
        	.click( function onClick( ){
                $( this ).perfectScrollbar( "update" );
        	} )
        	.css( {
        		"height": height
        	} )
            .perfectScrollbar( );
    }
};
