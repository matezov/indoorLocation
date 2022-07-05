class Navigation {
    
    constructor(room) {
        this.room               = room;                             // Graph obj.
        this.pos                = new Positioning(room);
        this.route              = undefined;                        // legrövidebb út tömbje
        this.distance           = undefined;                        // távolság a pozíciónk és a cél között
        this.destination        = undefined;                        // célállomás
        this.estimatedPosition  = undefined;                        // becsült pozíció az útra
        this.followingPoint     = undefined;                        // követi a becsült pontot
        this.nextTurn           = undefined;                        // következő kanyar iránya
        this.interval           = undefined;                        // milyen időközönként lépkedjen          
        this.nextTurnDistance   = undefined;                        // következő kanyar távolsága
    }

    /* navigálás */
    navigate() {
        let nearestRoutes = this.nearestRoutesFromBeacon(this.pos.nearestBeacon);
        if (nearestRoutes.length == 0) {
            this.findShortestRoute(this.pos.nearestBeacon.position, this.destination);
            return;
        }
        this.estimatedPosition = this.nearestToPosition(nearestRoutes);
        if (this.followingPoint == undefined) {
            this.followingPoint = this.estimatedPosition;
        }
        this.getRemainingDistance();
        this.nextTurn = this.declareNextTurn();
    }

    /* frissíti a this.nextTurnDistance-t, azaz a kiszámolja milyen messze van a következő kanyar */        // TESZT OK
    getNextTurnDistance(fromIndex, turnIndex) {
        let distance = 0;

        for (let i = fromIndex; i <= turnIndex; ++i) {
            distance += this.room.getDistance(this.route.coords[i], this.route.coords[i + 1])
        }

        this.nextTurnDistance = distance / this.pos.scale;
    }

    /* Visszaadja, hogy melyik két index között van a pozíció a this.route -ban */               // TESZT OK
    betweenVertexes(position) {
        let index = 0;
        let closest = this.route.coords[0];
        let closestDistance = this.room.getDistance(this.route.coords[0], position);

        for (let i = 1; i < this.route.coords.length; ++i) {
            let closestDistance_temp = this.room.getDistance(this.route.coords[i], position);
            if (closestDistance_temp < closestDistance) {
                index = i;
                closest = this.route.coords[i];
                closestDistance = closestDistance_temp;
            }
        }

        let index2;

        if (index == 0) {
            index2 = index + 1;
        } else if (index == this.route.coords.length - 1) {
            index2 = index - 1;
        } else {
            let before = this.route.coords[index - 1];
            let after = this.route.coords[index + 1];

            let beforeDirection = this.room.getDirection({firstPoint: before, secondPoint: closest});
            let afterDirection = this.room.getDirection({firstPoint: closest, secondPoint: after});

            if (beforeDirection == afterDirection) {
                if (beforeDirection == Direction.horizontal.get()) {
                    if (before.x < after.x) {
                        if (closest.x < position.x) {
                            index2 = index + 1;
                        } else if (closest.x == position.x) {
                            index2 = index + 1;
                        } else {
                            index2 = index - 1;
                        }
                    } else {
                        if (closest.x < position.x) {
                            index2 = index - 1;
                        } else if (closest.x == position.x) {
                            index2 = index + 1;
                        } else {
                            index2 = index + 1;
                        }
                    }
                } else {
                    if (before.y < after.y) {
                        if (closest.y < position.y) {
                            index2 = index + 1;
                        } else if (closest.y == position.y) {
                            index2 = index + 1;
                        } else {
                            index2 = index - 1;
                        }
                    } else {
                        if (closest.y < position.y) {
                            index2 = index - 1;
                        } else if (closest.y == position.y) {
                            index2 = index + 1;
                        } else {
                            index2 = index + 1;
                        }
                    }
                }
            } else {

                let bminX = Math.min(before.x, closest.x);
                let bmaxX = Math.max(before.x, closest.x);
                let bminY = Math.min(before.y, closest.y);
                let bmaxY = Math.max(before.y, closest.y);

                let inBefArea = false;

                if (position.x <= bmaxX && position.x >= bminX && position.y <= bmaxY && position.y >= bminY) {
                    inBefArea = true;
                }

                let aminX = Math.min(after.x, closest.x);
                let amaxX = Math.max(after.x, closest.x);
                let aminY = Math.min(after.y, closest.y);
                let amaxY = Math.max(after.y, closest.y);

                let inAftArea = false;

                if (position.x <= amaxX && position.x >= aminX && position.y <= amaxY && position.y >= aminY) {
                    inAftArea = true;
                }
                
                if (inBefArea && !inAftArea) {
                    index2 = index - 1;
                } else if (!inBefArea && inAftArea) {
                    index2 = index + 1;
                } else {
                    index2 = index + 1;
                }

            }
        }

        return index < index2 ? {a: index, b: index2} : {a: index2, b: index};

    }

    /* Visszaadja, hogy az adott indexű kanyarnál balra vagy jobbra kell majd következőleg fordulni */      // TESZT OK
    turnWhere(index) {
        if (this.room.getDirection({firstPoint: this.route.coords[index - 1], secondPoint: this.route.coords[index]}) == Direction.vertical.get()) {
            let befDir = this.route.coords[index - 1].y < this.route.coords[index].y ? 'down' : 'up';
            let aftDir = this.route.coords[index].x < this.route.coords[index + 1].x ? 'right' : 'left';
            if (befDir == 'down' && aftDir == 'right') {
                return 'left';
            } else if (befDir == 'down' && aftDir == 'left') {
                return 'right';
            } else if (befDir == 'up' && aftDir == 'right') {
                return 'right';
            } else {
                return 'left';
            }

        } else {
            let befDir = this.route.coords[index - 1].x < this.route.coords[index].x ? 'right' : 'left';
            let aftDir = this.route.coords[index].y < this.route.coords[index + 1].y ? 'down' : 'up';
            if (befDir == 'right' && aftDir == 'down') {
                return 'right';
            } else if (befDir == 'right' && aftDir == 'up') {
                return 'left';
            } else if (befDir == 'left' && aftDir == 'down') {
                return 'left';
            } else {
                return 'right';
            }
        }
    }

    /* Visszaadja, hogy balra vagy jobbra kell majd következőleg fordulni */                                // TESZT OK
    declareNextTurn() {

        let between = this.betweenVertexes(this.estimatedPosition);
        let direction = this.room.getDirection({firstPoint: this.route.coords[between.a], secondPoint: this.route.coords[between.b]});

        let foundCurve = false;
        let i = between.a;
        while (!foundCurve && i < this.route.coords.length - 1) {
            if (direction != this.room.getDirection({firstPoint: this.route.coords[i], secondPoint: this.route.coords[i + 1]})) {
                foundCurve = true;
                let turn = this.turnWhere(i);
                this.getNextTurnDistance(between.a, i);
                return turn;
            }
            ++i;
        }

        return 'none';
    }

    

    goForward(followingBetween) {
        let direction = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a], secondPoint: this.route.coords[followingBetween.b]});

            if (direction == 'vertical') {
                if (/* this.followingPoint.y */ this.route.coords[followingBetween.a].y < this.route.coords[followingBetween.b].y) {
                    if (this.followingPoint.y < this.route.coords[followingBetween.b].y) {
                        this.followingPoint.y += 1;
                        let step = Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y);
                        if (this.followingPoint.x < this.route.coords[followingBetween.b].x) {
                            this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x) / step;
                        } else if (this.followingPoint.x > this.route.coords[followingBetween.b].x) {
                            this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x) / step;
                        } 
                    } else {
                        let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.b + 1]});
    
                        if (direction2 == 'vertical') {
                            if (this.route.coords[followingBetween.b].y < this.route.coords[followingBetween.b + 1].y) {
                                this.followingPoint.y += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            } else {
                                this.followingPoint.y -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            }
                        } else {
                            if (this.route.coords[followingBetween.b].x < this.route.coords[followingBetween.b + 1].x) {
                                this.followingPoint.x += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            } else {
                                this.followingPoint.x -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            }
                        }
                    }
                    
                } else if (/* this.followingPoint.y */ this.route.coords[followingBetween.a].y > this.route.coords[followingBetween.b].y) {
                    if (this.followingPoint.y > this.route.coords[followingBetween.b].y) {
                        this.followingPoint.y -= 1;
                        let step = Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y);
                        if (this.followingPoint.x < this.route.coords[followingBetween.b].x) {
                            this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x) / step;
                        } else if (this.followingPoint.x > this.route.coords[followingBetween.b].x) {
                            this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x) / step;
                        }
                    } else {
                        let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.b + 1]});
    
                        if (direction2 == 'vertical') {
                            if (this.route.coords[followingBetween.b].y < this.route.coords[followingBetween.b + 1].y) {
                                this.followingPoint.y += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            } else {
                                this.followingPoint.y -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            }
                        } else {
                            if (this.route.coords[followingBetween.b].x < this.route.coords[followingBetween.b + 1].x) {
                                this.followingPoint.x += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            } else {
                                this.followingPoint.x -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            }
                        }
                    }
                }
            } else {
                if (/* this.followingPoint.x */ this.route.coords[followingBetween.a].x < this.route.coords[followingBetween.b].x) {
                    if (this.followingPoint.x < this.route.coords[followingBetween.b].x) {
                        this.followingPoint.x += 1;
                        let step = Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x);
                        if (this.followingPoint.y < this.route.coords[followingBetween.b].y) {
                            this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y) / step;
                        } else if (this.followingPoint.y > this.route.coords[followingBetween.b].y) {
                            this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y) / step;
                        } 
                    } else {
                        let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.b + 1]});
    
                        if (direction2 == 'vertical') {
                            if (this.route.coords[followingBetween.b].y < this.route.coords[followingBetween.b + 1].y) {
                                this.followingPoint.y += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            } else {
                                this.followingPoint.y -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            }
                        } else {
                            if (this.route.coords[followingBetween.b].x < this.route.coords[followingBetween.b + 1].x) {
                                this.followingPoint.x += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            } else {
                                this.followingPoint.x -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            }
                        }
                    }
                    
                } else if (/* this.followingPoint.x */ this.route.coords[followingBetween.a].x > this.route.coords[followingBetween.b].x) {
                    if (this.followingPoint.x > this.route.coords[followingBetween.b].x) {
                        this.followingPoint.x -= 1;
                        let step = Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.b].x);
                        if (this.followingPoint.y < this.route.coords[followingBetween.b].y) {
                            this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y) / step;
                        } else if (this.followingPoint.y > this.route.coords[followingBetween.b].y) {
                            this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.b].y) / step;
                        }
                    } else {
                        let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.b + 1]});
    
                        if (direction2 == 'vertical') {
                            if (this.route.coords[followingBetween.b].y < this.route.coords[followingBetween.b + 1].y) {
                                this.followingPoint.y += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            } else {
                                this.followingPoint.y -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y);
                                if (this.followingPoint.x < this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                } else if (this.followingPoint.x > this.route.coords[followingBetween.b + 1].x) {
                                    this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x) / step2;
                                }
                            }
                        } else {
                            if (this.route.coords[followingBetween.b].x < this.route.coords[followingBetween.b + 1].x) {
                                this.followingPoint.x += 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            } else {
                                this.followingPoint.x -= 1;
                                let step2 = Math.abs(this.route.coords[followingBetween.b + 1].x - this.route.coords[followingBetween.b].x);
                                if (this.followingPoint.y < this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                } else if (this.followingPoint.y > this.route.coords[followingBetween.b + 1].y) {
                                    this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b + 1].y - this.route.coords[followingBetween.b].y) / step2;
                                }
                            }
                        }
                    }
                }
            }
    }

    goBackward(followingBetween) {
        let direction = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.a]});
        let step;
        if (direction == 'vertical') {
            step = Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.a].y);
            if (this.route.coords[followingBetween.b].y < this.route.coords[followingBetween.a].y) {
                if (this.followingPoint.y < this.route.coords[followingBetween.a].y) {
                    this.followingPoint.y += 1;
                
                    if (this.followingPoint.x < this.route.coords[followingBetween.a].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.a].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.a].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.a].x) / step;
                    }
                } else {
                    let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a - 1], secondPoint: this.route.coords[followingBetween.a]});

                    if (direction2 == 'vertical') {
                        if (this.route.coords[followingBetween.a].y < this.route.coords[followingBetween.a - 1].y) {
                            this.followingPoint.y += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        } else {
                            this.followingPoint.y -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        }
                    } else {
                        if (this.route.coords[followingBetween.a].x < this.route.coords[followingBetween.a - 1].x) {
                            this.followingPoint.x += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        } else {
                            this.followingPoint.x -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        }
                    }
                }
            } else if (this.route.coords[followingBetween.b].y > this.route.coords[followingBetween.a].y) {
                if (this.followingPoint.y > this.route.coords[followingBetween.a].y) {
                    this.followingPoint.y -= 1;

                    if (this.followingPoint.x < this.route.coords[followingBetween.a].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.a].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.a].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.a].x) / step;
                    }
                } else {
                    let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a - 1], secondPoint: this.route.coords[followingBetween.a]});

                    if (direction2 == 'vertical') {
                        if (this.route.coords[followingBetween.a].y < this.route.coords[followingBetween.a - 1].y) {
                            this.followingPoint.y += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        } else {
                            this.followingPoint.y -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        }
                    } else {
                        if (this.route.coords[followingBetween.a].x < this.route.coords[followingBetween.a - 1].x) {
                            this.followingPoint.x += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        } else {
                            this.followingPoint.x -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        }
                    }
                }
            }
        } else {
            step = Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.a].x);
            if (this.route.coords[followingBetween.b].x < this.route.coords[followingBetween.a].x) {
                if (this.followingPoint.x < this.route.coords[followingBetween.a].x) {
                    this.followingPoint.x += 1;
                    
                    if (this.followingPoint.y < this.route.coords[followingBetween.a].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.a].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.a].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.a].y) / step;
                    }
                } else {
                    let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a - 1], secondPoint: this.route.coords[followingBetween.a]});

                    if (direction2 == 'vertical') {
                        if (this.route.coords[followingBetween.a].y < this.route.coords[followingBetween.a - 1].y) {
                            this.followingPoint.y += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        } else {
                            this.followingPoint.y -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        }
                    } else {
                        if (this.route.coords[followingBetween.a].x < this.route.coords[followingBetween.a - 1].x) {
                            this.followingPoint.x += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        } else {
                            this.followingPoint.x -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        }
                    }
                }
                
            } else if ( this.route.coords[followingBetween.b].x > this.route.coords[followingBetween.a].x) {

                if (this.followingPoint.x > this.route.coords[followingBetween.a].x) {
                    this.followingPoint.x -= 1;
                
                    if (this.followingPoint.y < this.route.coords[followingBetween.a].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.a].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.a].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.a].y) / step;
                    } 
                } else {
                    let direction2 = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a - 1], secondPoint: this.route.coords[followingBetween.a]});

                    if (direction2 == 'vertical') {
                        if (this.route.coords[followingBetween.a].y < this.route.coords[followingBetween.a - 1].y) {
                            this.followingPoint.y += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        } else {
                            this.followingPoint.y -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y);
                            if (this.followingPoint.x < this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            } else if (this.followingPoint.x > this.route.coords[followingBetween.a - 1].x) {
                                this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x) / step2;
                            }
                        }
                    } else {
                        if (this.route.coords[followingBetween.a].x < this.route.coords[followingBetween.a - 1].x) {
                            this.followingPoint.x += 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        } else {
                            this.followingPoint.x -= 1;
                            let step2 = Math.abs(this.route.coords[followingBetween.a - 1].x - this.route.coords[followingBetween.a].x);
                            if (this.followingPoint.y < this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            } else if (this.followingPoint.y > this.route.coords[followingBetween.a - 1].y) {
                                this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a - 1].y - this.route.coords[followingBetween.a].y) / step2;
                            }
                        }
                    }
                }
            }
        }
    }
    
    goToEstimation() {
        if (this.estimatedPosition.x > this.followingPoint.x - 5 && this.estimatedPosition.x < this.followingPoint.x + 5 &&
            this.estimatedPosition.y > this.followingPoint.y - 5 && this.estimatedPosition.y < this.followingPoint.y + 5) {
            return;
        }

        let direction = this.room.getDirection({ firstPoint: this.route.coords[between.a], secondPoint: this.route.coords[between.b]});

        if (direction == 'vertical') {
            if (this.estimatedPosition.y > this.followingPoint.y) {
                this.followingPoint.y += 1;
                let step = Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y);
                if (this.followingPoint.x < this.route.coords[between.b].x) {
                    this.followingPoint.x += Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                } else if (this.followingPoint.x > this.route.coords[between.b].x) {
                    this.followingPoint.x -= Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                }
            } else if (this.estimatedPosition.y < this.followingPoint.y) {
                this.followingPoint.y -= 1;
                let step = Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y);
                if (this.followingPoint.x < this.route.coords[between.b].x) {
                    this.followingPoint.x += Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                } else if (this.followingPoint.x > this.route.coords[between.b].x) {
                    this.followingPoint.x -= Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                }
            }
        } else {                
            if (this.estimatedPosition.x > this.followingPoint.x) {
                this.followingPoint.x += 1;
                let step = Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x);
                if (this.followingPoint.y < this.route.coords[between.b].y) {
                    this.followingPoint.y += Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                } else if (this.followingPoint.y > this.route.coords[between.b].y) {
                    this.followingPoint.y -= Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                }
            } else if (this.estimatedPosition.x < this.followingPoint.x) {
                this.followingPoint.x -= 1;
                let step = Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x);
                if (this.followingPoint.y < this.route.coords[between.b].y) {
                    this.followingPoint.y += Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                } else if (this.followingPoint.y > this.route.coords[between.b].y) {
                    this.followingPoint.y -= Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                }
            }
        }
    }

    /* Követi a becsült pozíciót */                 // TESZT OK
    follow() {

        let estimatedBetween = this.betweenVertexes(this.estimatedPosition);
        let followingBetween = this.betweenVertexes(this.followingPoint);

        if (estimatedBetween.a > followingBetween.a) {
            this.goForward(followingBetween);
        } else if (estimatedBetween.b < followingBetween.b) {
            this.goBackward(followingBetween);
        } else if (estimatedBetween.a == followingBetween.a && estimatedBetween.b == followingBetween.b) {
            this.goToEstimation();
        }
    }

    /* Követi a becsült pozíciót */                 // TESZT OK
