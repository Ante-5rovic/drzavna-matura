const subjectRepository = require('../repositories/subjectRepository');
const pool = require('../db');

jest.mock('../db', () => {
  const mPool = {
    query: jest.fn(),
  };
  return mPool;
});

describe('SubjectRepository', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  describe('findById', () => {
    test('trebao bi pozvati pool.query s ispravnim SQL-om i vratiti predmet', async () => {
      const mockSubject = { id: 1, name: 'Matematika' };
      pool.query.mockResolvedValueOnce({ rows: [mockSubject], rowCount: 1 });

      const result = await subjectRepository.findById(1);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, name FROM subject WHERE id = $1;',
        [1]
      );
      expect(result).toEqual(mockSubject);
    });

    test('trebao bi vratiti undefined ako predmet nije pronađen', async () => {
      pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const result = await subjectRepository.findById(99);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    test('trebao bi pozvati pool.query s ispravnim SQL-om za INSERT i vratiti kreirani predmet', async () => {
      const newSubjectData = { name: 'Fizika' };
      const createdSubject = { id: 2, name: 'Fizika' };
      pool.query.mockResolvedValueOnce({ rows: [createdSubject], rowCount: 1 });

      const result = await subjectRepository.create(newSubjectData);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO subject (name) VALUES ($1) RETURNING id, name;',
        [newSubjectData.name]
      );
      expect(result).toEqual(createdSubject);
    });

    test('trebao bi baciti grešku ako upit u bazu ne uspije', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB error'));
      const newSubjectData = { name: 'Kemija' };

      await expect(subjectRepository.create(newSubjectData)).rejects.toThrow('DB error');
    });
  });
});