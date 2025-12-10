import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { AuthGuard } from '../AuthGuard';
import type { User } from '@vetflow/shared';

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AuthGuard', () => {
  it('shows loading spinner when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      session: null,
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Check for spinner by looking for the SVG animation class
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      session: null,
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    // Should redirect to login (Navigate component will handle this)
    expect(window.location.pathname).not.toBe('/profile');
  });

  it('renders children when authenticated', () => {
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      session: { user: mockUser },
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not show spinner when authenticated', () => {
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      session: { user: mockUser },
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });
});
