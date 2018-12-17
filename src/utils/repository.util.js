const { ContactRepository } = require('../repositories/contact.repository');
const { withProcessEnv } = require('../dynamodb.factory');

/**
 * Creates a repository instance with a given configuration object that will be used to ceate a DocumentClient
 * Instance and a table name.
 * @param {NodeJS.ProcessEnv} env The environment with vars for dynamodb.  Send process.env.
 * @returns {(tableName?: string) => ContactRepository}
 */
const createRepository = (env) => {
  const docClient = withProcessEnv(env)();

  return (tableName) => new ContactRepository(docClient, tableName || env.CONTACTS_TABLE);
};

module.exports = {
  createRepository
};
