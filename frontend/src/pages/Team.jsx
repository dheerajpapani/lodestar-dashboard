/* eslint-disable no-unused-vars */
// src/pages/Team.jsx
import { useMemo } from 'react';
import { FaUniversity, FaBriefcase, FaTasks, FaBook, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../App.css';

const ProfileCard = ({ member }) => {
  const { t } = useTranslation();
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
          {member.image ? (
            <img src={`${import.meta.env.BASE_URL}${member.image}`} alt={member.name} className="leader-logo-img" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bba352' }} />
          ) : (
            <div className="leader-logo">{member.acronym}</div>
          )}
          <div className="leader-title-group">
            <h3>{member.name}</h3>
            <p>{member.title}</p>
          </div>
        </div>
        <div className="leader-body">
          <p className="leader-context">{member.institutionContext}</p>
          <div className="info-item"><FaBriefcase /><span><strong>{t('team.labels.role', 'Role in Project:')}</strong> {member.role}</span></div>
          <div className="info-item"><FaTasks /><span><strong>{t('team.labels.contribution', 'Primary Contribution:')}</strong> {member.projectContribution}</span></div>
          <div className="info-item"><FaBook /><span><strong>{t('team.labels.publication', 'Key Publication Insight:')}</strong> "{member.keyPublication.title}" — <em>{member.keyPublication.relevance}</em></span></div>
        </div>
        <div className="leader-footer">
          <a href={`mailto:${member.contact.email}`}><FaEnvelope /> {t('team.labels.email', 'Email')}</a>
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
      {member.image ? (
        <img src={`${import.meta.env.BASE_URL}${member.image}`} alt={member.name} className="member-logo-img" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '2px solid #bba352' }} />
      ) : (
        <div className="member-logo">{member.acronym}</div>
      )}
      <div className="member-info">
        <h4>{member.name}</h4>
        <p className="member-title">{member.title}</p>
        <span className="member-role-tag">{member.role}</span>
      </div>
    </motion.div>
  );
};

