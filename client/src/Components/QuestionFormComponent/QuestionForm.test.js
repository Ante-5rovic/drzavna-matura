
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionForm from './QuestionForm';
import '@testing-library/jest-dom';

const mockQuestion = {
  question_text: '',
  order_in_exam: 1,
  points: 1,
  question_type_id: '',
  answers: []
};

const mockQuestionTypes = [{ id: '1', description: 'Višestruki izbor - jedan točan', type_code: 'MULTIPLE_CHOICE_SINGLE' }];
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

describe('QuestionForm', () => {
  test('prikazuje formu za novo pitanje', () => {
    render(<QuestionForm question={mockQuestion} questionTypes={mockQuestionTypes} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText(/Novo pitanje/i)).toBeInTheDocument();
  });
});
