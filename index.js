const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

// assigment
// 6ofrUMieJvrpIJrA

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9tzag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })



function verifyJWT(req, res, next) {
    const authHeaders = req.headers.authorization
    if (!authHeaders) {
        return res.status(401).send({ message: "Unauthorized access" })
    }
    const token = authHeaders.split(' ')[1]
    // verify a token symmetric
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden Access" })
        }
        req.decoded = decoded
        next()
    })
}



async function run() {
    try {
        await client.connect()
        const mobileCollection = client.db("device").collection("mobile")
        const itemscollection = client.db("device").collection("item")
        const userCollection = client.db("MadeEasy").collection("users")
        const myorderCollection = client.db("MadeEasy").collection("myorders")
        const catagorilistCollection = client.db("MadeEasy").collection("catagorilist")


        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = mobileCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/catagorilist', async (req, res) => {
            const query = {}
            const cursor = catagorilistCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/catagorilist", async (req, res) => {
            const newCatagori = req.body
            const result = await catagorilistCollection.insertOne(newCatagori)
            res.send(result)
        })


        // deleted itemms
        app.delete("/catagorilist/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await catagorilistCollection.deleteOne(query)
            res.send(result)
        })




        app.get('/db', async (req, res) => {
            const query = {}
            const cursor = dbcollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post("/item/:categoryName", async (req, res) => {
            const newUser = req.body
            const result = await itemscollection.insertOne(newUser)
            res.send(result)
        })

        app.get("/item/:categoryName", async (req, res) => {
            const categoryName = req.params.categoryName
            const query = { categoryName: categoryName }
            const cursor = itemscollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        // -----------------------------------
        app.get("/itemquery", async (req, res) => {
            const sellerEmail = req.query.email
            const query = { sellerEmail: sellerEmail }
            const result = await itemscollection.find(query).toArray()
            return res.send(result)

        })

        // --------------------------------------------------------
        app.get("/item", async (req, res) => {
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
            // console.log(id)
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

        app.get("/item/:categoryName/:id", async (req, res) => {
            const categoryName = req.params.categoryName
            const id = req.params.id
            // console.log(name, id)
            const query = { categoryName: categoryName, _id: ObjectId(id) }
            const cursor = itemscollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // all user
        app.put("/user/:email", async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            // console.log(token)
            res.send({ result, token })

        })

        app.get("/user", async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        // admin----------------------------------------
        app.put("/user/admin/:email", async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const updateDoc = {
                $set: { role: "admin" },
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)

        })


        app.get("/admin/:email", async (req, res) => {
            const email = req.params.email
            const user = await userCollection.findOne({ email: email })
            const isAdmin = user?.role === "admin"
            res.send(({ admin: isAdmin }))
        })

        app.get("/seller/:email", async (req, res) => {
            const email = req.params.email
            const user = await userCollection.findOne({ email: email })
            const isseller = user?.role === "seller"
            res.send(({ seller: isseller }))
        })


        // remove user
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })


        // // all order
        app.post('/myorders', async (req, res) => {
            const newItem = req.body
            const result = await myorderCollection.insertOne(newItem)
            res.send(result)
        })

        app.get("/allorders", async (req, res) => {
            const query = {}
            const cursor = myorderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // deleted order
        app.delete("/allorders/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await myorderCollection.deleteOne(query)
            res.send(result)
        })





        app.get("/myorders", async (req, res) => {
            const buyingEmail = req.query.email
            const query = { buyingEmail: buyingEmail }
            const cursor = myorderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })



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

