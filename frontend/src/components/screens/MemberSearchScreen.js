import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { searchMembers } from '../../services/memberService';
import { COURTS } from '../../services/churchConstants';
import * as Icon from '../common/Icons';
import BaptismScreen from './BaptismScreen';
import NLSScreen from './NLSScreen';
import AppointmentScreen from './AppointmentScreen';

const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};



const getCourts = (member) => {
  const courtVal = member.court || member.campus || 'Global';
  if (Array.isArray(courtVal)) return courtVal;
  if (typeof courtVal === 'string') {
    return courtVal.split(',').flatMap(s => { const trimmed = s.trim(); return trimmed ? [trimmed] : []; });
  }
  return ['Global'];
};

const getDepartments = (member) => {
  const deptVal = member.dept || 'General';
  if (Array.isArray(deptVal)) return deptVal;
  if (typeof deptVal === 'string') {
    return deptVal.split(',').flatMap(s => { const trimmed = s.trim(); return trimmed ? [trimmed] : []; });
  }
  return ['General'];
};

const MemberSearchScreen = ({ user, onSelectMember, onNavigate }) => {
  const { t } = useLanguage();
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Hub Navigation State
  const [activeSubTab, setActiveSubTab] = useState(
    (user?.accessLevel >= 3) ? 'directory' : 
    (user?.accessLevel >= 2) ? 'baptism' : 'appointments'
  );

  // Court and folder navigation states
  const [activeCourt, setActiveCourt] = useState('Glory Court');
  const [expandedDepts, setExpandedDepts] = useState({});

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const result = await searchMembers('');
      // Filter out current user from listing
      const otherMembers = result.filter(m => m.uid !== user.uid);
      setMembers(otherMembers);

      // Auto-expand the first folder with items in the initial court tab
      const initialCourtMembers = otherMembers.filter(m => getCourts(m).includes('Glory Court'));
      if (initialCourtMembers.length > 0) {
        const firstDept = getDepartments(initialCourtMembers[0])[0] || 'General';
        setExpandedDepts({ [firstDept]: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Grouping & Filtering Logic
  const matchesQuery = (member) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const first = (member.first || '').toLowerCase();
    const last = (member.last || '').toLowerCase();
    const email = (member.email || '').toLowerCase();
    const position = (member.position || '').toLowerCase();
    const bio = (member.bio || '').toLowerCase();
    
    const deptsStr = getDepartments(member).join(' ').toLowerCase();
    const courtsStr = getCourts(member).join(' ').toLowerCase();

    return (
      first.includes(q) ||
      last.includes(q) ||
      email.includes(q) ||
      position.includes(q) ||
      bio.includes(q) ||
      deptsStr.includes(q) ||
      courtsStr.includes(q)
    );
  };

  const filteredMembers = members.filter(matchesQuery);

  // Tab count calculations
  const getCourtMemberCount = (courtName) => {
    return filteredMembers.filter(m => getCourts(m).includes(courtName)).length;
  };

  const activeCourtMembers = filteredMembers.filter(m => getCourts(m).includes(activeCourt));

  // Group members into departments
  const groupedMembers = {};
  activeCourtMembers.forEach(member => {
    const memberDepts = getDepartments(member);
    memberDepts.forEach(dept => {
      if (!groupedMembers[dept]) {
        groupedMembers[dept] = [];
      }
      if (!groupedMembers[dept].some(m => m.uid === member.uid)) {
        groupedMembers[dept].push(member);
      }
    });
  });

  // Sort departments: General first, then alphabetically
  const sortedDepts = Object.entries(groupedMembers).sort(([a], [b]) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  // Auto-expand folders when searching is active
  useEffect(() => {
    if (searchQuery.trim() !== '' && activeCourtMembers.length > 0) {
      const deptsToExpand = {};
      activeCourtMembers.forEach(member => {
        getDepartments(member).forEach(dept => {
          deptsToExpand[dept] = true;
        });
      });
      setExpandedDepts(deptsToExpand);
    }
  }, [searchQuery, activeCourt]);

  const toggleDept = (dept) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* --- HORIZONTAL NAV BAR --- */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 20px',
        overflowX: 'auto',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none'  // IE 10+
      }}>
        <style>{`
          .church-nav-bar::-webkit-scrollbar { display: none; }
        `}</style>

        {(user?.accessLevel >= 3) && (
          <button 
            onClick={() => setActiveSubTab('directory')} 
            style={topTabStyle(activeSubTab === 'directory')}
          >
            Directory
          </button>
        )}
        
        {user?.accessLevel >= 2 && (
          <button 
            onClick={() => setActiveSubTab('baptism')} 
            style={topTabStyle(activeSubTab === 'baptism')}
          >
            Baptism
          </button>
        )}

        <button 
          onClick={() => setActiveSubTab('appointments')} 
          style={topTabStyle(activeSubTab === 'appointments')}
        >
          Appointments
        </button>

        <button 
          onClick={() => setActiveSubTab('nls')} 
          style={topTabStyle(activeSubTab === 'nls')}
        >
          New Life School
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeSubTab === 'directory' && (user?.accessLevel >= 3) && (
          <div style={{ padding: '24px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--ink, #111)' }}>⛪ {t('church')}</h2>
              <p style={{ color: 'var(--ink-3, #666)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>Connect with your church family</p>
            </div>
      {/* Search Bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ position: 'absolute', left: '14px', fontSize: '1.1rem', color: '#888' }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, position, department, or court..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            borderRadius: '12px',
            border: '1px solid var(--line-2, #ddd)',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            backgroundColor: '#fafafa',
            transition: 'border-color 0.2s'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              color: '#888',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Court Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--line-2, #eee)', paddingBottom: '12px' }}>
        {COURTS.map(court => (
          <button 
            key={court}
            onClick={() => {
              setActiveCourt(court);
              const courtItems = filteredMembers.filter(m => getCourts(m).includes(court));
              if (courtItems.length > 0) {
                const firstDept = getDepartments(courtItems[0])[0] || 'General';
                setExpandedDepts({ [firstDept]: true });
              } else {
                setExpandedDepts({});
              }
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeCourt === court ? 'var(--accent)' : 'transparent',
              color: activeCourt === court ? 'white' : 'var(--ink-2, #555)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <span>{court === 'Global' ? '🌐' : '⛪'}</span>
            <span>{t(toCamelCase(court)) || court}</span>
            <span style={{
              backgroundColor: activeCourt === court ? 'rgba(255,255,255,0.25)' : 'var(--accent-soft, #f4f2ff)',
              color: activeCourt === court ? 'white' : 'var(--accent)',
              fontSize: '0.75rem',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '700',
              marginLeft: '4px'
            }}>
              {getCourtMemberCount(court)}
            </span>
          </button>
        ))}
      </div>

      {/* Main List Body */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3, #999)' }}>
          <div className="spinner" style={{ marginBottom: '16px' }}>⌛</div>
          {t('loading')}
        </div>
      ) : activeCourtMembers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          backgroundColor: 'var(--surface, #fafafa)',
          borderRadius: '24px',
          border: '1px solid var(--line-2, #eee)',
          color: 'var(--ink-3, #999)'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>👥</span>
          <p style={{ fontWeight: '600', fontSize: '1rem', margin: 0 }}>
            {searchQuery ? 'No matching members found' : t('noMembersFound')}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(91, 63, 187, 0.15)'
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedDepts.map(([dept, deptMembers]) => {
            const isExpanded = !!expandedDepts[dept];
            return (
              <div 
                key={dept} 
                style={{ 
                  borderRadius: '16px', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--line-2, #eee)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                {/* Folder Header */}
                <button
                  onClick={() => toggleDept(dept)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: isExpanded ? 'var(--accent-soft, #f4f2ff)' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{isExpanded ? '📂' : '📁'}</span>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--ink, #111)' }}>
                      {t(toCamelCase(dept)) || dept}
                    </span>
                    <span style={{ 
                      backgroundColor: 'rgba(91, 63, 187, 0.1)', 
                      color: 'var(--accent)', 
                      fontSize: '0.8rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {deptMembers.length}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--ink-3)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {/* Folder Content (Members) */}
                {isExpanded && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #eee' }}>
                    {deptMembers.map(member => (
                      <div
                        key={member.uid}
                        onClick={() => onSelectMember(member)}
                        style={{
                          backgroundColor: '#fafafa',
                          borderRadius: '12px',
                          padding: '14px',
                          border: '1px solid var(--line-2, #f0f0f0)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                      >
                        {/* Profile Image / Initials */}
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '25px',
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            flexShrink: 0,
                            backgroundImage: member.profilePhoto ? `url(${member.profilePhoto})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '1.5px solid #ddd'
                          }}
                        >
                          {!member.profilePhoto && member.first?.[0]}
                        </div>

                        {/* Member Info details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--ink)' }}>
                            {member.first} {member.last}
                          </div>
                          {member.email && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--ink-3, #666)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {member.email}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                            {member.position && (
                              <span style={{
                                backgroundColor: 'var(--accent-soft)',
                                color: 'var(--accent)',
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                fontWeight: '600'
                              }}>
                                {member.position}
                              </span>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>
                              Court: {getCourts(member).join(', ')}
                            </span>
                          </div>
                        </div>

                        <div style={{ fontSize: '1.2rem', color: 'var(--accent)', paddingRight: '4px' }}>→</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    )}

    {activeSubTab === 'baptism' && user?.accessLevel >= 2 && (
      <BaptismScreen user={user} />
    )}

    {activeSubTab === 'appointments' && (
      <AppointmentScreen user={user} />
    )}

    {activeSubTab === 'nls' && (
      <NLSScreen user={user} />
    )}
    </div>
  </div>
  );
};

const topTabStyle = (isActive) => ({
  whiteSpace: 'nowrap',
  padding: '8px 16px',
  borderRadius: '20px',
  border: 'none',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  backgroundColor: isActive ? 'var(--accent)' : 'var(--line)',
  color: isActive ? 'white' : 'var(--ink-2)',
  transition: 'all 0.2s',
  flexShrink: 0
});

export default MemberSearchScreen;
