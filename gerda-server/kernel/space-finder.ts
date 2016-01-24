//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/** Where the processes happens */
module Gerda.Kernel {
	/** Returs  */
	export function GetSpaces ( blueprintText: string , caretLocation: number ): Array<string> {
		/** Suggested spaces within the scope */
		var spaces: Array<string> = new Array<string>();

		// KRIT-2 Style reader to see if it's reached an space
		for ( var index: number = 0 ; index < caretLocation ; index++ ) {
			var current_char = blueprintText[ index ];
			
			if ( current_char == '(' ) {
				var finding: string = '';
				index++; current_char = blueprintText[ index ];
				
				while ( current_char != ',' && index < caretLocation ) {
					finding += current_char;
					if ( index < caretLocation - 1 ) {
						index++; current_char = blueprintText[ index ];
					}
				}
				
				finding = finding.replace(' ','');
				if ( finding.match('[a-zA-Z][a-zA-Z0-9\_]*') ) {
					var exists: boolean = false;
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

var spaces = Gerda.Kernel.GetSpaces( "(a,21)[10,(hello world,3)prd](c,10)" , 23 );
							       // ~~~~~~~~~~~~~~~~~~~~~~~~~^~~~~~~~~~
								   // the caret is pointing here.
console.log( spaces );

