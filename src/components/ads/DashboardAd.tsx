
import React from 'react';
import { AdUnit } from './AdUnit';

export const DashboardAd = () => {
  return (
    <AdUnit 
      slot="1234567890" // Replace with your actual ad slot ID
      style={{ width: '100%', height: 'auto', minHeight: '90px' }}
      className="rounded-lg overflow-hidden shadow-sm my-3"
    />
  );
};
