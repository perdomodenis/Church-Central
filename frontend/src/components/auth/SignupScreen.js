import React from 'react';

const SignupScreen = ({ step, data, onChange, onNext, onBack }) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Personal Information</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <InputField label="First Name" value={data.first} onChange={(v) => onChange({ first: v })} placeholder="John" />
              <InputField label="Last Name" value={data.last} onChange={(v) => onChange({ last: v })} placeholder="Doe" />
            </div>
            <InputField label="Email Address" type="email" value={data.email} onChange={(v) => onChange({ email: v })} placeholder="email@example.com" />
            <InputField label="Password" type="password" value={data.pw} onChange={(v) => onChange({ pw: v })} placeholder="••••••••" />
            <InputField label="Confirm Password" type="password" value={data.pw2} onChange={(v) => onChange({ pw2: v })} placeholder="••••••••" />
          </>
        );
      case 2:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Location and Church</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <InputField label="Zip Code" value={data.zip} onChange={(v) => onChange({ zip: v })} placeholder="12345" />
              <InputField label="City" value={data.city} onChange={(v) => onChange({ city: v })} placeholder="City" />
            </div>
            <InputField label="Court / Church" value={data.court} onChange={(v) => onChange({ court: v })} placeholder="Name of your church" />
          </>
        );
      case 3:
        return (
          <>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Your Role</h2>
            <InputField label="Position" value={data.position} onChange={(v) => onChange({ position: v })} placeholder="Ex: Volunteer, Member" />
            <InputField label="Department" value={data.dept} onChange={(v) => onChange({ dept: v })} placeholder="Ex: Worship, Youth" />
            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Interests</label>
              <input
                type="text"
                value={data.interests.join(', ')}
                onChange={(e) => onChange({ interests: e.target.value.split(',').map(i => i.trim()) })}
                placeholder="Ex: Music, Missions (comma separated)"
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
        <h1 style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '8px' }}>Join the Family</h1>
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
            {step === 1 ? 'Cancel' : 'Back'}
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
            {step === 3 ? 'Create Account' : 'Continue'}
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

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outlineColor: 'var(--accent)',
  boxSizing: 'border-box'
};

export default SignupScreen;