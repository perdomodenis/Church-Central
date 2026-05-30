import React, { useState } from 'react';
import { seedTestData } from '../../services/seedData';
import { seedProductionData } from '../../services/productionData';
import { seedLiveData } from '../../services/liveData';

const DebugScreen = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('Agregando datos de prueba...');
    try {
      await seedTestData();
      setMessage('✅ Datos de prueba agregados exitosamente! Recarga la página.');
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSeedProductionData = async () => {
    setLoading(true);
    setMessage('Agregando datos de producción...');
    try {
      await seedProductionData();
      setMessage('✅ Datos de producción agregados exitosamente! Recarga la página.');
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSeedLiveData = async () => {
    setLoading(true);
    setMessage('Agregando datos VIVOS de la iglesia...');
    try {
      await seedLiveData();
      setMessage('✅ ¡Datos VIVOS agregados! La app está lista para producción. Recarga la página.');
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
        Debug: Load Data
      </h2>

      <p style={{ color: '#666', marginBottom: '24px', fontSize: '0.9rem' }}>
        Choose an option to populate the database with data:
      </p>

      <button
        onClick={handleSeedData}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : '#FF6B6B',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '12px'
        }}
      >
        {loading ? 'Adding...' : 'Add 5 Test Users (Demo Data)'}
      </button>

      <button
        onClick={handleSeedProductionData}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '12px'
        }}
      >
        {loading ? 'Adding...' : 'Load Production Data (Grace Community Church)'}
      </button>

      <button
        onClick={handleSeedLiveData}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: loading ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {loading ? 'Adding...' : '🚀 Load LIVE Data (App Ready for Production!)'}
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
