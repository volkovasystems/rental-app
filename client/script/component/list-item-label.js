var ListItemLabel = React.createClass( {
	"type": "list-item-label",

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
				data-component
                data-list-item-label={ this.props.name }
				onClick={ this.props.focus }>
                <Label
					name={ this.props.name }
					label={ this.props.label }>
				</Label>
			</div>
		);
	}
} );
