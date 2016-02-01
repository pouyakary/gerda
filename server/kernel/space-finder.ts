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
				var scopedSpaces: Array<IScopedSpaceNameArray> = [ 
					[ 0 , 'return' , 'return' ] 
				];
				
				/** To track the scope */
				var scopeLevel: number = 0;
				
				/** To keep track of the character's location within the blueprint */
				var characterLocationIndex: number = 0;
				
				/**
		 		 * This checks on the list to not to add a spcae that is allready declared.
				 */
				var IsThereNeedToAddSpace = function ( spaceKey: string ): boolean {
					scopedSpaces.forEach( item => {
						if ( item[ 1 ] == spaceKey ) { 
							return false;
						}
					});
					return true;
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
						
						// generating the key
						var nameKey = givenSpaceName.replace( /^\s+|\s+$/gm , '' );
						
						// do we have to add it...
						if ( IsThereNeedToAddSpace( nameKey ) ) {
							scopedSpaces.push( [ scopeLevel , nameKey , givenSpaceName ] );
						}
					}
				} 

			//
			// ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
			//
				
				/*
				 * Here what we do is we escape the white spaces and comments till
				 * we reach the point where the function header.
				 */
				
				scopeLevel = 0;
				
				for (  ; characterLocationIndex < caretLocation ; characterLocationIndex++ ) {
					
					//
					// TOOLS
					//
					
					var currentChar = blueprintText[ characterLocationIndex ];
					
					/** 
					 * Updates the current_char location.
					 */
					var NextCharacter = function ( ) {
						if ( characterLocationIndex < caretLocation - 1 ) {
							currentChar = blueprintText[ ++characterLocationIndex ];
						}
					}
					
					/** 
					 * Escapes the one line comments that starts with the second 
					 * character of `char`.
					 */
					var EscapeOneLineComments = function ( char: string ) {
						NextCharacter( );
						while ( currentChar != '\n' && characterLocationIndex < caretLocation ) {
							NextCharacter( );
						}
					}
					
					/**
					 * Escapes the comments like slash star ... star slash
					 */
					var EscapeSlashStarComments = function ( firstChar: string , secondChar: string ) {
						NextCharacter( );
						var whileControl: boolean = true;
						while ( whileControl && characterLocationIndex < caretLocation - 1 ) {
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
					} else if ( currentChar == '/' && characterLocationIndex + 1 < caretLocation ) {
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
			
				scopeLevel = 1;
				var readingWhiteSpaceInSpaceName: boolean = false;

				for ( ; characterLocationIndex < caretLocation ; characterLocationIndex++ ) {
					var currentChar = blueprintText[ characterLocationIndex ];
					
					// If there's an space decleration...
					if ( currentChar == '(' ) {
						var finding: string = '';
						NextCharacter( );

						// Finds the stuff between '(' and ',' or ')'
						while ( currentChar != ',' && currentChar && characterLocationIndex < caretLocation ) {
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
							
							if ( characterLocationIndex < caretLocation - 1 ) {
								NextCharacter( );
							} else {
								break;
							}
						}
						
						// done
						AppendSpace( finding );

					// Taking care of the scoping.
					} else if ( currentChar == '[' || currentChar == '{' ) {
						scopeLevel++;
					} else if ( ( currentChar == ']' || currentChar == '}' ) && scopeLevel > 0 ) {
						scopedSpaces = RemoveSpacesInTheCurrentScope( scopedSpaces , scopeLevel );
						scopeLevel--;
					}
				}

			// ────────────────────────────────────────────────────────────────────────────────

				return GetSpacesByScopedSpacesArray( scopedSpaces );

			// ────────────────────────────────────────────────────────────────────────────────
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Takes the scoped spaces array with the scope_level and removes the 
		 * spaces declared within the current scope level.
		 */
		var RemoveSpacesInTheCurrentScope = function ( scopedSpaces: Array<IScopedSpaceNameArray> , scopeLevel: number ) {
			var newScopedSpacesList = new Array<IScopedSpaceNameArray>( );
			scopedSpaces.forEach( spaceWithScope => {
				if ( spaceWithScope[ 0 ] != scopeLevel ) {
					newScopedSpacesList.push( spaceWithScope );
				}
			});
			return newScopedSpacesList;
		}

	// ────────────────────────────────────────────────────────────────────────────────────────────────────
	
		/**  */
		type IScopedSpaceNameArray = [
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
		var GetSpacesByScopedSpacesArray = function ( scopedSpaces: Array<IScopedSpaceNameArray> ): Array<string> {
			var results = new Array<string>( );
			scopedSpaces.forEach( scopedSpace => {
				results.push( scopedSpace[ 2 ].trim( ) );
			});
			return results;
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────
}
