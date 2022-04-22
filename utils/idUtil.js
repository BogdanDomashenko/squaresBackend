exports.parse = (objId) => {
  return JSON.stringify(objId).split('"')[1];
};
