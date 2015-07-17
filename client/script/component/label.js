var Label = React.createClass( {
	"type": "label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <span
                id={ ID }
                data-label={ this.props.name }>
                { this.state.title }
            </span>
        );
	}
} );
