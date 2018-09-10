require('dotenv/config');

const { ContactRepository } = require('../../repositories/contact.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ContactRepository(docClient);
const ok = withStatusCode(200);
const badRequest = withStatusCode(400);
const notFound = withStatusCode(404);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body, pathParameters } = event;
  const { id } = pathParameters;

  const existingContact = await repository.get(id);
  const contact = parseJson(body);

  if (!existingContact) {
    return notFound();
  }

  if (existingContact.id !== contact.id) {
    return badRequest();
  }

  await repository.put(contact);

  return ok(contact);
};