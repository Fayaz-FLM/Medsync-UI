import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DietPlanModal({ show, onHide, dietPlan, loading, onGenerate }) {
  const contentRef = useRef(null);

  if (!show) return null;

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Diet_Plan_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bi bi-journal-medical me-2"></i>
              AI-Generated Diet Plan
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>
          <div className="modal-body" style={{ minHeight: '200px' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Generating your personalized diet plan...</h5>
                <p className="text-muted">Our AI is analyzing the diagnosis and medicines to create the best recommendations.</p>
              </div>
            ) : dietPlan ? (
              <div ref={contentRef} className="diet-plan-content p-4 border rounded bg-white shadow-sm">
                <div className="mb-4 pb-2 border-bottom">
                  <h3 className="text-success mb-0">MedSync AI Diet Plan</h3>
                  <p className="text-muted small">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="diet-plan-markdown" style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                  <ReactMarkdown>{dietPlan}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted mb-4">No diet plan has been generated for this appointment yet.</p>
                <button className="btn btn-success" onClick={onGenerate}>
                  Generate Diet Plan Now
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {dietPlan && !loading && (
              <button className="btn btn-outline-success me-auto" onClick={handleDownloadPDF}>
                <i className="bi bi-download me-2"></i>
                Download PDF
              </button>
            )}
            <button className="btn btn-secondary" onClick={onHide}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
