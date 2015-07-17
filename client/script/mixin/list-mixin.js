var ListMixin = {
    "getDefaultProps": function getDefaultProps( ){
        return {
            "items": [ ],
            "select": function select( ){ }
        };
    },

    "openList": function openList( ){
        $( "[data-list]", this.getElement( ) )
            .slideDown( );
    },

    "closeList": function closeList( ){
        $( "[data-list]", this.getElement( ) )
            .slideUp( );
    }
};
