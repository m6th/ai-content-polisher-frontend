import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { getOnboardingStatus } from '../services/api';

function DashboardWrapper({ user, onUpdateUser }) {
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await getOnboardingStatus();
      const onboardingData = response.data;

      // If onboarding not completed, redirect to onboarding
      if (!onboardingData.completed) {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If error checking status (e.g., endpoint doesn't exist yet), allow access to dashboard
    } finally {
      setCheckingOnboarding(false);
    }
  };

  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 dark:border-purple-400 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} onUpdateUser={onUpdateUser} />;
}

export default DashboardWrapper;
