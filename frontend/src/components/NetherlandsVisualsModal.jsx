import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const NetherlandsVisualsModal = ({ isOpen, onClose }) => {
  const [zoomedImg, setZoomedImg] = useState(null);
  if (!isOpen) return null;

  return (
    <div className="nl-modal-overlay">
      <div className="nl-modal-container">
        <div className="nl-modal-header">
          <h2>Netherlands Study Site Visualizations</h2>
          <button className="nl-modal-close" onClick={onClose} title="Close Visuals">
            <FaTimes />
          </button>
        </div>

        <div className="nl-modal-content">
          {/* Section 1: Baseline Context */}
          <section className="nl-section">
            <h3 className="nl-section-title">Baseline Hydrology</h3>
            <div className="nl-grid-2col">
              <div className="nl-card">
                <img src={`${import.meta.env.BASE_URL}forecast_gifs/mean_dis_nl.png`} alt="Mean Discharge Time Series" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} />
              </div>
              <div className="nl-card">
                <img src={`${import.meta.env.BASE_URL}forecast_gifs/mean_prec_nl.png`} alt="Mean Precipitation Time Series" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} />
              </div>
              <div className="nl-card">
                <img src={`${import.meta.env.BASE_URL}forecast_gifs/mean_dis_spatial_nl.png`} alt="Discharge Spatial Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} />
              </div>
              <div className="nl-card">
                <img src={`${import.meta.env.BASE_URL}forecast_gifs/mean_prec_spatial_nl.png`} alt="Precipitation Spatial Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} />
              </div>
            </div>
          </section>

          {/* Section 2: Historical Drought (SSI) */}
          <section className="nl-section">
            <h3 className="nl-section-title">Historical Drought (SSI) - 2022</h3>
            <div className="nl-grid-2col">
              <div className="nl-column-group">
                <h4 className="nl-group-title">SSI-1</h4>
                <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_1_2022.gif`} alt="SSI-1 Continuous Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_1_2022_categories.gif`} alt="SSI-1 Category Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
              </div>
              <div className="nl-column-group">
                <h4 className="nl-group-title">SSI-3</h4>
                <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_3_2022.gif`} alt="SSI-3 Continuous Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_3_2022_categories.gif`} alt="SSI-3 Category Map" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
              </div>
            </div>
          </section>

          {/* Section 3: Forecast Comparison */}
          <section className="nl-section">
            <h3 className="nl-section-title">Forecast Comparison</h3>
            <div className="nl-grid-2col">
              <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_1_dec_forecasts.png`} alt="SSI-1 Forecast Panel" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
              <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_3_dec_forecasts.png`} alt="SSI-3 Forecast Panel" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
            </div>
          </section>

          {/* Section 4: Lead Evolution */}
          <section className="nl-section">
            <h3 className="nl-section-title">Lead-wise Evolution</h3>
            <div className="nl-grid-2col">
              <div className="nl-column-group">
                <h4 className="nl-group-title">SSI-1 Leads</h4>
                <div className="nl-lead-row">
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_2025_10_lead1.png`} alt="Lead 1" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_2025_11_lead2.png`} alt="Lead 2" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_2025_12_lead3.png`} alt="Lead 3" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_2026_01_lead4.png`} alt="Lead 4" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_2026_02_lead5.png`} alt="Lead 5" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                </div>
              </div>
              <div className="nl-column-group">
                <h4 className="nl-group-title">SSI-3 Leads</h4>
                <div className="nl-lead-row">
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_2025_10_lead1.png`} alt="Lead 1" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_2025_11_lead2.png`} alt="Lead 2" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_2025_12_lead3.png`} alt="Lead 3" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_2026_01_lead4.png`} alt="Lead 4" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                  <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_2026_02_lead5.png`} alt="Lead 5" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Animations */}
          <section className="nl-section" style={{ borderBottom: 'none' }}>
            <h3 className="nl-section-title">Forecast Animation</h3>
            <div className="nl-grid-2col">
              <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc1_init_sep2025_leads1to5.gif`} alt="SSI-1 Animation" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
              <div className="nl-card"><img src={`${import.meta.env.BASE_URL}forecast_gifs/ssi_acc3_init_sep2025_leads1to5.gif`} alt="SSI-3 Animation" className="nl-img" style={{ cursor: "pointer" }} onClick={(e) => setZoomedImg(e.target.src)} /></div>
            </div>
          </section>

        </div>
      </div>

      {zoomedImg && (
        <div className="nl-lightbox-overlay" onClick={() => setZoomedImg(null)}>
          <button className="nl-lightbox-close" onClick={() => setZoomedImg(null)}>&times;</button>
          <img src={zoomedImg} className="nl-lightbox-img" alt="Zoomed" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default NetherlandsVisualsModal;
