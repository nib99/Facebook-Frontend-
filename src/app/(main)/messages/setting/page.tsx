'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, Eye, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <Card>
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Profile Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Update your profile information
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      defaultValue={user?.firstName}
                      placeholder="John"
                    />
                    <Input
                      label="Last Name"
                      defaultValue={user?.lastName}
                      placeholder="Doe"
                    />
                  </div>

                  <Input
                    label="Username"
                    defaultValue={user?.username}
                    placeholder="johndoe"
                  />

                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email}
                    placeholder="john@example.com"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      defaultValue={user?.bio}
                      placeholder="Tell us about yourself..."
                      rows={4}
                       className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-dark-600"
                    />
                  </div>

                  <Button onClick={handleSave} isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Account Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Manage your account security
                    </p>
                  </div>

                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                  />

                  <Button onClick={handleSave} isLoading={isLoading}>
                    Update Password
                  </Button>

                  <div className="pt-6 border-t border-gray-200 dark:border-dark-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Permanently delete your account and all data
                    </p>
                    <Button variant="danger">
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Privacy Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Control who can see your content
                    </p>
                    </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Profile Visibility', description: 'Who can see your profile' },
                      { label: 'Post Privacy', description: 'Default privacy for new posts' },
                      { label: 'Friend Requests', description: 'Who can send you friend requests' },
                      { label: 'Messages', description: 'Who can message you' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <select className="px-3 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>Everyone</option>
                          <option>Friends</option>
                          <option>Only Me</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSave} isLoading={isLoading}>
                    Save Privacy Settings
                  </Button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Notification Settings
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Choose what notifications you receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Likes', description: 'When someone likes your post' },
                      { label: 'Comments', description: 'When someone comments on your post' },
                      { label: 'Friend Requests', description: 'When you receive a friend request' },
                      { label: 'Messages', description: 'When you receive a new message' },
                      { label: 'Mentions', description: 'When someone mentions you' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSave} isLoading={isLoading}>
                    Save Notification Settings
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


