'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostFeed } from '@/components/posts/PostFeed';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Users, Calendar } from 'lucide-react';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <CreatePost />
            <PostFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-4">
            {/* Trending Topics */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  Trending Topics
                </h2>
              </div>
              <div className="space-y-3">
                {['#WebDevelopment', '#React', '#TypeScript', '#TailwindCSS', '#NextJS'].map((tag) => (
                  <button
                    key={tag}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <p className="font-medium text-primary-600">{tag}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 1000)}+ posts
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Friend Suggestions */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  People You May Know
                </h2>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No suggestions available
                </p>
              </div>
            </Card>
            
            {/* Upcoming Events */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  Upcoming Events
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No upcoming events
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
