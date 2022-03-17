function setPOS(position) {
    let index = 0;
    let distance1 = Math.sqrt(Math.pow(position.x - plan.routes.edges[0].from.x, 2) + Math.pow(position.y - plan.routes.edges[0].from.y, 2))
    let distance2 = Math.sqrt(Math.pow(position.x - plan.routes.edges[0].to.x, 2) + Math.pow(position.y - plan.routes.edges[0].to.y, 2))
    for (let i = 1; i < plan.routes.edges.length; ++i) {
        let distance1_tmp = Math.sqrt(Math.pow(position.x - plan.routes.edges[i].from.x, 2) + Math.pow(position.y - plan.routes.edges[i].from.y, 2))
        let distance2_tmp = Math.sqrt(Math.pow(position.x - plan.routes.edges[i].to.x, 2) + Math.pow(position.y - plan.routes.edges[i].to.y, 2))
        if (distance1_tmp + distance2_tmp < distance1 + distance2) {
            distance1 = distance1_tmp;
            distance1 = distance2_tmp;
            index = i;
        }
    }

    if (Math.abs(plan.routes.edges[index].from.x - plan.routes.edges[index].to.x) < 
        Math.abs(plan.routes.edges[index].from.y - plan.routes.edges[index].to.y)) {
            
            if (plan.routes.edges[index].from.y < plan.routes.edges[index].to.y) {
                if (position.y < plan.routes.edges[index].from.y) {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: plan.routes.edges[index].from.y};
                } else if (position.y > plan.routes.edges[index].to.y) {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: plan.routes.edges[index].to.y};
                } else {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: position.y};
                }
            } else {
                if (position.y < plan.routes.edges[index].to.y) {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: plan.routes.edges[index].to.y};
                } else if (position.y > plan.routes.edges[index].from.y) {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: plan.routes.edges[index].from.y};
                } else {
                    pos = {x: (plan.routes.edges[index].from.x + plan.routes.edges[index].to.x) / 2,
                        y: position.y};
                }
            }

    } else {

        if (plan.routes.edges[index].from.x < plan.routes.edges[index].to.x) {
            if (position.x < plan.routes.edges[index].from.x) {
                pos = {x: plan.routes.edges[index].from.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            } else if (position.x > plan.routes.edges[index].to.x) {
                pos = {x: plan.routes.edges[index].to.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            } else {
                pos = {x: position.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            }
        } else {
            if (position.x < plan.routes.edges[index].to.x) {
                pos = {x: plan.routes.edges[index].to.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            } else if (position.x > plan.routes.edges[index].from.x) {
                pos = {x: plan.routes.edges[index].from.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            } else {
                pos = {x: position.x,
                    y: (plan.routes.edges[index].from.y + plan.routes.edges[index].to.y) / 2};
            }
        }
    }
}