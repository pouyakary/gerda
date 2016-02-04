//
// Gerda -  The optimized Arendelle's intelligent auto suggestion server 
//    Copyright 2016 - Pouya Kary <k@arendelle.org>
//

/* ────────────────────────────────────────────────────────────────────────────────────────── *
 * ::::::::::::::::::::::::::::: G E R D A   P L A Y G R O U N D :::::::::::::::::::::::::::: *
 * ────────────────────────────────────────────────────────────────────────────────────────── */

//
// ─── HEADER ─────────────────────────────────────────────────────────────────────
//

	'use strict';

	const electron = require( 'electron' );

	const app = electron.app;
	const BrowserWindow = electron.BrowserWindow;
	let mainWindow;

//
// ─── DISPLAY ────────────────────────────────────────────────────────────────────
//

	function createWindow () {
		mainWindow = new BrowserWindow ({
			width: 840 , height: 500 
		});
		mainWindow.loadURL( 'file://' + __dirname + '/index.html' );
		mainWindow.on( 'closed' , function() {
			mainWindow = null;
		})
	}

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

	app.on( 'ready' , createWindow );

//
// ─── DISPLAY HANDLERS ───────────────────────────────────────────────────────────
//

	app.on( 'window-all-closed' , function () {
		console.log( 'Goodbye' );
		app.quit( );
	});
	
	app.on( 'activate', function () {
		if ( mainWindow === null ) {
			createWindow( );
		}
	});

// ────────────────────────────────────────────────────────────────────────────────
