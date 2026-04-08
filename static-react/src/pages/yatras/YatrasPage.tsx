import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

export const YatrasPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Yatras</CardTitle>
          <CardDescription>
            Join group practices and connect with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Group practice functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};