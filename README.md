# Gerda

Garda is an intelligent autosuggestion server for web. Specially designed to work with [Arendelle Studio](http://web.arendelle.org/studio/)

![](http://kary.us/GitHubWideImages/gerda/screen.png)

***

## Functions

#### Scanners

- Scoped based space suggestion.
- Function suggestion.
- Stored Space suggestion.

#### Suggestion Server

- Provides instant suggestion server for the IDE


## Structure
The module structure of the Gerda comes as:

- Gerda 
	- [Kernel](https://github.com/arendelle/gerda/tree/master/gerda-server/kernel): Where the lexers and scanners are
	- [Server](https://github.com/arendelle/gerda/tree/master/gerda-server/server): Where the 
	
## Build Info
You can compile the the library to pure JavaScript. In the make file there is a command for it:

```
% make build
```

There is also an [electron](http://electron.atom.io) interactive playground that lets you see the suggestion list instantly. You can run it via

```
% make electron
```
		
***		
	
## License

```
Gerda - The optimized Arendelle intelligent auto suggestion's server
  Copyright (c) 2016 Kary Foundation, Inc.
  Author: Pouya Kary <k@karyfoundation.org>


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

