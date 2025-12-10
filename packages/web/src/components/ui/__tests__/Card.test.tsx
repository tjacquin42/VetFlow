import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    renderWithProviders(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    renderWithProviders(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    renderWithProviders(
      <Card title="Title" subtitle="Subtitle">
        Content
      </Card>
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    renderWithProviders(
      <Card footer={<div>Footer content</div>}>Content</Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = renderWithProviders(
      <Card variant="default">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'border', 'border-secondary-200');
  });

  it('applies outlined variant styles', () => {
    const { container } = renderWithProviders(
      <Card variant="outlined">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border-2', 'border-primary-500');
  });

  it('applies elevated variant styles', () => {
    const { container } = renderWithProviders(
      <Card variant="elevated">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies small padding', () => {
    const { container } = renderWithProviders(
      <Card padding="sm">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-4');
  });

  it('applies medium padding', () => {
    const { container } = renderWithProviders(
      <Card padding="md">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-6');
  });

  it('applies large padding', () => {
    const { container } = renderWithProviders(
      <Card padding="lg">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-8');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const { user, container } = renderWithProviders(
      <Card onClick={handleClick}>Content</Card>
    );

    const card = container.firstChild as HTMLElement;
    await user.click(card);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('applies hoverable styles when hoverable is true', () => {
    const { container } = renderWithProviders(
      <Card hoverable>Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies hoverable styles when onClick is provided', () => {
    const { container } = renderWithProviders(
      <Card onClick={() => {}}>Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <Card className="custom-class">Content</Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('renders complete card with all props', () => {
    const { container } = renderWithProviders(
      <Card
        title="Complete Card"
        subtitle="With all props"
        footer={<button>Action</button>}
        variant="elevated"
        padding="lg"
        hoverable
      >
        Main content
      </Card>
    );

    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('With all props')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-8', 'shadow-lg', 'cursor-pointer');
  });
});
