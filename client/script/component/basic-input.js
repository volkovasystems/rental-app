var BasicInput = React.createClass( {
	"type": "basic-input",

	"mixins": [
		ComponentMixin,
		ShowHideComponentMixin,

		LabelMixin,
		InputMixin
	],

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
		} ).bind( this ), 100 );
	},

	"focusInput": function focusInput( ){
		$( "#input > input", this.getElement( ) )
			.focus( );
	},

	"blurInput": function blurInput( ){
		$( "#input > input", this.getElement( ) )
			.blur( );
	},

	"click": function click( ){
		this.hoverInputLabel( );

		this.focusInput( );

		this.props.click( );
	},

	"focus": function focus( ){
		this.hasFocus = true;

		this.hoverInputLabel( );

		this.focusInput( );

		this.props.focus( );
	},

	"blur": function blur( ){
		this.hasFocus = false;

		this.toggleInputLabel( );

		this.blurInput( );

		this.props.blur( );
	},

	"render": function render( ){
		var ID = this.getID( );

		return (
			<div
				id={ ID }
				data-component
				data-basic-input={ this.props.name }>
				<InputLabel
					id="label"
					name={ this.props.name }
					label={ this.props.label }
					click={ this.click }>
				</InputLabel>
				<Input
					id="input"
					name={ this.props.name }
					label={ this.props.label }
					placeholder={ this.props.placeholder }
					input={ this.props.input }
					update={ this.update }
					focus={ this.focus }
					blur={ this.blur }>
				</Input>
			</div>
		);
	},

	"componentDidUpdate": function componentDidUpdate( ){
		this.toggleInputLabel( );
	}
} );