/*     follow() {
        if (this.estimatedPosition.x > this.followingPoint.x - 5 && this.estimatedPosition.x < this.followingPoint.x + 5 &&
            this.estimatedPosition.y > this.followingPoint.y - 5 && this.estimatedPosition.y < this.followingPoint.y + 5) {
            return;
        }

        let between = this.betweenVertexes(this.estimatedPosition);
        let followingBetween = this.betweenVertexes(this.followingPoint);

        console.log('between');
        console.log(between);
        console.log('followingBetween');
        console.log(followingBetween);

        if (between.a > followingBetween.a) {
            let direction = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.a], secondPoint: this.route.coords[followingBetween.a + 1]});

            if (direction == 'vertical') {
                if (this.followingPoint.y < this.route.coords[followingBetween.a + 1].y) {
                    this.followingPoint.y += 1;
                    let step = Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y);
                    if (this.followingPoint.x < this.route.coords[followingBetween.a + 1].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.a + 1].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x) / step;
                    }
                } else if (this.followingPoint.y > this.route.coords[followingBetween.a + 1].y) {
                    this.followingPoint.y -= 1;
                    let step = Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y);
                    if (this.followingPoint.x < this.route.coords[followingBetween.a + 1].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.a + 1].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x) / step;
                    }
                }
                
            } else {
                if (this.followingPoint.x < this.route.coords[followingBetween.a + 1].x) {
                    this.followingPoint.x += 1;
                    let step = Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x);
                    if (this.followingPoint.y < this.route.coords[followingBetween.a + 1].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.a + 1].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y) / step;
                    }
                } else if (this.followingPoint.x > this.route.coords[followingBetween.a + 1].x) {
                    this.followingPoint.x -= 1;
                    let step = Math.abs(this.route.coords[followingBetween.a].x - this.route.coords[followingBetween.a + 1].x);
                    if (this.followingPoint.y < this.route.coords[followingBetween.a + 1].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.a + 1].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.a].y - this.route.coords[followingBetween.a + 1].y) / step;
                    }
                }
                
            }

        } else if (between.b < followingBetween.b) {
            let direction = this.room.getDirection({ firstPoint: this.route.coords[followingBetween.b], secondPoint: this.route.coords[followingBetween.b - 1]});

            if (direction == 'vertical') {
                if (this.followingPoint.y < this.route.coords[followingBetween.b - 1].y) {
                    this.followingPoint.y += 1;
                    let step = Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y);
                    if (this.followingPoint.x < this.route.coords[followingBetween.b - 1].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.b - 1].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x) / step;
                    }
                } else if (this.followingPoint.y > this.route.coords[followingBetween.b - 1].y) {
                    this.followingPoint.y -= 1;
                    let step = Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y);
                    if (this.followingPoint.x < this.route.coords[followingBetween.b - 1].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[followingBetween.b - 1].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x) / step;
                    }
                }
                
            } else {
                if (this.followingPoint.x < this.route.coords[followingBetween.b - 1].x) {
                    this.followingPoint.x += 1;
                    let step = Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x);
                    if (this.followingPoint.y < this.route.coords[followingBetween.b - 1].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.b - 1].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y) / step;
                    }
                } else if (this.followingPoint.x > this.route.coords[followingBetween.b - 1].x) {
                    this.followingPoint.x -= 1;
                    let step = Math.abs(this.route.coords[followingBetween.b].x - this.route.coords[followingBetween.b - 1].x);
                    if (this.followingPoint.y < this.route.coords[followingBetween.b - 1].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[followingBetween.b - 1].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[followingBetween.b].y - this.route.coords[followingBetween.b - 1].y) / step;
                    }
                }
            }
        } else if (between.a == followingBetween.a && between.b == followingBetween.b) {
            let direction = this.room.getDirection({ firstPoint: this.route.coords[between.a], secondPoint: this.route.coords[between.b]});

            if (direction == 'vertical') {
                if (this.estimatedPosition.y > this.followingPoint.y) {
                    this.followingPoint.y += 1;
                    let step = Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y);
                    if (this.followingPoint.x < this.route.coords[between.b].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[between.b].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                    }
                } else if (this.estimatedPosition.y < this.followingPoint.y) {
                    this.followingPoint.y -= 1;
                    let step = Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y);
                    if (this.followingPoint.x < this.route.coords[between.b].x) {
                        this.followingPoint.x += Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                    } else if (this.followingPoint.x > this.route.coords[between.b].x) {
                        this.followingPoint.x -= Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x) / step;
                    }
                }
            } else {                
                if (this.estimatedPosition.x > this.followingPoint.x) {
                    this.followingPoint.x += 1;
                    let step = Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x);
                    if (this.followingPoint.y < this.route.coords[between.b].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[between.b].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                    }
                } else if (this.estimatedPosition.x < this.followingPoint.x) {
                    this.followingPoint.x -= 1;
                    let step = Math.abs(this.route.coords[between.a].x - this.route.coords[between.b].x);
                    if (this.followingPoint.y < this.route.coords[between.b].y) {
                        this.followingPoint.y += Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                    } else if (this.followingPoint.y > this.route.coords[between.b].y) {
                        this.followingPoint.y -= Math.abs(this.route.coords[between.a].y - this.route.coords[between.b].y) / step;
                    }
                }
            }
        }
    } */

    /* Visszaadja a legközelebbi utat azokból az utakból, amelyek benne vannak a legközelebbi jeladó hatókörében */
    nearestToPosition(nearestRoutes) {
        if (nearestRoutes.length <= 0) { return; }
        let min = nearestRoutes[0];
        let minIndex = 0;
        let distance = this.room.getDistance(nearestRoutes[0], this.pos.position);

        for (let i = 1; i < nearestRoutes.length; ++i) {
            let distance_temp = this.room.getDistance(nearestRoutes[i], this.pos.position); 
            if (distance_temp < distance) {
                distance = distance_temp;
                min = nearestRoutes[i];
                minIndex = i;
            }
        }
        
        return min;
    }

    /* Visszaadja a legközelebbi jeladónak a x * y méter területű hatókörét  */
    areaFromNearestBeacon() {
        let minX, maxX, minY, maxY;
        switch (this.pos.nearestBeacon.direction) {
            case 'North':
                    minX = this.pos.nearestBeacon.position.x - 6 * this.pos.scale;
                    maxX = this.pos.nearestBeacon.position.x + 6 * this.pos.scale;
                    minY = this.pos.nearestBeacon.position.y - 6 * this.pos.scale;      // elol
                    maxY = this.pos.nearestBeacon.position.y;
                break;
            case 'East':
                    minX = this.pos.nearestBeacon.position.x;
                    maxX = this.pos.nearestBeacon.position.x + 6 * this.pos.scale;      // elol
                    minY = this.pos.nearestBeacon.position.y - 6 * this.pos.scale;
                    maxY = this.pos.nearestBeacon.position.y + 6 * this.pos.scale;
                break;
            case 'South':
                    minX = this.pos.nearestBeacon.position.x - 6 * this.pos.scale;
                    maxX = this.pos.nearestBeacon.position.x + 6 * this.pos.scale;
                    minY = this.pos.nearestBeacon.position.y;
                    maxY = this.pos.nearestBeacon.position.y + 6 * this.pos.scale;      // elol
                break;
            case 'West':
                    minX = this.pos.nearestBeacon.position.x - 6 * this.pos.scale;      // elol
                    maxX = this.pos.nearestBeacon.position.x;
                    minY = this.pos.nearestBeacon.position.y - 6 * this.pos.scale;
                    maxY = this.pos.nearestBeacon.position.y + 6 * this.pos.scale;
                break;
        }

        let return_array = [{firstPoint: new Point(minX, minY), secondPoint: new Point(minX, maxY)},
                            {firstPoint: new Point(minX, maxY), secondPoint: new Point(maxX, maxY)},
                            {firstPoint: new Point(maxX, maxY), secondPoint: new Point(maxX, minY)},
                            {firstPoint: new Point(maxX, minY), secondPoint: new Point(minX, minY)}];
        
        return return_array;
        /* return {firstPoint: new Point(minX, minY), secondPoint: new Point(maxX, maxY)}; */
    }

    /* Frissíti a jeladókból kapott adatokat */                                             // TESZT OK     
    setRSSI(name, rssi, txPower, position) {
        let positions = this.pos.getBeaconData(name, rssi, txPower, position);
    
        let avg_x = 0;
        let avg_y = 0;
    
        let c_ = 0;
    
        for (let i = 0; i < positions.length; ++i) {
            if (positions[i].x != NaN && positions[i].y != NaN) {
                avg_x += positions[i].x;
                avg_y += positions[i].y;
                ++c_;
            }
        }
    
        if (c_ != 0) {
            let tempPoint = new Point((avg_x / c_), (avg_y / c_));
            if (room.inObject(tempPoint, room.walls)) {
                pos = new Point((avg_x / c_), (avg_y / c_));
            }   
        }
    }

    /* Visszaadja az x méteren belül található legközelebbi utakat a jeladóhoz */           // TESZT OK
    nearestRoutesFromBeacon(beacon) {
        let routes = [];
        let first = false;
        let last = 1;
        for (let i = 0; i < this.route.coords.length; ++i) {
            if (this.inBeaconRange(beacon, this.route.coords[i]) && this.pos.getDistance(this.route.coords[i], beacon.position) / this.pos.scale < 2) {        // hány méter legyen?
                if (!first && i > 0) {
                    //routes.push(this.route.vertexes[i - 1]);
                    routes.push(this.route.coords[i - 1]);
                    first = true;
                } else {
                    first = true;
                }
                //routes.push(this.route.vertexes[i]);
                routes.push(this.route.coords[i]);
            }
            if (first) {
                last += 1;
            } else {
                last = i;
            }
        }
        if (last + 1 < this.route.coords.length) {
            //routes.push(this.route.vertexes[last + 1]);
            routes.push(this.route.coords[last + 1]);
        }
        return routes;
    }

    /* Visszaadja, hogy az adott csúcs arra van-e, amerre a jeladó "néz" */                 // TESZT OK
    inBeaconRange(beacon, vertex) {
        switch (beacon.direction) {
            case 'North':
                    if (beacon.position.y >= vertex.y ) {
                        return true;
                    }
                break;
            case 'East':
                    if (beacon.position.x >= vertex.x ) {
                        return true;
                    }
                break;
            case 'South':
                    if (beacon.position.y <= vertex.y ) {
                        return true;
                    }
                break;
            case 'West':
                    if (beacon.position.x <= vertex.x ) {
                        return true;
                    }
                break;
        }

        return false;
    }

    /* Visszaadja a hátralévű út távolságát méterben */                     // TESZT OK
    getRemainingDistance() {
        if (this.route.coords.length <= 0 || this.route == undefined) return;
        let closest = this.route.coords[0];
        let closeset_distance = this.pos.getDistance(closest, this.pos);
        let closest_index = 0;
        for (let i = 1; i < this.route.coords.length; ++i) {
            let closeset_distance_tmp = this.pos.getDistance(this.route.coords[i], this.pos);
            if (closeset_distance > closeset_distance_tmp) {
                closeset_distance = closeset_distance_tmp;
                closest = this.route.coords[i];
                closest_index = i;
            }
        }

        let remainingDistance = 0;
        for (let i = closest_index; i < this.route.coords.length - 1; ++i) {
            remainingDistance += this.pos.getDistance(this.route.coords[i], this.route.coords[i + 1]);
        }

        this.distance = remainingDistance / this.pos.scale;

        return this.distance;
    }

    /* UJRATERVEZESHEZ */       // KELL?
    thereIsRoute() {
        for (let i = 0; i < this.route.coords.length; ++i) {
            if (this.room.inObject(this.route.coords[i], this.areaFromNearestBeacon())) {
                return true;
            }
        }
        return false;
    }
    
    /* Megkeresi két pont közötti legrövidebb utat */                       // TESZT OK
    findShortestRoute(start, end) {
        if (this.room.graph.addition.length <= 0) return null;
        let min_start = this.pos.getDistance(start, {x: this.room.graph.addition[0].coordinate.x, y: this.room.graph.addition[0].coordinate.y});
        let min_start_index = 0;
        let min_dest = this.pos.getDistance(end, {x: this.room.graph.addition[0].coordinate.x, y: this.room.graph.addition[0].coordinate.y});
        let min_dest_index = 0;
        for (let i = 1; i < this.room.graph.addition.length; ++i) {
            if (this.pos.getDistance(start, {x: this.room.graph.addition[i].coordinate.x, y: this.room.graph.addition[i].coordinate.y}) < min_start) {
                min_start = this.pos.getDistance(start, {x: this.room.graph.addition[i].coordinate.x, y: this.room.graph.addition[i].coordinate.y});
                min_start_index = i;
            }
            if (this.pos.getDistance(end, {x: this.room.graph.addition[i].coordinate.x, y: this.room.graph.addition[i].coordinate.y}) < min_dest) {
                min_dest = this.pos.getDistance(end, {x: this.room.graph.addition[i].coordinate.x, y: this.room.graph.addition[i].coordinate.y});
                min_dest_index = i;
            }
        }
        let shortestRoute = this.room.graph.shortestRoute(min_start_index.toString(), min_dest_index.toString());

        let sr = {vertexes: shortestRoute, coords: Array(shortestRoute.length)};
        for (let i = 0; i < this.room.graph.addition.length; ++i) {
            for (let j = 0; j < shortestRoute.length; ++j) {
                if (i.toString() === shortestRoute[j]) {
                    sr.coords[j] = {x: this.room.graph.addition[i].coordinate.x, y: this.room.graph.addition[i].coordinate.y};
                }
            }
        }
        this.route = sr;
    }
}