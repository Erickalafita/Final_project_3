import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import './SearchPage.css';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;
            const params = [];

            if (searchQuery) {
                params.push(`name=${encodeURIComponent(searchQuery)}`);
            }
            if (selectedCategory) {
                params.push(`category=${encodeURIComponent(selectedCategory)}`);
            }
            if (selectedCondition) {
                params.push(`condition=${encodeURIComponent(selectedCondition)}`);
            }
            if (ageRange) {
                params.push(`age_years=${ageRange}`);
            }

            url += params.join('&');
            console.log('Search URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
        }
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };




    return (
        <div className="container mt-5">
            <h1 className="search-title">Search Gifts</h1>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Condition</label>
                                <select
                                    className="form-select"
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    <option value="">All Conditions</option>
                                    {conditions.map((condition, index) => (
                                        <option key={index} value={condition}>{condition}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <div className="mb-3">
                                <label className="form-label">Maximum Age (Years): {ageRange}</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1"
                                    max="20"
                                    value={ageRange}
                                    onChange={(e) => setAgeRange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Task 7: Add text input field for search criteria*/}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button className="btn btn-primary mb-3 w-100" onClick={handleSearch}>
                        Search
                    </button>

                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            <div className="row">
                                {searchResults.map((gift) => (
                                    <div key={gift.id} className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            {gift.image ? (
                                                <img src={gift.image} className="card-img-top" alt={gift.name} />
                                            ) : (
                                                <div className="card-img-top bg-secondary text-white d-flex align-items-center justify-content-center" style={{height: '150px'}}>
                                                    No Image
                                                </div>
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{gift.name}</h5>
                                                <p className="card-text">
                                                    <strong>Category:</strong> {gift.category}<br/>
                                                    <strong>Condition:</strong> {gift.condition}<br/>
                                                    <strong>Age:</strong> {gift.age_years} years
                                                </p>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => goToDetailsPage(gift.id)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-info text-center">
                                No gifts found matching your criteria. Try adjusting your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
