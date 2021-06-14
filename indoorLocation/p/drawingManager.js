const drawingManager = new (function () {
    /* Megkeresi az első felrajzolt faltól sorban a legközelebbi falat, sorrendbe teszi őket */
    this.searchNextWall = function () {
        /* if (coords.length < 4) {
            alert('Kevés fal lett rajzolva!');
            return;
        }
        if (coords.length % 2 === 1) {
            alert('Páratlan a falak száma!');
            return;
        } */

        let tmp_coords = [];
        const basic_length = coords.length;
        tmp_coords.push({ firstPoint: coords[0].firstPoint, secondPoint: coords[0].secondPoint, size: 0, direction: coords[0].direction });
        coords.splice(0, 1);
        while (tmp_coords.length < basic_length) {
            const tmp_befPoint = tmp_coords[tmp_coords.length - 1].secondPoint;
            let tmp_curr = coords[0];
            let tmp_index = 0;

            for (let i = 1; i < coords.length; ++i) {

                let tmp_firstPointDistance = getDistance(tmp_curr.firstPoint, tmp_befPoint);
                let tmp_secondPointDistance = getDistance(tmp_curr.secondPoint, tmp_befPoint);
                const firstPointDistance = getDistance(coords[i].firstPoint, tmp_befPoint);
                const secondPointDistance = getDistance(coords[i].secondPoint, tmp_befPoint);
                let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;

                if (firstPointDistance < minDistance || secondPointDistance < minDistance) {
                    tmp_curr = coords[i];
                    tmp_index = i;
                }

            }

            const tmp_firstPoint = tmp_curr.firstPoint;
            const tmp_secondPoint = tmp_curr.secondPoint;
            const tmp_firstPointDistance2 = getDistance(tmp_firstPoint, tmp_befPoint);
            const tmp_secondPointDistance2 = getDistance(tmp_secondPoint, tmp_befPoint);

            if (tmp_firstPointDistance2 <= tmp_secondPointDistance2) {
                tmp_coords.push({ firstPoint: tmp_firstPoint, secondPoint: tmp_secondPoint, size: 0, direction: '' });
            } else {
                tmp_coords.push({ firstPoint: tmp_secondPoint, secondPoint: tmp_firstPoint, size: 0, direction: '' });
            }

            coords.splice(tmp_index, 1);
        }

        coords = tmp_coords;
    }

    let furniture = [];

    /* Szétszedi azokat a falakat, amik "egyben" lettek felrajzolva */
    this.takeApart = function () {
        if (drawingCoords.length <= 15) return;
        let breakPoints = [];
        let direction;
        if (Math.abs(drawingCoords[0].x - drawingCoords[15].x) >
            Math.abs(drawingCoords[0].y - drawingCoords[15].y)) {
            direction = 'horizontal';
        } else {
            direction = 'vertical';
        }
        for (let i = 15; i < drawingCoords.length - 16; i += 15) {
            if (Math.abs(drawingCoords[i].x - drawingCoords[i + 15].x) >
                Math.abs(drawingCoords[i].y - drawingCoords[i + 15].y)) {
                if (direction === 'vertical') {
                    breakPoints.push({ x: drawingCoords[i].x, y: drawingCoords[i].y });
                }

                direction = 'horizontal';
            } else {
                if (direction === 'horizontal') {
                    breakPoints.push({ x: drawingCoords[i].x, y: drawingCoords[i].y })
                }
                direction = 'vertical';
            }
        }

        if (breakPoints.length < 1) return;

        if (drawingPhase) {
            coords.splice(-1, 1);
            coords.push({ firstPoint: { x: drawingCoords[0].x, y: drawingCoords[0].y }, secondPoint: { x: breakPoints[0].x, y: breakPoints[0].y }, size: 0, direction: '' });
            for (let i = 0; i < breakPoints.length - 1; ++i) {
                coords.push({ firstPoint: { x: breakPoints[i].x, y: breakPoints[i].y }, secondPoint: { x: breakPoints[i + 1].x, y: breakPoints[i + 1].y }, size: 0, direction: '' });
            }
            coords.push({ firstPoint: { x: breakPoints[breakPoints.length - 1].x, y: breakPoints[breakPoints.length - 1].y }, secondPoint: { x: drawingCoords[drawingCoords.length - 1].x, y: drawingCoords[drawingCoords.length - 1].y }, size: 0, direction: '' });
        }
        if (furnishingPhase) {
            furniture.splice(-1, 1);
            furniture.push({ firstPoint: { x: drawingCoords[0].x, y: drawingCoords[0].y }, secondPoint: { x: breakPoints[0].x, y: breakPoints[0].y }, size: 0, direction: '' });
            for (let i = 0; i < breakPoints.length - 1; ++i) {
                furniture.push({ firstPoint: { x: breakPoints[i].x, y: breakPoints[i].y }, secondPoint: { x: breakPoints[i + 1].x, y: breakPoints[i + 1].y }, size: 0, direction: '' });
            }
            furniture.push({ firstPoint: { x: breakPoints[breakPoints.length - 1].x, y: breakPoints[breakPoints.length - 1].y }, secondPoint: { x: drawingCoords[drawingCoords.length - 1].x, y: drawingCoords[drawingCoords.length - 1].y }, size: 0, direction: '' });
        }

    }

    /* Egybeolvassza az egymás melletti "egyirányú" falakat */
    this.mergeSameDirection = function () {

        let direction;
        if (Math.abs(coords[0].firstPoint.x - coords[0].secondPoint.x) >
            Math.abs(coords[0].firstPoint.y - coords[0].secondPoint.y)) {
            direction = 'horizontal';
        } else {
            direction = 'vertical';
        }

        tmp_coords.push(coords[0]);
        for (let i = 1; i < coords.length; ++i) {
            if (Math.abs(coords[i].firstPoint.x - coords[i].secondPoint.x) >
                Math.abs(coords[i].firstPoint.y - coords[i].secondPoint.y)) {
                if (direction === 'horizontal') {
                    let maxX = Math.max(coords[i].firstPoint.x, coords[i].secondPoint.x, coords[i - 1].firstPoint.x, coords[i - 1].secondPoint.x);
                    let minX = Math.min(coords[i].firstPoint.x, coords[i].secondPoint.x, coords[i - 1].firstPoint.x, coords[i - 1].secondPoint.x);
                    coords[i - 1].firstPoint = { x: minX, y: coords[i].firstPoint.y };
                    coords[i - 1].secondPoint = { x: maxX, y: coords[i].firstPoint.y };
                    coords.splice(i, 1);
                }
                direction = 'horizontal';
            } else {
                if (direction === 'vertical') {
                    let maxY = Math.max(coords[i].firstPoint.y, coords[i].secondPoint.y, coords[i - 1].firstPoint.y, coords[i - 1].secondPoint.y);
                    let minY = Math.min(coords[i].firstPoint.y, coords[i].secondPoint.y, coords[i - 1].firstPoint.y, coords[i - 1].secondPoint.y);
                    coords[i - 1].firstPoint = { x: coords[i].firstPoint.x, y: minY };
                    coords[i - 1].secondPoint = { x: coords[i].firstPoint.x, y: maxY };
                    coords.splice(i, 1);
                }
                direction = 'vertical';
            }
        }

        if (Math.abs(coords[0].firstPoint.x - coords[0].secondPoint.x) >
            Math.abs(coords[0].firstPoint.y - coords[0].secondPoint.y)) {
            if (direction === 'horizontal') {
                let maxX = Math.max(coords[0].firstPoint.x, coords[0].secondPoint.x, coords[coords.length - 1].firstPoint.x, coords[coords.length - 1].secondPoint.x);
                let minX = Math.min(coords[0].firstPoint.x, coords[0].secondPoint.x, coords[coords.length - 1].firstPoint.x, coords[coords.length - 1].secondPoint.x);
                coords[0].firstPoint = { x: minX, y: coords[0].firstPoint.y };
                coords[0].secondPoint = { x: maxX, y: coords[0].firstPoint.y };
                coords.splice(-1, 1);
            }
        } else {
            if (direction === 'vertical') {
                let maxY = Math.max(coords[0].firstPoint.y, coords[0].secondPoint.y, coords[coords.length - 1].firstPoint.y, coords[coords.length - 1].secondPoint.y);
                let minY = Math.min(coords[0].firstPoint.y, coords[0].secondPoint.y, coords[coords.length - 1].firstPoint.y, coords[coords.length - 1].secondPoint.y);
                coords[0].firstPoint = { x: coords[0].firstPoint.x, y: minY };
                coords[0].secondPoint = { x: coords[0].firstPoint.x, y: maxY };
                coords.splice(-1, 1);
            }
        }
        console.log(coords);
    }
})();