const { withStatusCode } = require('./response.util');

describe('Response Utilites', () => {
  const mockJSON = {
    stringify: (val) => 'turned into JSON'
  };

  beforeEach(() => jest.resetAllMocks());

  it('should be able to create a status code response', () => {
    const data = {
      id: '1',
      name: 'Jin Erso'
    };

    jest.spyOn(mockJSON, 'stringify').mockReturnValue(JSON.stringify(data));

    const success = withStatusCode(200, mockJSON.stringify);

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(data)
    };

    const response = success(data);

    expect(response).toEqual(expectedResponse);
    expect(mockJSON.stringify).toHaveBeenCalled();
  });

  it('should fail when a status code is out of range', () => {
    const lowstatus = 90;
    const highstatus = 600;
    const expectedError = 'status code out of range';

    expect(() => withStatusCode(lowstatus)).toThrowError(expectedError);
    expect(() => withStatusCode(highstatus)).toThrowError(expectedError);
  });

  it('should not format body data when a formatter is not used', () => {
    jest.spyOn(mockJSON, 'stringify');

    const success = withStatusCode(200);

    const data = {
      id: '2',
      name: 'Luke Skywalker'
    };

    const expectedResponse = {
      statusCode: 200,
      body: data
    };

    const response = success(data);

    expect(response).toEqual(expectedResponse);
    expect(mockJSON.stringify).not.toHaveBeenCalled();
  });

  it('should return a response with no body when data is used', () => {
    jest.spyOn(mockJSON, 'stringify');

    const notfound = withStatusCode(404);

    const expectedResponse = {
      statusCode: 404
    };

    const response = notfound();

    expect(response).toEqual(expectedResponse);
    expect(mockJSON.stringify).not.toHaveBeenCalled();
  });
});