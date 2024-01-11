import React, { useState } from "react";
import './Lab-cd.css'

const Lab_cd = () => {

    const [dadosFormulario, setDadosFormulario] = useState({
        bituminous_matrix: "CAP-30/45",
        sieve_3_8: 80.8,
        sieve_4: 54.8,
        sieve_200: 7.6,
        nominal_maximum_size: 12.5,
        binder_content: 4.6,
        binder_viscosity: 360,
        penetration: 53,
        softening_point: 52,
        void_volume: 3.6,
      });
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        setDadosFormulario((prevDados) => ({
          ...prevDados,
          [name]: value,
        }));
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();

    }

        return (
               <form onSubmit={handleSubmit}>

                <h1>Inputs</h1>

              <label>
              Bituminous matrix
                <select
                  type="text"
                  name="campo1"
                  value={dadosFormulario.bituminous_matrix}
                  onChange={handleChange}>
                    <option value='CAP-30/45'>CAP-30/45</option>
                    <option value='CAP-50/70'>CAP-50/70</option>
                </select>    
              </label>

              <label>
              Pass through sieve #3/8 (%)
                <input
                  type="number"
                  name="campo2"
                  value={dadosFormulario.sieve_3_8}
                  onChange={handleChange}
                />
              </label>

              <label>
              Pass through sieve #4 (%)
                <input
                  type="number"
                  name="campo3"
                  value={dadosFormulario.sieve_4}
                  onChange={handleChange}
                />
              </label>

              <label>
              Pass through sieve #200 (%)
                <input
                  type="number"
                  name="campo4"
                  value={dadosFormulario.sieve_200}
                  onChange={handleChange}
                />
              </label>

              <label>
              Nominal maximum size (mm)
                <input
                  type="number"
                  name="campo6"
                  value={dadosFormulario.nominal_maximum_size}
                  onChange={handleChange}
                />
              </label>

              <label>
              Binder content (%)
                <input
                  type="number"
                  name="campo7"
                  value={dadosFormulario.binder_content}
                  onChange={handleChange}
                />
              </label>

              <label>
              Binder viscosity ()
                <input
                  type="number"
                  name="campo8"
                  value={dadosFormulario.binder_viscosity}
                  onChange={handleChange}
                />
              </label>

              <label>
              Penetration
                <input
                  type="number"
                  name="campo9"
                  value={dadosFormulario.penetration}
                  onChange={handleChange}
                />
              </label>

              <label>
              Softening point
                <input
                  type="number"
                  name="campo10"
                  value={dadosFormulario.softening_point}
                  onChange={handleChange}
                />
              </label>

              <label>
              Void volume (%)
                <input
                  type="number"
                  name="campo5"
                  value={dadosFormulario.void_volume}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Fazer Previsão</button>
            </form> 
          );
};

export default Lab_cd;