import './CPUScheduling.css';

function GanttChart({ taskData, algorithm }) {

    if (!taskData || taskData.length === 0) return null;

    const buildTimeline = () => {

        const sortedTasks = [...taskData].sort(
            (a, b) => a.startTime - b.startTime
        );

        const timeline = [];

        let currentTime = 0;

        sortedTasks.forEach((task) => {

            const start =
                task.startTime ??
                (task.finishTime - task.burstTime);

            const finish = task.finishTime;

            if (start > currentTime) {

                timeline.push({
                    type: 'idle',
                    start: currentTime,
                    finish: start,
                    duration: start - currentTime
                });
            }

            timeline.push({
                type: task.type || 'task',
                taskIndex: task.taskIndex,
                start,
                finish,
                duration: finish - start
            });

            currentTime = finish;
        });

        return timeline;
    };

    const timeline = buildTimeline();

    const totalDuration = Math.max(
        ...timeline.map(segment => segment.finish)
    );

    return (

        <div className="gantt-wrapper">

            <div className="gantt-header">

                <h3>Gantt Chart: </h3>

                <span className="gantt-algorithm">
                    {algorithm}
                </span>

            </div>

            <div className="gantt-scroll">

                <div className="gantt-chart">

                    {timeline.map((segment, index) => {

                        const widthPercent =
                            (segment.duration / totalDuration) * 100;

                        const finalWidth =
                            Math.max(widthPercent, 6);

                        if (segment.type === 'idle') {

                            return (

                                <div
                                    key={`idle-${index}`}
                                    className="gantt-segment gantt-segment-idle"
                                    style={{
                                        width: `${finalWidth}%`,
                                        flexGrow: segment.duration
                                    }}
                                >

                                    <div className="gantt-segment-label">
                                        Idle
                                    </div>

                                    <div className="gantt-segment-time gantt-time-start">
                                        {segment.start}
                                    </div>

                                    <div className="gantt-segment-time gantt-time-end">
                                        {segment.finish}
                                    </div>

                                </div>
                            );
                        }

                        return (

                            <div
                                key={`${segment.taskIndex}-${index}`}
                                className="gantt-segment"
                                style={{
                                    width: `${finalWidth}%`,
                                    flexGrow: segment.duration
                                }}
                            >

                                <div className="gantt-segment-label">
                                    T{segment.taskIndex + 1}
                                </div>

                                <div className="gantt-segment-time gantt-time-start">
                                    {segment.start}
                                </div>

                                <div className="gantt-segment-time gantt-time-end">
                                    {segment.finish}
                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default GanttChart;