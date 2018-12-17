require('dotenv/config');

const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { createRepository } = require('../../utils/repository.util');

const repository = createRepository(process.env)();
const created = withStatusCode(201);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body } = event;
  const contact = parseJson(body);

  await repository.put(contact);

  return created();
};
