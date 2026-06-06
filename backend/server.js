require("dotenv").config()  
const app=require("./src/app")
const connectDB=require("./src/config/database")


app.listen(process.env.PORT || 5432,async()=>{
    try{
        await connectDB();
        console.log("server started on port http://localhost:5432")
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }

})