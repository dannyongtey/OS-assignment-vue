const fcfs = (originalInput) => {
    const input = Object.keys({...originalInput}).reduce((result, p) => {
        if ( originalInput[p].burst > 0 ) result[p] = originalInput[p];
        return result;
    }, {});
    const sortedProcessId = Object.keys(input).sort((p1, p2) => (input[p1].arrival - input[p2].arrival));
    let execution = {}, currentProcessId = sortedProcessId[0], t = 0, superiorOrder = [];
    while (true) {
        const isCompleted = Object.keys(input).length === Object.keys(input).filter(a => input[a].completed).length;
        if ( isCompleted ) break;
        const currentProcess = input[currentProcessId]; // get current process config
        const timeDiff = currentProcess.arrival - t <= 0 ? t : t + (currentProcess.arrival - t);
        const duration = timeDiff + currentProcess.burst;
        // get processes that arrive between t and duration where priority is higher than the current process
        let arrivedProcesses = sortedProcessId.filter(p => (input[p].arrival > t && input[p].arrival <= t + duration) && input[p].priority < currentProcess.priority);
        if ( currentProcess.arrival > t ) {
            t = currentProcess.arrival;
            execution[t] = null;
        } else { 
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
    }
    // console.log("FCFS >> ", execution)
    return execution
    
}
// // export default fcfs;
// // // Test input 
// const input2 = {
//     p0 : {
//         burst: 5,
//         arrival: 1,
//         priority: 0
//     },
//     p1 : {
//         burst: 6,
//         arrival: 5,
//         priority: 0
//     },
//     p2 : {
//         burst: 7,
//         arrival: 200,
//         priority: 0
//     }
// }
// const input = {
//     p0: {
//         burst: 6,
//         arrival: 0,
//         priority: 3
//     },
//     p1: {
//         burst: 4,
//         arrival: 1,
//         priority: 3
//     },
//     p2: {
//         burst: 6,
//         arrival: 5,
//         priority: 1
//     },
//     p3: {
//         burst: 6,
//         arrival: 6,
//         priority: 1
//     },
//     p4: {
//         burst: 6,
//         arrival: 7,
//         priority: 5
//     },
//     p5: {
//         burst: 6,
//         arrival: 8,
//         priority: 6
//     }
// };

// console.log(fcfs(input2));

export default fcfs