/**
 * Safely parses a string to a float, throwing an error if it's NaN
 * Use this to avoid writing NaN to the DB
 *
 * @param {string} s
 * @returns float
 */
function parseFloatSafe(s) {
  const ret = parseFloat(s);
  if (Number.isNaN(ret)) {
    throw new Error('Error Parsing float: NaN');
  } else {
    return ret;
  }
}

module.exports.parseFloatSafe = parseFloatSafe;
