const healthCheck = (req, res) => {
  res.json({ message: "everything is ok" });
};

export default healthCheck;
