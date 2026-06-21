require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 5432;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`server started on port http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
