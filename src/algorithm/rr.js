// let procObj = 
// {
//     P0: {
//         arrival: 9,
//         burst: 6,
//         priority: 3,
//     },
//     P1: {
//         arrival: 1,
//         burst: 4,
//         priority: 3,
//     },
//     P2: {
//         arrival: 18,
//         burst: 6,
//         priority: 1,
//     },
//     P3: {
//         arrival: 6,
//         burst: 6,
//         priority: 1,
//     },
//     P4: {
//         arrival: 7,
//         burst: 6,
//         priority: 5,
//     },
//     P5: {
//         arrival: 8,
//         burst: 6,
//         priority: 6,
//     },
// }
// console.log(computeRR(procObj))
export default function computeRR(procObj){
    // console.log(procObj)
    const QUANTUM = 2
    let results = {}
    // Entry time extraction
    let entryTime = {}
    let priorityList = {}
    Object.keys(procObj).forEach((key) => {
        // Obtain list of arriving process priorities
        const arrival = procObj[key].arrival
        const priority = procObj[key].priority
        if (entryTime[arrival] == undefined){
            entryTime[arrival] = []
        }
        entryTime[arrival].push(priority)
        // Obtain list of processes sorted by their priorities
        if (priorityList[priority] == undefined){
            priorityList[priority] = {}
            priorityList[priority].current = 0
            priorityList[priority].processes = []
        }
        priorityList[priority].processes.push(key)
        priorityList[priority].processes.sort((a,b)=>{
            if (procObj[a].arrival < procObj[b].arrival){
                return -1
            } else if (procObj[a].arrival > procObj[b].arrival) {
                return 1
            } else {
                return 0
            }
        })
    })
    let runningPriorities = []
    // Sort by ascending time
    let enterTime = Object.keys(entryTime).sort((a,b) => {
        return parseInt(a) > parseInt(b)
    })
    let currentTime = parseInt(enterTime[0])
    if (currentTime != 0){
        results[currentTime] = null
    }
    // console.log(enterTime)
    let done = false
    for (let i = 0; i < enterTime.length; i++){
        const curEntry = enterTime[i]
        // The priority groups included in the current time frame
        runningPriorities.push(...entryTime[curEntry])
        if (parseInt(curEntry) < currentTime && i !== enterTime.length - 1){
            continue
        }
        // console.log(runningPriorities)
        // Find the one with the highest priority
        let highest = Math.min.apply(Math, runningPriorities).toString()
        let firstProcTime, lastProcTime
        while (true){ // This loop will execute RR for the same priority process, and then proceed with the lower priority until the next process comes in
            // console.log(priorityList)
            const priorityLength = priorityList[highest].processes.length
            // Set current running process, at the end will increment. Current process is key
            let index = priorityList[highest].current % priorityLength
            let proc = priorityList[highest].processes[index]
            // Take note of the first and last process in the group to determine if the priority group can continually execute.
            if (index == 0){
                firstProcTime = currentTime
            }
            if (index == priorityLength-1){
                lastProcTime = currentTime
            }
            // Is it the process' turn to execute?
            if (procObj[proc].arrival <= currentTime && procObj[proc].burst > 0){
                // Execute the process, decrease the burst time and increase the current time
                let blockSize = procObj[proc].burst >= QUANTUM? QUANTUM : procObj[proc].burst
                procObj[proc].burst -= blockSize
                currentTime += blockSize
                results[currentTime] = proc
            }
            // Regardless of execution success or not, add current. This line is the key to round robin execution
            priorityList[highest].current++
            // Has all entry time been processed? And if not, should we pay attention to next entry time?
            if (enterTime[i+1] !== undefined && currentTime >= parseInt(enterTime[i+1])){
                break
            }
            // Has the priority group finished running?
            if (firstProcTime == currentTime && lastProcTime == currentTime){
                // If it has, switch to the next lower priority group to execute
                let tempPriorities = runningPriorities.filter(e => e > highest)
                highest = Math.min.apply(Math, tempPriorities).toString()
                lastProcTime = -1
                // If all priority groups have executed. Check, if there is process waiting to enter?
                if (tempPriorities.length == 0 && enterTime[i+1] === undefined) { // Break if not
                    done = true
                    break
                }
                if (tempPriorities.length == 0){ // Jump to next priority if have
                    currentTime = parseInt(enterTime[i+1])
                    results[currentTime] = null
                    break
                }
            }
            if (done){
                break
            }
        }
        if (done){
            break
        }
    } 
    return results
}
