var BasicInput = React.createClass( {
	"type": "basic-input",

	"mixins": [
		ComponentMixin,

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

	"focusInput": function focusInput( ){
		$( "#input > input", this.getElement( ) )
			.focus( );
	},

	"blurInput": function blurInput( ){
		$( "#input > input", this.getElement( ) )
			.blur( );
	},

	"focus": function focus( ){
		this.hoverInputLabel( );

		this.focusInput( );

		this.props.click( );
	},

	"blur": function blur( ){
		if( _.isEmpty( this.props.input ) ){
			this.compressInputLabel( );
		}

		this.blurInput( );
	},

	"render": function render( ){
		var ID = this.getID( );

		return (
			<div
				id={ ID }
				data-basic-input={ this.props.name }>
				<InputLabel
					id="label"
					name={ this.props.name }
					label={ this.props.label }
					focus={ this.focus }>
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
	}
} );
