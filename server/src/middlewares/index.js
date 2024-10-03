const axios = require('axios');
const { Country, Flag, Population, Borders } = require("../db.js");

async function createFlags() {
    await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
    .then(json.data.map(async (obj)=>{
        await Flag.findOrCreate({
            where:{
                name: obj.name,
                image: obj.flag
            }
        })
    }));

    
}

async function createPopulations() {
    await axios.get('https://countriesnow.space/api/v0.1/countries/population')
    .then(json.data.map(async (obj)=>{
        Population.findOrCreate({
            where:{
                name: obj.country,
                data: obj.populationCounts
            }
        })
    }));

    await Population.create()
}

async function createBorders(code) {
    let info = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${code}`);

    await Borders.findOrCreate({
        where:{
            name: info.commonName,
            data: info.borders
        }
    });
}

async function createCountries() {
    try{
        await createPopulations();
    await createFlags();

    await axios.get('https://date.nager.at/api/v3/AvailableCountries')
    .then(
        json.map(async (obj) => {
            await createBorders(obj.countryCode);
            let cBorders = await Borders.findOne({where: {name: obj.name}});
            let cPopulation = await Population.findOne({where: {name: obj.name}});
            let cFlag = await Flag.findOne({where: {name: obj.name}});

            let country = await Country.findOrCreate({
                where:{
                    name: obj.name,
                    code: obj.countryCode
                }
            });

            await country.addBorders(cBorders);
            await country.addFlags(cFlag);
            await country.addPopulations(cPopulation);
        })
    );
    }
    catch(e){
        console.log(e);
    }
}

module.exports = {
    createCountries,
};