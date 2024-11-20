const prisma = require("../prisma");

const seed = async () => {
  const numUsers = 5;
  const numTracks = 20;
  const numPlaylists = 10;

  // Create users
  const users = Array.from({ length: numUsers }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
  await prisma.user.createMany({ data: users });

  // Create tracks
  const tracks = Array.from({ length: numTracks }, (_, i) => ({
    name: `Track ${i + 1}`,
    artist: `Artist ${i + 1}`,
    duration: Math.floor(Math.random() * 300) + 180, // Random duration in seconds (3-8 minutes)
  }));
  await prisma.track.createMany({ data: tracks });

  // Create playlists
  for (let i = 0; i < numPlaylists; i++) {
    // Randomly select an owner
    const ownerId = 1 + Math.floor(Math.random() * numUsers);

    // Randomly select 5–15 tracks for the playlist
    const trackCount = 5 + Math.floor(Math.random() * 11);
    const trackIds = Array.from({ length: trackCount }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));

    // Create a playlist and connect it to the owner and tracks
    await prisma.playlist.create({
      data: {
        name: `Playlist ${i + 1}`,
        description: `Description for Playlist ${i + 1}`,
        ownerId: ownerId, // Randomly assigned owner
        tracks: { connect: trackIds }, // Connect tracks
      },
    });
  }
};

seed()
  .then(async () => {
    console.log("Database seeded successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
