import axios from 'axios';
import Link from 'next/link';

export default async function Home() {
    let countries = [];
    try {
        const res = await axios.get(`${process.env.API_URL}/countries`);
        countries = Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error('Error fetching countries:', error.message);
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '9px' }}>Country List</h1>
            <ul>
                {countries.length > 0 ? (
                    countries.map(country => {
                        return (
                            <li key={country.code} style={{ marginBottom: '10px', marginLeft: '25px' }}>
                                <Link href={`/detail/${country.id}`}>
                                    {country.name}
                                </Link>
                            </li>
                        );
                    })
                ) : (
                    <li>No countries found</li>
                )}
            </ul>
        </div>
    );
}
