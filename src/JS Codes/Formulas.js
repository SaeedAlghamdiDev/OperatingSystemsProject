 function whoCameFirst(tempTasks){ //Function to determine who goes first 

        let first = 99999999;
        let taskIndex;
        for (let i = 0; i < tempTasks.length; i++){

            if (tempTasks.at(i).TaskArrivalTime < first){

                first = tempTasks.at(i).TaskArrivalTime;
                taskIndex = i;

            }

            
        }

        return taskIndex;
    };

function whoIsShortest(tempTasks, totalTime){

        let time = 99999999;
        let taskIndex;
        for (let i = 0; i < tempTasks.length; i++){

            if (tempTasks.at(i).TaskBurstTime < time && totalTime >= tempTasks.at(i).TaskArrivalTime){

                time = tempTasks.at(i).TaskBurstTime;
                taskIndex = i;

            }

            
        }

        return taskIndex;
    }
    
    export {whoCameFirst, whoIsShortest};