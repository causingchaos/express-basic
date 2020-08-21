const sup = (req, res, next) => {
  console.log(req.method);
  console.log("Sup");
  next();
};

const how = (req, res, next) => {
  console.log("How you doin?")
  next();
};

module.exports = { sup, how };