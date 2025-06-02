import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExamMasterDetail from '../../Pages/AdminPages/ExamMasterDetail';

beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/exams')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    if (url.includes('/api/subjects')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    if (url.includes('/api/question-types')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }
    return Promise.reject(new Error('Unknown API'));
  });
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe('ExamMasterDetail', () => {
  test('prikazuje naslov stranice', async () => {
    render(<ExamMasterDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/Nema unesenih ispita/i)).toBeInTheDocument();
    });
  });
});