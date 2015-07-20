var Icon = React.createClass( {
    "type": "icon",

    "mixins": [
		ComponentMixin,

        IconMixin
	],

    "render": function render( ){
        var ID = this.getID( );

        return (
			<div
                id={ ID }
                data-component
				data-icon={ this.props.name }>
				<i
                    className="material-icons">
                    { this.props.icon }
                </i>
			</div>
        );
    }
} );
