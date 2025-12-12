import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders with value', () => {
    render(<Input value="test value" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('renders with label', () => {
    render(<Input label="Username" value="" onChange={() => {}} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Email" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <Input value="" onChange={() => {}} error="This field is required" />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies placeholder', () => {
    render(<Input placeholder="Enter text..." value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Enter text...');
    expect(input).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with number type', () => {
    render(<Input type="number" value={42} onChange={() => {}} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Input value="" onChange={() => {}} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
