var Control = React.createClass( {
    "type": "control",

    "mixins": [
		ComponentMixin,

        LabelMixin,
        ControlMixin
	],

    "showIcon": function showIcon( ){
        $( "#control-icon", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );
    },

    "hideIcon": function hideIcon( ){
        $( "#control-icon", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );
    },

    "toggleIcon": function toggleIcon( ){
        if( _.isEmpty( this.props.icon ) ){
            this.hideIcon( );

        }else{
            this.showIcon( );
        }
    },

    "render": function render( ){
        var ID = this.getID( );

        return (
			<div
                id={ ID }
				data-control={ this.props.name }>
				<button
					onClick={ this.click }>
                    <Icon
                        id="control-icon"
                        name={ this.props.name }
                        icon={ this.props.icon }>
                    </Icon>
					<ButtonLabel
						name={ this.props.name }
                        label={ this.props.label }>
					</ButtonLabel>
				</button>
			</div>
        );
    },

    "componentDidUpdate": function componentDidUpdate( ){
        this.toggleIcon( );
    },

    "componentDidMount": function componentDidMount( ){
        this.toggleIcon( );
    }
} );
