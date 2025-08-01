/* eslint-disable no-unused-vars */
// src/pages/Team.jsx
import { Link } from 'react-router-dom';
import { FaUniversity, FaBriefcase, FaTasks, FaBook, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';

const consortiumMembers = [
  { 
    id: 1, team: 'Leadership', name: 'Professor Anamika Barua', 
    title: 'Professor, Dept. of Humanities and Social Sciences',
    institution: 'Indian Institute of Technology-Guwahati (IIT-G)', acronym: 'IIT-G',
    institutionContext: 'As one of India\'s top universities and a leading institute in engineering and disaster management, IIT-G provides the project\'s anchor in India.',
    role: 'Indian Main Applicant (Principal Investigator)', 
    projectContribution: 'Leads the Indian consortium, provides overall project co-ordination, supervises PhD students, and is directly involved in Work Streams 1, 3 & 5.',
    keyPublication: {
        title: 'Media reporting on conflicts and cooperation... for the Brahmaputra basin.',
        relevance: 'This research provides critical insight into the socio-political context of water management, essential for the success of a cross-community EWS.'
    },
    contact: { email: 'abarua@iitg.ac.in', phone: '+91 361 258 2563' }
  },
  { 
    id: 2, team: 'Leadership', name: 'Dr. Jeroen F. Warner', 
    title: 'Associate Professor, Crisis and Disaster Studies',
    institution: 'Wageningen University & Research (WUR)', acronym: 'WUR',
    institutionContext: 'A world-leading institution in life sciences and social sciences, WUR brings interdisciplinary expertise in water, climate, and disaster studies.',
    role: 'Dutch Main Applicant (Principal Investigator)', 
    projectContribution: 'Leads the Dutch consortium, provides overall project co-ordination, supervises PhDs and is directly involved in Work Streams 3 & 5.',
    keyPublication: {
        title: 'The politics of adaptive climate management: Scientific recipes and lived reality.',
        relevance: 'This work is foundational to LODESTAR’s core mission, exploring the crucial intersection of scientific solutions and the lived experiences of at-risk communities.'
    },
    contact: { email: 'Jeroen.warner@wur.nl', phone: '(+31) 3174824720' }
  },
  { id: 3, team: 'Dutch', name: 'Dr. Sumit Vij', title: 'Assistant Professor', institution: 'Wageningen University & Research', role: 'Co-applicant & WS5 Lead', acronym: 'WUR' },
  { id: 4, team: 'Dutch', name: 'Dr. Jantsje van Loon-Steensma', title: 'Professor of Applied Sciences', institution: 'VHL University', role: 'Co-applicant, Eco-DRR Expert', acronym: 'VHL' },
  { id: 5, team: 'Dutch', name: 'Dr. Spyridon Paparrizos', title: 'Assistant Professor', institution: 'Wageningen University', role: 'Co-applicant & WS4 Co-lead', acronym: 'WUR' },
  { id: 6, team: 'Dutch', name: 'Dr. Frank van Steenbergen', title: 'Managing Director', institution: 'MetaMeta Research', role: 'Partner & WS3 Lead', acronym: 'MM' },
  { id: 7, team: 'Indian', name: 'Dr. Roshan Karan Srivastav', title: 'Assistant Professor', institution: 'IIT Tirupati', role: 'Co-applicant & WS4 Lead', acronym: 'IIT-Tr' },
  { id: 8, team: 'Indian', name: 'Dr. Rajarshi Das Bhowmik', title: 'Assistant Professor', institution: 'IISc Bangalore', role: 'Co-applicant & WS2 Lead', acronym: 'IISc' },
  { id: 9, team: 'Indian', name: 'Dr. Indu K Murthy', title: 'Principal Research Scientist', institution: 'CSTEP', role: 'Partner & WS3 Lead', acronym: 'CSTEP' },
  { id: 10, team: 'Indian', name: 'Dr. Anil Kumar Gupta', title: 'Head of Division', institution: 'NIDM', role: 'Collaboration Partner', acronym: 'NIDM' },
];

const ProfileCard = ({ member }) => {
    const isLeader = member.team === 'Leadership';
    if (isLeader) {
      return (
        <motion.div 
          className="leader-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="leader-header">
            <div className="leader-logo">{member.acronym}</div>
            <div className="leader-title-group">
              <h3>{member.name}</h3>
              <p>{member.title}</p>
            </div>
          </div>
          <div className="leader-body">
            <p className="leader-context">{member.institutionContext}</p>
            <div className="info-item"><FaBriefcase /><span><strong>Role in Project:</strong> {member.role}</span></div>
            <div className="info-item"><FaTasks /><span><strong>Primary Contribution:</strong> {member.projectContribution}</span></div>
            <div className="info-item"><FaBook /><span><strong>Key Publication Insight:</strong> "{member.keyPublication.title}" — <em>{member.keyPublication.relevance}</em></span></div>
          </div>
          <div className="leader-footer">
            <a href={`mailto:${member.contact.email}`}><FaEnvelope /> Email</a>
            <span><FaPhone /> {member.contact.phone}</span>
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div 
        className="member-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="member-logo">{member.acronym}</div>
        <div className="member-info">
          <h4>{member.name}</h4>
          <p className="member-title">{member.title}</p>
          <span className="member-role-tag">{member.role}</span>
        </div>
      </motion.div>
    );
};

export default function Team() {
    return (
        <div>
            <section className="hero-section-about">
              <div className="container">
                <h1 className="hero-title-about">The LODESTAR Consortium</h1>
                <p className="hero-subtitle-about">A detailed overview of the dedicated, transdisciplinary team driving the project.</p>
              </div>
            </section>

            <section className="page-section">
              <div className="container">
                <h2 className="section-title">Project Leadership</h2>
                <div className="leader-grid">
                    {consortiumMembers.filter(m => m.team === 'Leadership').map(member => (
                        <ProfileCard key={member.id} member={member} />
                    ))}
                </div>
              </div>
            </section>

            <section className="page-section">
                <div className="consortium-grid">
                    <div className="consortium-column">
                        <h2 className="section-title">Dutch Consortium</h2>
                        <div className="members-grid">
                            {consortiumMembers.filter(m => m.team === 'Dutch').map(member => (
                                <ProfileCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                    <div className="consortium-column">
                        <h2 className="section-title">Indian Consortium</h2>
                        <div className="members-grid">
                            {consortiumMembers.filter(m => m.team === 'Indian').map(member => (
                                <ProfileCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
