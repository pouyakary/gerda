//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

module Gerda.Kernel {
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/**
		 * Reruns the spaces available within the scope caret location is in the code.
		 */
		export function GetSpaces ( blueprintText: string , caretLocation: number ): Array<string> {
			
			//
			// ─── DEFINITIONS ────────────────────────────────────────────────────────────────
			//
			
				/** Space name rule */
				const spaceNameRegexRule: RegExp = /^[a-zA-Z0-9\_\s]+$/;

				/** Suggested spaces within the scope */
				var scopedSpaces: Array<IScopedSpaceWithKey> = [ 
					[ 0 , 'return' , 'return' ] 
				];
				
				/** To track the scope */
				var scopeLevel: number = 0;
				
				/** To keep track of the character's location within the blueprint */
				var characterLocationIndex: number = 0;
				
				/** 
				 * Where we have to stop parsing
				 * **NOTE** if this changes into: `caretLocation - 1`, It will have a
				 * better runtime but instead will loose the intelligence
				 */
				let whereToStop = caretLocation - 1;
				
			//
			// ─── FUNCTIONS ──────────────────────────────────────────────────────────────────
			//

				/**
		 		 * This checks on the list to not to add a spcae that is allready declared.
				 */
				var CheckForDouplicateAndAdd = function ( spaceToCheck: IScopedSpaceWithKey ) {
					var doHaveToAdd: boolean = true;
					for ( var index = 0 ; index < scopedSpaces.length && doHaveToAdd ; index++ ) {
						if ( scopedSpaces[ index ][ 1 ] == spaceToCheck[ 1 ] ) { 
							if ( scopedSpaces[ index ][ 2 ].length < spaceToCheck[ 2 ].length ) {
								scopedSpaces[ index ][ 2 ] = spaceToCheck[ 2 ];
							} 
							doHaveToAdd = false;
						}
					}
					if ( doHaveToAdd ) {
						scopedSpaces.push( spaceToCheck );
					}
				}
				
				
				/**
				 * Addes a space name to the scoped space list if the space name 
				 * meets the space name regex and also is not allready added.
				 */
				var AppendSpace = function ( givenSpaceName: string ) {
					
					// some cleaning up
					givenSpaceName = givenSpaceName.toLowerCase( ).trim( );
					
					// checking to see if it's a space name
					if ( givenSpaceName.match( spaceNameRegexRule ) ) {
						var nameKey = givenSpaceName.replace( / /g , '' );
						CheckForDouplicateAndAdd( [ scopeLevel , nameKey , givenSpaceName ] );
					}
				} 

			//
			// ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
			//
				
				/*
				 * Here what we do is we escape the white spaces and comments till
				 * we reach the point where the function header.
				 */

				for ( scopeLevel = 0 ; characterLocationIndex < whereToStop ; characterLocationIndex++ ) {
					
					//
					// TOOLS
					//
					
					var currentChar = blueprintText[ characterLocationIndex ];
					
					/** 
					 * Updates the current_char location.
					 */
					var NextCharacter = function ( ) {
						if ( characterLocationIndex < whereToStop ) {
							currentChar = blueprintText[ ++characterLocationIndex ];
						}
					}
					
					/** 
					 * Escapes the one line comments that starts with the second 
					 * character of `char`.
					 */
					var EscapeOneLineComments = function ( char: string ) {
						NextCharacter( );
						while ( currentChar != '\n' && characterLocationIndex < whereToStop ) {
							NextCharacter( );
						}
					}
					
					/**
					 * Escapes the comments like slash star ... star slash
					 */
					var EscapeSlashStarComments = function ( firstChar: string , secondChar: string ) {
						NextCharacter( );
						var whileControl: boolean = true;
						while ( whileControl && characterLocationIndex < whereToStop ) {
							if ( currentChar == secondChar ) {
								NextCharacter( );
								if ( currentChar == firstChar ) {
									whileControl = false;
								} else {
									characterLocationIndex--;
								}
							} else {
								NextCharacter( );
							}
						}
					}
					
					
					/**
					 * Escapes strings
					 */
					
					var EscapeString = function ( stringSign: string ) {
						var whileControl: boolean = true;
						while ( whileControl && characterLocationIndex < whereToStop ) {
							NextCharacter( );
							if ( currentChar == stringSign ) {
								whileControl = false;
							} else if ( currentChar == '\\' ) {
								if ( characterLocationIndex < whereToStop - 2 ) {
									characterLocationIndex++;
								}
							}
						}
					}
					
					
					/**
					 * Reads the function header '< ... , ... , ... >' and adds function
					 * space into the scopedSpaces
					 */
					var ReadAndParseHeader = function ( ) {
						var headerText: string = '';
						NextCharacter( );
						
						// reading the header
						while ( currentChar != '>' && characterLocationIndex < caretLocation - 1 ) {
							headerText += currentChar;
							NextCharacter( );
						}
						
						// getting the spaces and adding them to the scoped spaces
						var possibleSpaceDeclerations =	headerText.split( ',' );
						possibleSpaceDeclerations.forEach( possibleSpaceName => {
							AppendSpace( possibleSpaceName );
						});
					}
					
					
					//
					// BODY
					//
					
					if ( currentChar == ' ' || currentChar == '\t' || currentChar == '\n' ) {
						NextCharacter( );			
					} else if ( currentChar == '/' && characterLocationIndex < whereToStop ) {
						NextCharacter( );
						
						// where we escape the comments:
						if ( currentChar == '-' ) {
							EscapeOneLineComments( '/' );
						} else if ( currentChar == '*' ) {
							NextCharacter( );
							EscapeSlashStarComments( '/' , '*' );
						} 
						
					} else if ( currentChar == '<' ) {
						ReadAndParseHeader( );
					} else {
						
						/*
						 * there is no function header so we just get out and continue
						 * the scannig for normal scope declerations
						 */
						break;
					}
				}

			//
			// ─── BODY SCANNER ───────────────────────────────────────────────────────────────
			//
			
				var readingWhiteSpaceInSpaceName: boolean = false;

				for ( scopeLevel = 1 ; characterLocationIndex < whereToStop ; characterLocationIndex++ ) {
					var currentChar = blueprintText[ characterLocationIndex ];
					
					// If there's an space decleration...
					if ( currentChar == '(' ) {
						var finding: string = '';
						NextCharacter( );

						// Finds the stuff between '(' and ',' or ')'
						while ( currentChar != ',' && currentChar && characterLocationIndex < whereToStop ) {
							
							// this system here makes all the white spaces count as one space
							if ( currentChar == ' ' || currentChar == '\t' || currentChar == '\n' ) {
								if ( !readingWhiteSpaceInSpaceName ) {
									finding += ' ';
									readingWhiteSpaceInSpaceName = true;
								}
							} else {
								finding += currentChar;
								readingWhiteSpaceInSpaceName = false;
							}				
							
							if ( characterLocationIndex < whereToStop ) {
								NextCharacter( );
							} else {
								break;
							}
						}
						// done
						AppendSpace( finding );
					}


					// Escaping Comments
					else if ( currentChar == '/' ) {
						if ( characterLocationIndex < whereToStop - 1 ) {
							NextCharacter( );
							if ( currentChar == '/' ) {
								console.log( 'something ');
								EscapeOneLineComments( '/' );
							} else if ( currentChar == '*' ) {
								EscapeSlashStarComments( '/', '*' );
							} else {
								NextCharacter( );
							}
						}
					}
						
						
					// Epscaping strings
					else if ( currentChar == "'" || currentChar == '"' ) {
						EscapeString( currentChar );
					} 


					// Taking care of the scoping.
					else if ( currentChar == '[' || currentChar == '{' ) {
						scopeLevel++;
					} else if ( ( currentChar == ']' || currentChar == '}' ) && scopeLevel > 0 ) {
						scopedSpaces = RemoveSpacesInTheCurrentScope( scopedSpaces , scopeLevel );
						scopeLevel--;
					}
					
				} // end of for ( scopeLevel = 1 ; characterLocationIndex < caretLocation ; characterLocationIndex++ )

			// ────────────────────────────────────────────────────────────────────────────────

				return GetSpacesByScopedSpacesArray( scopedSpaces );

			// ────────────────────────────────────────────────────────────────────────────────
		} // end of function GetSpaces
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Takes the scoped spaces array with the scope_level and removes the 
		 * spaces declared within the current scope level.
		 */
		var RemoveSpacesInTheCurrentScope = function ( scopedSpaces: Array<IScopedSpaceWithKey> , scopeLevel: number ) {
			var newScopedSpacesList = new Array<IScopedSpaceWithKey>( );
			scopedSpaces.forEach( spaceWithScope => {
				if ( spaceWithScope[ 0 ] != scopeLevel ) {
					newScopedSpacesList.push( spaceWithScope );
				}
			});
			return newScopedSpacesList;
		}

