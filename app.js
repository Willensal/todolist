const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");
const cluster = "<clusterName>";
const authSource = "<authSource>";
const authMechanism = "<authMechanism>";
const mongodb = require("mongodb");
var ObjectId = require('mongodb').ObjectId;
const _ = require("lodash");


const app = express();
app.set("view engine", "ejs"); // setting view engine to ejs
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// to connect to mongo server online

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://bestlawn123:simeon2010@serverlessinstance0.z8vn5zn.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// async function run() {
//     try {
//         family:4
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

main().catch(err => console.log(err));
async function main() {

  await mongoose.connect("mongodb+srv://bestlawn123:simeon2010@serverlessinstance0.z8vn5zn.mongodb.net/?retryWrites=true&w=majority")

}





const todayDate = function () {

    let today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-US", options);
};

const itemsSchema = {
    name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!",
});
const item2 = new Item({
    name: "Hit the + button to add a new ittem.",
});
const item3 = new Item({
    name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];





app.get("/", async (req, res) => {

    const foundItems = await Item.find();
    if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
        try {
            console.log("Succesfully saved default items to DB");
        }
        catch (err) {
            console.log("there's an error");
        }; res.redirect("/");
    } else {
        res.render("list", { listTitle: todayDate(), newListItems: foundItems });
    };
});

const ListSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", ListSchema);

app.get("/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    const foundList = await List.findOne({ name: customListName });

    //function (err, foundList)
    if (!foundList) {
        const list = new List({
            name: customListName,
            items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName)
    } else {
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }


});





app.post("/", async (req, res) => {
    const itemName = req.body.newItem;
    let listName = req.body.list; if (listName) { listName.trim(); }
    const item = new Item({
        name: itemName,
    });

    if (listName === todayDate()) {
        item.save();
        res.redirect("/");

    } else {
        const foundList = await List.findOne({ name: listName });
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);


    };


});


app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox.trim();
    const listName = req.body.listName;

    if (listName === todayDate()) {

        Item.findByIdAndRemove(checkedItemId).then(function (foundItem) { Item.deleteOne({ _id: checkedItemId }) })

        res.redirect("/");

    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {
            res.redirect("/" + listName);
        });
    }

});


app.get("/catego", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
})

app.get("/about", function (req, res) {
    res.render("about");



});

app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running.");
  });
