const axios = require('axios');
const { Country, Flag, Population, Borders } = require("../db.js");

async function createFlags() {
    try{
        const json = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
        const flags = json.data.data.map(async (obj) => {
            await Flag.findOrCreate({
                where:{
                    name: obj.name,
                    image: obj.flag
                }
            })
        });
        await Promise.all(flags);
    }
    catch(e){
        console.error('Error creando banderas:', e);
    }
}

async function createPopulations() {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population');
        const populations = response.data.data.map(async (obj) => {
            await Population.findOrCreate({
                where: {
                    name: obj.country,
                },
                defaults: {
                    data: obj.populationCounts
                }
            });
        });
    await Promise.all(populations);

    } catch (error) {
        console.error('Error creando poblaciones:', error);
    }
}


async function createBorders(code) {
    try{
        let ccArray = code.map(o => o.countryCode);

        for(let i = 0; i < ccArray.length; i++){
            let info = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${ccArray[i]}`);
            let creator = await Borders.findOrCreate({
                where:{
                    name: info.data.commonName,
                },
                defaults: {
                    data: info.data.borders
                }
            });
            await Promise.all(creator);
        }
    }
    catch(e){
        console.error('Error al crear bordes:', e);
    }
}

async function createCountries() {
    const json = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    try{

   await createPopulations();
   await createFlags();
   await createBorders(json.data);

    await Promise.all(
        json.data.map(async (obj) => {
            
            const countryName = obj.name;
            const countryCode = obj.countryCode;

            if (!countryName || !countryCode) {
                console.error("Faltan datos: ", obj);
                return;
              }

              let cBorders = await Borders.findOne({ where: { name: countryName } });
              let cPopulation = await Population.findOne({ where: { name: countryName } });
              let cFlag = await Flag.findOne({ where: { name: countryName } });
      
          const country = await Country.create({
                name: countryName,
                code: countryCode,
          });
      
          if (cBorders) {
            await country.addBorders(cBorders);
          }
      
          if (cFlag) {
            await country.setFlag(cFlag);
          }
      
          if (cPopulation) {
            await country.setPopulation(cPopulation);
          }
          
        })
      );

    }
    catch(e){
        console.error('Error al crear el pais:', e);
    }
}

module.exports = {
    createCountries,
};