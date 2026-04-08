import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FiPlay, FiTrendingUp, FiUsers, FiTarget } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: FiPlay,
      title: 'Start Practice',
      description: 'Begin your daily meditation',
      action: () => console.log('Start practice'),
    },
    {
      icon: FiTrendingUp,
      title: 'View Progress',
      description: 'Check your practice statistics',
      action: () => console.log('View progress'),
    },
    {
      icon: FiUsers,
      title: 'Join Group',
      description: 'Connect with others',
      action: () => console.log('Join group'),
    },
    {
      icon: FiTarget,
      title: 'Set Goal',
      description: 'Define your practice goals',
      action: () => console.log('Set goal'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-text mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-text-secondary">
          Ready to continue your mindfulness journey?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={action.action}
            >
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-text mb-1">{action.title}</h3>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
          <CardDescription>
            Track your daily practice achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Meditation Time</span>
              <span className="font-semibold">0 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Streak</span>
              <span className="font-semibold">0 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Practices Completed</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspirational Quote */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6 text-center">
          <blockquote className="text-lg italic text-text mb-2">
            "The mind is everything. What you think you become."
          </blockquote>
          <cite className="text-text-secondary">- Buddha</cite>
        </CardContent>
      </Card>
    </div>
  );
};