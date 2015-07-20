var HeaderLabel = React.createClass( {
	"type": "header-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <h1
                id={ ID }
                data-component
                data-header-label={ this.props.name }>
                <Label
                    name={ this.props.name }
                    label={ this.props.label }>
                </Label>
            </h1>
        );
	}
} );
