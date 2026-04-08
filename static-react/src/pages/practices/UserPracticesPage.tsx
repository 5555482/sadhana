import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const UserPracticesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>My Practices</CardTitle>
          <CardDescription>
            Manage your daily practice routines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Practice management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};