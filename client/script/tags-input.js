( function module( ){
	var tagsInput = function tagsInput( container ){
		container.data( "tags-input-component", true );

		var inputComponent = $( "input", container );

		var handler = container.attr( "data-handler" );
		var reference = container.attr( "data-reference" );

		inputComponent.tagit( {
			"showAutocompleteOnFocus": true,
			"placeholderText": inputComponent.attr( "placeholder" ),
			"afterTagAdded": function onAfterTagAdded( event, tagData ){
				$( tagData.tag ).attr( "title", "Clicking this tag will remove it." );

				$( ".tagit-close", tagData.tag ).addClass( "hidden" );

				$( tagData.tag ).click( function onClick( ){
					$( ".tagit-close", this ).triggerHandler( "click" );
				} );

				PubSub.publish( handler, reference, inputComponent.tagit( "assignedTags" ) );
			},
			"autocomplete": {
				"source": function source( request, response ){
					PubSub.publish( handler, reference,
						function onResult( tags ){
							if( !_.isEmpty( tags ) ){
								response( tags );
							}
						} );
				}
			}
		} );

		inputComponent.tagit( "option", "singleField", false );

		PubSub.subscribe( "clear-tags-input",
			function onClearTagsInput( thisReference ){
				if( reference == thisReference ){
					inputComponent.tagit( "removeAll" );
				}
			} );
	};

	var bindTagsInput = function bindTagsInput( ){
		$( "[data-tags-input]" )
			.each( function onEachEmptyList( ){
				var container = $( this );

				if( !container.data( "tags-input-component" ) ){
					tagsInput( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedTagsInput( ){
			bindTagsInput( );
		} );

	$( "[data-tags-input]" )
		.ready( function onReady( ){
			bindTagsInput( );
		} );
} )( );