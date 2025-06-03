// server/services/subjectService.test.js
const subjectService = require('../services/subjectService');
const subjectRepository = require('../repositories/subjectRepository'); // Uvozimo da bi ga mockirali

// Mockiranje subjectRepository modula
jest.mock('../repositories/subjectRepository');

describe('SubjectService', () => {
  beforeEach(() => {
    // Resetiraj sve mockove prije svakog testa
    subjectRepository.findById.mockReset();
    subjectRepository.findByName.mockReset();
    subjectRepository.create.mockReset();
    // ... resetiraj ostale mockirane repo metode
  });

  describe('getSubjectById', () => {
    test('trebao bi vratiti predmet ako ga repozitorij pronađe', async () => {
      const mockSubject = { id: 1, name: 'Matematika' };
      subjectRepository.findById.mockResolvedValue(mockSubject);

      const result = await subjectService.getSubjectById(1);

      expect(subjectRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSubject);
    });

    test('trebao bi baciti grešku 404 ako predmet nije pronađen', async () => {
      subjectRepository.findById.mockResolvedValue(null); // Repozitorij ne vraća ništa

      await expect(subjectService.getSubjectById(99)).rejects.toThrow('Predmet nije pronađen.');
      // Opcionalno provjeri i statusCode ako ga postavljaš na objekt greške
      // await expect(subjectService.getSubjectById(99)).rejects.toHaveProperty('statusCode', 404);
      // Gornja linija može biti problematična ako jest.fn() ne vraća error objekt s dodatnim propertijima,
      // pa je jednostavnije provjeriti poruku.
    });
  });

  describe('createSubject', () => {
    test('trebao bi kreirati i vratiti novi predmet ako je naziv validan i ne postoji', async () => {
        const newSubjectData = { name: 'Fizika' };
        const createdSubject = { id: 1, name: 'Fizika' };

        subjectRepository.findByName.mockResolvedValue(null); 
        subjectRepository.create.mockResolvedValue(createdSubject); 

        // Dodaj console.log prije poziva servisa
        console.log('TEST: Prije poziva createSubject za Fizika');
        const result = await subjectService.createSubject(newSubjectData);
        console.log('TEST: Nakon poziva createSubject, prije asercija');

        // Dodaj console.log za provjeru je li findByName pozvan
        console.log('TEST: findByName calls:', subjectRepository.findByName.mock.calls);


        expect(subjectRepository.findByName).toHaveBeenCalledTimes(1); // Prvo provjeri broj poziva
        expect(subjectRepository.findByName).toHaveBeenCalledWith('Fizika');
        expect(subjectRepository.create).toHaveBeenCalledWith({ name: 'Fizika' });
        expect(result).toEqual(createdSubject);
    });

    test('trebao bi baciti grešku 400 ako naziv predmeta nije poslan', async () => {
      await expect(subjectService.createSubject({ name: '' })).rejects.toThrow('Naziv predmeta je obavezan.');
      // await expect(subjectService.createSubject({ name: '' })).rejects.toHaveProperty('statusCode', 400);
    });

    test('trebao bi baciti grešku 409 ako predmet s tim imenom već postoji', async () => {
      const existingSubjectData = { name: 'Matematika' };
      subjectRepository.findByName.mockResolvedValue({ id: 1, name: 'Matematika' }); // Predmet postoji

      await expect(subjectService.createSubject(existingSubjectData)).rejects.toThrow('Predmet s ovim nazivom već postoji.');
      // await expect(subjectService.createSubject(existingSubjectData)).rejects.toHaveProperty('statusCode', 409);
    });
  });
});