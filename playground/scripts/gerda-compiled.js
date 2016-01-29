//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Arendelle;
(function (Arendelle) {
    var FileSystem;
    (function (FileSystem) {
        /* ────────────────────────────────────────────────────────────────────────────────────────── *
         * ::::::::::::::::::::::::::: F I L E   S Y S T E M   O B J E C T :::::::::::::::::::::::::: *
         * ────────────────────────────────────────────────────────────────────────────────────────── */
        /** File and Directory objects shall both extend from this */
        var FileSystemObject = (function () {
            //
            // ─── FUNCS ──────────────────────────────────────────────────────────────────────
            //
            function FileSystemObject(path, name) {
                this.Name = name;
                this.Path = path;
            }
            return FileSystemObject;
        })();
        FileSystem.FileSystemObject = FileSystemObject;
    })(FileSystem = Arendelle.FileSystem || (Arendelle.FileSystem = {}));
})(Arendelle || (Arendelle = {}));
//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    var FileSystem;
    (function (FileSystem) {
        /* ────────────────────────────────────────────────────────────────────────────────────────── *
         * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
         * ────────────────────────────────────────────────────────────────────────────────────────── */
        /** Arendele '.space' / '.arendelle' files */
        var File = (function (_super) {
            __extends(File, _super);
            //
            // ─── FUNCS ──────────────────────────────────────────────────────────────────────
            //
            /** Class constructor */
            function File(name, path, content, space) {
                _super.call(this, path, name);
                this.Content = content;
                if (space)
                    this.Type = FileType.Space;
                else
                    this.Type = FileType.Arendelle;
            }
            /** Generates the full path of the file */
            File.prototype.FullPath = function () {
                return this.Path + '/' + this.Name + this.GetFileTypeEnd();
            };
            /** Get's the file type string for the Arendelle files */
            File.prototype.GetFileTypeEnd = function () {
                if (this.Type == FileType.Space)
                    return '.space';
                else
                    return '.arendelle';
            };
            return File;
        })(FileSystem.FileSystemObject);
        FileSystem.File = File;
        /* ────────────────────────────────────────────────────────────────────────────────────────── *
         * ::::::::::::::::::::::::::::::::::: F I L E   T Y P E S :::::::::::::::::::::::::::::::::: *
         * ────────────────────────────────────────────────────────────────────────────────────────── */
        (function (FileType) {
            /** Arendelle '.arendelle' blueprit files */
            FileType[FileType["Arendelle"] = 0] = "Arendelle";
            /** Arendelle '.space' stored space files */
            FileType[FileType["Space"] = 1] = "Space";
        })(FileSystem.FileType || (FileSystem.FileType = {}));
        var FileType = FileSystem.FileType;
    })(FileSystem = Arendelle.FileSystem || (Arendelle.FileSystem = {}));
})(Arendelle || (Arendelle = {}));
//
// Gerda - The optimized Arendelle intelligent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
/// <reference path="file.ts" />
/// <reference path="file-object.ts" />
var Arendelle;
(function (Arendelle) {
    var FileSystem;
    (function (FileSystem) {
        /* ────────────────────────────────────────────────────────────────────────────────────────── *
         * :::::::::::::::::::::::::::::: D I R E C T O R Y   C L A S S ::::::::::::::::::::::::::::: *
         * ────────────────────────────────────────────────────────────────────────────────────────── */
        var Directory = (function (_super) {
            __extends(Directory, _super);
            //
            // ─── FUNCS ──────────────────────────────────────────────────────────────────────
            //
            /**
             *  After runnig the constructor add files and sub-directories
             *  via the AppendFileObject function.
             */
            function Directory(path, name) {
                _super.call(this, path, name);
            }
            /** Adds files / directories to the directory */
            Directory.prototype.AppendFileObject = function (fileObject) {
                this.Contents.push(fileObject);
            };
            return Directory;
        })(FileSystem.FileSystemObject);
        FileSystem.Directory = Directory;
    })(FileSystem = Arendelle.FileSystem || (Arendelle.FileSystem = {}));
})(Arendelle || (Arendelle = {}));
//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//
var Gerda;
(function (Gerda) {
    var Kernel;
    (function (Kernel) {
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Reruns the spaces available within the scope caret location is in the code.
         */
        function GetSpaces(blueprintText, caretLocation) {
            //
            // ─── DEFINITIONS ────────────────────────────────────────────────────────────────
            //
            /** Suggested spaces within the scope */
            var scoped_spaces = new Array();
            scoped_spaces.push([0, "return"]);
            /** To track the scope */
            var scope_level = 1;
            /** To keep track of the character's location within the blueprint */
            var character_location_index = 0;
            //
            // ─── HEADER SCANNER ─────────────────────────────────────────────────────────────
            //
            /*
             * Here what we do is we escape the white spaces and comments till
             * we reach the point where the function header.
             */
            for (; character_location_index < caretLocation; character_location_index++) {
                //
                // TOOLS
                //
                var current_char = blueprintText[character_location_index];
                /** Updates the current_char location */
                function NextCharacter() {
                    if (character_location_index < caretLocation - 1)
                        current_char = blueprintText[++character_location_index];
                }
                /**
                 * Escapes the one line comments that starts with the second
                 * character of `char`.
                 */
                function EscapeOneLineComments(char) {
                    NextCharacter();
                    while (current_char != '\n' && character_location_index < caretLocation)
                        NextCharacter();
                }
                //
                // BODY
                //
                if (current_char == ' ' || current_char == '\t' || current_char == '\n') {
                    NextCharacter();
                }
                else if (current_char == '/' && character_location_index + 1 < caretLocation) {
                    NextCharacter();
                    // where we escape the comments:
                    if (current_char == '-') {
                        EscapeOneLineComments('/');
                    }
                    else if (current_char == '*') {
                    }
                }
                else if (current_char == '<') {
                }
                else {
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
            for (; character_location_index < caretLocation; character_location_index++) {
                var current_char = blueprintText[character_location_index];
                // If there's an space decleration...
                if (current_char == '(') {
                    var finding = '';
                    character_location_index++;
                    current_char = blueprintText[character_location_index];
                    // Finds the stuff between '(' and ',' or ')'
                    while (current_char != ',' && current_char && character_location_index < caretLocation) {
                        finding += current_char;
                        if (character_location_index < caretLocation - 1) {
                            character_location_index++;
                            current_char = blueprintText[character_location_index];
                        }
                        else {
                            break;
                        }
                    }
                    // Is it an space? this regex will find out
                    if (finding.match(/[a-zA-Z][a-zA-Z0-9\_]?/)) {
                        if (IsThereNeedToAddSpace(scoped_spaces, finding))
                            scoped_spaces.push([scope_level, finding]);
                    }
                }
                else if (current_char == '[' || current_char == '{') {
                    scope_level++;
                }
                else if ((current_char == ']' || current_char == '}') && scope_level > 0) {
                    scoped_spaces = RemoveSpacesWithinTheCurrentScope(scoped_spaces, scope_level);
                    scope_level--;
                }
            }
            // ────────────────────────────────────────────────────────────────────────────────
            return GetSpacesByScopedSpacesArray(scoped_spaces);
            // ────────────────────────────────────────────────────────────────────────────────
        }
        Kernel.GetSpaces = GetSpaces;
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Takes the scoped spaces array with the scope_level and removes the
         * spaces declared within the current scope level.
         */
        function RemoveSpacesWithinTheCurrentScope(scoped_spaces, scope_level) {
            var new_scoped_spaces_list = new Array();
            scoped_spaces.forEach(function (space_with_scope) {
                if (space_with_scope[0] != scope_level)
                    new_scoped_spaces_list.push(space_with_scope);
            });
            return new_scoped_spaces_list;
        }
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * This checks on the list to not to add a spcae that is allready declared.
         */
        function IsThereNeedToAddSpace(scopedSpaces, space) {
            scopedSpaces.forEach(function (item) {
                if (item[1] == space)
                    return false;
            });
            return true;
        }
        // ────────────────────────────────────────────────────────────────────────────────────────────────────
        /**
         * Converts scoped spaces to normal string array for returning
         */
        function GetSpacesByScopedSpacesArray(scopedSpaces) {
            var results = new Array();
            scopedSpaces.forEach(function (scopedSpace) {
                results.push(scopedSpace[1].toString());
            });
            return results;
        }
    })(Kernel = Gerda.Kernel || (Gerda.Kernel = {}));
})(Gerda || (Gerda = {}));
