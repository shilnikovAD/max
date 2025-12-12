import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state in stories
const InputWrapper = (args: typeof Default.args) => {
  const [value, setValue] = useState(args?.value || '');
  return (
    <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  );
};

export const Default: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
    value: '',
  },
};

export const WithValue: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Name',
    value: 'John Doe',
  },
};

export const WithError: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Email',
    type: 'email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
};

export const Required: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Required Field',
    required: true,
    placeholder: 'This field is required',
    value: '',
  },
};

export const Disabled: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Disabled',
    value: 'Cannot edit',
    disabled: true,
  },
};

export const Number: Story = {
  render: (args) => <InputWrapper {...args} />,
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
    value: '',
  },
};
