const { Router } = require("express");

const router = Router();

router.get("/events", (req, res) => {
  return req.context.db
    .getAll(req.query.date, req.query.location, req.query.order, req.query.max)
    .then(data => {
      res.send({
        data
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

router.get("/events/:id", (req, res) => {
  return req.context.db
    .getById(req.params.id)
    .then(data => {
      res.send({
        data
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

router.post("/events", (req, res) => {
  const data = {
    location: req.body.location,
    date: req.body.date
  };

  if (!data.location) {
    res.status(400).json({ error: "Location is missing" });
    return;
  }

  return req.context.db
    .add(data)
    .then(data => {
      res.send({
        data
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

router.patch("/events/:id", (req, res) => {
  const data = {
    location: req.body.location,
    date: req.body.date,
    id: req.params.id
  };

  return req.context.db
    .update(data)
    .then(data => {
      res.send({
        data
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

router.delete("/events/:id", (req, res) => {
  return req.context.db
    .delete(req.params.id)
    .then(data => {
      res.send({
        data
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message });
    });
});

module.exports = router;
