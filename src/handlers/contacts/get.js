
require('dotenv/config');

const { ContactRepository } = require('../../repositories/contact.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ContactRepository(docClient);
const ok = withStatusCode(200, JSON.stringify);
const notFound = withStatusCode(404);

exports.handler = async (event) => {
  const { id } = event.pathParameters;
  const contact = await repository.get(id);

  if (!contact){
    return notFound();
  }

  return ok(contact);
};