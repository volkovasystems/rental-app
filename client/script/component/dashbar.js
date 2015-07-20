var Dashbar = React.createClass( {
	"statics": {
		"list": [ ],

		"of": function of( name ){
			return _( Dashbar.list )
				.filter( function onEachDashbar( dashbar ){
					return dashbar.props.name == name;
				} )
				.value( );
		},

		"flush": function flush( name ){
			if( name ){
				exclude.bind( Dashbar.list )( name,
				 	function onEachDashbar( dashbar ){
						return dashbar.props.name == name;
					} );

			}else{
				Dashbar.list = [ ];
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

	"getDefaultProps": function getDefaultProps( ){
		return {
			"bars": [ ]
		};
	},

	"onEachBar": function onEachBar( bar ){
		var name = bar;
		var icon = "";

		if( typeof bar == "object" ){
			name = bar.name;
			icon = bar.icon;
		}

		var barPage = S( [ "-", name ].join( "" ) ).camelize( ).toString( );

		return (
			<div
				data-dash-item>
				<Control
					name={ name }
					icon={ icon }
					click={ window[ barPage ].open }>
				</Control>
			</div>
		);
	},

	"render": function onRender( ){
		var ID = this.getID( );

		var bars = this.props.bars;

		return (
			<div
				id={ ID }
				data-component
				data-page={ this.props.name }
				data-align-left>
				<div
					data-dashbar
					data-align-vertical>
					<div
						data-dash-list
						data-align-vertical>
						{ bars.map( this.onEachBar ) }
					</div>
				</div>
			</div>
		);
	},

	"componentWillMount": function componentWillMount( ){
		Dashbar.list.push( this );
	},

	"componentDidUpdate": function componentDidUpdate( ){

	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} )
