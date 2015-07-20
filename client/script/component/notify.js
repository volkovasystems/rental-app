var Notify = React.createClass( {
	"mixins": [
		ComponentMixin,
		StateChangeMixin,
		ClearStateMixin
	],

	"now": function now( type, title, description ){
		this.open( );

		this.setState( {
			"type": type || "default",
			"description": description || "",
			"title": title || ""
		} );
	},

	"showTitle": function showTitle( ){
		$( "[data-title]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"hideTitle": function hideTitle( ){
		$( "[data-title]", this.props.component )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"type": "",
			"title": "",
			"description": ""
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"type": "",
			"title": "",
			"description": ""
		};
	},

	"render": function onRender( ){
		var ID = this.getID( );

		return (
			<div
				id={ ID }
				data-component
				data-notify={ this.props.name }
				data-notify-type={ this.state.type }
				data-align-vertical>

				<TitleLabel
					name="notify-title"
					label={ this.state.title }>
				</TitleLabel>

				<Description
					name="notify-description"
					paragraph={ this.state.description }>
				</Description>
			</div>
		);
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( _.isEmpty( this.state.title ) ){
			this.showTitle( );

		}else{
			this.hideTitle( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
