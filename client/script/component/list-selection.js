var ListSelection = React.createClass( {
    "type": "list-selection",

    "mixins": [
        ComponentMixin,

        LabelMixin,
        ListMixin,
        ListSelectionMixin
    ],

    "blur": function blur( ){
        console.log( "LIST SELECTION BLUR" )
        this.closeList( );
    },

    "onEachListItem": function onEachListItem( item ){
        var label = item;

        var name = item.toString( );
        var icon = "";
        if( typeof item == "object" ){
            label = item.label;
            name = item.name;
        }

        return (
            <div
                key={ name }
                data-list-item
                data-align-center
                onClick={ this.select( item ) }>
                <Icon
                    name={ name }
                    icon={ icon }>
                </Icon>
                <ListItemLabel
                    name={ name }
                    label={ label }>
                </ListItemLabel>
            </div>
        );
    },

    "getDefaultProps": function getDefaultProps( ){
        return {
            "blur": function blur( ){ },
            "focus": function focus( ){ }
        };
    },

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-list-selection={ this.props.name }
                onBlur={ this.blur }
                onFocus={ this.focus }>
                <List
                    name={ this.props.name }
                    items={ this.props.items }
                    onEachListItem={ this.onEachListItem }>
                </List>

                <Control
                    id="done-selection"
                    name={ this.props.name }
                    label="done"
                    click={ this.done }>
                </Control>
            </div>
        );
    },

    "componentDidMount": function componentDidMount( ){
        this.closeList( );
    }
} );
