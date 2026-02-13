const memoryStore = new Set();

module.exports = function(req, res, next) {

  const key = req.headers["idempotency-key"];

  if (!key) return res.status(400).send("Idempotency key required");

  if (memoryStore.has(key)) {
    return res.status(409).send("Duplicate request");
  }

  memoryStore.add(key);

  next();
};
