var PlaceholderMixin = {
    "showPlaceholder": function showPlaceholder( ){
        $( "[placeholder], [instruction]", this.getElement( ) )
            .attr( "placeholder", this.props.placeholder );
    },

    "hidePlaceholder": function hidePlaceholder( ){
        $( "[placeholder]", this.getElement( ) )
            .removeAttr( "placeholder" )
            .attr( "instruction", this.props.placeholder );
    },

    "componentDidMount": function componentDidMount( ){
        this.hidePlaceholder( );
    }
};
