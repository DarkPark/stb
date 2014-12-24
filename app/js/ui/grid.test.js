'use strict';

var data = [
		[1, 2, 3, 4, 5],
		[6, {value: '7-9', colSpan: 3}, 10],
		[{value: '11;12;16;17', rowSpan: 2, colSpan: 2}, 13, 14, {value: '15;20', rowSpan: 2}],
		[18, 19],
		[{value: '26-30', colSpan: 5}],
		[{value: '31-40', colSpan: 5, rowSpan: 2}]
	];


function normalize ( data ) {
	var i, j, item;

	// rows
	for ( i = 0; i < data.length; i++ ) {
		// cols
		for ( j = 0; j < data[i].length; j++ ) {
			// cell value
			item = data[i][j];
			// primitive value
			if ( typeof item !== 'object' ) {
				// wrap
				item = data[i][j] = {
					value: data[i][j]
				};
			}
			// always at least one row/col
			item.colSpan = item.colSpan || 1;
			item.rowSpan = item.rowSpan || 1;
		}
	}

	return data;
}


function fill ( map, x, y, dX, dY, value ) {
	var i, j;

	// rows
	for ( i = y; i < y + dY; i++ ) {
		// increase map rows
		if ( map.length < i + 1 ) {
			map.push([]);
		}

		while ( map[y][x] !== undefined ) {
			x++;
		}

		// cols
		for ( j = x; j < x + dX; j++ ) {
			// increase map row cols
			if ( map[i].length < j + 1 ) {
				map[i].push(value);
			}
		}
	}
}


function map ( data ) {
	var result = [],
		i, j, item;

	// rows
	for ( i = 0; i < data.length; i++ ) {
		// cols
		for ( j = 0; j < data[i].length; j++ ) {
			// cell value
			item = data[i][j];
			// process a cell
			fill(result, j, i, item.colSpan, item.rowSpan, item.value);
		}
	}

	return result;
}


console.log('normalized data:');
console.log(normalize(data));
console.log('\nmap:');
console.log(map(normalize(data)));
