import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { Profile } from '../Profile';
import type { User } from '@vetflow/shared';

const mockUser: Partial<User> = {
  id: '123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  clinic: 'Test Clinic',
  phone: '+33 6 12 34 56 78',
  plan: 'free',
};

const mockSignOut = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    signOut: mockSignOut,
    loading: false,
  }),
}));

// Mock Supabase
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: mockUpdate,
    })),
  },
}));

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile page with user data', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('Mon Profil')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Clinic')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+33 6 12 34 56 78')).toBeInTheDocument();
  });

  it('displays user email as read-only', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText("L'email ne peut pas être modifié")).toBeInTheDocument();
  });

  it('displays user plan', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('free')).toBeInTheDocument();
  });

  it('updates form data when typing', async () => {
    const { user } = renderWithProviders(<Profile />);

    const firstNameInput = screen.getByLabelText(/prénom/i);
    const lastNameInput = screen.getByLabelText(/nom/i);

    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');

    await user.clear(lastNameInput);
    await user.type(lastNameInput, 'Smith');

    expect(firstNameInput).toHaveValue('Jane');
    expect(lastNameInput).toHaveValue('Smith');
  });

  it('calls update when form is submitted', async () => {
    const { user } = renderWithProviders(<Profile />);

    const firstNameInput = screen.getByLabelText(/prénom/i);
    const submitButton = screen.getByRole('button', {
      name: /sauvegarder les modifications/i,
    });

    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it('displays success message on successful update', async () => {
    const { user } = renderWithProviders(<Profile />);

    const firstNameInput = screen.getByLabelText(/prénom/i);
    const submitButton = screen.getByRole('button', {
      name: /sauvegarder les modifications/i,
    });

    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/profil mis à jour avec succès/i)).toBeInTheDocument();
    });
  });

  it('calls signOut when logout button is clicked', async () => {
    mockSignOut.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Profile />);

    const logoutButton = screen.getByRole('button', { name: /se déconnecter/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('displays usage information for free plan users', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('Utilisation')).toBeInTheDocument();
    expect(screen.getByText('Calculs cette semaine')).toBeInTheDocument();
    expect(screen.getByText(/passez au plan premium/i)).toBeInTheDocument();
  });

  it('renders form inputs with correct labels', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clinique/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
  });

  it('renders account information section', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('Informations du compte')).toBeInTheDocument();
    expect(screen.getByText("Plan d'abonnement")).toBeInTheDocument();
  });

  it('renders personal information section', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
  });
});
