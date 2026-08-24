// src/components/EmergencyContacts.jsx
import { useState } from 'react';
import { 
  FaPhoneAlt, 
  FaShieldAlt, 
  FaBuilding, 
  FaAmbulance, 
  FaFireExtinguisher, 
  FaFemale, 
  FaChild, 
  FaMapMarkerAlt,
  FaSearch
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';

const emergencyData = {
  guwahati: [
    { title: 'NDRF Control Room (Guwahati)', number: '0361-2840284', category: 'Disaster & NDRF', icon: <FaShieldAlt />, link: 'tel:03612840284' },
    { title: 'Assam State Disaster Mgmt (SDMA)', number: '1077 / 1070', category: 'Disaster & NDRF', icon: <FaShieldAlt />, link: 'tel:1070' },
    { title: 'DDMA Kamrup Metropolitan', number: '96784-71071', category: 'Disaster & NDRF', icon: <FaBuilding />, link: 'tel:9678471071' },
    { title: 'Guwahati Police Control Room', number: '0361-2684402', category: 'Police & Control', icon: <FaPhoneAlt />, link: 'tel:03612684402' },
    { title: 'Assam Police Emergency', number: '100', category: 'Police & Control', icon: <FaPhoneAlt />, link: 'tel:100' },
    { title: 'Emergency Response (Fire/Police/Med)', number: '108', category: 'Emergency Response', icon: <FaAmbulance />, link: 'tel:108' },
    { title: 'Fire & Emergency Services (Assam)', number: '0361-2735933 / 101', category: 'Fire & Rescue', icon: <FaFireExtinguisher />, link: 'tel:101' },
    { title: "Women's Helpline", number: '181', category: 'Public Helplines', icon: <FaFemale />, link: 'tel:181' },
    { title: 'Child Helpline', number: '1098', category: 'Public Helplines', icon: <FaChild />, link: 'tel:1098' }
  ],
  bengaluru: {
    general: [
      { title: 'BBMP Flood Control Room', number: '080-22660000', category: 'Flood Helpline', link: 'tel:08022660000' },
      { title: 'Karnataka State Disaster Helpline', number: '1070', category: 'State Disaster', link: 'tel:1070' },
      { title: 'Namma 112 Emergency Control', number: '112', category: 'Emergency Response', link: 'tel:112' }
    ],
    zones: [
      { zone: 'East Zone', mobile: '9480685702', landline: '080-22975803' },
      { zone: 'West Zone', mobile: '9480685703', landline: '080-23561692, 080-23463366' },
      { zone: 'South Zone', mobile: '9480685704', landline: '080-2656632, 080-2297503' },
      { zone: 'Mahadevapura Zone', mobile: '9480685706', landline: '080-28512300' },
      { zone: 'Bommanahalli Zone', mobile: '9480685707', landline: '080-25735642, 080-2573244' },
      { zone: 'Yelahanka Zone', mobile: '9480685705', landline: '7022664419, 080-23636671' },
      { zone: 'RR Nagar Zone', mobile: '9480685708', landline: '080-28601851' },
      { zone: 'Dasarahalli Zone', mobile: '9480685709', landline: '080-28394909' }
    ]
  },
  anantapur: [
    { title: 'AP State Disaster Management (APSDMA)', number: '1070', category: 'Disaster', icon: <FaShieldAlt />, link: 'tel:1070' },
    { title: 'Anantapur District Control Room', number: '08554-220003', category: 'District Control', icon: <FaBuilding />, link: 'tel:08554220003' },
    { title: 'Emergency Response (Med/Fire)', number: '112 / 108', category: 'Emergency Response', icon: <FaAmbulance />, link: 'tel:112' }
  ],
  netherlands: [
    { title: 'Rijkswaterstaat Flood Information', number: '0800-8002', category: 'Water & Floods', icon: <FaShieldAlt />, link: 'tel:08008002' },
    { title: 'National Emergency Services (NL)', number: '112', category: 'Emergency Services', icon: <FaAmbulance />, link: 'tel:112' },
    { title: 'Water Board Emergency Control', number: '0900-2025020', category: 'Dike & Water Safety', icon: <FaBuilding />, link: 'tel:09002025020' }
  ]
};

export default function EmergencyContacts() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="emergency-section">
      {/* Clustered Header Card */}
      <div className="emergency-header-cluster">
        <div className="emergency-header-main">
          <div className="emergency-header-title">
            <FaShieldAlt className="emergency-header-icon" />
            <div>
              <h2>Disaster Emergency Contacts</h2>
              <p>Direct helplines and control room numbers for LODESTAR study sites.</p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="emergency-search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search contact, zone, or service..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {/* Clustered Tabs Bar */}
        <div className="emergency-tabs">
          <button 
            className={`emergency-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FaMapMarkerAlt /> All Sites
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'guwahati' ? 'active' : ''}`}
            onClick={() => setActiveTab('guwahati')}
          >
            <FaMapMarkerAlt /> Guwahati (Assam)
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'bengaluru' ? 'active' : ''}`}
            onClick={() => setActiveTab('bengaluru')}
          >
            <FaMapMarkerAlt /> Bengaluru (Karnataka)
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'anantapur' ? 'active' : ''}`}
            onClick={() => setActiveTab('anantapur')}
          >
            <FaMapMarkerAlt /> Anantapur (AP)
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'netherlands' ? 'active' : ''}`}
            onClick={() => setActiveTab('netherlands')}
          >
            <FaMapMarkerAlt /> Netherlands (EU)
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="emergency-content-area">

        {/* BENGALURU SECTION */}
        {(activeTab === 'all' || activeTab === 'bengaluru') && (
          <motion.div 
            className="site-contact-wrapper site-bengaluru"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="city-title-bar">
              <div className="city-title-group">
                <img 
                  src="https://flagcdn.com/w40/in.png" 
                  alt="India Flag" 
                  className="site-flag-img" 
                />
                <div>
                  <h3>Bengaluru Study Site</h3>
                  <span className="city-subtext">BBMP Flood &amp; Emergency Helplines • Karnataka, India</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.bengaluru.general).map((item, index) => (
                <div key={index} className="emergency-card highlight">
                  <div className="emergency-card-body">
                    <span className="emergency-cat-tag">{item.category}</span>
                    <h4>{item.title}</h4>
                    <a href={item.link} className="emergency-phone-btn">
                      <FaPhoneAlt /> {item.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* BBMP Zonal Helpline Table */}
            <div className="bbmp-zonal-container">
              <h4>BBMP Zonal Flood Control Rooms</h4>
              <div className="table-responsive">
                <table className="bbmp-zonal-table">
                  <thead>
                    <tr>
                      <th>Zone Name</th>
                      <th>Mobile Control Room</th>
                      <th>Landline Number(s)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencyData.bengaluru.zones
                      .filter(z => !searchTerm || z.zone.toLowerCase().includes(searchTerm.toLowerCase()) || z.mobile.includes(searchTerm) || z.landline.includes(searchTerm))
                      .map((zone, idx) => (
                        <tr key={idx}>
                          <td><strong>{zone.zone}</strong></td>
                          <td>
                            <a href={`tel:${zone.mobile}`} className="table-phone-link">
                              <FaPhoneAlt /> {zone.mobile}
                            </a>
                          </td>
                          <td>{zone.landline}</td>
                          <td>
                            <a href={`tel:${zone.mobile}`} className="table-call-pill">
                              Call Zone
                            </a>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* GUWAHATI SECTION */}
        {(activeTab === 'all' || activeTab === 'guwahati') && (
          <motion.div 
            className="site-contact-wrapper site-guwahati"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="city-title-bar">
              <div className="city-title-group">
                <img 
                  src="https://flagcdn.com/w40/in.png" 
                  alt="India Flag" 
                  className="site-flag-img" 
                />
                <div>
                  <h3>Guwahati Study Site</h3>
                  <span className="city-subtext">Disaster &amp; Emergency Contacts • Assam, India</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.guwahati).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{item.category}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <a href={item.link} className="emergency-phone-btn">
                      <FaPhoneAlt /> {item.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANANTAPUR SECTION */}
        {(activeTab === 'all' || activeTab === 'anantapur') && (
          <motion.div 
            className="site-contact-wrapper site-anantapur"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="city-title-bar">
              <div className="city-title-group">
                <img 
                  src="https://flagcdn.com/w40/in.png" 
                  alt="India Flag" 
                  className="site-flag-img" 
                />
                <div>
                  <h3>Anantapur Study Site</h3>
                  <span className="city-subtext">Drought &amp; Disaster Control • Andhra Pradesh, India</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.anantapur).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{item.category}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <a href={item.link} className="emergency-phone-btn">
                      <FaPhoneAlt /> {item.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* NETHERLANDS SECTION */}
        {(activeTab === 'all' || activeTab === 'netherlands') && (
          <motion.div 
            className="site-contact-wrapper site-netherlands"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="city-title-bar">
              <div className="city-title-group">
                <img 
                  src="https://flagcdn.com/w40/nl.png" 
                  alt="Netherlands Flag" 
                  className="site-flag-img" 
                />
                <div>
                  <h3>Netherlands Study Sites</h3>
                  <span className="city-subtext">Dortrecht &amp; Geertruidenberg Water Helplines • Netherlands, EU</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.netherlands).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{item.category}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <a href={item.link} className="emergency-phone-btn">
                      <FaPhoneAlt /> {item.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
