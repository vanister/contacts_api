const { ContactRepository } = require('./contact.repository');

describe('Contacts Repository', () => {
  /** @type {AWS.DynamoDB.DocumentClient} */
  const mockDocClient = {
    scan: params => { },
    get: params => { },
    put: params => { },
    delete: params => { },
  };

  const mockContacts = [
    { id: '1', name: 'Jin Erso' },
    { id: '2', name: 'Luke Skywalker' },
    { id: '3', name: 'Darth Vadar' }
  ];

  const createAwsRequest = (data = null, resolveOrReject = true, errMsg = 'error') => {
    return {
      promise: () => resolveOrReject ? Promise.resolve(data) : Promise.reject(new Error('error'))
    };
  };

  const CONTACTS_TABLE = 'unit-test-contacts-table';

  /** @type {ContactsRepository} */
  let respository;

  beforeEach(() => {
    respository = new ContactRepository(mockDocClient, CONTACTS_TABLE);
  });

  it('should construct a new respository', () => {
    expect(respository).toBeDefined();
  });

  it('should list contacts', async () => {
    const expectedResult = {
      Items: mockContacts.slice()
    };

    spyOn(mockDocClient, 'scan').and.returnValues(createAwsRequest(expectedResult), createAwsRequest({ Items: null }));

    const awsParams = {
      TableName: CONTACTS_TABLE
    };

    const results = await respository.list();

    expect(results).toEqual(expectedResult.Items);
    expect(results.length).toBe(3);
    expect(mockDocClient.scan).toHaveBeenCalledWith(awsParams);

    const emptyResults = await respository.list();

    expect(emptyResults).toEqual([]);
  });

  it('should throw an error when listing fails', async () => {
    spyOn(mockDocClient, 'scan').and.returnValue(createAwsRequest(null, false));

    try {
      await respository.list();

      fail('listing should have failed with an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('error');
    }
  });

  it('should get a contact by id', async () => {
    const expectedResult = {
      Item: Object.assign({}, mockContacts[0])
    };

    spyOn(mockDocClient, 'get').and.returnValue(createAwsRequest(expectedResult));

    const id = '1';
    const awsParams = {
      TableName: CONTACTS_TABLE,
      Key: { id }
    };

    const contact = await respository.get(id);

    expect(contact).toBeDefined();
    expect(contact).toEqual(expectedResult.Item);
    expect(mockDocClient.get).toHaveBeenCalledWith(awsParams);
  });

  it('should put a new item in the db', async () => {
    spyOn(mockDocClient, 'put').and.returnValue(createAwsRequest());

    const newContact = {
      id: '4',
      name: 'Han Solo'
    };

    const awsParams = {
      TableName: CONTACTS_TABLE,
      Item: newContact
    };

    const contact = await respository.put(newContact);

    expect(contact).toBeDefined();
    expect(mockDocClient.put).toHaveBeenCalledWith(awsParams);
  });

  it('should delete a contact, by id', async () => {
    spyOn(mockDocClient, 'delete').and.returnValue(createAwsRequest());

    const id = '1';
    const awsParams = { TableName: CONTACTS_TABLE, Key: { id } };

    const deletedid = await respository.delete(id);

    expect(deletedid).toBe(id);
    expect(mockDocClient.delete).toHaveBeenCalledWith(awsParams);
  });
});
