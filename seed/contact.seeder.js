class ContactSeeder {
  /**
   * Constructs a new Contacts seeder
   * @param {AWS.DynamoDB} dynamodb The dynamo db instance
   * @param {AWS.DynamoDB.DocumentClient} docClient The dynamo db document client
   */
  constructor(dynamodb, docClient) {
    this.dynamodb = dynamodb;
    this.docClient = docClient;

    this._tablename = 'contacts';
  }

  async hasTable() {
    const tables = await this.dynamodb.listTables({ Limit: 5 }).promise();

    return tables.TableNames && tables.TableNames.indexOf(this._tablename) >= 0;
  }

  async createTable() {
    const tableParams = {
      TableName: this._tablename,
      KeySchema: [
        // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        {
          // Required HASH type attribute
          AttributeName: 'id',
          KeyType: 'HASH',
        }
      ],
      AttributeDefinitions: [
        // The names and types of all primary and index key attributes only
        {
          AttributeName: 'id',
          AttributeType: 'S', // (S | N | B) for string, number, binary
        }
      ],
      ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      }
    };

    const result = await this.dynamodb.createTable(tableParams).promise();

    return !!result.$response.error;
  }

  async deleteTable() {
    const result = await this.dynamodb.deleteTable({ TableName: this._tablename }).promise();

    return !!result.$response.err
  }

  /** 
   * @param {AddressBook.Contact[]} contacts The seed data
   */
  async seed(contacts = []) {
    // map the contact entries to a put request object
    const putRequests = contacts.map(c => ({
      PutRequest: {
        Item: Object.assign({}, c)
      }
    }));

    // set the request items param with the put requests
    const params = {
      RequestItems: {
        [this._tablename]: putRequests
      }
    };

    await this.docClient.batchWrite(params).promise();
  }
}

exports.ContactSeeder = ContactSeeder;