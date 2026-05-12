import TaskDataInput from "./taskDataInput.jsx";
import GanttChart from "./GanttChart.jsx";
import { useEffect } from "react";
import { useState } from "react";
import * as utils from '../JS Codes/Formulas.js';
import './CPUScheduling.css';

function CPUSchedulingAlgorithmInput() {

    const [listOfTasks, setListOfTasks] = useState([]);
    const [arrivalTime, setArrivalTime] = useState(0);
    const [burstTime, setBurstTime] = useState(1);
    const [quantumTime, setQuantumTime] = useState(1);

    // IMPORTANT:
    // taskData can now be:
    // - array (FCFS / SJF / SRTF)
    // - object with summary + timeline (RR)
    const [taskData, setTaskData] = useState([]);

    const [averageWaitTime, setAverageWaitTime] = useState(0);
    const [averageTurnAroundTime, setAverageTurnAroundTime] = useState(0);
    const [currentAlgorithm, setCurrentAlgorithm] = useState('');

    const addTask = () => {

        let newTask = {
            TaskName: listOfTasks.length,
            TaskArrivalTime: arrivalTime,
            TaskBurstTime: burstTime
        };

        setListOfTasks(l => [...l, newTask]);
    }

    function calculateSRTF() {

        let tempTaskData = [];

        let tempTasks = listOfTasks.map(t => ({
            ...t,
            remainingTime: t.TaskBurstTime,
            finishTime: 0
        }));

        let totalTime = 0;
        let completedTasks = 0;
        let n = tempTasks.length;

        let averageWaitTime = 0;
        let averageTurnAroundTime = 0;

        let currentIndex;

        while (completedTasks < n) {

            currentIndex = -1;
            let shortest = 99999999;

            for (let i = 0; i < tempTasks.length; i++) {

                if (
                    tempTasks[i].remainingTime > 0 &&
                    tempTasks[i].TaskArrivalTime <= totalTime &&
                    tempTasks[i].remainingTime < shortest
                ) {
                    shortest = tempTasks[i].remainingTime;
                    currentIndex = i;
                }
            }

            if (currentIndex === -1) {
                totalTime++;
                continue;
            }

            tempTasks[currentIndex].remainingTime--;
            totalTime++;

            if (tempTasks[currentIndex].remainingTime === 0) {

                tempTasks[currentIndex].finishTime = totalTime;

                tempTaskData.push({
                    taskIndex: tempTasks[currentIndex].TaskName,
                    arrivalTime: tempTasks[currentIndex].TaskArrivalTime,
                    burstTime: tempTasks[currentIndex].TaskBurstTime,
                    startTime:
                        totalTime -
                        tempTasks[currentIndex].TaskBurstTime,
                    finishTime: totalTime,
                    turnAroundTime:
                        totalTime -
                        tempTasks[currentIndex].TaskArrivalTime,
                    waitTime:
                        totalTime -
                        tempTasks[currentIndex].TaskBurstTime -
                        tempTasks[currentIndex].TaskArrivalTime
                });

                completedTasks++;
            }
        }

        for (let i = 0; i < tempTaskData.length; i++) {

            averageWaitTime += tempTaskData[i].waitTime / n;

            averageTurnAroundTime +=
                tempTaskData[i].turnAroundTime / n;
        }

        setAverageWaitTime(averageWaitTime);

        setAverageTurnAroundTime(
            averageTurnAroundTime
        );

        setTaskData(tempTaskData);
    };

    function calculateRR() {

        let tempTasks = listOfTasks.map(t => ({
            ...t,
            remainingTime: t.TaskBurstTime,
            finishTime: 0
        }));

        let readyQueue = [];
        let totalTime = 0;

        let ganttTimeline = [];
        let completedTaskData = [];

        let averageWaitTime = 0;
        let averageTurnAroundTime = 0;

        tempTasks.sort((a, b) =>
            a.TaskArrivalTime - b.TaskArrivalTime ||
            a.TaskName - b.TaskName
        );

        let i = 0;

        while (readyQueue.length > 0 || i < tempTasks.length) {

            if (readyQueue.length === 0) {

                if (tempTasks[i].TaskArrivalTime > totalTime) {

                    ganttTimeline.push({
                        type: 'idle',
                        startTime: totalTime,
                        finishTime: tempTasks[i].TaskArrivalTime,
                        burstTime:
                            tempTasks[i].TaskArrivalTime -
                            totalTime
                    });
                }

                totalTime = Math.max(
                    totalTime,
                    tempTasks[i].TaskArrivalTime
                );

                readyQueue.push(tempTasks[i]);
                i++;
            }

            let current = readyQueue.shift();

            const executionStart = totalTime;

            let execTime = Math.min(
                current.remainingTime,
                quantumTime
            );

            totalTime += execTime;
            current.remainingTime -= execTime;

            // Store EVERY RR slice
            ganttTimeline.push({
                type: 'task',
                taskIndex: current.TaskName,
                arrivalTime: current.TaskArrivalTime,
                startTime: executionStart,
                finishTime: totalTime,
                burstTime: execTime
            });

            while (
                i < tempTasks.length &&
                tempTasks[i].TaskArrivalTime <= totalTime
            ) {
                readyQueue.push(tempTasks[i]);
                i++;
            }

            if (current.remainingTime > 0) {

                readyQueue.push(current);

            } else {

                current.finishTime = totalTime;

                let turnAroundTime =
                    current.finishTime -
                    current.TaskArrivalTime;

                let waitTime =
                    turnAroundTime -
                    current.TaskBurstTime;

                completedTaskData.push({
                    taskIndex: current.TaskName,
                    arrivalTime: current.TaskArrivalTime,
                    finishTime: current.finishTime,
                    waitTime,
                    turnAroundTime,
                    burstTime: current.TaskBurstTime
                });
            }
        }

        completedTaskData.sort(
            (a, b) => a.taskIndex - b.taskIndex
        );

        for (let j = 0; j < completedTaskData.length; j++) {

            averageWaitTime +=
                completedTaskData[j].waitTime /
                completedTaskData.length;

            averageTurnAroundTime +=
                completedTaskData[j].turnAroundTime /
                completedTaskData.length;
        }

        setAverageWaitTime(averageWaitTime);

        setAverageTurnAroundTime(
            averageTurnAroundTime
        );

        setTaskData({
            summary: completedTaskData,
            timeline: ganttTimeline
        });
    }

    function calculatenSJF() {

        let tempTaskData = [];
        let tempTasks = [...listOfTasks];

        let totalTime = 0;
        let currentIndex;

        let averageWaitTime = 0;
        let averageTurnAroundTime = 0;

        while (tempTasks.length > 0) {

            currentIndex = utils.whoIsShortest(
                tempTasks,
                totalTime
            );

            if (
                tempTasks.at(currentIndex).TaskArrivalTime >
                totalTime
            ) {
                totalTime =
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime;
            }

            totalTime +=
                tempTasks.at(currentIndex)
                    .TaskBurstTime;

            tempTaskData.push({
                taskIndex:
                    tempTasks.at(currentIndex).TaskName,

                arrivalTime:
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                finishTime: totalTime,

                startTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskBurstTime,

                waitTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskBurstTime -
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                turnAroundTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                burstTime:
                    tempTasks.at(currentIndex)
                        .TaskBurstTime
            });

            tempTasks.splice(currentIndex, 1);
        }

        for (let i = 0; i < tempTaskData.length; i++) {

            averageWaitTime +=
                tempTaskData.at(i).waitTime /
                tempTaskData.length;

            averageTurnAroundTime +=
                tempTaskData.at(i).turnAroundTime /
                tempTaskData.length;
        }

        setAverageWaitTime(averageWaitTime);

        setAverageTurnAroundTime(
            averageTurnAroundTime
        );

        setTaskData(tempTaskData);
    }

    function calculateFCFS() {

        let tempTaskData = [];
        let tempTasks = [...listOfTasks];

        let totalTime = 0;
        let currentIndex;

        let averageWaitTime = 0;
        let averageTurnAroundTime = 0;

        while (tempTasks.length > 0) {

            currentIndex = utils.whoCameFirst(tempTasks);

            if (
                tempTasks.at(currentIndex).TaskArrivalTime >
                totalTime
            ) {
                totalTime =
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime;
            }

            totalTime +=
                tempTasks.at(currentIndex)
                    .TaskBurstTime;

            tempTaskData.push({
                taskIndex:
                    tempTasks.at(currentIndex).TaskName,

                arrivalTime:
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                finishTime: totalTime,

                startTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskBurstTime,

                waitTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskBurstTime -
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                turnAroundTime:
                    totalTime -
                    tempTasks.at(currentIndex)
                        .TaskArrivalTime,

                burstTime:
                    tempTasks.at(currentIndex)
                        .TaskBurstTime
            });

            tempTasks.splice(currentIndex, 1);
        }

        for (let i = 0; i < tempTaskData.length; i++) {

            averageWaitTime +=
                tempTaskData.at(i).waitTime /
                tempTaskData.length;

            averageTurnAroundTime +=
                tempTaskData.at(i).turnAroundTime /
                tempTaskData.length;
        }

        setAverageWaitTime(averageWaitTime);

        setAverageTurnAroundTime(
            averageTurnAroundTime
        );

        setTaskData(tempTaskData);
    }

    const removeTask = (index) => {

        setListOfTasks(l =>
            l.filter((_, i) => i !== index)
        );
    }

    const handleArrivalTimeChange = (event) => {

        if (event.target.value < 0) {

            setArrivalTime(0);

        } else if (event.target.value > 1000) {

            setArrivalTime(1000);

        } else {

            setArrivalTime(
                parseInt(event.target.value)
            );
        }
    }

    const handleBurstTimeChange = (event) => {

        if (event.target.value < 1) {

            setBurstTime(1);

        } else if (event.target.value > 1000) {

            setBurstTime(1000);

        } else {

            setBurstTime(
                parseInt(event.target.value)
            );
        }
    }

    const handleQuantumTimeChange = (event) => {

        if (event.target.value < 0) {

            setQuantumTime(0);

        } else if (event.target.value > 1000) {

            setQuantumTime(1000);

        } else {

            setQuantumTime(
                parseInt(event.target.value)
            );
        }
    }

    useEffect(() => {

        if (listOfTasks.length === 0) return;

        if (currentAlgorithm === 'FCFS') {

            calculateFCFS();

        } else if (currentAlgorithm === 'nSJF') {

            calculatenSJF();

        } else if (currentAlgorithm === 'RR') {

            if (quantumTime > 0) {
                calculateRR();
            }

        } else if (currentAlgorithm === 'SRTF') {

            calculateSRTF();
        }

    }, [quantumTime, currentAlgorithm, listOfTasks]);

    const isRRData =
        !Array.isArray(taskData);

    const summaryData =
        isRRData
            ? taskData.summary || []
            : taskData;

    const timelineData =
        isRRData
            ? taskData.timeline || []
            : taskData;

    return (

        <div className="cpu-scheduling-container">

            <div className="cpu-scheduling-header">

                <h1>
                    CPU Scheduling Simulator
                </h1>

                <p>
                    Visualize and analyze different
                    CPU scheduling algorithms
                </p>

            </div>

            <div className="cpu-scheduling-grid">

                <div className="cpu-card">

                    <h2>Task Configuration</h2>

                    <div className="input-section">

                        <div className="form-group">

                            <label>
                                Arrival Time

                                <div className="label-hint">
                                    (Time when task enters
                                    system)
                                </div>

                            </label>

                            <input
                                className="cpu-input"
                                type="number"
                                min="0"
                                max="1000"
                                value={arrivalTime}
                                onChange={
                                    handleArrivalTimeChange
                                }
                                placeholder="Enter arrival time in seconds"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Burst Time

                                <div className="label-hint">
                                    (CPU processing time required)
                                </div>

                            </label>

                            <input
                                className="cpu-input"
                                type="number"
                                min="1"
                                max="1000"
                                value={burstTime}
                                onChange={
                                    handleBurstTimeChange
                                }
                                placeholder="Enter burst time in seconds"
                            />

                        </div>

                        <button
                            className="cpu-button cpu-button-primary"
                            onClick={addTask}
                        >
                            + Add Task
                        </button>

                    </div>

                    <div className="section-divider"></div>

                    <div className="input-section">

                        <div className="form-group">

                            <label>

                                Quantum Time (Round Robin)

                                <div className="label-hint">
                                    (Time slice per task)
                                </div>

                            </label>

                            <input
                                className="cpu-input"
                                type="number"
                                min="1"
                                max="1000"
                                value={quantumTime}
                                onChange={
                                    handleQuantumTimeChange
                                }
                                placeholder="Enter quantum time for RR scheduling"
                            />

                        </div>

                    </div>

                </div>

                <div className="cpu-card">

                    <h2>Active Tasks</h2>

                    {listOfTasks.length === 0 ? (

                        <div className="task-list-container">

                            <div className="task-list-empty">
                                No tasks added yet.
                            </div>

                        </div>

                    ) : (

                        <div className="task-list-container">

                            <ul className="task-list">

                                {listOfTasks.map(
                                    (task, index) => (

                                        <li
                                            key={index}
                                            className="task-item"
                                            onClick={() =>
                                                removeTask(index)
                                            }
                                        >

                                            <div className="task-item-content">

                                                <span className="task-item-label">
                                                    Task {index + 1}
                                                </span>

                                                <span className="task-item-times">
                                                    Arrival:
                                                    {' '}
                                                    {task.TaskArrivalTime}s
                                                    {' | '}
                                                    Burst:
                                                    {' '}
                                                    {task.TaskBurstTime}s
                                                </span>

                                            </div>

                                            <div className="task-item-delete">
                                                Click to remove
                                            </div>

                                        </li>
                                    )
                                )}

                            </ul>

                        </div>
                    )}

                </div>

                <div className="cpu-card algorithms-section">

                    <h2>Select Algorithm</h2>

                    <div className="algorithms-grid">

                        <button
                            className={`cpu-button ${
                                currentAlgorithm === 'FCFS'
                                    ? 'cpu-button-primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setCurrentAlgorithm('FCFS')
                            }
                        >
                            FCFS
                        </button>

                        <button
                            className={`cpu-button ${
                                currentAlgorithm === 'nSJF'
                                    ? 'cpu-button-primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setCurrentAlgorithm('nSJF')
                            }
                        >
                            nSJF
                        </button>

                        <button
                            className={`cpu-button ${
                                currentAlgorithm === 'RR'
                                    ? 'cpu-button-primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setCurrentAlgorithm('RR')
                            }
                        >
                            Round Robin
                        </button>

                        <button
                            className={`cpu-button ${
                                currentAlgorithm === 'SRTF'
                                    ? 'cpu-button-primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setCurrentAlgorithm('SRTF')
                            }
                        >
                            SRTF
                        </button>

                    </div>

                </div>

                <div className="cpu-card results-container">

                    <h2>Scheduling Results</h2>

                    {summaryData.length === 0 ? (

                        <div className="results-empty">
                            Select an algorithm and add tasks.
                        </div>

                    ) : (

                        <div className="results-content">

                            {currentAlgorithm && (

                                <div className="algorithm-indicator">
                                    Algorithm:
                                    {' '}
                                    {currentAlgorithm}
                                </div>

                            )}

                            <div className="average-metrics-grid">

                                <div className="average-wait-time">

                                    <div className="average-wait-time-label">
                                        Average Wait Time
                                    </div>

                                    <div>

                                        <span className="average-wait-time-value">
                                            {averageWaitTime.toFixed(2)}
                                        </span>

                                        <span className="average-wait-time-unit">
                                            seconds
                                        </span>

                                    </div>

                                </div>

                                <div className="average-wait-time">

                                    <div className="average-wait-time-label">
                                        Average Turn-Around Time
                                    </div>

                                    <div>

                                        <span className="average-wait-time-value">
                                            {averageTurnAroundTime.toFixed(2)}
                                        </span>

                                        <span className="average-wait-time-unit">
                                            seconds
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <GanttChart
                                taskData={timelineData}
                                algorithm={currentAlgorithm}
                            />

                            <ul className="results-table">

                                {summaryData.map((task, index) => (

                                    <li
                                        key={index}
                                        className="result-item"
                                    >

                                        <div className="result-item-header">

                                            <span className="result-item-task-label">
                                                Task {task.taskIndex + 1}
                                            </span>

                                        </div>

                                        <div className="result-item-metrics">

                                            <div className="metric">

                                                <div className="metric-label">
                                                    Arrival Time
                                                </div>

                                                <div className="metric-value">
                                                    {task.arrivalTime}s
                                                </div>

                                            </div>

                                            <div className="metric">

                                                <div className="metric-label">
                                                    Burst Time
                                                </div>

                                                <div className="metric-value">
                                                    {task.burstTime}s
                                                </div>

                                            </div>

                                            {task.startTime !== undefined && (

                                                <div className="metric">

                                                    <div className="metric-label">
                                                        Start Time
                                                    </div>

                                                    <div className="metric-value">
                                                        {task.startTime}s
                                                    </div>

                                                </div>

                                            )}

                                            <div className="metric">

                                                <div className="metric-label">
                                                    Finish Time
                                                </div>

                                                <div className="metric-value">
                                                    {task.finishTime}s
                                                </div>

                                            </div>

                                            <div className="metric">

                                                <div className="metric-label">
                                                    Wait Time
                                                </div>

                                                <div className="metric-value">
                                                    {task.waitTime}s
                                                </div>

                                            </div>

                                            <div className="metric">

                                                <div className="metric-label">
                                                    Turn-Around Time
                                                </div>

                                                <div className="metric-value">
                                                    {task.turnAroundTime}s
                                                </div>

                                            </div>

                                        </div>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default CPUSchedulingAlgorithmInput;