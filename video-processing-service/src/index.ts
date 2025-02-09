import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, uploadProcessedVideo, setupDirectories } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    // get the bucket and fileName from cloud PubSub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('invalid message syntax');
        }
    } catch(err) {
        console.log(err);
        res.status(400).send('Bad request: missing filename.');
        return;
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    await downloadRawVideo(inputFileName);

    try {
        convertVideo(inputFileName, outputFileName)
    } catch(err) {
        Promise.all([
            deleteProcessedVideo(outputFileName),
            deleteRawVideo(inputFileName)
        ])
        console.log(err);
        res.status(500).send('Internal server error: video processing failed.');
        return;
    }

    // Upload the processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    // Delete local copies
    await Promise.all([
        deleteProcessedVideo(outputFileName),
        deleteRawVideo(inputFileName)
    ])

    console.log("Video processing completed successfully.")
    res.status(200).send("Video processing completed successfully.");
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
})