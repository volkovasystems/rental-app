var PageMixin = {
    "componentDidMount": function componentDidMount( ){
        var element = $( this.getDOMNode( ) );

        this.page = Page( this );
    }
};
