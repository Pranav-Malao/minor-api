const mongoose = require('mongoose');
const balKand = require('../models/balKand.js'); 
// const balKandShlokas= require('../seeds/Balkand/BalkandSarg6.js');


function transformId(id) {

  let transformedId = id.replace(/\./g, '-');
  
  // Remove leading zeros from each segment
  transformedId = transformedId.split('-').map(segment => parseInt(segment, 10)).join('-');
  
  return transformedId;
}

mongoose.connect('mongodb://localhost:27017/minor-project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  try {
    // Fetch all documents
    const slokas = await balKand.find({});
    
    // Update each document
    for (const sloka of slokas) {
      const id = sloka.id;
      const SlokaAudio = transformId(id);
      sloka.audio = `https://www.valmiki.iitk.ac.in/sites/default/files/audio/${SlokaAudio}.mp3`;

      // Save the updated document
      await sloka.save();
      console.log(`Updated sloka with id: ${id}`);
    }

    console.log('All documents updated successfully');
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
});


  
//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "connection error:"));
//   db.once("open", () => {
//     console.log("Database connected");
//   });
   

  
//   balKand.find()
//   .then(docs => console.log(docs))
//   .catch(err => console.error(err));

//   balKand.insertMany(balKandShlokas)
//   .then(res => {
//     console.log(res)
// })
// .catch(e => {
//     console.log(e)
// })
 
