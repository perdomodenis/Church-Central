import React, { useState } from 'react';
import { seedTestData } from '../../services/seedData';

const DebugScreen = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('Agregando datos de prueba...');
    try {
      await seedTestData();
      setMessage('✅ Datos agregados exitosamente! Recarga la página.');
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      <button onClick={onBack} style={{ marginBottom: '24px', padding: '8px 16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        ← Back
      </button>

      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>
        Debug: Add Test Data
      </h2>

      <button
        onClick={handleSeedData}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {loading ? 'Adding...' : 'Add 5 Test Users'}
      </button>

      {message && (
        <div style={{
          padding: '16px',
          backgroundColor: message.includes('✅') ? '#e8f5e9' : '#ffebee',
          color: message.includes('✅') ? '#2e7d32' : '#c62828',
          borderRadius: '8px',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DebugScreen;
