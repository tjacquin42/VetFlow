import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Modal content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Modal content
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = renderWithProviders(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', async () => {
    const handleClose = vi.fn();
    const { user, container } = renderWithProviders(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );

    const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
    if (overlay) {
      await user.click(overlay as HTMLElement);
      expect(handleClose).toHaveBeenCalledOnce();
    }
  });

  it('does not call onClose when modal content is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = renderWithProviders(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    await user.click(screen.getByText('Modal content'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    renderWithProviders(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Modal"
        footer={<button>Save</button>}
      >
        Content
      </Modal>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies small size styles', () => {
    const { container } = renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Small Modal" size="sm">
        Content
      </Modal>
    );
    const modalPanel = container.querySelector('.max-w-md');
    expect(modalPanel).toBeInTheDocument();
  });

  it('applies medium size styles', () => {
    const { container } = renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Medium Modal" size="md">
        Content
      </Modal>
    );
    const modalPanel = container.querySelector('.max-w-lg');
    expect(modalPanel).toBeInTheDocument();
  });

  it('applies large size styles', () => {
    const { container } = renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Large Modal" size="lg">
        Content
      </Modal>
    );
    const modalPanel = container.querySelector('.max-w-2xl');
    expect(modalPanel).toBeInTheDocument();
  });

  it('applies xl size styles', () => {
    const { container } = renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="XL Modal" size="xl">
        Content
      </Modal>
    );
    const modalPanel = container.querySelector('.max-w-4xl');
    expect(modalPanel).toBeInTheDocument();
  });

  it('prevents body scroll when open', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = renderWithProviders(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(document.body.style.overflow).toBe('unset');
  });
});
