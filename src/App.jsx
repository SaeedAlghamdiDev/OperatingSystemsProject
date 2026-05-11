import CPUSchedulingAlgorithmInput from "./Components/CPUSchedulingAlgorithmInput";
import Footer from "./Components/Footer";
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import { CPUSchedulingPage} from './Pages/CPUSchedulingPage';
import { Home } from './Pages/Home';
import { ContiguousMemoryPage } from "./Pages/ContiguousMemoryPage";
import { PageReplacementPage } from "./Pages/PageReplacementPage";
import { Link } from "react-router-dom";
import { Layout } from "./Components/Layout";

function app(){

  

  return(<>


  <Router>
    <Routes>
      <Route element={<Layout/>}>

      <Route path="/" element ={<Home/>}/>
      <Route path="/CPUSchedule" element ={<CPUSchedulingPage/>}/>
      <Route path="/Memory" element ={<ContiguousMemoryPage/>}/>
      <Route path="/PageReplacement" element ={<PageReplacementPage/>}/>

      </Route>
      
      
      
      
      
    </Routes>
  </Router>
  {/* "Hello"
  <CPUSchedulingAlgorithmInput/>
  /* <Footer/> */}
  </>);
}

export default app