const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl1tykd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("product").collection("users");
    const ProductCollection = client.db("product").collection("products");

    // save users
    app.put("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const email = user.email;
      const filter = { email: email };
      const options = { upsert: true };
      const obj = {
        email: user.email,
        name: user.name,
      };
      const updateDoc = { $set: obj };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //users get api
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    //users delete api
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    // product API section
    //get  All product
    app.get("/product", async (req, res) => {
      const query = {};
      const result = await ProductCollection.find(query).toArray();
      res.send(result);
    });

    //get product by email-----my product
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      console.log(query);
      const bookings = await ProductCollection.find(query).toArray();
      res.send(bookings);
    });

    //get by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ProductCollection.find(query).toArray();
      res.send(result);
    });

    //store product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await ProductCollection.insertOne(product);
      res.send(result);
    });

    //update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const product = req.body;
      const option = { upsert: true };
      const updateProduct = {
        $set: {
          price: product.price,
          detail: product.detail,
          image: product.image,
          title: product.title,
          brand: product.brand,
        },
      };
      const result = await ProductCollection.updateOne(
        filter,
        updateProduct,
        option
      );
      res.send(result);
    });

    //delete product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ProductCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("server running or server test");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
