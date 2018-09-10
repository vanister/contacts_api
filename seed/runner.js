require('dotenv/config');

const { ContactSeeder } = require('./contact.seeder');
const { DynamoDB } = require('aws-sdk');
const { DocumentClient } = DynamoDB;
const contactsData = require('./contacts-test-data.json');

const dynamo = new DynamoDB({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const doclient = new DocumentClient({ service: dynamo });
const contactSeeder = new ContactSeeder(dynamo, doclient);

const log = (...mgs) => console.log('>>', ...mgs);

const seedContacts = async () => {
  log(`Checking if 'contacts' table exists`);

  const exists = await contactSeeder.hasTable();

  if (exists) {
    log(`Table 'contacts' exists, deleting`);
    await contactSeeder.deleteTable();
  }

  log(`Creating 'contacts' table`);
  await contactSeeder.createTable();

  log('Seeding data');
  await contactSeeder.seed(contactsData);
};

seedContacts()
  .then(() => log('Done!'))
  .catch(err => console.log(err));