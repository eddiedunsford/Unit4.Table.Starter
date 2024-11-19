const prisma = require("../prisma");

const seed = async () => {
  // TODO: this function
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
