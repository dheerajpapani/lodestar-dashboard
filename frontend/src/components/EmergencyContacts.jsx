// src/components/EmergencyContacts.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    { titleKey: 'ndrf_guwahati', title: 'NDRF Control Room (Guwahati)', number: '0361-2840284', categoryKey: 'disaster_ndrf', category: 'Disaster & NDRF', icon: <FaShieldAlt />, link: 'tel:03612840284' },
    { titleKey: 'sdma_assam', title: 'Assam State Disaster Mgmt (SDMA)', number: '1077 / 1070', categoryKey: 'disaster_ndrf', category: 'Disaster & NDRF', icon: <FaShieldAlt />, link: 'tel:1070' },
    { titleKey: 'ddma_kamrup', title: 'DDMA Kamrup Metropolitan', number: '96784-71071', categoryKey: 'disaster_ndrf', category: 'Disaster & NDRF', icon: <FaBuilding />, link: 'tel:9678471071' },
    { titleKey: 'police_guwahati', title: 'Guwahati Police Control Room', number: '0361-2684402', categoryKey: 'police_control', category: 'Police & Control', icon: <FaPhoneAlt />, link: 'tel:03612684402' },
    { titleKey: 'police_assam', title: 'Assam Police Emergency', number: '100', categoryKey: 'police_control', category: 'Police & Control', icon: <FaPhoneAlt />, link: 'tel:100' },
    { titleKey: 'emergency_response_108', title: 'Emergency Response (Fire/Police/Med)', number: '108', categoryKey: 'emergency_response', category: 'Emergency Response', icon: <FaAmbulance />, link: 'tel:108' },
    { titleKey: 'fire_assam', title: 'Fire & Emergency Services (Assam)', number: '0361-2735933 / 101', categoryKey: 'fire_rescue', category: 'Fire & Rescue', icon: <FaFireExtinguisher />, link: 'tel:101' },
    { titleKey: 'women_helpline', title: "Women's Helpline", number: '181', categoryKey: 'public_helplines', category: 'Public Helplines', icon: <FaFemale />, link: 'tel:181' },
    { titleKey: 'child_helpline', title: 'Child Helpline', number: '1098', categoryKey: 'public_helplines', category: 'Public Helplines', icon: <FaChild />, link: 'tel:1098' }
  ],
  bengaluru: {
    general: [
      { titleKey: 'bbmp_flood', title: 'BBMP Flood Control Room', number: '080-22660000', categoryKey: 'flood_helpline', category: 'Flood Helpline', link: 'tel:08022660000' },
      { titleKey: 'karnataka_disaster', title: 'Karnataka State Disaster Helpline', number: '1070', categoryKey: 'state_disaster', category: 'State Disaster', link: 'tel:1070' },
      { titleKey: 'namma_112', title: 'Namma 112 Emergency Control', number: '112', categoryKey: 'emergency_response', category: 'Emergency Response', link: 'tel:112' }
    ],
    zones: [
      { zoneKey: 'east_zone', zone: 'East Zone', mobile: '9480685702', landline: '080-22975803' },
      { zoneKey: 'west_zone', zone: 'West Zone', mobile: '9480685703', landline: '080-23561692, 080-23463366' },
      { zoneKey: 'south_zone', zone: 'South Zone', mobile: '9480685704', landline: '080-2656632, 080-2297503' },
      { zoneKey: 'mahadevapura_zone', zone: 'Mahadevapura Zone', mobile: '9480685706', landline: '080-28512300' },
      { zoneKey: 'bommanahalli_zone', zone: 'Bommanahalli Zone', mobile: '9480685707', landline: '080-25735642, 080-2573244' },
      { zoneKey: 'yelahanka_zone', zone: 'Yelahanka Zone', mobile: '9480685705', landline: '7022664419, 080-23636671' },
      { zoneKey: 'rr_nagar_zone', zone: 'RR Nagar Zone', mobile: '9480685708', landline: '080-28601851' },
      { zoneKey: 'dasarahalli_zone', zone: 'Dasarahalli Zone', mobile: '9480685709', landline: '080-28394909' }
    ]
  },
  anantapur: [
    { titleKey: 'ap_disaster', title: 'AP State Disaster Management (APSDMA)', number: '1070', categoryKey: 'disaster', category: 'Disaster', icon: <FaShieldAlt />, link: 'tel:1070' },
    { titleKey: 'anantapur_control', title: 'Anantapur District Control Room', number: '08554-220003', categoryKey: 'district_control', category: 'District Control', icon: <FaBuilding />, link: 'tel:08554220003' },
    { titleKey: 'emergency_med_fire', title: 'Emergency Response (Med/Fire)', number: '112 / 108', categoryKey: 'emergency_response', category: 'Emergency Response', icon: <FaAmbulance />, link: 'tel:112' }
  ],
  netherlands: [
    { titleKey: 'rijkswaterstaat', title: 'Rijkswaterstaat Flood Information', number: '0800-8002', categoryKey: 'water_floods', category: 'Water & Floods', icon: <FaShieldAlt />, link: 'tel:08008002' },
    { titleKey: 'nl_emergency', title: 'National Emergency Services (NL)', number: '112', categoryKey: 'emergency_services', category: 'Emergency Services', icon: <FaAmbulance />, link: 'tel:112' },
    { titleKey: 'water_board', title: 'Water Board Emergency Control', number: '0900-2025020', categoryKey: 'dike_water_safety', category: 'Dike & Water Safety', icon: <FaBuilding />, link: 'tel:09002025020' }
  ]
};

