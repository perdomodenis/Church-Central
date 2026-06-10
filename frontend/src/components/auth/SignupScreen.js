import React from 'react';
import { COURTS, DEPARTMENTS, ROLES, DISTRICTS, SOW_CLASSES } from '../../services/churchConstants';
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
            <SelectField label={t('gender') || 'Gender'} value={data.gender} onChange={(v) => onChange({ gender: v })} options={['Male', 'Female']} t={t} />
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
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                {t('courts') || 'Courts'}
              </label>
              <div style={{ display: 'flex', gap: '20px', padding: '4px 0' }}>
                {COURTS.map(c => {
                  const selected = data.courts?.includes(c);
                  return (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(data.courts || []), c]
                            : (data.courts || []).filter(item => item !== c);
                          onChange({ courts: updated });
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{t(toCamelCase(c)) || c}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <SelectField label={t('district') || 'District'} value={data.district} onChange={(v) => onChange({ district: v })} options={DISTRICTS} t={t} />
          </>
        );
      case 3:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{t('yourRole')}</h2>
            <SelectField label={t('positionLabel')} value={data.position} onChange={(v) => onChange({ position: v })} options={ROLES} t={t} />
            <SelectField label={t('schoolClass') || 'School of the Word Class'} value={data.schoolClass} onChange={(v) => onChange({ schoolClass: v })} options={SOW_CLASSES} t={t} />
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
                {t('departments') || 'Departments'}
              </label>
              <div style={{
                maxHeight: '150px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: 'white'
              }}>
                {DEPARTMENTS.map(d => {
                  const selected = data.depts?.includes(d);
                  return (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(data.depts || []), d]
                            : (data.depts || []).filter(item => item !== d);
                          onChange({ depts: updated });
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{t(toCamelCase(d)) || d}</span>
                    </label>
                  );
                })}
              </div>
            </div>

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