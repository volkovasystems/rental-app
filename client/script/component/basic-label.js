var BasicLabel = React.createClass( {
	"type": "basic-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-basic-label={ this.props.name }>
                <Label
                    name={ this.props.name }
                    label={ this.props.label }>
                </Label>
            </div>
        );
	}
} );
