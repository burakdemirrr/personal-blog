import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Providers } from '../../providers';
import Page from './page';

describe('Admin Login Page', () => {
  it('shows validation errors', async () => {
    render(
      <Providers>
        <Page />
      </Providers>
    );
    const submit = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submit);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/expected string to have >=6 characters/i)).toBeInTheDocument();
  });
});


