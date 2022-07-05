const div = document.getElementById("divPositioning");
const canvas = document.querySelector("#positioning");
const context = canvas.getContext("2d");
context.canvas.width = div.clientWidth;
context.canvas.height = div.clientHeight;

/* let plan; */
let navigation;

/* TESZTHEZ */
/* let routeY; */
/* let pos_for_test = []; */

function init() {
    let room = new Room();
    room.loadData(plan);
    room.reSize(canvas.width, canvas.height);

    navigation = new Navigation(room);

    /* TESZTHEZ */
    /* let avgY = 0;
    for (let i = 0; i < room.graph.addition.length; ++i) {
        avgY += room.graph.addition[i].coordinate.y;
    }
    routeY = avgY / room.graph.addition.length; */

    draw();
}

function search() {
	let name = prompt('Keresendő cikk neve:');
	let index1;
	let index2;
	for (let i = 0; i < navigation.room.furnitures.length; ++i) {
		for (let j = 0; j < navigation.room.furnitures[i].products.length; ++j) {
			navigation.room.furnitures[i].products[j].stuffHere.forEach( sh => {
				if (name === sh) {
					index1 = i;
					index2 = j;
					dest_name = name;
				}
			});
		}
	}
	if (index1 !== undefined && index2 !== undefined) {
		let xt = (navigation.room.furnitures[index1].separators[index2].firstPoint.x + navigation.room.furnitures[index1].separators[index2].secondPoint.x) / 2;
		let yt = (navigation.room.furnitures[index1].separators[index2].firstPoint.y + navigation.room.furnitures[index1].separators[index2].secondPoint.y) / 2;
		let dest = new Point(xt, yt);
        navigation.destination = dest;
		if (navigation.pos.position === undefined) {
            let rand = Math.floor(Math.random() * (navigation.room.graph.addition.length - 1));
            navigation.pos.position = navigation.room.graph.addition[rand].coordinate;
		}
        navigation.findShortestRoute(navigation.pos.position, navigation.destination);
		draw();
	}
}

let interval;
/* Elidítja az intervalt */
function startInterval() {
    interval = window.setInterval(function() {
        navigation.follow();
        draw();
    }, 100);
}

/* Megállítja az intervalt */
function stopInterval() {
    clearInterval(interval);
}

const draw = function (e) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < navigation.room.walls.length; ++i) {
        context.strokeStyle = "black";
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(navigation.room.walls[i].firstPoint.x, navigation.room.walls[i].firstPoint.y);
        context.lineTo(navigation.room.walls[i].secondPoint.x, navigation.room.walls[i].secondPoint.y);
        context.stroke();
    }

    for (let i = 0; i < navigation.room.furnitures.length; ++i) {
        context.strokeStyle = "black";
        context.fillStyle = "black";
        let xs = [], ys = [];
        navigation.room.furnitures[i].data.forEach(furniture => {
            xs.push(furniture.firstPoint.x);
            xs.push(furniture.secondPoint.x);
            ys.push(furniture.firstPoint.y);
            ys.push(furniture.secondPoint.y);
            context.beginPath();
            context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
            context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
            context.stroke();
        });
        let minX = Math.min(...xs);
        let maxX = Math.max(...xs);
        let minY = Math.min(...ys);
        let maxY = Math.max(...ys);
        context.fillStyle = "LightSkyBlue";
        context.fillRect(minX, minY, (maxX - minX), (maxY - minY));
        context.fillStyle = "black";
    }

    for (let i = 0; i < navigation.room.beacons.length; ++i) {
        context.strokeStyle = "purple";
        context.fillStyle = "purple";
        context.beginPath();
        context.arc(navigation.room.beacons[i].x, navigation.room.beacons[i].y, 2, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
    }

    
    if (navigation.route != undefined) {

        let betweenF;
        if (navigation.followingPoint != undefined) {
            betweenF = navigation.betweenVertexes(navigation.followingPoint);
        } else {
            betweenF = {a: -1, b: -1};
        }
        
        context.lineWidth = 3;
        for (let i = 0; i < navigation.route.vertexes.length - 1; ++i) {
            if (i < betweenF.a) {
                context.strokeStyle = "DarkGrey";
                context.beginPath();
                context.moveTo(navigation.route.coords[i].x, navigation.route.coords[i].y);
                context.lineTo(navigation.route.coords[i + 1].x, navigation.route.coords[i + 1].y);
                context.stroke();
                context.arc(navigation.route.coords[i].x, navigation.route.coords[i].y, 2, 0, 2 * Math.PI);
                context.stroke();
                context.strokeStyle = "black";
            } else if (i == betweenF.a) {
                context.strokeStyle = "DarkGrey";
                context.beginPath();
                context.moveTo(navigation.route.coords[i].x, navigation.route.coords[i].y);
                context.lineTo(navigation.followingPoint.x, navigation.followingPoint.y);
                context.stroke();
                context.arc(navigation.route.coords[i].x, navigation.route.coords[i].y, 2, 0, 2 * Math.PI);
                context.stroke();

                context.strokeStyle = "MediumSeaGreen";
                context.beginPath();
                context.moveTo(navigation.followingPoint.x, navigation.followingPoint.y);
                context.lineTo(navigation.route.coords[i + 1].x, navigation.route.coords[i + 1].y);
                context.stroke();
                context.strokeStyle = "black";
            } else if (i >= betweenF.b) {
                context.strokeStyle = "MediumSeaGreen";
                context.beginPath();
                context.moveTo(navigation.route.coords[i].x, navigation.route.coords[i].y);
                context.lineTo(navigation.route.coords[i + 1].x, navigation.route.coords[i + 1].y);
                context.stroke();
                context.arc(navigation.route.coords[i].x, navigation.route.coords[i].y, 2, 0, 2 * Math.PI);
                context.stroke();
                context.strokeStyle = "black";
            }
            
            
        }
        context.lineWidth = 1;
    }

    if (navigation.followingPoint !== undefined) {
		context.fillStyle = "green";
		context.beginPath();
		context.arc(navigation.followingPoint.x, navigation.followingPoint.y, 5, 0, 2 * Math.PI);
		context.fill();

        if (navigation.pos.nearestBeacon != null) {
            context.strokeStyle = "orange";
            context.fillStyle = "orange";
            context.beginPath();
            context.arc(navigation.pos.nearestBeacon.position.x, navigation.pos.nearestBeacon.position.y, 5, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        }
	}

    /* if (navigation.pos.position !== undefined) {
        console.log(navigation.pos.position.x);
		context.fillStyle = "green";
		context.beginPath();
		context.arc(navigation.pos.position.x, navigation.pos.position.y, 5, 0, 2 * Math.PI);
		context.fill();

        if (navigation.pos.nearestBeacon != null) {
            context.strokeStyle = "orange";
            context.fillStyle = "orange";
            context.beginPath();
            context.arc(navigation.pos.nearestBeacon.position.x, navigation.pos.nearestBeacon.position.y, 5, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        }
	} */

    if (navigation.destination !== undefined) {
		context.fillStyle = "red";
		context.beginPath();
		context.arc(navigation.destination.x, navigation.destination.y, 5, 0, 2 * Math.PI);
		context.fill();
    }

    /* TESZTHEZ */
    /* for (let i = 0; i <pos_for_test.length; ++i) {
        context.fillStyle = "green";
		context.beginPath();
		context.arc(pos_for_test[i].x, pos_for_test[i].y, 5, 0, 2 * Math.PI);
		context.fill();
    } */

}

init();