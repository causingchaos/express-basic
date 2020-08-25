const sup = (req, res, next) => {
  //console.log(req.method);
  console.log("Sup");
  next();
};

const how = (req, res, next) => {
  console.log("How you doin?")
  next();
};

module.exports = { sup, how };

//TODO -- middleware to capture IP address, and country, so we can send
// emails indicating strange login, and get verification.