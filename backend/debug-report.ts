import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(async () => {
        console.log("Connected to MongoDB.");

        // Lazy definition to avoid requiring the full app
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            portfolioReport: {
                analysis: String,
                generatedAt: Date
            }
        }, { collection: 'users' });

        const User = mongoose.model('User', userSchema);

        const akash = await User.findOne({ email: 'xofad82541@homuno.com' });
        if (!akash) {
            console.log("Akash not found");
        } else {
            console.log("--- AKASH REPORT START ---");
            console.log(akash.portfolioReport?.analysis || "NO REPORT");
            console.log("--- AKASH REPORT END ---");
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
