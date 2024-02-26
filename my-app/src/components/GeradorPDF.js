import React from 'react';
import jsPDF from 'jspdf';
import '../pages/LabCd.css'

const GeradorPDF = ({ dadosFormulario, graficos }) => {
  const gerarPDF = () => {

    const doc = new jsPDF();

    doc.setFont('helvetica','bold');
    doc.setFontSize(20);
    doc.text('Relatório de Previsão', 14, 15);
  
    const dataAtual = new Date().toLocaleDateString();
    doc.setFont('helvetica','bold');
    doc.setFontSize(12);
    doc.text(`Data: ${dataAtual}`, 14, 25);
  
    doc.setFont('helvetica','bold');
    doc.setFontSize(12);
    doc.text('Parâmetros de Entrada:', 14, 40);
    doc.setFont('helvetica','normal');
    let y = 50;
    Object.entries(dadosFormulario).forEach(([key, value]) => {
      doc.text(`- ${key}: ${value}`, 14, y);
      y += 10;
    })

    doc.setFont('helvetica','bold');
    doc.setFontSize(12);
    doc.text('Resultados da Previsão:', 14, y + 10); 
    doc.setFont('helvetica','normal');
    y += 35; 
      
    let pageNumber = 1;

    for (let i = 0; i < graficos.length; i++) {
      const grafico = graficos[i];
      const { nome, imagem } = grafico;
      const imageObj = new Image();
      imageObj.src = imagem;
      imageObj.onload = function () {
        const width = 180;
        const height = (this.height * width) / this.width;
        
        if (y + height > doc.internal.pageSize.height) {
          doc.addPage();
          pageNumber++;
          y = 10;
        }

        doc.addImage(this, 14, y, width, height);
        doc.text(` ${nome}`, 14, y - 5);
        y += height + 10;

        if (i === graficos.length - 1) {
          doc.save(`relatorio_previsao_.pdf`);
        }
      };
    }

    }

  return (
    <button className='buttonEnviar' onClick={gerarPDF}>Gerar PDF</button>
  );
};

export default GeradorPDF;


















