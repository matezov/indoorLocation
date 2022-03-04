/* felhelyezi az adott indexű falra a "jeladót" vagy jeladóra kattintás esetén meg lehet adni a méretét*/
function setBeacon(index, e) {
	let size = 0;
	
	for (let i = 0; i < beacons.length; ++i) {
		if (e.layerX > beacons[i].x - 15 && e.layerX < beacons[i].x + 15
			&& e.layerY > beacons[i].y - 15 && e.layerY < beacons[i].y + 15
			&& beacons[i].wall === index) {
			size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
			while (size >= coords[index].size || coords[index].size <= 0) {
				alert('Hibás méret!');
				size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
			}
			switch (coords[index].direction) {
				case 'North':
					size = coords[index].size - size;
					break;
				case 'West':
					size = coords[index].size - size;
					break;
			}
			beacons[i].pos = size;
			return;
		}
	}
	let beaconID = prompt('Add meg a jeladó azonosítóját!');
	beacons.push({ x: e.clientX, y: e.clientY, wall: index, pos: size, id: beaconID });
	console.log(beacons)
	draw();
}

function getNearestWallsFromBeacon(beacon) {
	nearestWallHorizontal = [];
	nearestWallVertical = [];
	for (let i = 0; i < coords.length; ++i) {
		if (getDirection(coords[i]) === 'vertical') {
			nearestWallVertical.push({wall_index: i,  distance: distV});
		} else {

		}
	}
}

/* Arányosan rajzolja fel a jeladókat */
function scalingBeacons() {
	for (let i = 0; i < coords.length; ++i) {
		for (let j = 0; j < beacons.length; ++j) {
			if (beacons[j].wall === i) {
				switch (coords[i].direction) {
					case 'North':
						beacons[j].x = coords[i].firstPoint.x;
						beacons[j].y = coords[i].firstPoint.y - beacons[j].pos * scale_permanent;
						break;
					case 'South':
						beacons[j].x = coords[i].firstPoint.x;
						beacons[j].y = coords[i].firstPoint.y + beacons[j].pos * scale_permanent;
						break;
					case 'East':
						beacons[j].x = coords[i].firstPoint.x + beacons[j].pos * scale_permanent;
						beacons[j].y = coords[i].firstPoint.y;
						break;
					case 'West':
						beacons[j].x = coords[i].firstPoint.x - beacons[j].pos * scale_permanent;
						beacons[j].y = coords[i].firstPoint.y;
						break;
				}
			}
		}
	}
}