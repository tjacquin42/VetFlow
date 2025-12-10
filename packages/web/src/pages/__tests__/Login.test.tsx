import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { Login } from '../Login';

// Mock useAuth hook
const mockSignIn = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signInWithGoogle: mockSignInWithGoogle,
    user: null,
    loading: false,
  }),
}));

// Mock authSchemas
vi.mock('@/lib/authSchemas', () => ({
  loginSchema: {
    safeParse: (data: any) => {
      if (!data.email || !data.password) {
        return {
          success: false,
          error: {
            errors: [
              { path: ['email'], message: 'Email requis' },
              { path: ['password'], message: 'Mot de passe requis' },
            ],
          },
        };
      }
      return { success: true };
    },
  },
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('VetFlow')).toBeInTheDocument();
    expect(screen.getByText('Connectez-vous à votre compte')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('renders Google sign in button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Se connecter avec Google')).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText("Pas encore de compte ?")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Mot de passe oublié ?')).toBeInTheDocument();
  });

  it('updates form data when typing', async () => {
    const { user } = renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signIn when form is submitted', async () => {
    mockSignIn.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message on sign in failure', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));
    const { user } = renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls signInWithGoogle when Google button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Login />);

    const googleButton = screen.getByText('Se connecter avec Google');
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('disables inputs while loading', async () => {
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const { user } = renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check if button shows loading state
    expect(submitButton).toBeDisabled();
  });
});
