import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import styled from 'styled-components';

function PopartyCard() {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const [view, setView] = useState(null);
    const [searchText, setSearchText] = useState('');
    const[count , setCount] = useState(0)

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://68f9f711ef8b2e621e7e3b89.mockapi.io/api/get-proparty/get-proparty');
            const data = await response.json();
            setProperties(data);
            setLoading(false);
        }
        fetchData();
        console.log(properties);

    }, [count]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name: e.target.name.value,
            type: e.target.type.value,
            price: e.target.price.value,
            location: e.target.location.value,
            description: e.target.description.value,
            image:
                'https://media-cldnry.s-nbcnews.com/image/upload/newscms/2018_30/1355945/home-exterior-today-180726-tease-1355945.jpg',
        };

        try {
            const res = await fetch('https://68f9f711ef8b2e621e7e3b89.mockapi.io/api/get-proparty/get-proparty', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newItem = await res.json();
                // setProperties([...properties, newItem]);
                setCount(count + 1)
                e.target.reset(); // clears form
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const filteredProperties = properties.filter(
        (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.location.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <StyledWrapper blur={!!view}>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                />
            </div>

           
            <div className={`p-6 flex flex-wrap justify-center gap-6 ${view ? 'blurred' : ''}`}>
                {filteredProperties.map((item) => (
                    <div key={item.id} className="card">
                        <div className="card-details">
                            <p className="text-title">{item.name}</p>
                            <p><strong>Price:</strong> {item.price}</p>
                            <p className="text-body">{item.location}</p>
                            <p className="text-body">{item.description}</p>
                        </div>
                        <button onClick={() => setView(item)} className="card-button">
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" className="input" placeholder="Name" required />
                    <input type="text" name="type" className="input" placeholder="Type" required />
                    <input type="text" name="price" className="input" placeholder="Price" required />
                    <input type="text" name="location" className="input" placeholder="Location" required />
                    <input type="text" name="description" className="input" placeholder="Description" required />
                    <button type="submit">Add</button>
                </form>
            </div>

          
            {view && (
                <div className="modal-overlay" onClick={() => setView(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={view.image} alt={view.name} className="mb-4 rounded" />
                        <h2 className="text-2xl font-bold mb-4 text-[#008bf8]">{view.name}</h2>
                        <p className="mb-2">{view.description}</p>
                        <p><strong>Location:</strong> {view.location}</p>
                        <p><strong>Price:</strong> {view.price}</p>
                        <button className="close-btn" onClick={() => setView(null)}>Close</button>
                    </div>
                </div>
            )}
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #b3e5fc 0%, #81d4fa 50%, #0288d1 100%);
  padding: 3rem;
  transition: 0.3s ease;
  position: relative;

  .blurred {
    filter: blur(6px);
    pointer-events: none;
    user-select: none;
  }

  /* Search bar */
  .search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .search-input {
    width: 300px;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 2px solid #0288d1;
    outline: none;
    transition: 0.3s;
  }

  .search-input:focus {
    border-color: #01579b;
    box-shadow: 0 0 10px rgba(2, 136, 209, 0.4);
  }

  /* Card styling */
  .card {
    width: 250px;
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
    border: 1px solid #d0d0d0;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0, 139, 248, 0.3);
  }

  .text-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #0288d1;
  }

  .text-body {
    color: #555;
    font-size: 0.9rem;
  }

  .card-button {
    margin-top: 1rem;
    background: #0288d1;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    transition: 0.3s;
  }

  .card-button:hover {
    background: #0277bd;
  }

  /* Form styling */
  .form-container {
    margin-top: 3rem;
    display: flex;
    justify-content: center;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .input {
    padding: 0.8rem;
    border: 1.5px solid #0288d1;
    border-radius: 8px;
    width: 200px;
    outline: none;
    transition: 0.2s;
  }

  .input:focus {
    box-shadow: 0 0 6px rgba(2, 136, 209, 0.3);
  }

  button {
    background: #03a9f4;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.7rem 1.4rem;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background: #0288d1;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.25);
  }

  .close-btn {
    margin-top: 1rem;
    background: #0288d1;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .close-btn:hover {
    background: #01579b;
  }
`;

export default PopartyCard;
