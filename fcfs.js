const fcfs = (input) => {
    const totalBurstTime = Object.keys(input).reduce((a, b) => a + input[b].burst, 0),
        sortedProcessId = Object.keys(input).sort((p1, p2) => (input[p1].arrival - input[p2].arrival));
    let execution = {}, currentProcessId = sortedProcessId[0], t = 0, superiorOrder = [];
    while (t < totalBurstTime) {
        // execution[t] = currentProcessId;
        const currentProcess = input[currentProcessId]; // get current process config
        const timeDiff = currentProcess.arrival - t <= 0 ? t : t + (currentProcess.arrival - t);
        const duration = timeDiff + currentProcess.burst;
        // get processes that arrive between t and duration where priority is higher than the current process
        let arrivedProcesses = sortedProcessId.filter(p => (input[p].arrival > t && input[p].arrival <= t + duration) && input[p].priority < currentProcess.priority);
        
        if (arrivedProcesses.length === 0) {
            // if no superior process arrive between this timeframe, we will finish the current process first
            currentProcess.completed = true;
            t = duration;
            execution[t] = currentProcessId;
            // then find the next best process in the waiting list
            const waitingList = sortedProcessId.filter((p) => !input[p].completed);
            superiorOrder = waitingList.sort((p1, p2) => input[p1].priority - input[p2].priority);
        } else {
            // else get the process that arrived first 
            superiorOrder = arrivedProcesses;
            const diff = input[superiorOrder[0]].arrival - t;
            input[currentProcessId].burst -= diff; // update the current process burst
            t += diff;
        }

        execution[t] = currentProcessId;
        currentProcessId = superiorOrder[0];
        
      
    }
    return execution
}

// export default fcfs;
// Test input 
const input = {
    p0: {
        burst: 6,
        arrival: 0,
        priority: 3
    },
    p1: {
        burst: 4,
        arrival: 1,
        priority: 3
    },
    p2: {
        burst: 6,
        arrival: 5,
        priority: 1
    },
    p3: {
        burst: 6,
        arrival: 6,
        priority: 1
    },
    p4: {
        burst: 6,
        arrival: 7,
        priority: 5
    },
    p5: {
        burst: 6,
        arrival: 8,
        priority: 6
    },
    p6: {
        burst: 6,
        arrival: 40,
        priority: 6
    }
};

console.log(fcfs(input));

