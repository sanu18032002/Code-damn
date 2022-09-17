require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const { Schema } = mongoose;
const codeSchema = new Schema({
  htmlText: String,
  cssText: String,
  jsText: String,
  _id: String,
});
const Code = mongoose.model("Code", codeSchema);
app.post("/code", async (req, res) => {
  console.log(req.body);

  const htmlText = req.body.htmlText;
  const cssText = req.body.cssText;
  const jsText = req.body.jsText;
  const currId = req.body.currId;
  const document = await findOrCreateDocument(
    currId,
    htmlText,
    cssText,
    jsText
  );
  if (document) res.json(document);
});
async function findOrCreateDocument(id, htmlText, cssText, jsText) {
  if (id == null) return;

  const document = await Code.findById(id);
  if (document) {
    await Code.findByIdAndUpdate({ _id: id }, { htmlText, cssText, jsText });

    return document;
  }
  return await Code.create({ _id: id, htmlText, cssText, jsText });
}
app.get("/", (req, res) => {
  res.send("Server Started");
});
app.get("/readcode", async (req, res) => {
  console.log(req.query.id);
  const document = await Code.findById(req.query.id);
  if (document) res.json(document);
});
app.listen(port, (req, res) => {
  console.log(`Server running on ${port}`);
});
