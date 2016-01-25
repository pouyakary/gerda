//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/// <reference path="file-object.ts" />

module Arendelle.FileSystem {	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */
	 
	/** Arendele '.space' / '.arendelle' files */
	export class File extends FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** Where we store the file content */
			Content: string;
			
			/** File Type */
			Type: 	FileType;
		
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/** Class constructor */
			constructor ( name: string , path: string , content: string , space: boolean) {
				super( path , name );
				this.Content = content;
				if ( space )
					this.Type = FileType.Space;	
				else
					this.Type = FileType.Arendelle;
			}
			
			
			/** Generates the full path of the file */
			FullPath ( ): string {
				return this.Path + '/' + this.Name + this.GetFileTypeEnd();
			}
			
			
			/** Get's the file type string for the Arendelle files */
			GetFileTypeEnd ( ): string {
				if ( this.Type == FileType.Space )
					return '.space';
				else
					return '.arendelle';
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