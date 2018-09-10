require('dotenv/config');

const { ContactRepository } = require('../../repositories/contact.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ContactRepository(docClient);
const created = withStatusCode(201);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body } = event;
  const contact = parseJson(body);

  await repository.put(contact);

  return created();
};