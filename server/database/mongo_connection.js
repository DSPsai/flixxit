
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://dspsaiprudhvi007:Pass1234@cluster0.1tblibb.mongodb.net/netflix_clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

// Create Mongoose schema and model
const userSchema = new mongoose.Schema({
    token: String,
    name: String,
    email: String,
    password: String,
    preferredVideoQuality: String,
    subscription: Boolean,
    recentlyWatched: [String], // Array of content IDs
    wishlist: [String], // Array of content IDs
    resetToken: String,
    resetTokenExpiration: String
});

const contentSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    genre: String,
    releaseDate: Date,
    description: String,
    cast: [String],
    videoUrl: String,
    intro_skip: String,
    poster: String
});

const User = mongoose.model('User', userSchema);
const Content = mongoose.model('Content', contentSchema);

module.exports = {
    mongoose,
    User,
    Content,
};
/**
 * users:
 *      (each user)
 *      name:string
 *      email
 *      password hashed
 *      prefered video quality
 *      subscription:boolean
 *      recently watched:content collection id
 *      wishlist:content collection id
 * content collection:
 *      geners(horror, animation, action):
 *          (each movie)
 *          title
 *          rating
 *          genere
 *          release date
 *          description
 *          cast(string array)
 */