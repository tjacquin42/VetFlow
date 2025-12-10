import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    renderWithProviders(
      <Input label="Email" value="" onChange={() => {}} />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    const { user } = renderWithProviders(
      <Input label="Name" value="" onChange={handleChange} />
    );

    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'John');

    expect(handleChange).toHaveBeenCalled();
  });

  it('displays the current value', () => {
    renderWithProviders(
      <Input label="Name" value="John Doe" onChange={() => {}} />
    );
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    renderWithProviders(
      <Input label="Email" value="" onChange={() => {}} required />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderWithProviders(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('displays hint when no error', () => {
    renderWithProviders(
      <Input
        label="Password"
        value=""
        onChange={() => {}}
        hint="Must be at least 8 characters"
      />
    );
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('hides hint when error is present', () => {
    renderWithProviders(
      <Input
        label="Password"
        value=""
        onChange={() => {}}
        error="Password is required"
        hint="Must be at least 8 characters"
      />
    );
    expect(screen.queryByText('Must be at least 8 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    renderWithProviders(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        error="Email is invalid"
      />
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('border-danger-500');
  });

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(
      <Input label="Name" value="" onChange={() => {}} disabled />
    );
    expect(screen.getByLabelText(/name/i)).toBeDisabled();
  });

  it('renders with unit suffix', () => {
    renderWithProviders(
      <Input label="Weight" value="10" onChange={() => {}} unit="kg" />
    );
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    renderWithProviders(
      <Input
        label="Search"
        value=""
        onChange={() => {}}
        leftIcon={<span data-testid="search-icon">🔍</span>}
      />
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderWithProviders(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        placeholder="Enter your email"
      />
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('accepts type prop', () => {
    renderWithProviders(
      <Input label="Password" type="password" value="" onChange={() => {}} />
    );
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('accepts number type with min, max, step', () => {
    renderWithProviders(
      <Input
        label="Age"
        type="number"
        value="25"
        onChange={() => {}}
        min="0"
        max="120"
        step="1"
      />
    );
    const input = screen.getByLabelText(/age/i);
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '120');
    expect(input).toHaveAttribute('step', '1');
  });
});
