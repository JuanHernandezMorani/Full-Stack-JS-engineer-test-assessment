import axios from 'axios';
import Link from 'next/link';
import PopulationChart from '../../components/PopulationChart.jsx';

export default async function CountryInfo({ params }) {
    let country = null;
    let image = "https://th.bing.com/th/id/OIP.sy63ZAVf8hBLh4qDltKCUgHaGi?rs=1&pid=ImgDetMain";

    try {
        const { data } = await axios.get(`${process.env.API_URL}/countries/${params.id}`);
        country = data ? data : null;

        if (country && country.flag && country.flag.image) {
            image = country.flag.image;
        }
    } catch (error) {
        console.error("Error fetching country data:", error);
        country = null; 
    }

    return (
        country == null ? 
            <div>
                <h1>Country API doesn't have further information about this country</h1>
                <Link href='/'>Go back to countries list</Link>
            </div>
        :
        <div>
            <Link href='/'>Go back to countries list</Link>
            <h1 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '9px' }}>
                {country.name} ({country.code})
                <img width={40} height={25} src={image} alt={`${country.name} flag`} style={{ marginLeft: '10px', marginBottom: '1px' }} />
            </h1>

            <h2 style={{ marginLeft: '50px', marginRight: '10px' }}>Border Countries:</h2>
            <br/>
            <ul>
                {country.borders && country.borders[0] && country.borders[0].data.length > 0 ? (
                    country.borders[0].data.map(border => (
                        <li key={border.countryCode} style={{ marginBottom: '10px', marginLeft: '25px' }}>
                            <Link href={`/detail/${border.countryCode}`}>{border.commonName}</Link>
                        </li>
                    ))
                ) : (
                    <li style={{ marginLeft: '50px' }}>No border countries available</li>
                )}
            </ul>
            <br/>
            <br/>
            <h2 style={{ marginLeft: '50px', marginRight: '10px' }}>Population Chart</h2>
            <br/>
            {country.population && country.population.data.length > 0 ? (
                <PopulationChart populationData={country.population.data} />
            ) : (
                <p style={{ marginLeft: '50px' }}>No population data available</p>
            )}
        </div>
    );
}