var SwitchControl = React.createClass( {
    "type": "switch-control",

    "mixins": [
		ComponentMixin,

        ControlMixin,
        SwitchControlMixin
	],

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-switch-control={ this.props.name }>
                <Control
                    id="on-switch"
                    icon={ this.props.onIcon }
                    name={ this.props.on }
                    label={ this.props.on }
                    click={ this.switchOn }> 
                </Control>
                <Control
                    id="off-switch"
                    icon={ this.props.offIcon }
                    name={ this.props.off }
                    label={ this.props.off }
                    click={ this.switchOff }>
                </Control>
            </div>
        );
    }
} );
