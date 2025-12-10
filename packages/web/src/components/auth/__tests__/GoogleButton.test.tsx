import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { GoogleButton } from '../GoogleButton';

describe('GoogleButton', () => {
  it('renders with default signin text', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} />
    );
    expect(screen.getByText('Se connecter avec Google')).toBeInTheDocument();
  });

  it('renders with signup text when mode is signup', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} mode="signup" />
    );
    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
  });

  it('shows Google logo icon', () => {
    const { container } = renderWithProviders(
      <GoogleButton onClick={async () => {}} />
    );
    const icon = container.querySelector('svg[width="18"]');
    expect(icon).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn().mockResolvedValue(undefined);
    const { user } = renderWithProviders(
      <GoogleButton onClick={handleClick} />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when isLoading is true', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} isLoading={true} />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} isLoading={true} />
    );
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('hides Google icon when loading', () => {
    const { container } = renderWithProviders(
      <GoogleButton onClick={async () => {}} isLoading={true} />
    );
    const icon = container.querySelector('svg[width="18"]');
    expect(icon).not.toBeInTheDocument();
  });

  it('handles async onClick errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handleClick = vi.fn().mockRejectedValue(new Error('Auth failed'));
    const { user } = renderWithProviders(
      <GoogleButton onClick={handleClick} />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('applies secondary variant', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary-200');
  });

  it('forwards additional props to Button', () => {
    renderWithProviders(
      <GoogleButton onClick={async () => {}} className="custom-class" data-testid="google-btn" />
    );
    const button = screen.getByTestId('google-btn');
    expect(button).toHaveClass('custom-class');
  });
});
