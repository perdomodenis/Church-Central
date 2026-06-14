import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './SignupScreen.css';

const SignupScreen = ({ data, onChange, onNext, onBack }) => {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundImage: 'url("/auth-bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 0
      }}></div>

      <div className="main-container" style={{ zIndex: 1 }}>
          <div className="auth-panel">
              <h1>{t('joinFamily') || 'Create Account'}</h1>
              <p>Welcome! Let's get you set up to join the community.</p>
              <div className="auth-card">
                  <form onSubmit={handleSubmit}>
                      <div className="field-group">
                           <div className="field-wrap">
                              <label htmlFor="firstName">{t('firstName') || 'First Name'}</label>
                              <input 
                                type="text" 
                                id="firstName" 
                                name="firstName" 
                                required 
                                value={data.first || ''} 
                                onChange={(e) => onChange({ first: e.target.value })} 
                              />
                          </div>
                          <div className="field-wrap">
                              <label htmlFor="lastName">{t('lastName') || 'Last Name'}</label>
                              <input 
                                type="text" 
                                id="lastName" 
                                name="lastName" 
                                required 
                                value={data.last || ''} 
                                onChange={(e) => onChange({ last: e.target.value })} 
                              />
                          </div>
                      </div>
                      <div className="field-wrap">
                          <label htmlFor="gender">{t('gender') || 'Gender'}</label>
                          <select 
                            id="gender" 
                            name="gender" 
                            required 
                            value={data.gender || ''} 
                            onChange={(e) => onChange({ gender: e.target.value })}
                          >
                              <option value="" disabled>Select your gender</option>
                              <option value="Male">{t('male') || 'Male'}</option>
                              <option value="Female">{t('female') || 'Female'}</option>
                          </select>
                      </div>
                      <div className="field-group">
                          <div className="field-wrap">
                              <label htmlFor="zip">{t('zipCode') || 'Zip Code'}</label>
                              <input 
                                type="text" 
                                id="zip" 
                                name="zip" 
                                required 
                                value={data.zip || ''} 
                                onChange={(e) => onChange({ zip: e.target.value })} 
                              />
                          </div>
                          <div className="field-wrap">
                              <label htmlFor="city">{t('city') || 'City'}</label>
                              <input 
                                type="text" 
                                id="city" 
                                name="city" 
                                required 
                                value={data.city || ''} 
                                onChange={(e) => onChange({ city: e.target.value })} 
                              />
                          </div>
                      </div>
                      <div className="field-wrap">
                          <label htmlFor="email">{t('email') || 'Email Address'}</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required 
                            value={data.email || ''} 
                            onChange={(e) => onChange({ email: e.target.value })} 
                          />
                      </div>
                      <div className="field-wrap">
                          <label htmlFor="password">{t('password') || 'Password'}</label>
                          <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            value={data.pw || ''} 
                            onChange={(e) => onChange({ pw: e.target.value })} 
                          />
                      </div>
                       <div className="field-wrap">
                          <label htmlFor="confirmPassword">{t('confirmPassword') || 'Confirm Password'}</label>
                          <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            required 
                            value={data.pw2 || ''} 
                            onChange={(e) => onChange({ pw2: e.target.value })} 
                          />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                          <button 
                            type="button" 
                            className="btn" 
                            style={{ flex: 1, marginTop: 0, backgroundColor: 'var(--bg)', border: '1px solid var(--line-2)', color: 'var(--ink-2)' }} 
                            onClick={onBack}
                          >
                            {t('cancel') || 'Cancel'}
                          </button>
                          <button type="submit" className="btn btn-primary" style={{ flex: 1, marginTop: 0 }}>
                            {t('continue') || 'Continue'}
                          </button>
                      </div>
                  </form>
              </div>
              <div className="auth-footer" style={{ paddingBottom: '0px', marginBottom: '6px' }}>
                  {t('alreadyHaveAccount') || 'Already have an account?'} <button onClick={onBack}>{t('login') || 'Log In'}</button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SignupScreen;