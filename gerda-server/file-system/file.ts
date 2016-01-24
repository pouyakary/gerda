//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 - Pouya Kary <k@arendelle.org>
//

module Gerda.Arendelle {	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::::::::::: F I L E   C L A S S :::::::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */
	 
	export class File {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** Where we store the file content */
			Content: string;
		
			/** Path to the file */
			Path: string;
		
			/** File name: */
			Name: string;
			
			/** File Type */
			Type: FileType;
		
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/** Class constructor */
			constructor ( name: string , path: string , content: string , space: boolean ) {
				this.Content = content;
				this.Name = name;
				this.Path = path;
				
				if ( space )
					this.Type = FileType.Space;	
				else
					this.Type = FileType.Arendelle;
			}
			
			/** Generates the full path of the file */
			FullPath ( ) :string {
				return this.Path + '/' + this.Name + this.GetFileTypeEnd();
			}
			
			/** */
			GetFileTypeEnd ( ) :string {
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