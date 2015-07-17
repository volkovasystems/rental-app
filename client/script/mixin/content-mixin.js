var ContentMixin = {
    "componentDidMount": function componentDidMount( ){
        this.content = $( "[data-content]", this.getDOMNode( ) );

        this.content.addClass( "col-lg-4 col-md-6 col-sm-6 col-xs-11" );
    }
};
