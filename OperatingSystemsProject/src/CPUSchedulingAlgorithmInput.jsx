import TaskDataInput from "./taskDataInput.jsx";
import {useEffect} from "react";
import {useState} from "react";

function CPUSchedulingAlgorithmInput(){
    

    // const [numberOfTasks, setNumberOfTasks] = useState(0);
    const [listOfTasks, setListOfTasks] = useState([]);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(0);
    const [quantumTime, setQuantumTime] = useState(0);
    const [taskData, setTaskData] = useState([]);

    let quantum = false;
    

    const addTask = () => {

        let newTask = null;
        quantum?  newTask = {     TaskName: listOfTasks.length,
                                  TaskArrivalTime: arrivalTime,
                                  TaskBurstTime:burstTime,
                                  TaskQuantumTime:quantumTime}
                                  :
                  newTask = {
                                  TaskName: listOfTasks.length,
                                  TaskArrivalTime: arrivalTime,
                                  TaskBurstTime:burstTime};

        setListOfTasks(l => [...l, newTask]);

        


        
    }


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
    }

    function whoIsShortest(tempTasks){

        let time = 99999999;
        let taskIndex;
        for (let i = 0; i < tempTasks.length; i++){

            if (tempTasks.at(i).TaskBurstTime < first){

                time = tempTasks.at(i).TaskBurstTime;
                taskIndex = i;

            }

            
        }

        return taskIndex;
    }

    
    const calculateFCFS = () => {
        
        let tempTaskData = [];            //Processed task data that gets moved to global Task Data
        let tempTasks = [...listOfTasks]; //an array to hold data without changing the original
        let totalTime = 0;
        let currentIndex;
        
        let averageWaitTime = 0;
        

        while(tempTasks.length > 0){
        currentIndex = whoCameFirst(tempTasks);
        
        if (tempTasks.at(currentIndex).TaskArrivalTime > totalTime) {    //This lets totalTime take idle time into account.
             totalTime = tempTasks.at(currentIndex).TaskArrivalTime;
                }
             totalTime += tempTasks.at(currentIndex).TaskBurstTime;

        tempTaskData.push({taskIndex: tempTasks.at(currentIndex).TaskName,
                       arrivalTime: tempTasks.at(currentIndex).TaskArrivalTime,
                       finishTime: totalTime,
                       startTime: totalTime - tempTasks.at(currentIndex).TaskBurstTime,
                       waitTime: totalTime - tempTasks.at(currentIndex).TaskBurstTime - tempTasks.at(currentIndex).TaskArrivalTime,
                       turnAroundTime: totalTime - tempTasks.at(currentIndex).TaskArrivalTime})
        tempTasks.splice(currentIndex, 1);
        }



        for (let i = 0; i < tempTaskData.length; i++){
            averageWaitTime += tempTaskData.at(i).waitTime/tempTaskData.length;
        }
        alert("Average Wait Time: " + averageWaitTime);
        setTaskData(tempTaskData);
        
        


        



        
        
        

    }
    

    const removeTask = (index) =>{

        setListOfTasks(l => l.filter((_, i) => i !== index));
    }
    const handleArrivalTimeChange = (event) => {
            
        if(event.target.value < 0){
            setArrivalTime(0);
        } else if (event.target.value > 1000) {
            setArrivalTime(1000);
        } 
        else {
            setArrivalTime(parseInt(event.target.value));
        }
            
            
    }
    const handleBurstTimeChange = (event) => {
            

        if(event.target.value < 1){
            setBurstTime(1);
        } else if (event.target.value > 1000) {
            setBurstTime(1000);
        } 
        else {
            setBurstTime(parseInt(event.target.value));
        }
            
            
    }
    const handleQuantumTimeChange = (event) => {
            
        if(event.target.value < 0){
            setQuantumTime(0);
        } else if (event.target.value > 1000) {
            setQuantumTime(1000);
        } 
        else {
            setQuantumTime(parseInt(event.target.value));
        }
            
            
    }

    const handleListOfTasks= () => {

        setListOfTasks("");

    }

    const handleTasksChange = (event) => {
        
        //if statment makes sure value isnt less than 0
        if(event.target.value < 0){
            setNumberOfTasks(0);
        } else {
            setNumberOfTasks(parseInt(event.target.value));
        }
        
        
    }

    //Building an array of <TaskDataInputs>
    // const items = [];
    // for(let i = 1; i < numberOfTasks + 1; i++){
    //     items.push(<TaskDataInput name = {i} quantum = {true}/>)
    // }

    
    

    

    return(<>

        <div>
     <input type="number" value={arrivalTime} onChange={handleArrivalTimeChange} ></input>
                       <input type="number" value={burstTime} onChange={handleBurstTimeChange} ></input>
                       {quantum == true? <input type="number" value={quantumTime} onChange={handleQuantumTimeChange} ></input>: null}
    
    <button onClick={addTask}>Add Task</button>
    </div>
        
        <div>Added Tasks: <br/>
        <ul>
            {listOfTasks.map((listOfTasks, index)=>
                 <li key={index} onClick={() => removeTask(index)}>
                     Task: {index + 1} Arrival Time: {listOfTasks.TaskArrivalTime}s Burst Time: {listOfTasks.TaskBurstTime}s  </li>)}
        </ul>

    </div>


    <div>
        <button onClick={calculateFCFS}>Calculate</button>
    </div>


                
                  <div>Task Wait Times:
                    <ul>
                        {taskData.map((taskData, index) => <li key ={index} >
                            Task {taskData.taskIndex + 1}, Arrival Time: {taskData.arrivalTime}s, Start Time: {taskData.startTime}s, Finish Time: {taskData.finishTime}s, Wait Time: {taskData.waitTime}s, Turn-Around Time: {taskData.turnAroundTime}s
                        </li>)} <br/> 
                    </ul>
                  </div>
        

    </>)
}

export default CPUSchedulingAlgorithmInput