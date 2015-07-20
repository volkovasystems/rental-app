var Opbar = React.createClass( {
	"statics": {
		"list": [ ],

		"of": function of( name ){
			return _( Opbar.list )
				.filter( function onEachOpbar( opbar ){
					return opbar.props.name == name;
				} )
				.value( );
		},

		"flush": function flush( ){
			if( name ){
				exclude.bind( Opbar.list )( name,
				 	function onEachOpbar( opbar ){
						return opbar.props.name == name;
					} );

			}else{
				Opbar.list = [ ];
			}
		}
	},

	"mixins": [
		ComponentMixin,
		StateChangeMixin,
		ShowHidePageMixin,
		ClearStateMixin,
		PageTraversalMixin,

		PageMixin
	],

	"onEachOption": function onEachOption( option ){
		var name = option;
		var icon = "";

		if( typeof option == "object" ){
			name = option.name;
			icon = option.icon;
		}

		var optionPage = S( [ "-", name, "-page" ].join( "" ) ).camelize( ).toString( );

		return (
			<div
				data-op-item>
				<Control
					name={ name }
					icon={ icon }
					click={ window[ optionPage ].open }>
				</Control>
			</div>
		);
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"options": [ ]
		};
	},

	"render": function onRender( ){
		var ID = this.getID( );

		var options = this.props.options;

		return (
			<div
				id={ ID }
				data-component
				data-page
				data-align-right>
				<div
					data-opbar
					data-align-vertical>
					<div
						data-op-list
						data-align-vertical>
						{ options.map( this.onEachOption ) }
					</div>
				</div>
			</div>
		);
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
