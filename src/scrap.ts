import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("athenaeum", "root", "mysecretpassword", {
  host: "localhost",
  dialect: "postgres",
});

const Author = sequelize.define(
  "Author",
  {
    // Model attributes are defined here
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "authors",
    createdAt: "created_at",
    updatedAt: false,
    // Other model options go here
  }
);

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // `sequelize.define` also returns the model
    console.log(Author === sequelize.models.Author); // true

    const authors = await Author.findAll();
    console.log(authors);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

run();