export default function Team() {
  const { t } = useTranslation();

  const consortiumMembers = useMemo(() => [
    {
      id: 1, team: 'Leadership', name: t('team.members.m1.name', 'Professor Anamika Barua'),
      title: t('team.members.m1.title', 'Professor, Dept. of Humanities and Social Sciences'),
      institution: t('team.members.m1.institution', 'Indian Institute of Technology-Guwahati (IIT-G)'), acronym: 'IIT-G',
      institutionContext: t('team.members.m1.institutionContext', "As one of India's top universities and a leading institute in engineering and disaster management, IIT-G provides the project's anchor in India."),
      role: t('team.members.m1.role', 'Indian Main Applicant (Principal Investigator)'),
      projectContribution: t('team.members.m1.projectContribution', 'Leads the Indian consortium, provides overall project co-ordination, supervises PhD students, and is directly involved in Work Streams 1, 3 & 5.'),
      keyPublication: {
        title: t('team.members.m1.publication.title', 'Media reporting on conflicts and cooperation... for the Brahmaputra basin.'),
        relevance: t('team.members.m1.publication.relevance', 'This research provides critical insight into the socio-political context of water management, essential for the success of a cross-community EWS.')
      },
      contact: { email: 'abarua@iitg.ac.in', phone: '+91 361 258 2563' },
      image: 'faculty/Professor-Anamika-Barua.jpg'
    },
    {
      id: 2, team: 'Leadership', name: t('team.members.m2.name', 'Dr. Jeroen F. Warner'),
      title: t('team.members.m2.title', 'Associate Professor, Crisis and Disaster Studies'),
      institution: t('team.members.m2.institution', 'Wageningen University & Research (WUR)'), acronym: 'WUR',
      institutionContext: t('team.members.m2.institutionContext', 'A world-leading institution in life sciences and social sciences, WUR brings interdisciplinary expertise in water, climate, and disaster studies.'),
      role: t('team.members.m2.role', 'Dutch Main Applicant (Principal Investigator)'),
      projectContribution: t('team.members.m2.projectContribution', 'Leads the Dutch consortium, provides overall project co-ordination, supervises PhDs and is directly involved in Work Streams 3 & 5.'),
      keyPublication: {
        title: t('team.members.m2.publication.title', 'The politics of adaptive climate management: Scientific recipes and lived reality.'),
        relevance: t('team.members.m2.publication.relevance', 'This work is foundational to LODESTAR’s core mission, exploring the crucial intersection of scientific solutions and the lived experiences of at-risk communities.')
      },
      contact: { email: 'Jeroen.warner@wur.nl', phone: '(+31) 3174824720' },
      image: 'faculty/Dr.-Jeroen-F.-Warner.webp'
    },
    { id: 3, team: 'Dutch', name: t('team.members.m3.name', 'Dr. Sumit Vij'), title: t('team.members.m3.title', 'Assistant Professor'), institution: t('team.members.m3.institution', 'Wageningen University & Research'), role: t('team.members.m3.role', 'Co-applicant & WS5 Lead'), acronym: 'WUR', image: 'faculty/Dr.-Sumit-Vij.jpg' },
    { id: 4, team: 'Dutch', name: t('team.members.m4.name', 'Dr. Jantsje van Loon-Steensma'), title: t('team.members.m4.title', 'Professor of Applied Sciences'), institution: t('team.members.m4.institution', 'VHL University'), role: t('team.members.m4.role', 'Co-applicant, Eco-DRR Expert'), acronym: 'VHL', image: 'faculty/Dr.-Jantsje-van-Loon-Steensma.jpg' },
    { id: 5, team: 'Dutch', name: t('team.members.m5.name', 'Dr. Spyridon Paparrizos'), title: t('team.members.m5.title', 'Assistant Professor'), institution: t('team.members.m5.institution', 'Wageningen University'), role: t('team.members.m5.role', 'Co-applicant & WS4 Co-lead'), acronym: 'WUR', image: 'faculty/Dr.-Spyridon-Paparrizos.jpg' },
    { id: 6, team: 'Dutch', name: t('team.members.m6.name', 'Dr. Frank van Steenbergen'), title: t('team.members.m6.title', 'Managing Director'), institution: t('team.members.m6.institution', 'MetaMeta Research'), role: t('team.members.m6.role', 'Partner & WS3 Lead'), acronym: 'MM', image: 'faculty/Dr.-Frank-van-Steenbergen.jpg' },
    { id: 7, team: 'Indian', name: t('team.members.m7.name', 'Dr. Roshan Karan Srivastav'), title: t('team.members.m7.title', 'Assistant Professor'), institution: t('team.members.m7.institution', 'IIT Tirupati'), role: t('team.members.m7.role', 'Co-applicant & WS4 Lead'), acronym: 'IIT-Tr', image: 'faculty/Dr.-Roshan-Karan-Srivastav.jpg' },
    { id: 8, team: 'Indian', name: t('team.members.m8.name', 'Dr. Rajarshi Das Bhowmik'), title: t('team.members.m8.title', 'Assistant Professor'), institution: t('team.members.m8.institution', 'IISc Bangalore'), role: t('team.members.m8.role', 'Co-applicant & WS2 Lead'), acronym: 'IISc', image: 'faculty/Dr.-Rajarshi-Das-Bhowmik.jpg' },
    { id: 9, team: 'Indian', name: t('team.members.m9.name', 'Dr. Indu K Murthy'), title: t('team.members.m9.title', 'Principal Research Scientist'), institution: t('team.members.m9.institution', 'CSTEP'), role: t('team.members.m9.role', 'Partner & WS3 Lead'), acronym: 'CSTEP', image: 'faculty/Dr.-Indu-K-Murthy.jpg' },
    { id: 10, team: 'Indian', name: t('team.members.m10.name', 'Dr. Anil Kumar Gupta'), title: t('team.members.m10.title', 'Head of Division'), institution: t('team.members.m10.institution', 'NIDM'), role: t('team.members.m10.role', 'Collaboration Partner'), acronym: 'NIDM', image: 'faculty/Dr.-Anil-Kumar-Gupta.jpg' },
  ], [t]);

  return (
    <div>
      <section className="hero-section-about">
        <div className="container">
          <h1 className="hero-title-about">{t('team.title', 'The LODESTAR Consortium')}</h1>
          <p className="hero-subtitle-about">{t('team.subtitle', 'A detailed overview of the dedicated, transdisciplinary team driving the project.')}</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container-wide">
          <h2 className="section-title">{t('team.sections.leadership', 'Project Leadership')}</h2>
          <div className="leader-grid">
            {consortiumMembers.filter(m => m.team === 'Leadership').map(member => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container-wide">
          <div className="consortium-grid">
            <div className="consortium-column">
              <h2 className="section-title">{t('team.sections.dutch', 'Dutch Consortium')}</h2>
              <div className="members-grid">
                {consortiumMembers.filter(m => m.team === 'Dutch').map(member => (
                  <ProfileCard key={member.id} member={member} />
                ))}
              </div>
            </div>
            <div className="consortium-column">
              <h2 className="section-title">{t('team.sections.indian', 'Indian Consortium')}</h2>
              <div className="members-grid">
                {consortiumMembers.filter(m => m.team === 'Indian').map(member => (
                  <ProfileCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
