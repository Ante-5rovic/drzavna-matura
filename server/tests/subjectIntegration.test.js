const request = require('supertest');
const app = require('../app');

jest.mock('../repositories/subjectRepository', () => {
  return {
    findByName: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    countBySubjectId: jest.fn(),
  };
});

const mockSubjectRepository = require('../repositories/subjectRepository');

describe('Integracijski testovi za Subject', () => {
  let agent;
  let csrfToken;
  
  beforeAll(async () => {
    agent = request.agent(app);

    const res = await agent.get('/csrf-token');
    csrfToken = res.body.csrfToken;
  });

  beforeEach(() => {
    mockSubjectRepository.findByName.mockReset();
    mockSubjectRepository.create.mockReset();
    mockSubjectRepository.findAll.mockReset();
    mockSubjectRepository.findById.mockReset();
    mockSubjectRepository.update.mockReset();
    mockSubjectRepository.delete.mockReset();
    mockSubjectRepository.countBySubjectId.mockReset();

  });

  describe('POST /admin/subjects', () => {
    test('trebao bi kreirati novi predmet i vratiti 201 ako su podaci validni', async () => {
      const newSubjectData = { name: 'Biologija' };
      const createdSubjectFromRepo = { id: 1, name: 'Biologija' };

      mockSubjectRepository.findByName.mockResolvedValue(null);
      mockSubjectRepository.create.mockResolvedValue(createdSubjectFromRepo);

      const response = await agent
        .post('/admin/subjects') 
        .send(newSubjectData)
        .expect(201);

      expect(mockSubjectRepository.findByName).toHaveBeenCalledWith(newSubjectData.name);
      expect(mockSubjectRepository.create).toHaveBeenCalledWith(newSubjectData);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newSubjectData.name);
    });

    test('trebao bi vratiti 400 ako naziv predmeta nije poslan', async () => {
      const response = await agent
        .post('/admin/subjects')
        .send({})
        .expect(400);
      
      expect(response.body.message).toBe('Naziv predmeta je obavezan.');
      expect(mockSubjectRepository.create).not.toHaveBeenCalled();
    });

    test('trebao bi vratiti 409 ako predmet s tim imenom već postoji', async () => {
      const existingSubjectData = { name: 'Kemija' };
      mockSubjectRepository.findByName.mockResolvedValue({ id: 2, name: 'Kemija' });

      const response = await agent
        .post('/admin/subjects')
        .send(existingSubjectData)
        .expect(409);
      
      expect(response.body.message).toBe('Predmet s ovim nazivom već postoji.');
      expect(mockSubjectRepository.findByName).toHaveBeenCalledWith(existingSubjectData.name);
      expect(mockSubjectRepository.create).not.toHaveBeenCalled();
    });
  });
});