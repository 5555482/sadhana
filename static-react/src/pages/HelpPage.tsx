import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>
            Get help with using Sadhana Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Help and support functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};