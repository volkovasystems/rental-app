var InputLabel = React.createClass( {
	"type": "input-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"getDefaultProps": function getDefaultProps( ){
		return {
			"click": function click( ){ }
		};
	},

	"render": function render( ){
		var ID = this.getID( );

		var label = [ this.props.label, ":" ].join( "" );

		return (
			<div
				id={ ID }
				data-component
                data-input-label={ this.props.name }
				onClick={ this.props.click }>
                <Label
					name={ this.props.name }
					label={ label }>
				</Label>
			</div>
		);
	}
} );
