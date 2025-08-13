import { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';

type AuthMode = 'login' | 'signup';

export function AuthFlow() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const switchToSignUp = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  return (
    <div className="min-h-screen">
      {authMode === 'login' ? (
        <LoginScreen onSwitchToSignUp={switchToSignUp} />
      ) : (
        <SignUpScreen onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
}