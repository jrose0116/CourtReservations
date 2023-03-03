const constructor = (app) => {
  app.get("/", (req, res) => res.json({ route: "Here" }));

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructor;
