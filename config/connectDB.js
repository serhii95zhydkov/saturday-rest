const mongoose = require("mongoose");

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URI);
    console.log(
      `MongoDB is connected. DB_NAME: ${db.connection.name}. DB_HOST: ${db.connection.host}. DB_PORT: ${db.connection.port}`
        .green.italic.bold
    );
  } catch (error) {
    console.log(error.message.red.italic.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