	// ────────────────────────────────────────────────────────────────────────────────────────────────────
	
		/**  */
		type IScopedSpaceWithKey = [
			/** Scope Level */
			number , 
			/** String Key */
			string,
			/** String Show */
			string
		];
				
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Converts scoped spaces to normal string array for returning
		 */
		var GetSpacesByScopedSpacesArray = function ( scopedSpaces: Array<IScopedSpaceWithKey> ): Array<string> {
			var results = new Array<string>( );
			scopedSpaces.forEach( scopedSpace => {
				results.push( scopedSpace[ 2 ].trim( ) );
			});
			return results;
		}
		
	// ────────────────────────────────────────────────────────────────────────────────────────────────────
		
		export function FilterSuggestions( suggestions: Array<string> , userInput: string ) {
			var results = new Array<string>( );
			for ( var index = 0; index < suggestions.length; index++ ) {
				var element = suggestions[ index ];
				var currentSearchCharIndex = 0;
				var elementToBeAdded = '';
				for ( var searchStringsIndex = 0; searchStringsIndex < element.length; searchStringsIndex++) {
					var currentChar = element[ searchStringsIndex ];
					if ( currentChar == userInput[ currentSearchCharIndex ] ) {
						if ( currentSearchCharIndex < userInput.length ) {
							elementToBeAdded += '<span class="itemFoundChar">' + currentChar + '</span>';
							currentSearchCharIndex++;
						} else {
							elementToBeAdded += currentChar;
						}
					} else {
						elementToBeAdded += currentChar;
					}
				}
				if ( currentSearchCharIndex >= userInput.length ) {
					results.push( elementToBeAdded );
				}
			}
			return results;
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────
}
