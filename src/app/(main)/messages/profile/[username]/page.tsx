'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Link as LinkIcon, Calendar, Mail, Edit, UserPlus, MessageCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PostCard } from '@/components/posts/PostCard';
import { Spinner } from '@/components/ui/Spinner';
import { getFullName, formatDate } from '@/utils/helpers';
import api from '@/lib/api';
import { User, Post } from '@/types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAppSelector(state => state.auth);
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends'>('posts');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/profile/${username}`),
          api.get(`/posts/user/${username}`),
        ]);
        setProfile(profileRes.data.data);
        setPosts(postsRes.data.data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  if (!profile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            User not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-br from-primary-600 to-purple-600 relative">
          {profile.coverPhoto && (
            <img
              src={profile.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 pb-4">
              {/* Avatar & Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <Avatar
                  src={profile.avatar}
                  name={getFullName(profile)}
                  size="2xl"
                  className="ring-4 ring-white dark:ring-dark-800"
                />
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {getFullName(profile)}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{profile.username}
                  </p>
                  {profile.bio && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-md">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button variant="primary" leftIcon={<Edit className="w-4 h-4" />}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" leftIcon={<UserPlus className="w-4 h-4" />}>
                      Add Friend
                    </Button>
                    <Button variant="secondary" leftIcon={<MessageCircle className="w-4 h-4" />}>
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 py-4 border-t border-gray-200 dark:border-dark-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {posts.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.friends?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Friends</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.followers?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              {['posts', 'about', 'friends'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 dark:bg-primary-400 rounded-t" />
                  )}
                </button>
              ))}
            </div>
                      </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Sidebar - About */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  About
                </h2>
                <div className="space-y-3">
                  {profile.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-gray-100">{profile.location}</p>
                      </div>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-start gap-3">
                      <LinkIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                  {profile.email && isOwnProfile && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'posts' && (
                <div>
                  {posts.length === 0 ? (
                    <Card>
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No posts yet
                      </p>
                    </Card>
                  ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                  )}
                </div>
              )}

              {activeTab === 'about' && (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    About {profile.firstName}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Bio
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {profile.bio || 'No bio added yet'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Basic Info
                      </h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500 dark:text-gray-400">Username</dt>
                          <dd className="text-gray-900 dark:text-gray-100">@{profile.username}</dd>
                        </div>
                        {profile.dateOfBirth && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-gray-400">Birthday</dt>
                            <dd className="text-gray-900 dark:text-gray-100">
                              {formatDate(profile.dateOfBirth)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'friends' && (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Friends
                  </h2>
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No friends to show
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
    
  );
}


