import { useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Result() {
    const { title, titleId } = useParams();
    const [ extractedChapters, setExtractedChapters ] = useState([]);
    const [ coverImageUrl, setCoverImageUrl ] = useState();
    const decodeTitle = decodeURIComponent(title);

    const coverArtId = useLocation().state?.art;

    useEffect(() => {
        const SearchResult = async () => {
            const decodeTitleId = decodeURIComponent(titleId);
            const MANGADEX_BASE_URL = process.env.REACT_APP_MANGADEX_BASE_URL;
            const url = `${MANGADEX_BASE_URL}/manga/${decodeTitleId}/aggregate`;
            
            try {
                const response = await axios({
                    method: 'GET',
                    url: url,
                    params: {
                        translatedLanguage: ['en']
                    }
                });
                
                const coverImageResponse = await axios({
                    method: 'GET',
                    url: `${MANGADEX_BASE_URL}/cover/${coverArtId}`
                });

                const coverImage = coverImageResponse.data.data.attributes.fileName;
                const COVER_IMAGE_URL = process.env.REACT_APP_MANGADEX_COVER_IMAGE_URL;
                setCoverImageUrl(`${COVER_IMAGE_URL}/${decodeTitleId}/${coverImage}.512.jpg`);

                const data = response.data.volumes;
                
                let chapterArray = [];
                Object.values(data).forEach(volumes => {
                    const chapters = volumes.chapters;
                    
                    Object.values(chapters).forEach(chapter => {
                        const chapterNumber = chapter.chapter;
                        const chapterId = chapter.id;

                        chapterArray.push({chapterNumber, chapterId});
                    });
                });
                
                setExtractedChapters(chapterArray);
            }
            catch (error) {
                console.error("Error fetching manga chapters:", error);
            }

        };
        SearchResult();
    }, [titleId, coverArtId]);

    function handleChapterClick(chapterId){
        window.open(`/chapter/${encodeURIComponent(chapterId)}`);
    }

    return (
        <div>
            <h2>{decodeTitle} - List of Chapters</h2>
            <div className="chapter-container">
                <img 
                    src={coverImageUrl}
                    alt="Cover"
                    className="cover-image"
                />
                <div className="chapter-list-container">
                    <ul className="chapter-list">
                        {extractedChapters.map(chapter => (
                            <li key={chapter.chapterId} data-chapter-id={chapter.chapterId} onClick={() => handleChapterClick(chapter.chapterId)}>
                                Chapter {chapter.chapterNumber}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}