
//
// ─── VARIABLES ──────────────────────────────────────────────────────────────────
//

    var isRunningOnSuggestionMode = false;
    var currentSequence = '';
    var editor = document.getElementById ( "editor" );
    var display = document.getElementById ( "suggestions" );
    var character_name_regex_formula = /[@a-zA-Z0-9\s]/;
    var past_position = -1;

//
// ─── GET SELECTION COORDS ───────────────────────────────────────────────────────
//

    function getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.top;
                }
                // Fall back to inserting a temporary element
                if (x == 0 && y == 0) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild( doc.createTextNode("\u200b") );
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    }

//
// ─── GET CARET POSITION ─────────────────────────────────────────────────────────
//

    function getCaretPosition(editableDiv) {
        var caret_pos = 0,
        sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if ( sel.rangeCount ) {
                range = sel.getRangeAt(0);
                if ( range.commonAncestorContainer.parentNode == editableDiv ) {
                    caret_pos = range.endOffset;
                }
            }
        } else if ( document.selection && document.selection.createRange ) {
            range = document.selection.createRange( );
            if ( range.parentElement( ) == editableDiv ) {
                var tempEl = document.createElement( "span" );
                editableDiv.insertBefore( tempEl , editableDiv.firstChild );
                var temp_range = range.duplicate( );
                temp_range.moveToElementText( tempEl );
                temp_range.setEndPoint( "EndToEnd" , range );
                caret_pos = temp_range.text.length;
            }
        }
        return caret_pos;
    }

//
// ─── GENERATE HTML ITEM ELEMENTS FROM SUGGESTIONS ARRAY ─────────────────────────
//

    function generateHTMLItemELementsFromSuggestionArray ( spaces ) {
        var results = "";
        spaces.forEach ( function ( space ) {
            results += '<div class="item">@' + space + '</div><br/>';
        });
        return results;
    }
    
//
// ─── HIDE SUGGESTIONS ON BAD KEYS ───────────────────────────────────────────────
//

    function hideSuggestionsOnBadKeys( event ) {
        try {
            var key_code = getKeyboardKeyByOnKeyboardClickedEvent( event );
            if ( key_code == 8 || key_code == 46 ) {
                if ( currentSequence.length > 0 ) {
                    currentSequence = currentSequence.slice( 0 , -1 );
                    updateSuggestions( );
                } else {
                    hideSuggestions( );
                }
            }
        } catch ( err ) {
            console.log( 'KFGerda: Could not hide suggestions.' );
        }
    }
    
//
// ─── HIDE SUGGESTIONS ───────────────────────────────────────────────────────────
//
    
    function endSuggestions( ) {
        hideSuggestions( );
    }
    
//
// ─── HIDE ON SCROLL ─────────────────────────────────────────────────────────────
//

    function updateSuggestionsOnScroll( ) {
        if ( isRunningOnSuggestionMode ) {
            updateSuggestionBox( );
        }
    }

//
// ─── GET KEYBOARD KEY USING THE ON KEYDOWN EVENT BY EVENT ───────────────────────
//

    function getKeyboardKeyByOnKeyboardClickedEvent( event ) {
        try {
             return event.which || event.keyCode;
        } catch ( err ) {
            return 0;
        }
    }

//
// ─── UPDATE SUGGESTIONS ─────────────────────────────────────────────────────────
//

    function updateSuggestions( event ) {
        
        // Fetching basic information  
        var caret_location = getCaretPosition( editor );
        var key_code = getKeyboardKeyByOnKeyboardClickedEvent( event );
        var current_char = String.fromCharCode( key_code );

        // Checking the status of suggestion system
        updateSuggestionScreenDisplayStatus( current_char );
        isShowingTheSuggestionEnough( );
        
        // If is on suggestion...
        if ( isRunningOnSuggestionMode ) {
            updateSuggestionBox( );
            display.innerHTML = getSuggestionsInHTMLFormat( editor.innerText , caret_location );
        }
        
    }

//
// ─── IS SHOWING ENOUGH SUGGESTIONS ──────────────────────────────────────────────
//
    
    function isShowingTheSuggestionEnough( ) {
        if ( suggestions.children.length == 1 ) {
            var sizeOfCurrent = currentSequence.replace( /\s/g , '' );
            var firstChildSzie = suggestions.firstChild( ).length;
            if ( sizeOfCurrent >= firstChildSzie ) {
                hideSuggestions( );
            }
        }
    }
    
//
// ─── GET SUGGESTIONS IN HTML FORMAT ─────────────────────────────────────────────
//
    
    function getSuggestionsInHTMLFormat( text , position ) {
        currentSequence = currentSequence.replace( /\s/g , '' );
        var suggestions = Gerda.Kernel.GetSpaces( text , position );
        var filteredSuggestions = Gerda.Kernel.FilterSuggestions( suggestions , currentSequence );
        return generateHTMLItemELementsFromSuggestionArray( filteredSuggestions );
    }
    
//
// ─── UPDATE SUGGESTION BOX ──────────────────────────────────────────────────────
//

    function updateSuggestionBox( ) {
        var position = getSelectionCoords( );
        var box = document.getElementById( "suggestions" );
        box.style.position = "fixed";
        box.style.left = ( position.x + 15 ) + "px";
        box.style.top = ( position.y - 21 ) + "px";
    }
    
//
// ─── CHECK CURRENT CHARARCTER ───────────────────────────────────────────────────
//

    function getCurrentCaracter( position ) {
        var editor_data = editor.innerContent || editor.innerText;
        return editor_data[ position - 1 ];
    }
    
//
// ─── UPADET SUGGESTION STATUS ───────────────────────────────────────────────────
//

    function updateSuggestionScreenDisplayStatus( current_char ) {
        if ( isRunningOnSuggestionMode ) {
            if ( /./.test( current_char ) ) {
                if ( character_name_regex_formula.test( current_char ) ) {
                    currentSequence += current_char;
                } else {
                    hideSuggestions( );
                }
            }
        } else {
            if ( current_char == '@' ) {
                showSuggestions( );
            }
        }
    }
    
//
// ─── SHOW SUGGESTIONS ───────────────────────────────────────────────────────────
//
    
    function showSuggestions( ) {
        currentSequence = '';
        isRunningOnSuggestionMode = true;
        suggestions.style.display = 'block';
    }

//
// ─── HIDE SUGGESTIONS ───────────────────────────────────────────────────────────
//
 
    function hideSuggestions( ) {
        currentSequence = '';
        isRunningOnSuggestionMode = false;
        suggestions.style.display = 'none';
    }

// ────────────────────────────────────────────────────────────────────────────────