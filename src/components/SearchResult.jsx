import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function SearchResult() {
    const { mangaList } = useLocation().state;
    const [mangaDetails, setMangaDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMangaDetails = async () => {
            const details = await Promise.all(mangaList.map(async (manga) => {
                const mangaId = manga.id; // manga Id
                const title = manga.attributes.title.en; // manga title
                const coverArtId = manga.relationships.filter(art => art.type === 'cover_art')[0].id; // cover art Id

                // cover art src
                const MANGADEX_BASE_URL = process.env.REACT_APP_MANGADEX_BASE_URL;
                const coverImageResponse = await axios.get(`${MANGADEX_BASE_URL}/cover/${coverArtId}`);

                const coverImage = coverImageResponse.data.data.attributes.fileName;
                const COVER_IMAGE_URL = process.env.REACT_APP_MANGADEX_COVER_IMAGE_URL;
                const coverArtSrc = `${COVER_IMAGE_URL}/${mangaId}/${coverImage}.512.jpg`;

                return { mangaId, title, coverArtId, coverArtSrc };
            }));

            setMangaDetails(details);
        };

        fetchMangaDetails();
    }, [mangaList]);

    const handleClick = (manga) => {
        // console.log(manga);
        navigate(`/result/${encodeURIComponent(manga.title)}/${encodeURIComponent(manga.mangaId)}`, { state: { art: manga.coverArtId }});
    };

    return (
        <div className="results-container">
            {mangaDetails.map(manga => (
                <div 
                    key={manga.mangaId} 
                    className="manga-card" 
                    onClick={() => handleClick(manga)}
                    style={{ cursor: 'pointer' }} // Adding cursor style to indicate clickability
                >
                    <h2>{manga.title}</h2>
                    <img src={manga.coverArtSrc} id={manga.coverArtId} alt={`${manga.title} cover`} />
                </div>
            ))}
        </div>
    );
}
