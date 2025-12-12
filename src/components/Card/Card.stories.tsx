import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
    },
    padding: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div>
    <h3 style={{ margin: '0 0 12px 0' }}>Card Title</h3>
    <p style={{ margin: 0, color: '#666' }}>
      This is sample content inside the card. Cards are used to group related
      information and actions.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
    variant: 'default',
    padding: 'medium',
  },
};

export const Elevated: Story = {
  args: {
    children: <SampleContent />,
    variant: 'elevated',
    padding: 'medium',
  },
};

export const Outlined: Story = {
  args: {
    children: <SampleContent />,
    variant: 'outlined',
    padding: 'medium',
  },
};

export const SmallPadding: Story = {
  args: {
    children: <SampleContent />,
    padding: 'small',
  },
};

export const LargePadding: Story = {
  args: {
    children: <SampleContent />,
    padding: 'large',
  },
};

export const Clickable: Story = {
  args: {
    children: <SampleContent />,
    variant: 'elevated',
    onClick: () => alert('Card clicked!'),
  },
};
