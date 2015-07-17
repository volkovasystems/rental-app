var Paragraph = React.createClass( {
	"type": "paragraph",

	"mixins": [
		ComponentMixin,

        ParagraphMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        return (
            <p
                id={ ID }
                data-paragraph={ this.props.name }>
                { this.props.paragraph }
            </p>
        );
	}
} );
