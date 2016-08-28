# Gerda

Garda is an stand alone intelligent autosuggestion server for Arendelle Language. Gerda scans Arendelle in a very fast maneuver (Only scans the substring of code's start to caret's location and scan's the string in an O(n) time).

Currently [Arendelle for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=karyfoundation.arendelle) uses Gerda for it's IntelleSense core. 

If you wanna play online with Gerda, Two versions of it are available via Kary Foundation's Playgrounds:

- [Gerda v1 &mdash; With Static UI](http://www.karyfoundation.org/research/playgrounds/gerda/01/)
- [Gerda v2 &mdash; With Interactive Suggestion Autocomplete UI](http://www.karyfoundation.org/research/playgrounds/gerda/02/)

![](https://cloud.githubusercontent.com/assets/2157285/18032698/43e36866-6d23-11e6-8e46-0d875358367a.jpg)


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
% chmod u+x ./run.sh; ./run.sh
```
	
	
## Name?
As you know our convention with Arendelle was to use names of the characters of the movie Frozen. [Gerda](http://disney.wikia.com/wiki/Kai_and_Gerda) is one of the invisible servants of the castle. And that name suits the Gerda so much! It's also an invisible server that helps you write code in silent...
	
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

