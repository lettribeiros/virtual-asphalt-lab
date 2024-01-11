import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Lab_cd from "./pages/Lab-cd";
import Lab_dc from "./pages/Lab-dc";

const AppRoutes = () => {
   return(
       <Routes>
           <Route path="/" element={<Home />} />
            <Route path="/lab-composicao-desempenho" element={<Lab_cd />} />
            <Route path="/lab-desempenho-composicao" element={<Lab_dc />} />
       </Routes>
   )
}

export default AppRoutes