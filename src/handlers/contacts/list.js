require('dotenv/config');

const { ContactRepository } = require('../../repositories/contact.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ContactRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);

exports.handler = async (event) => {
  const contacts = await repository.list();

  return ok(contacts);
};