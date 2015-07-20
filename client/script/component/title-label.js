var TitleLabel = React.createClass( {
	"type": "title-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-title-label={ this.props.name }>
                <Label
                    name={ this.props.name }
                    label={ this.props.label }>
                </Label>
            </div>
        );
	}
} );
