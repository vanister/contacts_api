require('dotenv/config');

const { withStatusCode } = require('../../utils/response.util');
const { createRepository } = require('../../utils/repository.util');

const repository = createRepository(process.env)();
const ok = withStatusCode(200, JSON.stringify);

exports.handler = async (event) => {
  const contacts = await repository.list();

  return ok(contacts);
};
