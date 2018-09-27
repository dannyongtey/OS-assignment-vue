const srtn = rawInput => {
	console.log("SRTN-input", rawInput);
	var input = cleanseInput(rawInput);
	if(Object.keys(input).length === 0) return {};

	var sequenceStack = objectToSequenceStack(input);
	var checkingPurposeStack = objectToSequenceStack(input);
	console.log(sequenceStack);
	var waitingStack = [];
	var processSequence = {};

	var currentProcess = sequenceStack.pop();
	var currentStartTime = input[currentProcess].arrival;
	var nextProcess = sequenceStack[sequenceStack.length - 1];
	
	var k=0;
	while(true) {
		if(interruptWhileProcessing(input[currentProcess], input[nextProcess], currentStartTime) && sequenceStack.length > 0) {
			var currentProcessRemainingBurstTime = input[currentProcess].burst - (input[nextProcess].arrival - currentStartTime)

			if(input[nextProcess].burst < currentProcessRemainingBurstTime || (input[nextProcess].burst === currentProcessRemainingBurstTime && input[nextProcess].priority < input[currentProcess].priority)) {
				input[currentProcess].burst = currentProcessRemainingBurstTime;
				
				// Push current process into waiting queue
				waitingStack.push(currentProcess);

				// Find all same arrival time process and push into waiting stack
				var sameArrivalTimeArray = sameArrivalTime(input, sequenceStack);
				sameArrivalTimeArray.forEach(key => {
					if(key !== nextProcess) {
						waitingStack.push(key);
					}
				});

				// Remove the next process from sequenceStack and add into Process Sequence
				var previousProcess = currentProcess;
				currentProcess = nextProcess;
				sequenceStack = popCorrentElement(sequenceStack, nextProcess);
				waitingStack = popCorrentElement(waitingStack, nextProcess);
				currentStartTime = input[currentProcess].arrival;
				processSequence[currentStartTime] = previousProcess;	
				

				// Remove all same interval process from sequenceStack
				for(var i=0; i<sameArrivalTimeArray.length-1; i++) {
					sequenceStack.pop()
				}
				
				// console.log(waitingStack);
				// console.log(processSequence);
			}
			else {
				var sameArrivalTimeArray = sameArrivalTime(input, sequenceStack);
				sameArrivalTimeArray.forEach(key => {
					sequenceStack = popCorrentElement(sequenceStack, key);
					waitingStack = popCorrentElement(waitingStack, nextProcess);
					waitingStack.push(key);
				});
				
				// console.log(waitingStack);
				// console.log(processSequence);
			}
		}
		else {
			if(input[nextProcess].arrival - (currentStartTime + input[currentProcess].burst) > 0 && waitingStack.length === 0) {
				if(input[currentProcess].burst !== 0){
					processSequence[currentStartTime + input[currentProcess].burst] = currentProcess;
				}
				
				processSequence[input[nextProcess].arrival] = null;

				currentProcess = nextProcess;
				sequenceStack = popCorrentElement(sequenceStack, nextProcess);
				waitingStack = popCorrentElement(waitingStack, nextProcess);
				currentStartTime = input[currentProcess].arrival;
			}
			else if(input[nextProcess].arrival - (currentStartTime + input[currentProcess].burst) > 0 && waitingStack.length > 0) {
				currentStartTime = currentStartTime + input[currentProcess].burst;
				processSequence[currentStartTime] = currentProcess;

				currentProcess = waitingStackUpcomingProcess(input, waitingStack);
				waitingStack = popCorrentElement(waitingStack, currentProcess);
			}
			else {
				currentStartTime = currentStartTime + input[currentProcess].burst;
				processSequence[currentStartTime] = currentProcess;

				waitingStack.push(nextProcess);

				currentProcess = waitingStackUpcomingProcess(input, waitingStack);
				sequenceStack = popCorrentElement(sequenceStack, currentProcess);
				waitingStack = popCorrentElement(waitingStack, currentProcess);
			}
		}

		if(sequenceStack.length > 0) {
			nextProcess = sequenceStack[sequenceStack.length - 1];
		}
		else if(waitingStack.length > 0) {
			nextProcess = waitingStackUpcomingProcess(input, waitingStack);
		}
		else {
			if(input[currentProcess].burst === 0) {
				processSequence[currentStartTime] = null
			}
			else {
				processSequence[input[currentProcess].burst + currentStartTime] = currentProcess;
			}
			break;
		}
		
		
		// console.log('--------');
		// console.log(sequenceStack);
		// console.log(waitingStack);
		// console.log(currentProcess);
		// console.log(nextProcess);
		// console.log(input);
		// console.log(processSequence);
		// console.log('--------');
		//break;

	}

	checkFirstArrivalProcess(input[checkingPurposeStack.pop()], processSequence);
	console.log("SRTN", processSequence);
	return processSequence;
};

