import TaskDataInput from "./taskDataInput.jsx";
import {useEffect} from "react";
import {useState} from "react";

function CPUSchedulingAlgorithmInput(){
    

    const [numberOfTasks, setNumberOfTasks] = useState(0);
    const [listOfTasks, setListOfTasks] = useState([]);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(0);
    const [quantumTime, setQuantumTime] = useState(0);

    let quantum = true;


    const addTask = () => {

        let newTask = null;
        quantum?  newTask = {TaskArrivalTime: arrivalTime,
                                  TaskBurstTime:burstTime,
                                  TaskQuantumTime:quantumTime}
                                  :
                  newTask = {TaskArrivalTime: arrivalTime,
                                  TaskBurstTime:burstTime};

        setListOfTasks(l => [...l, newTask]);

        


        
    }


    const removeTask = (index) =>{

        setListOfTasks(l => l.filter((_, i) => i !== index));
    }
    const handleArrivalTimeChange = (event) => {
            
            setArrivalTime(parseInt(event.target.value));
            
    }
    const handleBurstTimeChange = (event) => {
            
            setBurstTime(parseInt(event.target.value));
            
    }
    const handleQuantumTimeChange = (event) => {
            
            setQuantumTime(parseInt(event.target.value));
            
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
        <uo>
            {listOfTasks.map((listOfTasks, index)=>
                 <li key={index} onClick={() => removeTask(index)}>
                     Task: {index + 1} Arrival Time: {listOfTasks.TaskArrivalTime}s Burst Time: {listOfTasks.TaskBurstTime}s  </li>)}
        </uo>

    </div>


    <div>
        {/* <button onClick={CalculateRequest}>Calculate</button> */}
    </div>

        

    </>)

}

export default CPUSchedulingAlgorithmInput