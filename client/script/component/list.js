var List = React.createClass( {
    "type": "list",
    
    "mixins": [
        ComponentMixin,

        ListMixin,
        ScrollbarMixin
    ],

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-list={ this.props.name }>
                <div
                    data-scrollbar>
                    <div
                        data-list-items
                        data-align-vertical>
                        { this.props.items.map( this.props.onEachListItem ) }
                    </div>
                </div>
            </div>
        );
    }
} );
