process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! App shutdown!");
  console.log(err.name, err.message);
  process.exit(1);
});
