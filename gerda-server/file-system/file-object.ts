//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

module Arendelle.FileSystem {
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * ::::::::::::::::::::::::::: F I L E   S Y S T E M   O B J E C T :::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */

	/** File and Directory objects shall both extend from this */
	export class FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** Path to the file */
			Path: 	string;
		
			/** File name: */
			Name: 	string;
			
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			constructor( path: string , name: string ) {
				this.Name = name;
				this.Path = path;
			}
		
		// ────────────────────────────────────────────────────────────────────────────────
		
	}
	
}