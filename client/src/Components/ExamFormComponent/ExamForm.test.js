
import { render, screen, fireEvent } from '@testing-library/react';
import ExamForm from './ExamForm';
import '@testing-library/jest-dom';

const mockSubjects = [{ id: '1', name: 'Matematika' }];
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

beforeAll(() => {
  window.alert = jest.fn();
});

describe('ExamForm', () => {
  test('prikazuje formu za novi ispit', () => {
    render(<ExamForm exam={{}} subjects={mockSubjects} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText(/Novi ispit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spremi/i })).toBeInTheDocument();
  });

  test('validira prazna obavezna polja', () => {
    render(<ExamForm exam={{}} subjects={mockSubjects} onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByText(/Spremi/i));
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Molimo popunite sva obvezna polja/i));
  });
});
