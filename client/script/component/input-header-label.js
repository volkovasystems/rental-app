var InputHeaderLabel = React.createClass( {
	"type": "input-header-label",

	"mixins": [
		ComponentMixin,

        LabelMixin
	],

	"render": function render( ){
        var ID = this.getID( );

        var label = [ this.props.label, ":" ].join( "" );

        return (
            <div
                id={ ID }
                data-component
                data-input-header-label={ this.props.name }>
                <HeaderLabel
                    name={ this.props.name }
                    label={ label }>
                </HeaderLabel>
            </div>
        );
	}
} );
