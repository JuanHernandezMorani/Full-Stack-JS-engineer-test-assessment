const { Router } = require("express");
const { Country, Flag, Population, Borders } = require("../db.js");
const { createCountries, test } = require("../middlewares/index.js");

const app = Router();

app.get('/', async (req,res) => {
const { name } = req.query;

const init = async (data) => {
    let all = await Country.findAll();
    let filtered = "";
    if(!!data) all.filter(c => c.name.toLowerCase().includes(data.toLowerCase()));
    !!data ? filtered.length > 0 ? res.status(200).send(filtered) : res.status(404).send("") : res.status(200).send(all);
};

try {
    let exist = await Country.findOne({where:{id: 1}});
    !!exist ? await init(name) : await createCountries();
} 
catch (error) {
    console.log(error);
}

});

app.get('/:id', async (req,res) => {
    const {id} = req.params;

    let c = Country.findOne({where:{id: id},include:[
        {
            model: Flag,
            attributes:['image'],
            through: {
                attributes: [],
            }
        },
        {
            model: Borders,
            attributes:['data'],
            through: {
                attributes: [],
            }
        },
        {
            model: Population,
            attributes:['data'],
            through: {
                attributes: [],
            }
        }
    ]});


});

module.exports = app;