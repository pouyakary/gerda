//
// Standard Arendelle File System Object Model for TypeScript Code Bases
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

module Arendelle {
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::: F I L E   S Y S T E M   O B J E C T :::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */

	/** File and Directory objects shall both extend from this */
	export class FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** Parent directory object of the file */
			Parent: Directory;
		
			/** File name: */
			Name: 	string;
			
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/**
			 * ***
			 * Generates a directory. 
			 * ***
			 * **NOTE:** Each directory is being created in the file system root. You then
			 * have to move them to where you want using the `.MoveFileToDirectory( )` that
			 * is provided for you.
			 */
			constructor( name: string ) {
				this.Name 	= name;
				this.Parent = null;
			}
			
		// ────────────────────────────────────────────────────────────────────────────────	
		
			/**
			 * ***
			 * Gets the full path of the object.
			 * *** 
			 * @returns UNIX path in format of: `/something/something_else/file_name`.
			 */
			GetFullPath( ): string  {
				if ( this.Parent != null ) {
					return this.Parent.GetFullPath( ) + '/' + this.Name;
				} else {
					return '/';
				}
			}
			
		// ────────────────────────────────────────────────────────────────────────────────			
			
			/**
			 * ***
			 * Moves the file to a `Directory` object.
			 * ***
			 * @param	directory		The destination directory.
			 * ***
			 * @returns 				True if the transmission was successful.
			 */
			MoveFileToDirectory( directory: Directory ): boolean {
				// removing forom the first directory
				if ( this.Parent != null ) {
					this.Parent.RemoveFileName( this.Name );
				}
				// adding to the second directory
				if ( directory != null ) {
					var couldMove = false;
					if ( directory.AppendFileObject( this ) ) {
						this.Parent = directory;
						couldMove = true;
					}
					return couldMove;
				} else {
					this.Parent = null;
					return true;
				}
			}
		
		// ────────────────────────────────────────────────────────────────────────────────
		
	}
	
}
