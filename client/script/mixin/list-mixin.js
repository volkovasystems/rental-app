var ListMixin = {
    "getDefaultProps": function getDefaultProps( ){
        return {
            "items": [ ],
            "select": function select( ){ },
            "onEachListItem": function onEachListItem( ){ }
        };
    },

    "openList": function openList( ){
        this.getElement( ).slideDown( );
    },

    "closeList": function closeList( ){
        this.getElement( ).slideUp( );
    }
};
