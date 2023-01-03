import {
  insertAuthors,
  insertBookAuthors,
  insertBookGenres,
  insertBooks,
  insertGenres,
  insertUsers,
} from "./insert";

const run = async () => {
  console.log("==> Populating tables...");

  await insertGenres();
  await insertAuthors();
  await insertBooks();
  await insertUsers();
  await insertBookAuthors();
  await insertBookGenres();
};

run().finally(() => {
  console.log("Done!");
  // process.exit(0);
});
