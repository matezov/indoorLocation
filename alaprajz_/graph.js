class Graph {

    adjacencyList;
    addition;

    #vertex;

    constructor() {
        this.adjacencyList = {};
        this.addition = new Array();
        this.#vertex = 0;
    }

    addVertex(/* vertex, */ point, nearestWall) {
        this.adjacencyList[this.#vertex] = [];
        this.addition.push( {coordinate: point, nearestWall: nearestWall} );
        this.#vertex += 1;
    }

    getVertexCount() {
        return this.#vertex;
    }

    addEdge(vertex_1, vertex_2, weight) {
        this.adjacencyList[vertex_1].push({node: vertex_2, weight: weight});
        this.adjacencyList[vertex_2].push({node: vertex_1, weight: weight});
    }

    // Dijkstra algorithm
    shortest_route(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = [];
        let smallest;
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        while (nodes.values.length) {
            smallest = nodes.dequeue().value;

            if (smallest === finish) {
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }

            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    let candidate = distances[smallest] + nextNode.weight;
                    let neighborValue = nextNode.node;
                    
                    if (candidate < distances[neighborValue]) {
                        distances[neighborValue] = candidate;
                        previous[neighborValue] = smallest;
                        nodes.enqueue(neighborValue, candidate);
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    }

    getAdjacencyList() {
        return this.adjacencyList;
    }

}

class Node {
    constructor(value, priority) {
        this.value = value;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(value, priority) {
        let node = new Node(value, priority);
        this.values.push(node);

        let i = this.values.length - 1;
        const element = this.values[i];
        while (i > 0) {
            
            let p_ind = Math.floor((i - 1) / 2);
            const parent = this.values[p_ind];

            if (element.priority >= parent.priority) {
                break;
            }

            this.values[p_ind] = element;
            this.values[i] = parent;
            i = p_ind;

        }
        return this.values;
    }

    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        console.log(end);

        if (this.values.length > 0) {
            this.values[0] = end;

            let i = 0;
            const lenght = this.values.length;
            const element = this.values[0];

            while (true) {
                let left_ind = 2 * i + 1;
                let right_ind = 2 * i + 2;
                let left_child;
                let right_child;
                let swap = null;

                if (left_ind < lenght) {
                    left_child = this.values[left_ind];
                    if (left_child.priority < element.priority) {
                        swap = left_ind;
                    }
                }

                if (right_ind < lenght) {
                    right_child = this.values[right_ind];
                    if ((swap === null && right_child.priority < element.priority) || (swap !== null && right_child.priority < left_child.priority)) {
                        swap = right_ind;
                    }
                }

                if (swap === null) {
                    break;
                }

                this.values[i] = this.values[swap];
                this.values[swap] = element;
                i = swap;
            }
        }
        return min;
    }
}