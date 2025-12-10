import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Select } from '../Select';

const mockOptions = [
  { value: 'dog', label: 'Chien' },
  { value: 'cat', label: 'Chat' },
  { value: 'both', label: 'Les deux' },
];

describe('Select', () => {
  it('renders with label', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/espèce/i)).toBeInTheDocument();
  });

  it('renders all options', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('option', { name: 'Chien' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Chat' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Les deux' })).toBeInTheDocument();
  });

  it('displays the current value', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value="dog"
        onChange={() => {}}
      />
    );
    const select = screen.getByLabelText(/espèce/i) as HTMLSelectElement;
    expect(select.value).toBe('dog');
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const { user } = renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText(/espèce/i);
    await user.selectOptions(select, 'cat');

    expect(handleChange).toHaveBeenCalledWith('cat');
  });

  it('shows required indicator when required is true', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        required
      />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        error="Ce champ est requis"
      />
    );
    expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        error="Erreur"
      />
    );
    const select = screen.getByLabelText(/espèce/i);
    expect(select).toHaveClass('border-danger-500');
  });

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        disabled
      />
    );
    expect(screen.getByLabelText(/espèce/i)).toBeDisabled();
  });

  it('renders with placeholder', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Sélectionner une espèce"
      />
    );
    expect(screen.getByRole('option', { name: 'Sélectionner une espèce' })).toBeInTheDocument();
  });

  it('placeholder option is disabled', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        placeholder="Sélectionner"
      />
    );
    const placeholderOption = screen.getByRole('option', { name: 'Sélectionner' }) as HTMLOptionElement;
    expect(placeholderOption.disabled).toBe(true);
  });

  it('applies custom className', () => {
    renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    );
    expect(screen.getByLabelText(/espèce/i)).toHaveClass('custom-class');
  });

  it('renders dropdown icon', () => {
    const { container } = renderWithProviders(
      <Select
        label="Espèce"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
