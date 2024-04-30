import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Search() {

    const navigate = useNavigate();

    async function handleSubmit(event) {

        event.preventDefault();
        const title = event.target.elements.q.value;

        const MANGADEX_BASE_URL = process.env.REACT_APP_MANGADEX_BASE_URL;

        try{
                
            const url = `${MANGADEX_BASE_URL}/manga`;
            const response = await axios({
                method: 'GET',
                url: url,
                params: {
                    title: title,
                    limit: 1,
                    offset: 0
                }
            });

            const id = response.data.data[0].id;
            const responseTitle = response.data.data[0].attributes.title.en;

            const cover_art= response.data.data[0].relationships.filter(art => art.type === 'cover_art')[0].id;

            navigate(`/result/${encodeURIComponent(responseTitle)}/${encodeURIComponent(id)}`, { state: { art: cover_art }});
        }
        catch (error) {
            console.error("Error fetching manga: ", error);
        }
    }

    return (
        <div className="center-container">
            <div className="search-container">
                <form role="search" id="form" onSubmit={handleSubmit}>
                    <input type="search" id="query" name="q" placeholder="Search..." />
                </form>
            </div>
        </div>
    );
}
