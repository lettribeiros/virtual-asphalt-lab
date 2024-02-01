import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LabCd from "./pages/LabCd";
import LabDc from "./pages/LabDc";

const AppRoutes = () => {
   return(
       <Routes>
           <Route path="/virtual-asphalt-lab" element={<Home />} />
            <Route path="/virtual-asphalt-lab/lab-composicao-desempenho" element={<LabCd />} />
            <Route path="/virtual-asphalt-lab/lab-desempenho-composicao" element={<LabDc />} />
       </Routes>
   )
}

export default AppRoutes