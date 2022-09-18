const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public"));

// Connecting to MongoDB
const mongoDB = "mongodb://localhost:27017/wikiDB";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
});

// The structure of an article
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

// Getting the root directory of our website
app.get("/", (req, res) => {
  res.send("Hello");
});

// ---------------------- TARGETING ALL ARTICLES ------------------------

app
  .route("/articles")

  // Getting all articles in the articles collection
  .get((req, res) => {
    Article.find((err, results) => {
      if (!err) res.send(results);
      else console.log(err);
    });
  })

  // Adding new articles to the articles collection
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (err) console.log(err);
      else console.log("Successfully posted the article.");
    });
  })

  // Deleting all articles from the articles collection
  .delete((err) => {
    if (err) console.log(err);
    else console.log("Successfully deleted all articles.");
  });

// ---------------------- TARGETING A PARTICULAR ARTICLE ------------------------

app
  .route("/articles/:articleTitle")

  // Displaying a specific article
  .get((req, res) => {
    const title = req.params.articleTitle;

    Article.findOne({ title: title }, (err, foundResult) => {
      if (foundResult) res.send(foundResult);
      else res.send("No article with that title was found.");
    });
  })

  // Replacing the specific article with new field(s)
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) console.log(err);
        else console.log("Successfully updated the article.");
      }
    );
  })

  // Updating a field in the specific article
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) console.log(err);
        else console.log("Patch was done successfully.");
      }
    );
  })

  // Deleting the specific article from the articles collection
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (err) console.log(err);
      else
        console.log(
          "Delete successful for article: " + req.params.articleTitle
        );
    });
  });

app.listen(3000, () => {
  console.log("Server has now started on port 3000.");
});
