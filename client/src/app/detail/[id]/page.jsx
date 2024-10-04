import axios from 'axios';
import Link from 'next/link';

export default async function CountryInfo({ params }) {
    const id = params.id;
    const data = await axios.get(`${process.env.API_URL}/countries/${id}`);
    const country = data.data;
    country.borders[0].data.map((border) => {
        console.log(border);
    })

    return (
        <div>
            <h1>{country.name} ({country.code}) <img width={40} height={25} src={country.flag.image} alt={`${country.name} flag`}/></h1> 
            
            <h2>Border Countries:</h2>
            <ul>
                {country.borders[0].data.map(border => (
                    <li key={border.countryCode}>
                        <Link href={`/detail/${border.countryCode}`}>{border.commonName}</Link>
                    </li>
                ))}
            </ul>
            <h2>Population Chart</h2>
            <ul>
                {country.population.data.map(p => (
                    <li key={p.year}>
                        Year: {p.year}, Population: {p.value.toLocaleString()}
                    </li>
                ))}
            </ul>
            
        </div>
    );
}
