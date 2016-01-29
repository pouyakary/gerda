//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Gerda;
(function (Gerda) {
    var Kernel;
    (function (Kernel) {
        /**
         * Reruns the spaces available within the scope caret location is in the code.
         */
        function GetSpaces(blueprintText, caretLocation) {
            /** Suggested spaces within the scope */
            var scoped_spaces = new Array();
            scoped_spaces.push([0, "return"]);
            /** To track the scope */
            var scope_level = 1;
            // KRIT-2 Style reader to see if it reached an space
            for (var index = 0; index < caretLocation; index++) {
                var current_char = blueprintText[index];
                // If there's an space decleration...
                if (current_char == '(') {
                    var finding = '';
                    index++;
                    current_char = blueprintText[index];
                    // Finds the stuff between '(' and ',' or ')'
                    while (current_char != ',' && current_char && index < caretLocation) {
                        finding += current_char;
                        if (index < caretLocation - 1) {
                            index++;
                            current_char = blueprintText[index];
                        }
                        else {
                            break;
                        }
                    }
                    // Is it an space? this regex will find out
                    finding = finding.replace(' ', '');
                    if (finding.match(/[a-zA-Z][a-zA-Z0-9\_]?/)) {
                        var exists = false;
                        // To see if we have it allready
                        scoped_spaces.forEach(function (element) {
                            if (element[1] == finding) {
                                exists = true;
                            }
                        });
                        // So let's add it if it's not allready there
                        if (!exists) {
                            scoped_spaces.push([scope_level, finding]);
                        }
                    }
                }
                else if (current_char == '[' || current_char == '{') {
                    scope_level++;
                }
                else if ((current_char == ']' || current_char == '}') && scope_level > 0) {
                    var new_scoped_spaces_list = new Array();
                    // Removing the spaces that were declared within the current space
                    scoped_spaces.forEach(function (space_with_scope) {
                        if (space_with_scope[0] != scope_level) {
                            new_scoped_spaces_list.push(space_with_scope);
                        }
                    });
                    scoped_spaces = new_scoped_spaces_list;
                    scope_level--;
                }
            }
            return GetSpacesByScopedSpacesArray(scoped_spaces);
        }
        Kernel.GetSpaces = GetSpaces;
        /** Converts scoped spaces to normal string array */
        function GetSpacesByScopedSpacesArray(scopedSpaces) {
            var results = new Array();
            scopedSpaces.forEach(function (scopedSpace) {
                results.push(scopedSpace[1].toString());
            });
            return results;
        }
    })(Kernel = Gerda.Kernel || (Gerda.Kernel = {}));
})(Gerda || (Gerda = {}));
