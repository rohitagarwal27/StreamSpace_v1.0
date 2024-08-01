import multer from "multer";

// DiskStorage(we are using) and if other buffer  (memory storage)
// This  storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // cb --> call back
    // keeping file in public folder
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

export const upload = multer({ 
  storage // storage: storage we are using ES6 
});
