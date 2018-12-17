
// TODO: consider breaking this out into individual suites

describe('Contacts', () => {
  const mockContactRepository = {
    list: () => [],
    get: id => null,
    put: contact => null,
    delete: id => null
  };

  const testcontacts = [
    { id: '1', name: 'Jin Erso' },
    { id: '2', name: 'Rey' },
    { id: '3', name: 'Kylo Ren' }
  ];

  const mockWithStatusCode = jest.fn();
  const mockResponseUtil = {
    withStatusCode: (stat, fn) => mockWithStatusCode
  };

  const mockParseWith = jest.fn();
  const mockRequestUtil = {
    parseWith: (parser) => mockParseWith
  };

  const mockDynamoDbFactory = {
    withProcessEnv: (env) => jest.fn()
  };

  jest.mock('../../utils/repository.util', () => ({ createRepository: (env) => (tbl) => mockContactRepository }))
  jest.mock('../../utils/response.util', () => mockResponseUtil);
  jest.mock('../../utils/request.util', () => mockRequestUtil);

  describe('list handler', () => {
    const { handler } = require('./list');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));
    });

    it('should return a list of contacts', async () => {
      jest.spyOn(mockContactRepository, 'list').mockResolvedValue(testcontacts);

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testcontacts)
      };

      const response = await handler({});

      expect(response).toBeDefined();
      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.list).toHaveBeenCalled();
      expect(mockWithStatusCode).toHaveBeenCalled();
    });
  });

  describe('get handler', () => {
    const { handler } = require('./get');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));
    });

    it('should get a contact by id', async () => {
      jest.spyOn(mockContactRepository, 'get').mockImplementation(id => Promise.resolve(testcontacts[id] || null));

      const id = 1;
      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(testcontacts[id])
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.get).toHaveBeenCalledWith(id);
      expect(mockWithStatusCode).toHaveBeenCalled();
    });

    it('should return a 404 not found if a contact does not exist', async () => {
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue(null);

      mockWithStatusCode.mockClear();
      mockWithStatusCode.mockImplementation(_ => ({ statusCode: 404 }));

      const id = 1000;
      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 404
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.get).toHaveBeenCalledWith(id);
      expect(mockWithStatusCode).toHaveBeenCalled();
    });
  });

  describe('add handler', () => {
    const { handler } = require('./add');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 201 }));
      mockParseWith.mockImplementation(text => JSON.parse(text));

    });

    it('should create a new contact', async () => {
      jest.spyOn(mockContactRepository, 'put').mockImplementation((data) => Promise.resolve(data));

      const contact = {
        id: '4',
        name: 'Han Solo'
      };

      const event = {
        body: JSON.stringify(contact)
      };

      const expectedResponse = {
        statusCode: 201
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.put).toHaveBeenCalledWith(contact);
    });
  });

  describe('delete handler', () => {
    const { handler } = require('./delete');

    beforeEach(() => {
      jest.resetAllMocks();
      mockWithStatusCode.mockImplementation(() => ({ statusCode: 204 }));
    });

    it('should delete a contact', async () => {
      jest.spyOn(mockContactRepository, 'delete').mockResolvedValue('1');

      const id = '1';

      const event = {
        pathParameters: { id }
      };

      const expectedResponse = {
        statusCode: 204
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('update handler', () => {
    const { handler } = require('./update');

    beforeEach(() => {
      jest.resetAllMocks();
      mockParseWith.mockImplementation(text => JSON.parse(text));
    });

    it('should create a new contact', async () => {
      jest.spyOn(mockContactRepository, 'put').mockImplementation((data) => Promise.resolve(data));
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue({ id: '3' });

      mockWithStatusCode.mockImplementation((data) => ({ statusCode: 200, body: JSON.stringify(data) }));

      const contact = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(contact)
      };

      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify(contact)
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.put).toHaveBeenCalledWith(contact);
      expect(mockContactRepository.get).toHaveBeenCalledWith('3');
    });

    it('should return 404 not found if contact does not exist', async () => {
      jest.spyOn(mockContactRepository, 'put').mockRejectedValue('unexpected call to put');
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue(null);

      mockWithStatusCode.mockImplementation(() => ({ statusCode: 404 }));

      const contact = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(contact)
      };

      const expectedResponse = {
        statusCode: 404
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.get).toHaveBeenCalledWith('3');

      expect(mockContactRepository.put).not.toHaveBeenCalledWith(contact);
    });

    it('should return 400 bad request if contact id does not match', async () => {
      jest.spyOn(mockContactRepository, 'put').mockRejectedValue('unexpected call to put');
      jest.spyOn(mockContactRepository, 'get').mockResolvedValue({ id: '1000' });

      mockWithStatusCode.mockImplementation(() => ({ statusCode: 400 }));

      const contact = {
        id: '3',
        name: 'Darth Vader'
      };

      const event = {
        pathParameters: { id: '3' },
        body: JSON.stringify(contact)
      };

      const expectedResponse = {
        statusCode: 400
      };

      const response = await handler(event);

      expect(response).toEqual(expectedResponse);
      expect(mockContactRepository.get).toHaveBeenCalledWith('3');

      expect(mockContactRepository.put).not.toHaveBeenCalledWith(contact);
    });
  });
});
