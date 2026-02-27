const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.json({ status: false, message: 'URL required' });
    }

    try {
        // Instagram API call
        const response = await axios.get(`https://www.instagram.com/p/${url.split('/p/')[1].split('/')[0]}/?__a=1`);
        const media = response.data.graphql.shortcode_media;
        
        let downloadUrl = '';
        if (media.is_video) {
            downloadUrl = media.video_url;
        } else {
            downloadUrl = media.display_url;
        }

        res.json({ 
            status: true, 
            data: [{ url: downloadUrl }] 
        });
    } catch (error) {
        res.json({ status: false, message: 'Failed to download' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));