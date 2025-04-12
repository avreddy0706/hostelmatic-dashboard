
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  it('renders 404 - Not Found message', () => {
    render(<NotFound />);
    const notFoundText = screen.getByText('404 - Not Found');
    expect(notFoundText).toBeInTheDocument();
  });
});
