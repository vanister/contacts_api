require('dotenv/config');

const { ContactSeeder } = require('./contact.seeder');
const { DynamoDB } = require('aws-sdk');
const { DocumentClient } = DynamoDB;
const contactsData = require('./contacts-test-data.json');

const { CONTACTS_TABLE } = process.env;
const dynamo = new DynamoDB({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION
});

const doclient = new DocumentClient({ service: dynamo });
const contactSeeder = new ContactSeeder(dynamo, doclient, CONTACTS_TABLE);

const log = (...mgs) => console.log('>>', ...mgs);

const seedContacts = async () => {
  log(`Checking if '${CONTACTS_TABLE}' table exists`);

  const exists = await contactSeeder.hasTable();

  if (exists) {
    log(`Table '${CONTACTS_TABLE}' exists, deleting`);
    await contactSeeder.deleteTable();
  }

  log(`Creating '${CONTACTS_TABLE}' table`);
  await contactSeeder.createTable();

  log('Seeding data');
  await contactSeeder.seed(contactsData);
};

seedContacts()
  .then(() => log('Done!'))
  .catch(err => console.log(err));
