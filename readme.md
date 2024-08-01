# Production Level Stuffs


npm init
 nodemon app.js --eror
 mkdir src 
 .gitignore ----> from git ignore generator for node marke copy and paste in .gitignore file so sensitive files nt push to git
public folder banao then uske andar temp kabhi kabhi track nahi kar pata toh .gitkeep banao 
 npm i -D nodemon -- install first
  npm dev start
   npm run dev   -- stop it also
    npm i -D prettier -- its is dev depencies so -D(when prettier commes u  need to do  create file in src)
    .prettierrc --> niche down bottom me preetier will automatically track files
    .prettierignore 
    env settings
    PORT =8000
MOGODB_URI=mongodb+srv://rohit_mongodb:rohit123@cluster0.ct1t3bn.mongodb.net-- uri from mongo atlas

npm i dotenv
npm i mongoose express dotenv
 npm i cookie-parser cors
 # CORS stands for Cross-Origin Resource Sharing. It is a security feature implemented by web browsers to control how resources on a web page can be requested from another domain (origin). It is used to allow or restrict web applications running at one origin (domain) from making requests to a different origin.
 npm install mongoose-aggregate-paginate-v2
# mongoose-aggregate-paginate-v2 is a Mongoose plugin designed to facilitate pagination for Mongoose aggregate queries. Aggregate queries are powerful for performing complex data transformations and lookups in MongoDB, but they can become cumbersome when dealing with large datasets. Pagination helps by retrieving data in chunks, making it easier to handle and display in applications.

npm install bcrypt -->node.bycrypt.js--> helps u hash password
# bcrypt: Faster, requires native bindings, better for production.
# bcryptjs: Easier to install, slower, better for development and simpler deployments.

npm install jsonwebtoken
# JSON Web Tokens (JWT) are an open, industry-standard method (RFC 7519) for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.
# JWTs are a powerful and widely-used method for authentication and authorization in modern web applications, providing a secure and efficient way to manage user sessions.

# token exapmle = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

 npm i cloudinary
 npm i  multer
 # DiskStorage
The disk storage engine gives you full control on storing files to disk.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })
























# userSchema.method is used to add instance methods to your schema. These methods can then be called on individual documents created from the schema. Here's how you can define and use instance methods in Mongoose:
Yes, in addition to userSchema.methods, there are several other properties and methods you can define on a Mongoose schema. Here are some of the most commonly used ones:

1. # userSchema.statics
Defines static methods for the schema. Static methods are called on the model itself, not on individual documents.

javascript
Copy code
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Usage:
User.findByEmail('john.doe@example.com').then(user => {
  console.log(user);
});
2. # userSchema.virtual
Defines virtual properties. Virtuals are document properties that do not get persisted to the database. They are computed values.

javascript
Copy code
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Usage:
const user = new User({ firstName: 'John', lastName: 'Doe' });
console.log(user.fullName); // Output: John Doe
3. # userSchema.pre and userSchema.post
Defines middleware (also called pre and post hooks) for the schema. Middleware are functions that run at specific stages in the lifecycle of a document.

javascript
Copy code
userSchema.pre('save', function(next) {
  // Do something before saving a document
  console.log('A document is about to be saved');
  next();
});

userSchema.post('save', function(doc) {
  // Do something after saving a document
  console.log('A document has been saved:', doc);
});
4. # userSchema.plugin
Applies plugins to the schema. Plugins are reusable pieces of code that add functionality to schemas.

javascript
Copy code
const mongoosePaginate = require('mongoose-paginate-v2');
userSchema.plugin(mongoosePaginate);

// Usage:
User.paginate({}, { limit: 10 }).then(result => {
  console.log(result);
});
5. # userSchema.index
Defines indexes for the schema. Indexes improve the performance of database operations.

javascript
Copy code
userSchema.index({ email: 1 });

// Ensure indexes are created
userSchema.on('index', error => {
  if (error) {
    console.error('Indexing error:', error);
  }
});

``` javascript
Example Usage
Here's a complete example that includes various schema properties and methods:

javascript
Copy code
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String
});

// Instance method
userSchema.methods.greet = function() {
  return `Hello, ${this.firstName} ${this.lastName}!`;
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Virtual property
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware
userSchema.pre('save', function(next) {
  console.log('A document is about to be saved');
  next();
});

userSchema.post('save', function(doc) {
  console.log('A document has been saved:', doc);
});

// Plugin
const mongoosePaginate = require('mongoose-paginate-v2');
userSchema.plugin(mongoosePaginate);

// Index
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

// Connecting to the database and using the model
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const newUser = new User({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securepassword'
});

newUser.save()
  .then(() => {
    console.log(newUser.greet()); // Output: Hello, John Doe!
    console.log(newUser.fullName); // Output: John Doe
    return User.findByEmail('john.doe@example.com');
  })
  .then(user => {
    console.log('Found user by email:', user);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error:', error);
    mongoose.connection.close();
  });
Summary
Mongoose schemas provide a powerful way to define the structure and behavior of documents in your MongoDB collections. By using methods, statics, virtuals, pre and post hooks, plugins, and index, you can create rich models with encapsulated logic, validations, and additional functionality.
```

   











  