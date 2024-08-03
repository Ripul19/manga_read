import Header from "./components/Header";
import Search from "./components/Search";
import SearchResult from "./components/SearchResult";
import Result from "./components/Result";
import Chapter from "./components/Chapter";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
    return(
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Search />} />
                <Route path='/searchResult/:title' element={<SearchResult />} />
                <Route path='/result/:title/:titleId' element={<Result />} />
                <Route path='/chapter/:chapterId' element={<Chapter />} />
            </Routes>
        </Router>
    );
}

export default App;

/**
 * <Router>
 *  <Routes>
 *      <Route path='/' element={<Element />} />
 *  </Routes>
 * </Router>
 */