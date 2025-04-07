
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BasecampConnect from '@/components/BasecampConnect';
import SprintSummary from '@/components/dashboard/SprintSummary';
import UpcomingCeremonies from '@/components/dashboard/UpcomingCeremonies';
import TeamActivity from '@/components/dashboard/TeamActivity';

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to Scrum Connect. Track your sprint progress and upcoming ceremonies.
          </p>
        </div>
        
        <BasecampConnect />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SprintSummary />
          <UpcomingCeremonies />
        </div>
        
        <TeamActivity />
      </div>
    </MainLayout>
  );
};

export default Index;
