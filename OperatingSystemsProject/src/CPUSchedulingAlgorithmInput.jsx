import TaskDataInput from "./taskDataInput.jsx";
import {useEffect} from "react";
import {useState} from "react";

function CPUSchedulingAlgorithmInput(){
    

    const [numberOfTasks, setNumberOfTasks] = useState(0);

    const handleTasksChange = (event) => {
        
        //if statment makes sure value isnt less than 0
        if(event.target.value < 0){
            setNumberOfTasks(0);
        } else {
            setNumberOfTasks(parseInt(event.target.value));
        }
        
        
    }

    //Building an array of <TaskDataInputs>
    const items = [];
    for(let i = 1; i < numberOfTasks + 1; i++){
        items.push(<TaskDataInput name = {i} quantum = {true}/>)
    }
    

    

    return(<>

        <div>
        <p>How many tasks will the CPU handle? 
             <input type="number" value={numberOfTasks} onChange={handleTasksChange}></input>
        </p>
        </div>

        <p>
        

        {items}

        </p>
        
        

    </>)

}

export default CPUSchedulingAlgorithmInput