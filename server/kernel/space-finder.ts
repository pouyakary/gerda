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

			/** Suggested spaces within the scope */
			var scopedSpaces = new Array<Array<Object>> ();
			scopedSpaces.push( [ 0 , "return" ] )
				
				/** To track the scope */
				var scope_level: number = 1
				
				/** To keep track of the character's location within the blueprint */
				var characterLocationIndex: number = 0

			//
			// ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
			//
				
				/*
				 * Here what we do is we escape the white spaces and comments till
				 * we reach the point where the function header.
				 */
				for ( ; characterLocationIndex < caretLocation ; characterLocationIndex++ ) {
					
					//
					// TOOLS
					//
					
					var currentChar = blueprintText[ characterLocationIndex ]
					
					console.log ( currentChar )
					
					/** 
					 * Updates the current_char location.
					 */
					var NextCharacter = function ( ) {
						if ( characterLocationIndex < caretLocation - 1 )
							currentChar = blueprintText[ ++characterLocationIndex ]
						console.log( currentChar )
					}
					
					/** 
					 * Escapes the one line comments that starts with the second 
					 * character of `char`.
					 */
					var EscapeOneLineComments = function ( char: string ) {
						NextCharacter( )
						while ( currentChar != '\n' && characterLocationIndex < caretLocation )
							NextCharacter( )
					}
					
					/**
					 * Escapes the comments like slash star ... star slash
					 */
					var EscapeSlashStarComments = function ( firstChar: string , secondChar: string ) {
						NextCharacter( )
						var whileControl: boolean = true
						while ( whileControl && characterLocationIndex < caretLocation - 1 ) {
							if ( currentChar == secondChar ) {
								NextCharacter( )
								if ( currentChar == firstChar ) {
									whileControl = false
								} else {
									characterLocationIndex--
								}
							} else {
								NextCharacter( )
							}
						}
					}
					
					
					
					//
					// BODY
					//
					
					if ( currentChar == ' ' || currentChar == '\t' || currentChar == '\n' ) {
						NextCharacter( )						
					} else if ( currentChar == '/' && characterLocationIndex + 1 < caretLocation ) {
						NextCharacter( )
						// where we escape the comments:
						if ( currentChar == '-' ) {
							EscapeOneLineComments( '/' )
						} else if ( currentChar == '*' ) {
							EscapeSlashStarComments( '/' , '*' )
						} 
					} else if ( currentChar == '<' ) {
						console.log( "----> reached" )
						// se we're reading the header
					} else {
						/*
						 * there is no function header so we just get out and continue
						 * the scannig for normal scope declerations
						 */
						break
					}
				}

			//
			// ─── BODY SCANNER ───────────────────────────────────────────────────────────────
			//

				for ( ; characterLocationIndex < caretLocation ; characterLocationIndex++ ) {
					var currentChar = blueprintText[ characterLocationIndex ]

					// If there's an space decleration...
					if ( currentChar == '(' ) {
						var finding: string = ''
						characterLocationIndex++; currentChar = blueprintText[ characterLocationIndex ]

						// Finds the stuff between '(' and ',' or ')'
						while ( currentChar != ',' && currentChar && characterLocationIndex < caretLocation ) {
							finding += currentChar
							if ( characterLocationIndex < caretLocation - 1 ) {
								characterLocationIndex++; currentChar = blueprintText[ characterLocationIndex ]
							} else {
								break
							}
						}

						// Is it an space? this regex will find out
						if ( finding.match( /[a-zA-Z][a-zA-Z0-9\_]?/ ) ) {
							if ( IsThereNeedToAddSpace( scopedSpaces , finding ) )
								scopedSpaces.push( [ scope_level , finding ] )
						}

					// Taking care of the scoping.
					} else if ( currentChar == '[' || currentChar == '{' ) {
						scope_level++
					} else if ( ( currentChar == ']' || currentChar == '}' ) && scope_level > 0 ) {
						scopedSpaces = RemoveSpacesInTheCurrentScope( scopedSpaces , scope_level )
						scope_level--
					}
				}

			// ────────────────────────────────────────────────────────────────────────────────

				return GetSpacesByScopedSpacesArray( scopedSpaces )

			// ────────────────────────────────────────────────────────────────────────────────
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Takes the scoped spaces array with the scope_level and removes the 
		 * spaces declared within the current scope level.
		 */
		var RemoveSpacesInTheCurrentScope = function ( scopedSpaces: Array<Array<Object>> , scopeLevel: number ) {
			var newScopedSpacesList = new Array<Array<Object>>()
			scopedSpaces.forEach( spaceWithScope => {
				if ( spaceWithScope[ 0 ] != scopeLevel )
					newScopedSpacesList.push( spaceWithScope )
			})
			return newScopedSpacesList
		}

	// ────────────────────────────────────────────────────────────────────────────────────────────────────
	
		/**
		 * This checks on the list to not to add a spcae that is allready declared.
		 */
		var IsThereNeedToAddSpace = function ( scopedSpaces: Array<Array<Object>> , space: Object ): boolean {
			scopedSpaces.forEach( item => {
				if ( item[ 1 ] == space ) return false
			})
			return true
		}
		
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Converts scoped spaces to normal string array for returning
		 */
		var GetSpacesByScopedSpacesArray = function ( scopedSpaces: Array<Array<Object>> ): Array<string> {
			var results = new Array<string>()
			scopedSpaces.forEach( scopedSpace => {
				results.push( scopedSpace[ 1 ].toString() )
			})
			return results
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────
}
