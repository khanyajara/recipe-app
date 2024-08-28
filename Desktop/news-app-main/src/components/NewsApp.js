import React, { useState, useEffect } from 'react';
import './NewsApp.css';

const NewsArticle = ({ article }) => {
    const { title, url, urlToImage, description } = article;

    // URLs for sharing
    const emailLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const instagramLink = `https://www.instagram.com/?url=${encodeURIComponent(url)}`; // Instagram does not support direct sharing of links

    return (
        <div className='news-article'>
            {urlToImage && (
                <img src={urlToImage} alt={title} className='news-image' />
            )}
            <h3>{title}</h3>
            <p>{description}</p>
            <a href={url} target='_blank' rel='noopener noreferrer'>Read more</a>
            <div className="share-links">
                <p>Share:</p>
                <a href={emailLink} target='_blank' rel='noopener noreferrer'>Email</a>
                <a href={whatsappLink} target='_blank' rel='noopener noreferrer'>WhatsApp</a>
                <a href={facebookLink} target='_blank' rel='noopener noreferrer'>Facebook</a>
                <a href={instagramLink} target='_blank' rel='noopener noreferrer'>Instagram</a>
            </div>
        </div>
    );
};

const NewsApp = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(9); // 3 columns x 3 rows per page
    const [selectedCategory, setSelectedCategory] = useState('general');

    useEffect(() => {
        const fetchNews = async () => {
            const url = `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=594e7c65a0394c01b9b99a1399d9d896`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data.articles || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [selectedCategory]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    return (
        <div>
            <div className="dropdown">
                <button className="dropbtn">Category</button>
                <div className="dropdown-content">
                    <a href="#" onClick={() => setSelectedCategory('sports')}>Sports</a>
                    <a href="#" onClick={() => setSelectedCategory('technology')}>Tech</a>
                    <a href="#" onClick={() => setSelectedCategory('business')}>Business</a>
                    <a href="#" onClick={() => setSelectedCategory('politics')}>Politics</a>
                    <a href="#" onClick={() => setSelectedCategory('entertainment')}>Entertainment</a>
                    <a href="#" onClick={() => setSelectedCategory('health')}>Health</a>
                    <a href="#" onClick={() => setSelectedCategory('science')}>Science</a>
                </div>
            </div>
            <h2>Trending news</h2>
            <div className='news-container'>
                {news.slice(indexOfFirstArticle, indexOfLastArticle).map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default NewsApp;
