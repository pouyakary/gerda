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
				var scoped_spaces = new Array<Array<Object>>()
				scoped_spaces.push( [ 0 , "return" ] )
				
				/** To track the scope */
				var scope_level: number = 1
				
				/** To keep track of the character's location within the blueprint */
				var character_location_index: number = 0

			//
			// ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
			//
				
				/*
				 * Here what we do is we escape the white spaces and comments till
				 * we reach the point where the function header.
				 */
				for ( ; character_location_index < caretLocation ; character_location_index++ ) {
					
					//
					// TOOLS
					//
					
					var current_char = blueprintText[ character_location_index ]
					
					/** Updates the current_char location */
					function NextCharacter () {
						if ( character_location_index < caretLocation - 1 )
							current_char = blueprintText[ ++character_location_index ]
					}
					
					/** 
					 * Escapes the one line comments that starts with the second
					 * character of `char`.
					 */
					function EscapeOneLineComments ( char: string ) {
						NextCharacter()
						while ( current_char != '\n' && character_location_index < caretLocation )
							NextCharacter()
					}
					
					//
					// BODY
					//
					
					if ( current_char == ' ' || current_char == '\t' || current_char == '\n' ) {
						NextCharacter()						
					} else if ( current_char == '/' && character_location_index + 1 < caretLocation ) {
						NextCharacter()
						// where we escape the comments:
						if ( current_char == '-' ) {
							EscapeOneLineComments( '/' )
						} else if ( current_char == '*' ) {
							
						}
					} else if ( current_char == '<' ) {
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

				for ( ; character_location_index < caretLocation ; character_location_index++ ) {
					var current_char = blueprintText[ character_location_index ]

					// If there's an space decleration...
					if ( current_char == '(' ) {
						var finding: string = ''
						character_location_index++; current_char = blueprintText[ character_location_index ]

						// Finds the stuff between '(' and ',' or ')'
						while ( current_char != ',' && current_char && character_location_index < caretLocation ) {
							finding += current_char
							if ( character_location_index < caretLocation - 1 ) {
								character_location_index++; current_char = blueprintText[ character_location_index ]
							} else {
								break
							}
						}

						// Is it an space? this regex will find out
						if ( finding.match( /[a-zA-Z][a-zA-Z0-9\_]?/ ) ) {
							if ( IsThereNeedToAddSpace( scoped_spaces , finding ) )
								scoped_spaces.push( [ scope_level , finding ] )
						}

					// Taking care of the scoping.
					} else if ( current_char == '[' || current_char == '{' ) {
						scope_level++
					} else if ( ( current_char == ']' || current_char == '}' ) && scope_level > 0 ) {
						scoped_spaces = RemoveSpacesWithinTheCurrentScope( scoped_spaces , scope_level )
						scope_level--
					}
				}

			// ────────────────────────────────────────────────────────────────────────────────

				return GetSpacesByScopedSpacesArray( scoped_spaces );

			// ────────────────────────────────────────────────────────────────────────────────
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Takes the scoped spaces array with the scope_level and removes the 
		 * spaces declared within the current scope level.
		 */
		function RemoveSpacesWithinTheCurrentScope ( scoped_spaces: Array<Array<Object>> , 
													 scope_level: number ) {
			var new_scoped_spaces_list = new Array<Array<Object>>()
			scoped_spaces.forEach( space_with_scope => {
				if ( space_with_scope[ 0 ] != scope_level )
					new_scoped_spaces_list.push( space_with_scope )
			})
			return new_scoped_spaces_list
		}

	// ────────────────────────────────────────────────────────────────────────────────────────────────────
	
		/**
		 * This checks on the list to not to add a spcae that is allready declared.
		 */
		function IsThereNeedToAddSpace ( scopedSpaces: Array<Array<Object>> , space: Object ): boolean {
			scopedSpaces.forEach( item => {
				if ( item[ 1 ] == space ) return false
			})
			return true
		}
		
	// ────────────────────────────────────────────────────────────────────────────────────────────────────

		/** 
		 * Converts scoped spaces to normal string array for returning
		 */
		function GetSpacesByScopedSpacesArray ( scopedSpaces: Array<Array<Object>> ): Array<string> {
			var results = new Array<string>()
			scopedSpaces.forEach( scopedSpace => {
				results.push( scopedSpace[ 1 ].toString() )
			})
			return results
		}
	
	// ────────────────────────────────────────────────────────────────────────────────────────────────────
}
