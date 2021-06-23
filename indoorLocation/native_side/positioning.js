const canvas = document.querySelector("#positioning");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let scale;

let pos;
let dest;
let dest_name;

/* Visszaadja a 3 legerősebb jellel rendelkező jeladót. arr -> [{x,y,d}] */
function strongestSigns(arr) {
	let max = [];

	for (let i = 0; i < 3; ++i) {
		let curr_max = arr[0];
		let curr_index = 0;
		for (let j = 1; j < arr.length; ++j) {
			if (curr_max.d < arr[j].d) {
				curr_max = arr[j];
				curr_index = j;
			}
		}
		max.push(curr_max);
		arr.splice(curr_index, 1);
	}

	return max;
}

canvas.onclick = function (e) {
	if (e.layerX < pos.x + 10 && e.layerX > pos.x - 10 &&
		e.layerY < pos.y + 10 && e.layerY > pos.y - 10) {
			let name = prompt('Keresendő cikk neve:');
			let index1;
			let index2;
			for (let i = 0; i < plan.furnitures.length; ++i) {
				for (let j = 0; j < plan.furnitures[i].products.length; ++j) {
					plan.furnitures[i].products[j].stuffHere.forEach( sh => {
						if (name === sh) {
							index1 = i;
							index2 = j;
							dest_name = name;						
						}
					});
				}
			}
			console.log(index1)
			console.log(index2)
			if (index1 !== undefined && index2 !== undefined) {
				let xt = (plan.furnitures[index1].separators[index2].firstPoint.x + plan.furnitures[index1].separators[index2].secondPoint.x) / 2;
				let yt = (plan.furnitures[index1].separators[index2].firstPoint.y + plan.furnitures[index1].separators[index2].secondPoint.y) / 2;
				dest = {x: xt, y: yt}
				draw();
			}
	}
	console.log(e.layerX, e.layerY)
}


/* function trilateration(P1, P2, P3) {

	let S = (Math.pow(P3.x, 2) - Math.pow(P2.x, 2) + Math.pow(P3.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r, 2) - Math.pow(P3.r, 2)) / 2;
   	let T = (Math.pow(P1.x, 2) - Math.pow(P2.x, 2) + Math.pow(P1.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r, 2) - Math.pow(P1.r, 2)) / 2;
    let y = ((T * (P2.x - P3.x)) - (S * (P2.x - P1.x))) / (((P1.y - P2.y) * (P2.x - P3.x)) - ((P3.y - P2.y) * (P2.x - P1.x)));
	let x = ((y * (P1.y - P2.y)) - T) / (P2.x - P1.x);

	return {x, y}
} */

/* 3 pontot távolsággal Pi = {x,y,r,d} alakban */
function getPosition(P1, P2, P3) {
	
	const A = 2 * P2.x - 2 * P1.x
	const B = 2 * P2.y - 2 * P1.y
	const C = P1.r ** 2 - P2.r ** 2 - P1.x ** 2 + P2.x ** 2 - P1.y ** 2 + P2.y ** 2
	const D = 2 * P3.x - 2 * P2.x
	const E = 2 * P3.y - 2 * P2.y
	const F = P2.r ** 2 - P3.r ** 2 - P2.x ** 2 + P3.x ** 2 - P2.y ** 2 + P3.y ** 2
	const x = (C * E - F * B) / (E * A - B * D);
	const y = (C * D - A * F) / (B * D - A * E);

	return {x, y}
}

function init() {
	scalePlan();
	//setDistFromWalls();
	console.log(plan.furnitures);
	scaleFurnitures();
	let arr = [{x:1,y:1,r: 5,d:10},{x:2,y:2,r:5, d:21},{x:3,y:3,r: 5,d:50},{x:4,y:4,r: 5,d:32},{x:1,y:2,r: 5,d:42},{x:1,y:2,r: 5,d:4},{x:1,y:2,r: 5,d:23},{x:1,y:2,r: 5,d:324}]; 
	const max_array = strongestSigns(arr);
	pos = getPosition(max_array[0],max_array[1],max_array[2])
	pos = {x: 500, y: 400}
	draw();
}


const draw = function (e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < plan.walls.length; ++i) {
        context.beginPath();
        context.moveTo(plan.walls[i].firstPoint.x, plan.walls[i].firstPoint.y);
        context.lineTo(plan.walls[i].secondPoint.x, plan.walls[i].secondPoint.y);
        context.stroke();
    }
    for (let i = 0; i < plan.beacons.length; ++i) {
        context.fillStyle = "green";
        context.beginPath();
        context.arc(plan.beacons[i].x, plan.beacons[i].y, 5, 0, 2 * Math.PI);
		context.fill();
		context.fillStyle = "black";
	}
	for (let i = 0; i < plan.furnitures.length; ++i) {
		plan.furnitures[i].data.forEach(wall => {
			context.beginPath();
			context.moveTo(wall.firstPoint.x, wall.firstPoint.y);
			context.lineTo(wall.secondPoint.x, wall.secondPoint.y);
			context.stroke();
		});

	}

	context.fillStyle = "brown";
	context.beginPath();
	context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
	context.fill();

	if (dest !== undefined) {
		context.fillStyle = "red";
		context.beginPath();
		context.arc(dest.x, dest.y, 5, 0, 2 * Math.PI);
		context.fill();
	}
	
	

}

init();
