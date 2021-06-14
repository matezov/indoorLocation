function setProduct(index, e) {

    for (let i = 0; i < furnitures[index].products.length; ++i) {
		if (e.layerX > furnitures[index].products[i].x - 15 && e.layerX < furnitures[index].products[i].x + 15
			&& e.layerY > furnitures[index].products[i].y - 15 && e.layerY < furnitures[index].products[i].y + 15) {
            if (furnitures[index].products[i].name !== '') {
                alert(furnitures[index].products[i].name);
            } else {
                let name = prompt('Név:');
                if (name !== null) {
                    furnitures[index].products[i].name = name;
                }
            }
			return;
		}
    }
    
	furnitures[index].products.push({ x: e.clientX, y: e.clientY, wall: index, name: ''});
	draw();
}


function inObject(point, objCoord) {

    let b = true;

    let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
        objCoord.forEach(coord => {
            let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            /* bal felso pontja */
            if (point.x > mincoordX && point.y > mincoordY) {
                    topLeft = true;
            }
            /* bal also pontja */
            if (point.x > mincoordX && point.y < maxcoordY) {
                    bottomLeft = true;
            }
            /* jobb felso pontja */
            if (point.x < maxcoordX && point.y > mincoordY) {
                    topRigth = true;
            }
            /* jobb also pontja */
            if (point.x < maxcoordX && point.y < maxcoordY) {
                    bottomRight = true;
            }
        });
        if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
            b = false;
        }

    return b;
}