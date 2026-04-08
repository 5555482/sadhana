import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Settings functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};