export default srtn;

const checkFirstArrivalProcess = (firstElement, processSequence) => {
	if(firstElement.arrival !== 0) {
		processSequence[firstElement.arrival] = null;
	}

	return processSequence;
}

const popCorrentElement = (array, element) => {
	/*waitingStack.forEach((e, index) => {
		if(element === e) {
			var temp = e;
			waitingStack.splice(index, 1);
			//return e;
		}
	});

	sequenceStack.forEach((e, index) => {
		if(element === e) {
			var temp = e;
			sequenceStack.splice(index, 1);
			//return e;
		}
	});*/
	
	return array.filter(e => e !== element);
}

const removeArrayElement = (array, deleteElement) => {
	let temp = array;
	temp.forEach((element, index) => {
		if(element === deleteElement) {
			array.splice(index, 1);
		}
	});

	return array;
}

// Check which should be pop when
const waitingStackUpcomingProcess = (input, waitingStack) => {
	var upcomingKey = waitingStack[0];
	waitingStack.forEach(key => {
		if(compareProcess(input[upcomingKey], input[key]) === -1) {
			upcomingKey = key;
		}
	})

	return upcomingKey;
}

// All process with same arrival time
const sameArrivalTime = (input, sequenceStack) => {
	var processFirst = sequenceStack[sequenceStack.length - 1];
	var sameArrivalTimeArray = [];

	sequenceStack.forEach(key => {
		if(input[key].arrival === input[processFirst].arrival) {
			sameArrivalTimeArray.push(key);
		}
	});

	return sameArrivalTimeArray;
};

// Check if there is process coming in when one process is executing
const interruptWhileProcessing = (current, next, currentStartTime) => {
	if(next.arrival < (current.burst + currentStartTime)) {
		return true;
	}
	else {
		return false;
	}
};

// Determine 2 processes which one should execute first (based on burst time then priority)
// Return 1 if first process is greater
const compareProcess = (firstProcess, secondProcess) => {
	if (firstProcess.burst === secondProcess.burst) {
		if(firstProcess.priority === secondProcess.priority) {
			return 1;
		}
		else if(firstProcess.priority < secondProcess.priority) {
			return 1;
		}
		else {
			return -1;
		}
	}
	else if(firstProcess.burst < secondProcess.burst) {
		return 1;
	}
	else {
		return -1;
	}
};

const objectToSequenceStack = input => {
	var result = Object.keys(input).map(key => {
		return [key, input[key].arrival, input[key].burst, input[key].priority];
	});

	var queuedArray = result.sort((a, b) => {
		if(a[1] === b[1]) {
			if(a[2] === b[2]) {
				return a[3] - b[3]
			}
			return a[2] - b[2];
		}
		return a[1] - b[1];
	});

	var sequence = queuedArray.map(item => {
		return item[0];
	})

	return sequence.reverse();
};

const cleanseInput = input => {
	Object.keys(input).map(key => {
		if (input[key].burst === 0) {
			delete input[key]
		}
	})

	return input;
}
