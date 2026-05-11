import { memo, useState } from "react";

function MemAllocation() {


    const [memorySlots, setMemorySlots] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [slotSize, setSlotSize] = useState(100);
    const [processSize, setProcessSize] = useState(100);
    const [processPairs, setProcessPairs] = useState([]);


    const handleSlotSize = (event) => {

        setSlotSize(event.target.value)
        // if (event.target.value == 1){
        //     setSlotSize(100)}
        // if(event.target.value == slotSize - 1){
        //     setSlotSize(slotSize-100);
        // }
        // if(event.target.value == slotSize + 1){
        //     setSlotSize(slotSize+100);
        // }


    }

    const handleProcessSize = (event) => {

        setProcessSize(event.target.value)
    }

    const addSlot = () => {
        setMemorySlots([...memorySlots, slotSize]);

    }
    const addProcess = () => {
        setProcesses([...processes, processSize]);

    }

    const firstFit = () => {

        

        for (let i = 0; i < processes.length; i++) {

            

            
                for(let j = 0; j < memorySlots.length; j++){
                    if (memorySlots.at(j) >= processes.at(i)){
                        setProcessPairs([...processPairs, {Process: i+1, Slot: j+1}])
                        
                        


                    } 

                    
                }
                
                
            
            console.log(processPairs)


        }
    }



    return (<>
        <div>
            <label>Insert Slot Slizes for your memory </label>

            <input type="number" value={slotSize} min={100} max={1000} step={100} onChange={handleSlotSize}></input>
            <button onClick={addSlot}>Add Slot</button>
        </div>
        <div>
            <label>Insert Processes </label>
            <input type="number" value={processSize} min={100} max={1000} step={100} onChange={handleProcessSize}></input>
            <button onClick={addProcess}>Add Process</button>
        </div>
        <ul>
            {memorySlots.map((slots, index) => <li key={index}> Slot {index + 1}: {memorySlots.at(index)}KB</li>)}
        </ul>
        <ul>
            {processes.map((slots, index) => <li key={index}> Process {index + 1}: {processes.at(index)}KB</li>)}
        </ul>

        <div className="memory-block">hi</div>

        <button onClick={firstFit}>First-Fit</button> <button>Best-fit</button> <button>Worst-fit</button>
        
        <ul>
            {processPairs.map((slots, index) => <li key={index}> Slot {index + 1}: Process:{processPairs.at(index).Process}</li>)}
        </ul>

    </>);
}

export default MemAllocation