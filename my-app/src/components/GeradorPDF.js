import React from 'react';
import jsPDF from 'jspdf';
import '../pages/LabCd.css'

const GeradorPDF = ({ dadosFormulario, imagens }) => {
  const gerarPDF = () => {

    const doc = new jsPDF();

    doc.text('Relatório de Previsão', 10, 10);

    let y = 30;
    Object.entries(dadosFormulario).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    });

    let maxY = 0; 
    imagens.forEach((url) => {

      const height = 130;
      if (y + height > 280) {
        doc.addPage();
        y = 10; 
      }
      doc.addImage(url, 'PNG', 10, y, 180, 120);
      y += 130; 
      maxY = Math.max(maxY, y + height); 
    });


    doc.save('relatorio_previsao.pdf');
  };

  return (
    <button className='buttonEnviar' onClick={gerarPDF}>Gerar PDF</button>
  );
};

export default GeradorPDF;

















