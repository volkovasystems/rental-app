/*:
    @todo:
        Input component for shown passphrase
            should not be accessible internally.
            It can only be shown and cannot be
            transferrable.
    @end-todo
*/
var PassphraseInput = React.createClass( {
    "type": "passphrase-input",

    "mixins": [
		ComponentMixin,

        LabelMixin,
		InputMixin
	],

    "showPassphrase": function showPassphrase( ){
        $( "#hidden-passphrase", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );

        $( "#shown-passphrase", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );
    },

    "hidePassphrase": function hidePassphrase( ){
        $( "#hidden-passphrase", this.getElement( ) )
            .addClass( "shown" )
            .removeClass( "hidden" );

        $( "#shown-passphrase", this.getElement( ) )
            .addClass( "hidden" )
            .removeClass( "shown" );
    },

    "compressInputLabel": function compressInputLabel( ){
		$( "#label", this.getElement( ) )
			.removeClass( "hover-up" );
	},

	"hoverInputLabel": function hoverInputLabel( ){
		$( "#label", this.getElement( ) )
			.addClass( "hover-up" );
	},

    "toggleInputLabel": function toggleInputLabel( ){
        if( this.timeout ){
            clearTimeout( this.timeout );

            delete this.timeout;
        }

        this.timeout = setTimeout( ( function onTimeout( ){
            if( _.isEmpty( this.props.input.toString( ) ) &&
                !this.hasFocus )
            {
                this.compressInputLabel( );
            
            }else{
                this.hoverInputLabel( );
            }
        } ).bind( this ), 0 );
    },

	"focusInput": function focusInput( ){
		$( "[data-input].shown > input", this.getElement( ) )
			.focus( );
	},

	"blurInput": function blurInput( ){
		$( "[data-input].shown > input", this.getElement( ) )
			.blur( );
	},

    "click": function click( ){
        this.hoverInputLabel( );

        this.focusInput( );

        this.props.click( );
    },

    "focus": function focus( ){
        this.hoverInputLabel( );

        this.focusInput( );

        this.props.focus( );

        this.hasFocus = true;
    },

    "blur": function blur( ){
        this.toggleInputLabel( );

        this.blurInput( );
            
        this.props.blur( );

        this.hasFocus = false
    },

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-passphrase-input={ this.props.name }>

                <InputLabel
                    id="label"
					name={ this.props.name }
					label={ this.props.label }
                    click={ this.click }>
				</InputLabel>

                <Input
                    id="hidden-passphrase"
                    format="password"
                    name={ this.props.name }
                    placeholder={ this.props.placeholder }
                    input={ this.props.input }
                    update={ this.update }
                    focus={ this.focus }
                    blur={ this.blur }>
                </Input>

                <Input
                    id="shown-passphrase"
                    name={ this.props.name }
                    placeholder={ this.props.placeholder }
                    input={ this.props.input }
                    update={ this.update }
                    focus={ this.focus }
                    blur={ this.blur }>
                </Input>

                <SwitchControl
                    name={ this.props.name }
                    on={ "show-password" }
                    off={ "hide-password" }
                    switchOn={ this.showPassphrase }
                    switchOff={ this.hidePassphrase }>
                </SwitchControl>
            </div>
        );
    },

    "componentDidUpdate": function componentDidUpdate( ){
        this.toggleInputLabel( );
    },

    "componentDidMount": function componentDidMount( ){
        this.hidePassphrase( );
    }
} );
