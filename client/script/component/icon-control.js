var IconControl = React.createClass( {
    "type": "icon-control",

    "mixins": [
		ComponentMixin,

        ControlMixin
	],

    "render": function render( ){
        var ID = this.getID( );

        return (
			<div
                id={ ID }
				data-control={ this.props.name }>
				<button
					onClick={ this.click }>
                    <Icon
                        name={ this.props.name }
                        icon={ this.props.icon }>
                    </Icon>
				</button>
			</div>
        );
    }
} );
