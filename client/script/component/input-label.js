var InputLabel = React.createClass( {
	"type": "input-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"getDefaultProps": function getDefaultProps( ){
		return {
			"focus": function focus( ){ }
		};
	},

	"render": function render( ){
		var ID = this.getID( );

		return (
			<div
				id={ ID }
                data-input-label={ this.props.name }
				onClick={ this.props.focus }>
                <Label
					name={ this.props.name }
					label={ this.props.label }>
				</Label>
			</div>
		);
	}
} );
