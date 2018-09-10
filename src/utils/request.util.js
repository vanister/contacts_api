/**
 * Parses the body of a request using a parser
 * @param {(text: string) => any} parser The parser to use
 * @returns {(text: string) => any} The function that will use the parser
 */
const parseWith = (parser) => (text) => {
  if (!parser) {
    throw new Error('parser');
  }

  if (!text) {
    throw new Error('text');
  }

  return parser(text);
};

module.exports = {
  parseWith
};