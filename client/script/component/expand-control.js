var ExpandControl = React.createClass( {
    "type": "expand-control",

    "mixins": [
		ComponentMixin,

        LabelMixin,
        ControlMixin
	],

    "expand": function expand( ){
        $( "#minimized-control", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );

        $( "#expanded-control", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );

        this.props.open( );
    },

    "minimize": function minimize( ){
        $( "#expanded-control", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );

        $( "#minimized-control", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );

        this.props.close( );
    },

    "update": function update( ){
        if( this.props.expanded ){
            this.expand( );

        }else{
            this.minimize( );
        }
    },

    "toggle": function toggle( ){
        this.setState( {
            "expanded": !this.props.expanded
        } );
    },

    "getDefaultProps": function getDefaultProps( ){
        return {
            "expanded": false,
            "openIcon": "",
            "closeIcon": "",
            "open": function open( ){ },
            "close": function close( ){ }
        };
    },

    "componentWillMount": function componentWillMount( ){
        if( _.isEmpty( this.props.icon ) ){
            throw new Error( "icon was not initialized" );
        }

        if( typeof this.props.icon != "string" ){
            throw new Error( "invalid icon data type" );
        }
    },

    "render": function render( ){
        var ID = this.getID( );

        return (
			<div
                id={ ID }
                data-component
				data-expand-control={ this.props.name }>
                <IconControl
                    id="minimized-control"
                    name={ this.props.name }
                    icon={ this.props.openIcon || this.props.icon }
                    click={ this.toggle }>
                </IconControl>

                <Control
                    id="expanded-control"
                    name={ this.props.name }
                    label={ this.props.label }
                    icon={ this.props.closeIcon || this.props.icon }
                    click={ this.toggle }>
                </Control>
			</div>
        );
    },

    "componentWillMount": function componentWillMount( prevProps, prevState ){
        this.update( );
    },

    "componentDidMount": function componentDidMount( ){
        this.update( );
    }
} );
