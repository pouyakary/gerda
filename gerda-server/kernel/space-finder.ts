//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

module Gerda.Kernel {
	
	/** 
	 * Reruns the spaces available within the scope caret location is in the code. 
	 */
	export function GetSpaces ( blueprintText: string , caretLocation: number ): Array<string> {
		/** Suggested spaces within the scope */
		var spaces: Array<string> = new Array<string>();
		// KRIT-2 Style reader to see if it's reached an space
		for ( var index: number = 0 ; index < caretLocation ; index++ ) {
			var current_char = blueprintText[ index ];
			// If there's an space decleration...
			if ( current_char == '(' ) {
				var finding: string = '';
				index++; current_char = blueprintText[ index ];
				// Finds the stuff between '(' and ',' or ')'
				while ( current_char != ',' && current_char && index < caretLocation ) {
					finding += current_char;
					if ( index < caretLocation - 1 ) {
						index++; current_char = blueprintText[ index ];
					}
				}
				// Is it an space? this regex will find out
				finding = finding.replace(' ','');
				if ( finding.match('[a-zA-Z][a-zA-Z0-9\_]*') ) {
					var exists: boolean = false;
					// To see if we have it allready
					spaces.forEach( element => {
						if ( element == finding ) {
							exists = true;
						}
					});
					if (!exists)
						spaces.push( finding );
				}
			}
		}
		return spaces;
	}
}
