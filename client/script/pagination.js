/*:
	Always note that pagination treats page index starting from 1.
*/
var Pagination = React.createClass( {
	"onClick": function onClick( event ){
		var currentPageIndex = $( event.currentTarget ).attr( "data-index" );

		if( currentPageIndex === "next" ){
			currentPageIndex = parseInt( this.state.currentPageIndex ) + 1;				

		}else if( currentPageIndex === "back" ){
			currentPageIndex = parseInt( this.state.currentPageIndex ) - 1;
		}

		if( currentPageIndex < 1 ){
			currentPageIndex = 1;
		
		}else if( currentPageIndex > this.state.pageCount ){
			currentPageIndex = this.state.pageCount;
		}

		this.setState( {
			"currentPageIndex": currentPageIndex
		} );
	},

	"onEachPageIndex": function onEachPageIndex( index ){
		return; //: @template: template/pagination-index.html
	},

	"constructPageIndices": function constructPageIndices( ){
		var pageCount = this.state.pageCount;

		var pageIndices = [ ];
		for( var index = 1; index <= pageCount; index++ ){
			pageIndices.push( index );
		}

		this.setState( {
			"pageIndices": pageIndices
		} );
	},

	"hidePagination": function hidePagination( ){
		$( this.getDOMNode( ) )
			.removeClass( "shown" )
			.addClass( "hidden" );
	},

	"showPagination": function showPagination( ){
		$( this.getDOMNode( ) )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"totalCount": 0,
			"contentCount": 0,

			"pageIndex": 0,
			/*:
				This is the number content per page.

				This is given by the user or predefined.
			*/
			"pageSize": 0,
			//: This is the number of pages.
			"pageCount": 0,

			"onPageIndexChange": function onPageIndexChange( ){ },
			"onPageSizeChange": function onPageSizeChange( ){ }
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"currentPageIndex": 1,

			"pageIndices": [ ],

			"pageCount": 0,
			"pageSize": 0
		};
	},

	"render": function onRender( ){
		return; //: @template: template/pagination.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevProps.totalCount != this.props.totalCount &&
			this.state.pageSize > 0 )
		{
			this.setState( {
				"pageCount": Math.ceil( this.props.totalCount / this.state.pageSize )
			} );
		}

		if( prevProps.contentCount != this.props.contentCount &&
			this.state.pageCount > 1 )
		{
			this.showPagination( );

			this.constructPageIndices( );

		}else if( this.state.pageCount < 1 ){
			this.hidePagination( );
		}

		if( prevState.currentPageIndex != this.state.currentPageIndex &&
			this.state.pageCount > 1 )
		{
			this.props.onPageIndexChange( this.state.currentPageIndex );
		}

		if( prevState.pageSize != this.state.pageSize &&
			this.state.pageCount > 1 )
		{
			this.props.onPageSizeChange( this.state.pageSize );
		}
	},

	"componentDidMount": function componentDidMount( ){
		if( this.props.pageCount > 0 ){
			this.setState( {
				"pageCount": this.props.pageCount
			} );
		}

		if( this.props.pageSize > 0 ){
			this.setState( {
				"pageSize": this.props.pageSize
			} );
		}

		this.hidePagination( );
	}
} );