const multer = require("multer");
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const { Readable } = require("stream");

const mongoConfig = require("../../database/mongo/config");

/**
 * Connect Mongo Driver to MongoDB.
 */
let db;

// const client = new MongoClient(mongoConfig.url);
// async function connectMongo() {
//   try {
//     // Connect to the MongoDB cluster
//     db = await client.connect();
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// }
// connectMongo();

MongoClient.connect(mongoConfig.url, (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error.');
    process.exit(1);
  }
  db = client.db("symphony");
});

const getTrack = async (req, res, next) => {
  try {
    var trackID = new ObjectID(req.params.trackID);
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: "tracks",
  });

  let downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
};

const uploadTrack = async (req, res, next) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fields: 1, fileSize: 20000000, files: 1, parts: 2 },
  });
  upload.single("track")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Upload Request Validation Failed",
      });
    } else if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        message: "No track name in request body",
      });
    }

    let trackName = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: "tracks",
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        status: 201,
        message:
          "File uploaded successfully, stored under Mongo ObjectID: " + id,
      });
    });
  });
};

module.exports = {
  getTrack,
  uploadTrack,
};
