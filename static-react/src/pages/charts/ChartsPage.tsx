import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const ChartsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Charts & Analytics</CardTitle>
          <CardDescription>
            Visualize your practice progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Charts and analytics functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};