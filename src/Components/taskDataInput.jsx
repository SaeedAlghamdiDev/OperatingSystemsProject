import { useEffect } from "react";
import { useState } from "react";

function TaskDataInput(props) {


        const [arrivalTime, setArrivalTime] = useState(0);
        const [burstTime, setBurstTime] = useState(0);
        const [quantumTime, setQuantumTime] = useState(0);

        const handleArrivalTimeChange = (event) => {

                setArrivalTime(parseInt(event.target.value));

        }
        const handleBurstTimeChange = (event) => {

                setBurstTime(parseInt(event.target.value));

        }
        const handleQuantumTimeChange = (event) => {

                setQuantumTime(parseInt(event.target.value));

        }

        let taskObject = { id: props.name, AT: arrivalTime }

        return (<>
                <div>
                        Task: {props.name} <input type="number" value={arrivalTime} onChange={handleArrivalTimeChange} ></input>
                        <input type="number" value={burstTime} onChange={handleBurstTimeChange} ></input>
                        {props.quantum == true ? <input type="number" value={quantumTime} onChange={handleQuantumTimeChange} ></input> : null}
                </div>
        </>);
}

export default TaskDataInput