const { Router } = require("express");
const { Country, Flag, Population, Borders } = require("../db.js");
const { createCountries } = require("../middlewares/index.js");

const app = Router();

app.get('/', async (req,res) => {

try {
    let exist = await Country.findOne({where:{id: 1}});
    if(!exist){
        createCountries();
    }
    let all = await Country.findAll({order: ['id']});
        
    return res.status(200).send(all);
}
catch (error) {
    console.log(error);
}

});

app.get('/:param', async (req, res) => {
    const { param } = req.params;
    try {
        
        let country = await Country.findByPk(param, {
            include: [
                {
                    model: Flag,
                    attributes: ['image']
                },
                {
                    model: Borders,
                    attributes: ['data'],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Population,
                    attributes: ['data']
                }
            ]
        });

        return country ? res.status(200).send(country) : res.status(404).send("Country not found");
    } catch (e) {
        console.error("¡Warning! " + e);
        return res.status(500).send("Error interno del servidor");
    }
});


module.exports = app;