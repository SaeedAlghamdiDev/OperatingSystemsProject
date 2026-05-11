import "./Home.css";
import osgif from "../assets/CPU.gif"

export function Home() {
    return (

        <div className="home-container">


            <section className="home-section course-section">

                <div className="course-grid">
                    <div className="course-item">

                        <span>Professor Jawad Alkhateeb <br/>SOEN 4361-101: Operating Systems</span> 


                        <span></span>
                    </div>
                </div>
            </section>

            <img src={osgif}></img>

            
            <header className="home-header">
                <h1>The Operating System Simulator</h1> <h3>A SOEN 4361 Project</h3>
                <p className="subtitle">CPU Scheduling, Memory Management, and Page Replacement Simulator</p>
            </header>


            
            <section className="home-section overview-section">
                
                <p>
                        This project provides an interactive simulator for three fundamental concepts covered in class.
                    <br/>Explore CPU scheduling algorithms, memory allocation strategies, and page replacement techniques
                    with this handy tool.
                </p>
            </section>





            <section className="home-section students-section">
                <h2>Team Members</h2>
                <div className="students-grid">
                    <div className="student-card">
                        <div className="student-name">Saeed Alghamdi</div>
                        <div className="student-id">202401525@pmu.edu.sa</div>
                    </div>
                    <div className="student-card">
                        <div className="student-name">Naif Almutairi</div>
                        <div className="student-id">202200195@pmu.edu.sa</div>
                    </div>
                    <div className="student-card">
                        <div className="student-name">Mujahed Alzahrani</div>
                        <div className="student-id">202100239@pmu.edu.sa</div>
                    </div>
                    <div className="student-card">
                        <div className="student-name">Abdullah Almutairi</div>
                        <div className="student-id">202100239@pmu.edu.sa</div>
                    </div>
                </div>
            </section>




        </div>
    );
}

