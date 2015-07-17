var ListSelection = React.createClass( {
    "type": "list-selection",

    "mixins": [
        ComponentMixin
    ],

    "onEachListItem": function onEachListItem( ){

    },

    "getDefaultProps": function getDefaultProps( ){

    },

    "render": function render( ){
        return (
            <div
                data-list-selection={ this.props.name }>
                <div
                    data-list>
                </div>
            </div>
        );
    }
} );
