import { useParams } from 'react-router-dom/dist';
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Chapter() {
    const [ imageUrls, setImageUrls ] = useState([]);
    const { chapterId } = useParams();

    useEffect(() => {
        const ChapterResult = async () => {
            const decodeChapterId = decodeURIComponent(chapterId);
            const MANGADEX_BASE_URL = process.env.REACT_APP_MANGADEX_BASE_URL;
            const url = `${MANGADEX_BASE_URL}/at-home/server/${decodeChapterId}`;

            try{
                const response = await axios({
                    method: 'GET',
                    url: url
                });
    
                const hash= response.data.chapter.hash;
                const MANGADEX_CHAPTER_URL = response.data.baseUrl;
                let images = response.data.chapter.data;
                let urls= images.map(image => `${MANGADEX_CHAPTER_URL}/data/${hash}/${image}`);
                setImageUrls(urls);
            }
            catch(error) {
                console.error("Error fetching Chapter Data:", error);
            }
        
        };
        ChapterResult();
    }, [chapterId]);

    return (
        <div className="image-list">
                {imageUrls.length > 0 ? (
                    imageUrls.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`${index + 1}`}
                        />
                    ))
                ) : (
                    <p>No Data available right now !!!</p>
                )}
        </div>
    );
}