import React from 'react';
import { COURTS, DEPARTMENTS, ROLES } from '../../services/churchConstants';
import { useLanguage } from '../../context/LanguageContext';

const SignupScreen = ({ step, data, onChange, onNext, onBack }) => {
  const { t } = useLanguage();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{t('personalInfo')}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <InputField label={t('firstName')} value={data.first} onChange={(v) => onChange({ first: v })} placeholder="John" />
              <InputField label={t('lastName')} value={data.last} onChange={(v) => onChange({ last: v })} placeholder="Doe" />
            </div>
            <InputField label={t('email')} type="email" value={data.email} onChange={(v) => onChange({ email: v })} placeholder="email@example.com" />
            <InputField label={t('password')} type="password" value={data.pw} onChange={(v) => onChange({ pw: v })} placeholder="••••••••" />
            <InputField label={t('confirmPassword')} type="password" value={data.pw2} onChange={(v) => onChange({ pw2: v })} placeholder="••••••••" />
          </>
        );
      case 2:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{t('locationAndChurch')}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <InputField label={t('zipCode')} value={data.zip} onChange={(v) => onChange({ zip: v })} placeholder="12345" />
              <InputField label={t('city')} value={data.city} onChange={(v) => onChange({ city: v })} placeholder="City" />
            </div>
            <SelectField label={t('courtOrChurch')} value={data.court} onChange={(v) => onChange({ court: v })} options={COURTS} t={t} />
          </>
        );
      case 3:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{t('yourRole')}</h2>
            <SelectField label={t('positionLabel')} value={data.position} onChange={(v) => onChange({ position: v })} options={ROLES} t={t} />
            <SelectField label={t('departmentLabel')} value={data.dept} onChange={(v) => onChange({ dept: v })} options={DEPARTMENTS} t={t} />
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>{t('interests')}</label>
              <input
                type="text"
                value={data.interests.join(', ')}
                onChange={(e) => onChange({ interests: e.target.value.split(',').map(i => i.trim()) })}
                placeholder={t('interestsPlaceholder')}
                style={inputStyle}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="signup-screen" style={{ 
      padding: '40px 20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>{t('joinFamily')}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ 
              width: '30px', 
              height: '4px', 
              borderRadius: '2px', 
              backgroundColor: s <= step ? 'var(--accent)' : '#ddd' 
            }} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {renderStep()}

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            type="button"
            onClick={onBack}
            style={{ 
              flex: 1,
              padding: '14px', 
              borderRadius: '8px', 
              border: '1px solid #ddd', 
              backgroundColor: 'white',
              fontWeight: '600', 
              cursor: 'pointer'
            }}
          >
            {step === 1 ? t('cancel') : t('back')}
          </button>
          <button 
            type="submit" 
            style={{ 
              flex: 2,
              backgroundColor: 'var(--accent)', 
              color: 'white', 
              padding: '14px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: '600', 
              cursor: 'pointer'
            }}
          >
            {step === 3 ? t('createAccount') : t('continue')}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="input-group" style={{ marginBottom: '16px', flex: 1 }}>
    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      style={inputStyle}
    />
  </div>
);

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

const SelectField = ({ label, value, onChange, options, t }) => (
  <div className="input-group" style={{ marginBottom: '16px', flex: 1 }}>
    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      style={selectStyle}
    >
      <option value="" disabled>{t('select')} {label}</option>
      {options.map(opt => {
        const key = toCamelCase(opt);
        return (
          <option key={opt} value={opt}>
            {t(key)}
          </option>
        );
      })}
    </select>
  </div>
);

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outlineColor: 'var(--accent)',
  boxSizing: 'border-box'
};

const selectStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outlineColor: 'var(--accent)',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  fontFamily: 'inherit',
  fontSize: '1rem',
  color: '#333'
};

export default SignupScreen;