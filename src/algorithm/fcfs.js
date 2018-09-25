const fcfs = (input) => {
    const totalBurstTime = Object.keys(input).reduce((a, b) => a + input[b].burst, 0),
        sortedProcessId = Object.keys(input).sort((p1, p2) => (input[p1].arrival - input[p2].arrival));
    let execution = {}, currentProcessId = sortedProcessId[0], t = 0;
    while (t < totalBurstTime) {
        const currentProcess = input[currentProcessId]; // get current process config
        const duration = t + currentProcess.burst;
        // get processes that arrive between t and duration where priority is higher than the current process
        let arrivedProcesses = sortedProcessId.filter(p => (input[p].arrival > t && input[p].arrival <= t + duration) && input[p].priority < currentProcess.priority);
        
        if (arrivedProcesses.length === 0) {
            // if no superior process arrive between this timeframe, we will finish the current process first
            currentProcess.completed = true;
            t = duration;
            // then find the next best process in the waiting list
            const waitingList = sortedProcessId.filter((p) => !input[p].completed);
            const superior = waitingList.sort((p1, p2) => input[p1].priority - input[p2].priority);
            if ( superior[0] ) currentProcessId = superior[0];
        } else {
            // else get the process that arrived first 
            const superior = arrivedProcesses[0];
            const diff = input[superior].arrival - t;
            input[currentProcessId].burst -= diff; // update the current process burst
            t += diff;
            currentProcessId = superior;
        }
        execution[t] = currentProcessId;
    }
    return execution
}
export default fcfs;
// // Test input 
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


