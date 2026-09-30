import mongoose from "mongoose"

export const dbConnectionHandler = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connection established at', conn.connection.host)
    } catch (err) {
        process.exit(1);
    }
}