export default function EmergencyContacts() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filterBySearch = (items) => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const translatedTitle = item.titleKey ? t(`emergency.contacts.${item.titleKey}`, item.title) : item.title;
      const translatedCategory = item.categoryKey ? t(`emergency.categories.${item.categoryKey}`, item.category) : item.category;
      return (
        translatedTitle?.toLowerCase().includes(term) ||
        translatedCategory?.toLowerCase().includes(term) ||
        item.number?.toLowerCase().includes(term)
      );
    });
  };

  return (
    <div className="emergency-section">
      {/* Clustered Header Card */}
      <div className="emergency-header-cluster">
        <div className="emergency-header-main">
          <div className="emergency-header-title">
            <FaShieldAlt className="emergency-header-icon" />
            <div>
              <h2>{t('emergency.title', 'Disaster Emergency Contacts')}</h2>
              <p>{t('emergency.subtitle', 'Direct helplines and control room numbers for LODESTAR study sites.')}</p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="emergency-search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder={t('emergency.search_placeholder', 'Search contact, zone, or service...')} 
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
            <FaMapMarkerAlt /> {t('emergency.all_sites', 'All Sites')}
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'guwahati' ? 'active' : ''}`}
            onClick={() => setActiveTab('guwahati')}
          >
            <FaMapMarkerAlt /> {t('emergency.guwahati_tab', 'Guwahati (Assam)')}
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'bengaluru' ? 'active' : ''}`}
            onClick={() => setActiveTab('bengaluru')}
          >
            <FaMapMarkerAlt /> {t('emergency.bengaluru_tab', 'Bengaluru (Karnataka)')}
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'anantapur' ? 'active' : ''}`}
            onClick={() => setActiveTab('anantapur')}
          >
            <FaMapMarkerAlt /> {t('emergency.anantapur_tab', 'Anantapur (AP)')}
          </button>
          <button 
            className={`emergency-tab ${activeTab === 'netherlands' ? 'active' : ''}`}
            onClick={() => setActiveTab('netherlands')}
          >
            <FaMapMarkerAlt /> {t('emergency.netherlands_tab', 'Netherlands (EU)')}
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
                  <h3>{t('emergency.bengaluru_title', 'Bengaluru Study Site')}</h3>
                  <span className="city-subtext">{t('emergency.bengaluru_subtext', 'BBMP Flood & Emergency Helplines • Karnataka, India')}</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.bengaluru.general).map((item, index) => (
                <div key={index} className="emergency-card highlight">
                  <div className="emergency-card-body">
                    <span className="emergency-cat-tag">{t(`emergency.categories.${item.categoryKey}`, item.category)}</span>
                    <h4>{t(`emergency.contacts.${item.titleKey}`, item.title)}</h4>
                    <a href={item.link} className="emergency-phone-btn">
                      <FaPhoneAlt /> {item.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* BBMP Zonal Helpline Table */}
            <div className="bbmp-zonal-container">
              <h4>{t('emergency.bbmp_zonal_title', 'BBMP Zonal Flood Control Rooms')}</h4>
              <div className="table-responsive">
                <table className="bbmp-zonal-table">
                  <thead>
                    <tr>
                      <th>{t('emergency.zone_name', 'Zone Name')}</th>
                      <th>{t('emergency.mobile_control', 'Mobile Control Room')}</th>
                      <th>{t('emergency.landline_numbers', 'Landline Number(s)')}</th>
                      <th>{t('emergency.action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencyData.bengaluru.zones
                      .filter(z => {
                        if (!searchTerm) return true;
                        const term = searchTerm.toLowerCase();
                        const translatedZone = z.zoneKey ? t(`emergency.zones.${z.zoneKey}`, z.zone) : z.zone;
                        return translatedZone.toLowerCase().includes(term) || z.mobile.includes(term) || z.landline.includes(term);
                      })
                      .map((zone, idx) => (
                        <tr key={idx}>
                          <td><strong>{t(`emergency.zones.${zone.zoneKey}`, zone.zone)}</strong></td>
                          <td>
                            <a href={`tel:${zone.mobile}`} className="table-phone-link">
                              <FaPhoneAlt /> {zone.mobile}
                            </a>
                          </td>
                          <td>{zone.landline}</td>
                          <td>
                            <a href={`tel:${zone.mobile}`} className="table-call-pill">
                              {t('emergency.call_zone', 'Call Zone')}
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
                  <h3>{t('emergency.guwahati_title', 'Guwahati Study Site')}</h3>
                  <span className="city-subtext">{t('emergency.guwahati_subtext', 'Disaster & Emergency Contacts • Assam, India')}</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.guwahati).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{t(`emergency.categories.${item.categoryKey}`, item.category)}</span>
                    </div>
                    <h4>{t(`emergency.contacts.${item.titleKey}`, item.title)}</h4>
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
                  <h3>{t('emergency.anantapur_title', 'Anantapur Study Site')}</h3>
                  <span className="city-subtext">{t('emergency.anantapur_subtext', 'Drought & Disaster Control • Andhra Pradesh, India')}</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.anantapur).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{t(`emergency.categories.${item.categoryKey}`, item.category)}</span>
                    </div>
                    <h4>{t(`emergency.contacts.${item.titleKey}`, item.title)}</h4>
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
                  <h3>{t('emergency.netherlands_title', 'Netherlands Study Sites')}</h3>
                  <span className="city-subtext">{t('emergency.netherlands_subtext', 'Dordrecht & Geertruidenberg Water Helplines • Netherlands, EU')}</span>
                </div>
              </div>
            </div>

            <div className="emergency-grid">
              {filterBySearch(emergencyData.netherlands).map((item, index) => (
                <div key={index} className="emergency-card">
                  <div className="emergency-card-body">
                    <div className="emergency-card-top">
                      <span className="emergency-icon-wrapper">{item.icon}</span>
                      <span className="emergency-cat-tag">{t(`emergency.categories.${item.categoryKey}`, item.category)}</span>
                    </div>
                    <h4>{t(`emergency.contacts.${item.titleKey}`, item.title)}</h4>
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
