// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Pastikan folder assets dan subfoldernya ada
['music', 'video', 'images'].forEach(type => {
  const dir = path.join(__dirname, 'public/assets', type);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type;
    let folder = 'music';
    if (type === 'video') folder = 'video';
    if (type === 'image') folder = 'images';
    cb(null, path.join(__dirname, 'public/assets', folder));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const type = req.body.type;
  const fileUrl = `/assets/${type === 'image' ? 'images' : type}/${req.file.filename}`;
  res.json({ url: fileUrl, name: req.file.originalname });
});

app.get('/files/:type', (req, res) => {
  const type = req.params.type;
  const dir = path.join(__dirname, 'public/assets', type === 'image' ? 'images' : type);
  fs.readdir(dir, (err, files) => {
    if (err) return res.json([]);
    res.json(files.map(f => ({
      name: f,
      url: `/assets/${type === 'image' ? 'images' : type}/${f}`
    })));
  });
});

app.listen(4000, () => console.log('Upload server running on http://localhost:4000'));