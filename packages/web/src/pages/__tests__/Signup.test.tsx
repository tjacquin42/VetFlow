import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { Signup } from '../Signup';

// Mock useAuth hook
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    user: null,
    loading: false,
  }),
}));

// Mock authSchemas
vi.mock('@/lib/authSchemas', () => ({
  signupSchema: {
    safeParse: (data: any) => {
      if (!data.email || !data.password || data.password !== data.confirmPassword) {
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
  getPasswordStrength: (password: string) => {
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  },
}));

describe('Signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form', () => {
    renderWithProviders(<Signup />);

    expect(screen.getByText('VetFlow')).toBeInTheDocument();
    expect(screen.getByText('Créez votre compte')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
  });

  it('renders Google sign up button', () => {
    renderWithProviders(<Signup />);

    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderWithProviders(<Signup />);

    expect(screen.getByText('Déjà un compte ?')).toBeInTheDocument();
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('updates form data when typing', async () => {
    const { user } = renderWithProviders(<Signup />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^mot de passe$/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signUp when form is submitted with valid data', async () => {
    mockSignUp.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Signup />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const firstNameInput = screen.getByLabelText(/prénom/i);
    const lastNameInput = screen.getByLabelText(/nom/i);
    const submitButton = screen.getByRole('button', { name: /s'inscrire$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', {
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  it('displays success message on successful signup', async () => {
    mockSignUp.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Signup />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /s'inscrire$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/compte créé avec succès/i)).toBeInTheDocument();
    });
  });

  it('displays error message on signup failure', async () => {
    mockSignUp.mockRejectedValue(new Error('Email already exists'));
    const { user } = renderWithProviders(<Signup />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /s'inscrire$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('calls signInWithGoogle when Google button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
    const { user } = renderWithProviders(<Signup />);

    const googleButton = screen.getByText("S'inscrire avec Google");
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('disables submit button while loading', async () => {
    mockSignUp.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const { user } = renderWithProviders(<Signup />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^mot de passe$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /s'inscrire$/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
  });
});
