var ListSelectionMixin = {
    /*:
        Clever way of using delegation.

        We passed the item during rendering then return a delegate method
            when the item is clicked it will use the hoisted item value
            and trigger the transfer of the item selected to the parent.
    */
    "select": function select( item ){
        return ( function delegate( event ){
            if( this.props.mode == "single" ){
                this.setState( {
                    "selected": item
                },
                    ( function onStateChange( ){
                        this.done( );
                    } ).bind( this ) );

            }else if( this.props.mode == "multiple" ){
                this.setState( {
                    "selections": _.clone( this.state.selections.push( item ) )
                } );
            }
        } ).bind( this );
    },

    "getDefaultProps": function getDefaultProps( ){
        return {
            "mode": "single"
        };
    },

    "getInitialState": function getInitialState( ){
        return {
            "selected": null,
            "selections": [ ]
        };
    },

    "hideDoneControl": function hideDoneControl( ){
        $( "#done-selection", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );
    },

    "showDoneControl": function showDoneControl( ){
        $( "#done-selection", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );
    },

    "toggleDoneControl": function toggleDoneControl( ){
        if( this.props.mode == "single" ){
            this.hideDoneControl( );

        }else if( this.props.mode == "multiple" ){
            this.showDoneControl( );
        }
    },

    "done": function done( ){ 
        this.closeList( );
        
        if( this.props.mode == "single" ){
            this.props.select( this.state.selected );

        }else if( this.props.mode == "multiple" ){
            this.props.select( this.state.selections );
        }
    },

    "componentDidUpdate": function componentDidUpdate( ){
        this.toggleDoneControl( );
    },

    "componentDidMount": function componentDidMount( ){
        this.toggleDoneControl( );
    }
};
