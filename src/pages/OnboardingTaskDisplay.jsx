import React from 'react';
import OnboardingTasks from '../components/OnboardingTask';

const OnboardingTaskDisplay = () => {
  return (
    <main className="flex-1 p-4">
      {/* <h2 className="text-3xl font-bold mb-4">Onboarding Task Display</h2> */}
      <OnboardingTasks />
    </main>
  );
};

export default OnboardingTaskDisplay;
