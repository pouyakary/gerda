//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/// <reference path="file-object.ts" />

module Arendelle {	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */
	 
	/** Arendele '.space' / '.arendelle' files */
	export class File extends FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** 
			 * Where we store the file content (the string within the file) 
			 */
			Content: string;
			
			/** 
			 * File Type: "Arendele" or "Space"
			 */
			Type: 	FileType;
		
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/**
			 * ***
			 * Constructs an Arendele file. 
			 * ***
			 * @param	name		The name of the file (For example the file path is:
			 * 						`a/b/c/abc.arendelle` then the file name is `abc`)
			 * @param 	content		The string content within your file.
			 * @param	space		Pass `true`	if your file is an `.space` file and 
			 * 						`false` if it's an `.arendelle` file.
			 */
			constructor ( name: string , content: string , space: boolean) {
				super( name );
				this.Content = content;
				if ( space )
					this.Type = FileType.Space;	
				else
					this.Type = FileType.Arendelle;
			}
			
		// ────────────────────────────────────────────────────────────────────────────────
			
			/** 
			 * ***
			 * Get's the file type string for the Arendelle files
			 * ***
			 */
			GetFileTypeEnd ( ): string {
				if ( this.Type == FileType.Space )
					return '.space';
				else
					return '.arendelle';
			}
		
		// ────────────────────────────────────────────────────────────────────────────────
			/**
			 * ***
			 * Getts the pull file path way including it's file tye ending
			 * ***
			 * **NOTE:** the `.GetFullPath( )` provided by the `FileSystemObject`
			 * must never be used for the files as it does not include the file type
			 */
			GutFullFilePath ( ): string {
				return this.GetFullPath( ) + this.GetFileTypeEnd( );
			}
		
		// ────────────────────────────────────────────────────────────────────────────────

	}
	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::::::::::: F I L E   T Y P E S :::::::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */

	export enum FileType {
		/** Arendelle '.arendelle' blueprit files */
		Arendelle,
		/** Arendelle '.space' stored space files */
		Space	
	}
	
}
