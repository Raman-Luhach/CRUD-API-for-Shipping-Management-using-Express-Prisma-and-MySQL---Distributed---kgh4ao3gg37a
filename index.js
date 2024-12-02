const express = require('express');
const dotenv = require('dotenv');
const {connectDB , prisma} = require("./db/config");
const {parse} = require("dotenv");


dotenv.config();

const app = express();
app.use(express.json());

const middleware = async (req , res , next)=>{
  const x = req.header('SHIPPING_SECRET_KEY')

  if (!x){
    return res.status(403).json({
      "error": "SHIPPING_SECRET_KEY is missing or invalid"
    })
  }
  if (x !== process.env.SHIPPING_SECRET_KEY){
    return res.status(403).json({
      "error": "Failed to authenticate SHIPPING_SECRET_KEY"
    })
  }
  next()
}


const create = async (req , res)=>{
  const {userId , productId , count} = req.body

  if (!userId || !productId || !count){
    return res.status(404).json({
      "error": "All fields required"
    })
  }

  const x = await prisma.Shipping.create(
      {
        data: {userId , productId , count}
      }
  )

  return res.status(201).json(x)
}

const cancel = async (req , res) =>{
    const {shippingId} = req.body
    if (!shippingId){
      return res.status(404).json({
        "error": "Missing shippingId",
      })
    }

  const x = await prisma.Shipping.update(
      {
        where : {id : parseInt(shippingId)},
        data: {status: "cancelled"}
      }
  )

  return res.status(200).json(x)

}

const get = async (req , res) =>{
  const id = req.query.userId

  if (!id){
    const x = await prisma.Shipping.findMany()
    return res.status(200).json(x)
  }

  const x = await prisma.Shipping.findMany({
    where : {userId : parseInt(id)}
  })

  return res.status(200).json(x)
}


app.post("/api/shipping/create" , middleware , create)
app.put("/api/shipping/cancel" , middleware , cancel)
app.get('/api/shipping/get' , middleware , get)

// Start the server
const PORT = process.env.PORT || 3000;


connectDB().then(()=>{
  app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`)
  })
})


module.exports = app;
