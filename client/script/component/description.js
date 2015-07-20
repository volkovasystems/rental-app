var Description = React.createClass( {
	"type": "description",

	"mixins": [
		ComponentMixin,

        ParagraphMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-description={ this.props.name }>
                <Paragraph
                    name={ this.props.name }
                    paragraph={ this.props.paragraph }>
                </Paragraph>
            </div>
        );
	}
} );
