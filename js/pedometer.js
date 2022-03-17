class Vector3d {

    Vector3d(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalized() {
        length = this.magnitude();
        return (Math.abs(length) > Number.EPSILON) ? Vector3d(this.x / length, this.y / length, this.z / length) : this;
    }

    normalize() {
        length = this.magnitude();
        if (Math.abs(length) > Number.EPSILON) {
            this /= length;
        }
        return this;
    }

    isNull() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    crossProduct(v1, v2) {
        return Vector3d(v1.y * v2.z - v1.z * v2.y,
                        v1.z * v2.x - v1.x * v2.z, 
                        v1.x * v2.y - v1.y * v2.x);
    }

    dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    multiplication(multiplier) {
        this.x *= multiplier;
        this.y *= multiplier;
        this.z *= multiplier;
        return this;
    }

    division(divisor) {
        this.x /= divisor;
        this.y /= divisor;
        this.z /= divisor;
    }

    addition(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }


    subtraction(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }


}

class SensorMeasurment {
    SensorMeasurment() {
        this.ts = -1;
        this.values = [];
    }
}

class Step {
    Step(stepTs, stepLength) {
        this.ts = stepTs;
        this.value = stepLength;
    }
}

class Magnitude {
    Magnitude(msrTs, magnitudeValue) {
        this.ts = msrTs;
        this.values = magnitudeValue;
    }
}

class Deque {
    constructor() {
        this.data = {}; // Or Array, but that really does not add anything useful
        this.front = 0;
        this.back = 1;
        this.size = 0;
    }
    addFront(value) {
        if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
        this.size++;
        this.front = (this.front + 1) % Number.MAX_SAFE_INTEGER;
        this.data[this.front] = value;
    }
    removeFront() {
        if (!this.size) return;
        let value = this.peekFront();
        this.size--;
        delete this.data[this.front];
        this.front = (this.front || Number.MAX_SAFE_INTEGER) - 1;
        return value;
    }
    peekFront() { 
        if (this.size) return this.data[this.front];
    }
    addBack(value) {
        if (this.size >= Number.MAX_SAFE_INTEGER) throw "Deque capacity overflow";
        this.size++;
        this.back = (this.back || Number.MAX_SAFE_INTEGER) - 1;
        this.data[this.back] = value;
    }
    removeBack() {
        if (!this.size) return;
        let value = this.peekBack();
        this.size--;
        delete this.data[this.back];
        this.back = (this.back + 1) % Number.MAX_SAFE_INTEGER;
        return value;
    }
    peekBack() { 
        if (this.size) return this.data[this.back];
    }
}



class Pedometer {

    #AVERAGING_TIME_INTERVAL_MS      = 2500;           // Time interval on which we calculate averaged filtered magnitude in order to align it relative to zero value
    #FILTER_TIME_INTERVAL_MS         = 200;            // Filtered acc measurements are calculated as average over this time interval

    #UPDATE_TIME_INTERVAL_MS         = 700;            // The time interval(in millisec) on which we update accelMax, Min, threshold
    #MIN_TIME_BETWEEN_STEPS_MS       = 300;            // We cut off possible steps if time between them is less then this thresh

    #STEP_LENGTH_CONST               = 0.52;           // Constant using in algorithm which is responisble for step length calculation
    #MINIMAL_THRESHOLD_VALUE         = 0.05 * 9.80665; // Empirical threshold values from article p.888

    #MINIMAL_NUMBER_OF_STEPS         = 5;              // First N steps in which we accumulate data about average step time
    #MAXIMUM_NUMBER_OF_STEPS         = 50;             // Maximum number of steps to make an assumption about average step time
    #MAX_STEP_TIME                   = 2000;

    #mAccelMeasurements;
    #mFilteredAccMagnitudes;
    #mTimes; 

    #mMagnitudeSize  = 0;
    #mPossibleSteps  = -1;
    #mStepTime       = -1;
    #mIsStep         = false;

    Pedometer() { 
        this.#mAccelMeasurements = new Deque();
        this.#mFilteredAccMagnitudes = new Deque();
        this.#mTimes = new Deque(); 
    }

    update(msrs) {
        this.#mMagnitudeSize = Math.max(this.#mFilteredAccMagnitudes.size, 1);

        msrs.forEach(msr => {
            this.#mAccelMeasurements.addBack(msr);
            magn = this.calculateFilteredAccMagnitudes();

            if (magn.tsr != 0) {
                this.#mFilteredAccMagnitudes.addBack(magn);
            }

            while (this.#mAccelMeasurements.peekBack().ts - this.#mAccelMeasurements.peekFront().ts > 2 * this.#AVERAGING_TIME_INTERVAL_MS
                    && this.#mAccelMeasurements.size > 0) {

                        this.#mAccelMeasurements.removeFront();
            }

        });
    }

    calculateFilteredAccMagnitudes() {
        lastMeasTs = this.#mAccelMeasurements.peekBack().ts;

        lBorderAverIt = this.#mAccelMeasurements.peekFront();
        lbacIdx = 0;

        for (mam in this.#mAccelMeasurements.data) {
            if (lastMeasTs - mam.ts >= this.#AVERAGING_TIME_INTERVAL_MS) {
                lBorderAverIt = mam;
                lbacIdx += 1;
                break; 
            }
        }

        let averMagnitude = 0;
        let nMeasAverage = 0;
        let flag = 0;
        for (deq_ in this.#mAccelMeasurements.data) {
            if (deq == lBorderAverIt) {
                flag = 1;
            }
            if (flag == 1) {
                averMagnitude += deq_;
                nMeasAverage += 1;
            }
        }
        averMagnitude = averMagnitude / nMeasAverage;

        /* ----------------- */

        lBorderFilterIt = this.#mAccelMeasurements.peekFront();
        lbfcIdx = 0;
        for (mam in this.#mAccelMeasurements.data) {
            if (lastMeasTs - mam.ts >= this.#FILTER_TIME_INTERVAL_MS) {
                lBorderFilterIt = mam;
                lbfcIdx += 1;
                break;
            }
        }

        let filterMagnitude = 0;
        let nMeasFiltered = 0;
        let flag = 0;
        for (deq_ in this.#mAccelMeasurements.data) {
            if (deq == lBorderFilterIt) {
                flag = 1;
            }
            if (flag == 1) {
                filterMagnitude += deq_;
                nMeasFiltered += 1;
            }
        }
        filterMagnitude = filterMagnitude / nMeasFiltered;

        if (nMeasAverage == 0 || nMeasFiltered == 0) {
            return new Magnitude(0, 0);
        }

        filterMagnitude /= nMeasFiltered;
        averMagnitude   += filterMagnitude; // For correct processing at the very beginning
        averMagnitude   /= nMeasAverage;
        filterMagnitude -= averMagnitude;

        return new Magnitude(lastMeasTs, filterMagnitude);
        
    }

    calculateSteps() {
        let steps = new Deque();
        if (this.#mFilteredAccMagnitudes.size() <= 3) return steps;

        let averageStepTime = 0;

        let distance = 0;
        for (deq_ in this.#mTimes.data) {
            distance += 1;
        }

        let nSteps = Math.max(distance, 1);

        if (nSteps >= this.#MINIMAL_NUMBER_OF_STEPS) {
            let accumulate = 0;
            countAccumulate_ = 0;
            for (deq_ in this.#mTimes.data) {
                accumulate += deq;
                countAccumulate_ += 1;
            }
            accumulate = accumulate / countAccumulate_;
        }

        averageStepTime /= nSteps;

        let timeBetweenSteps = Math.max(1.0 * this.#MIN_TIME_BETWEEN_STEPS_MS, 0.6 * averageStepTime);

        for (let i = this.#mMagnitudeSize; i < this.#mFilteredAccMagnitudes.size; ++i) {
            let curAcc = this.#mFilteredAccMagnitudes.data[i];
            let prevAcc = this.#mFilteredAccMagnitudes.data[i - 1];

            if (!this.#mIsStep &&
                prevAcc.value < this.#MINIMAL_THRESHOLD_VALUE &&
                curAcc.value > this.#MINIMAL_THRESHOLD_VALUE &&
                curAcc.ts - mPossibleStepTs > this.#MIN_TIME_BETWEEN_STEPS_MS &&
                timeBetweenSteps > 0) {
                    mIsStep = true;
                    mPossibleStepTs = curAcc.ts;
            }

            if (this.#mIsStep) {
                let stepLength = this.calculateStepLength(this.#UPDATE_TIME_INTERVAL_MS, this.#mFilteredAccMagnitudes.peekFront() + i);
                if (mPossibleStepTs - this.#mStepTime < this.#MAX_STEP_TIME) {
                    this.#mTimes.addBack(mPossibleStepTs - this.#mStepTime);
                }
                steps.addBack(new Step(mPossibleStepTs, stepLength));
                this.#mStepTime = mPossibleStepTs;
                this.#mIsStep = false;
            }
        }

        while (this.#mFilteredAccMagnitudes.peekBack().ts - this.#mFilteredAccMagnitudes.peekFront().ts > 2 * this.#UPDATE_TIME_INTERVAL_MS) {
            this.#mFilteredAccMagnitudes.removeFront();
        }

        while (this.#mTimes.size > this.#MAXIMUM_NUMBER_OF_STEPS) {
            this.#mTimes.removeFront();
        }

        return steps;
    }

    calculateStepLength(timeIntervalMs, rightBorderIt) {
        leftBorderIt = rightBorderIt;
        for (let i = this.#mFilteredAccMagnitudes.size - 1; i >= 0; --i) {
            if (rightBorderIt.ts - leftBorderIt.ts <= timeIntervalMs && leftBorderIt != this.#mFilteredAccMagnitudes.peekFront()) {
                leftBorderIt = this.#mFilteredAccMagnitudes.data[i - 1];
                break; 
            }
        }

        let maxMagn = this.#mFilteredAccMagnitudes.peekFront();
        let minMagn = this.#mFilteredAccMagnitudes.peekFront();

        for (let i = 0; i < this.#mFilteredAccMagnitudes.size; ++i) {
            if (this.#mFilteredAccMagnitudes.data[i] > maxMagn) {
                maxMagn = this.#mFilteredAccMagnitudes.data[i];
            }
            if (this.#mFilteredAccMagnitudes.data[i] < minMagn) {
                minMagn = this.#mFilteredAccMagnitudes.data[i];
            }
        }

        let accAmplitude = maxMagn - minMagn;
        let stepLength = this.#STEP_LENGTH_CONST * Math.sqrt(Math.sqrt(accAmplitude));

        return stepLength;
    }
}

