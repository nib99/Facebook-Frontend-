import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUser } from '@/store/slices/authSlice';

export const useAuth = (requireAuth: boolean = true) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && !user) {
      dispatch(loadUser());
    } else if (!token && requireAuth) {
      router.push('/login');
    }
  }, [dispatch, user, requireAuth, router]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  return { user, isAuthenticated, isLoading };
};


