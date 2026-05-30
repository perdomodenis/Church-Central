import React, { useState, useEffect } from 'react';
import { searchMembers } from '../../services/memberService';

const MemberSearchScreen = ({ user, onSelectMember, onNavigate }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const result = await searchMembers('');
    setMembers(result.filter(m => m.uid !== user.uid));
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    const result = await searchMembers(query);
    setMembers(result.filter(m => m.uid !== user.uid));
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '24px', color: '#111' }}>
        Miembros
      </h2>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, email o departamento..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            outlineColor: 'var(--accent)'
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Cargando miembros...</p>
      ) : members.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {members.map((member) => (
            <div
              key={member.uid}
              onClick={() => onSelectMember(member)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
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
                  backgroundPosition: 'center'
                }}
              >
                {!member.profilePhoto && member.first?.[0]}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: '#111' }}>
                  {member.first} {member.last}
                </div>
                {member.email && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                    {member.email}
                  </div>
                )}
                {member.dept && (
                  <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '2px' }}>
                    {member.dept} {member.position && `• ${member.position}`}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '1.5rem' }}>→</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          <p>No se encontraron miembros.</p>
        </div>
      )}
    </div>
  );
};

export default MemberSearchScreen;
