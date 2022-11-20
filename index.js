const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

// assigment
// 6ofrUMieJvrpIJrA

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9tzag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })




async function run() {
    try {
        await client.connect()
        const mobileCollection = client.db("device").collection("mobile")
        const itemscollection = client.db("device").collection("item")

        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = mobileCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/db', async (req, res) => {
            const query = {}
            const cursor = dbcollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/item/:name", async (req, res) => {
            const newUser = req.body
            const result = await itemscollection.insertOne(newUser)
            res.send(result)
        })

        app.get("/item/:name", async (req, res) => {
            const name = req.params.name
            const query = { name: name }
            const cursor = itemscollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/item", async (req, res) => {
            // const name = req.params.name
            const query = {}
            const cursor = itemscollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/item", async (req, res) => {
            const newUser = req.body
            const result = await itemscollection.insertOne(newUser)
            res.send(result)
        })

        // deleted itemms
        app.delete("/item/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await itemscollection.deleteOne(query)
            res.send(result)
        })

        // details item
        app.get("/item/:id", async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await itemscollection.findOne(query)
            res.send(result)
        })

        // app.get("/item/:name/:id", async (req, res) => {
        //     const name = req.params.name
        //     const id = req.params.id
        //     console.log(id)
        //     const query = { _id: ObjectId(id) }
        //     const cursor = itemscollection.find(query)
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })

        app.get("/item/:name/:id", async (req, res) => {
            const name = req.params.name
            const id = req.params.id
            console.log(name, id)
            const query = { name: name, _id: ObjectId(id) }
            const cursor = itemscollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // // // Add Items prodects
        // app.post('/inventory', async (req, res) => {
        //     const newItem = req.body
        //     const result = await mobileCollection.insertOne(newItem)
        //     res.send(result)
        // })

        // // details item
        // app.get('/inventory/:id', async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const result = await mobileCollection.findOne(query)
        //     res.send(result)
        // })
        // // delevered items
        // app.put("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const updatedUser = req.body
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true }
        //     const updateDoc = {
        //         $set: updatedUser
        //     }
        //     const result = await mobileCollection.updateOne(filter, updateDoc, options)
        //     res.send(result)
        // })

        // app.get("/hero", async (req, res) => {
        //     res.send("Herocu connected")
        // })
        // // add Quantity items

        // app.put("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const filter = { _id: ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             quantity: req.body.updateQuantity
        //         },
        //     }
        //     const result = await mobileCollection.updateOne(filter, updateDoc)
        //     res.send(result)
        // })

        // // deleted itemms
        // app.delete("/inventory/:id", async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const result = await mobileCollection.deleteOne(query)
        //     res.send(result)
        // })


        // // My items
        // app.get('/myitems', async (req, res) => {
        //     const email = req.query.email
        //     const query = { email: email }
        //     const cursor = mobileCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.send(result)
        // })


    } finally {

    }
}

run().catch(console.dir)



// middleware
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Running Genius Server hello")
})

app.listen(port, () => {
    console.log("Listening to port", port)
})

