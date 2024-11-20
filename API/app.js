const express = require('express');
const bodyParser = require('body-parser');

// Mock Database Models (Replace with your actual database models)
const { User, Playlist, Track } = require('./models'); // Adjust the path accordingly

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // For parsing JSON bodies

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// /users Router
const usersRouter = express.Router();

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll(); // Replace with your DB query
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Playlist }], // Include owned playlists
    });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

app.use('/users', usersRouter);

// /playlists Router
const playlistsRouter = express.Router();

playlistsRouter.get('/', async (req, res, next) => {
  try {
    const playlists = await Playlist.findAll(); // Replace with your DB query
    res.status(200).send(playlists);
  } catch (err) {
    next(err);
  }
});

playlistsRouter.post('/', async (req, res, next) => {
  try {
    const { name, description, ownerId, trackIds } = req.body;
    if (!name || !ownerId || !Array.isArray(trackIds)) {
      return res.status(400).send({ error: 'Invalid data provided' });
    }
    const newPlaylist = await Playlist.create({ name, description, ownerId });
    await newPlaylist.setTracks(trackIds); // Associate tracks with the playlist
    res.status(201).send(newPlaylist);
  } catch (err) {
    next(err);
  }
});

playlistsRouter.get('/:id', async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [{ model: Track }], // Include tracks
    });
    if (!playlist) {
      return res.status(404).send({ error: 'Playlist not found' });
    }
    res.status(200).send(playlist);
  } catch (err) {
    next(err);
  }
});

app.use('/playlists', playlistsRouter);

// /tracks Router
const tracksRouter = express.Router();

tracksRouter.get('/', async (req, res, next) => {
  try {
    const tracks = await Track.findAll(); // Replace with your DB query
    res.status(200).send(tracks);
  } catch (err) {
    next(err);
  }
});

tracksRouter.get('/:id', async (req, res, next) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).send({ error: 'Track not found' });
    }
    res.status(200).send(track);
  } catch (err) {
    next(err);
  }
});

app.use('/tracks', tracksRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
