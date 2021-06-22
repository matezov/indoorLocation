function setProduct(index, e) {

    const point = {x: e.layerX, y: e.layerY};

    for (let i = 0; i < furnitures[index].separators.length; ++i) {
        if (i === 0) {
            const obj = [{firstPoint: furnitures[index].info.start.firstPoint, secondPoint: furnitures[index].info.start.secondPoint},
            {firstPoint: furnitures[index].separators[i].firstPoint, secondPoint: furnitures[index].separators[i].secondPoint}];
            if (inObject(point, obj)) {
                let name = prompt('Név:');
                if (name !== null) {
                    furnitures[index].products[i].stuffHere.push(name);
                }
            }
        } else {
            const obj = [{firstPoint: furnitures[index].separators[i - 1].firstPoint, secondPoint: furnitures[index].separators[i - 1].secondPoint},
            {firstPoint: furnitures[index].separators[i].firstPoint, secondPoint: furnitures[index].separators[i].secondPoint}];
            if (inObject(point, obj)) {
                let name = prompt('Név:');
                if (name !== null) {
                    furnitures[index].products[i].stuffHere.push(name);
                }
            }
        }
    }

    
    const obj = [{ firstPoint: furnitures[index].separators[furnitures[index].separators.length - 1].firstPoint, secondPoint: furnitures[index].separators[furnitures[index].separators.length - 1].secondPoint },
    { firstPoint: furnitures[index].info.end.firstPoint, secondPoint: furnitures[index].info.end.secondPoint }];
    if (inObject(point, obj)) {
        let name = prompt('Név:');
        if (name !== null) {
            furnitures[index].products[furnitures[index].separators.length - 1].stuffHere.push(name);
        }
    }
    
	// furnitures[index].products.push({ x: e.clientX, y: e.clientY, wall: index, name: ''});
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

