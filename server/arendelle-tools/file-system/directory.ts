//
// Standard Arendelle File System Object Model for TypeScript Code Bases 
//    Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

/// <reference path="file.ts" />
/// <reference path="file-object.ts" />

module Arendelle {	
	
	/* ────────────────────────────────────────────────────────────────────────────────────────── *
	 * :::::::::::::::::::::::::::::: D I R E C T O R Y   C L A S S ::::::::::::::::::::::::::::: *
	 * ────────────────────────────────────────────────────────────────────────────────────────── */

	export class Directory extends FileSystemObject {
		
		//
		// ─── STORAGE ────────────────────────────────────────────────────────────────────
		//
		
			/**  
			 * Contents of the directory including files and directories
			 */
		 	Contents: Array<FileSystemObject>
			
		//
		// ─── FUNCS ──────────────────────────────────────────────────────────────────────
		//
		
			/**
			 * ***
			 * Generates a Directory. <br />
			 * ***
			 * **NOTE**: To add a directory you have to use the `AppendFileObject()` method.
			 * ***
			 * @param 	name 		The file name, (For exampe if the file be `a/b/abc.arendelle` 
			 * 						the name would be `abc`.)
			 */
			constructor ( name: string ) {
				super( name );
				this.Contents = new Array<FileSystemObject>( );
			} 
		
		// ────────────────────────────────────────────────────────────────────────────────
			
			/** 
			 * ***
			 * Adds `files` / `directories` to the directory.
			 * ***
			 * @param 	fileObject 		The file you request to be deleted.
			 * @returns 				True if the process was successful.
			 */
			AppendFileObject ( fileObject: FileSystemObject ): boolean {
				// checks if it's douplicate or not
				var doHaveToAdd: boolean = true;
				for ( var index: number = 0 ; index < this.Contents.length ; index++ ) {
					if ( this.Contents[ index ].Name == fileObject.Name ) {
						doHaveToAdd = false;
						break;
					}
				}
				if ( doHaveToAdd ) {
					this.Contents.push( fileObject );
				}
				return doHaveToAdd;
			}
			
		// ────────────────────────────────────────────────────────────────────────────────
			
			/** 
			 * ***
			 * Removes a FileSystemObject from the current directory and return true if
			 * the process was successful.
			 * ***
			 * @param 	fileName 	Name of the file you want to deleted (`FileSystemObject.Name`).
			 * @returns				True if the deletation was successful.
			 */
			RemoveFileName( fileName: string ): boolean {
				var newFileList = new Array<FileSystemObject>( );
				var didDelete = false;
				this.Contents.forEach( fileObject => {
					if ( fileObject.Name != fileName ) {
						newFileList.push( fileObject );
						didDelete = true;
					}
				});
				this.Contents = newFileList;
				return didDelete;
			}
			
		// ────────────────────────────────────────────────────────────────────────────────

	}

}
