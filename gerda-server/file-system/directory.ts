//
// Gerda - The optimized Arendelle itelegent auto suggestion's server
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/// <reference path="file.ts" />
/// <reference path="file-object.ts" />

module Gerda.Arendelle {	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * :::::::::::::::::::::::::::::: D I R E C T O R Y   C L A S S ::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */

	export class Directory extends FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/** Files and Subdirectories of the Directory */
			Contents: Array<FileSystemObject>
			
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/**
			 *  After runnig the constructor add files and sub-directories
			 *  via the AppendFileObject function.
			 * */
			constructor ( path: string , name:string ) {
				super ( path , name );
			} 
			
			
			/** Adds files / directories to the directory */
			AppendFileObject ( fileObject: FileSystemObject ) {
				this.Contents.push( fileObject );
			}
			
		// ────────────────────────────────────────────────────────────────────────────────

	}

}