// Create Dino Constructor

// Superclass constructor
function Creature (weight, height, diet) {
    this.weight = weight;
    this.height = height;
    this.diet = diet;
}

// Subclass constructor
function Dinosaur (weight, height, diet, species) {
    // call constructor of superclass
    Creature.call(this, weight, height, diet);
    this.species = species;
}

// Setting up the prototype chain between superclass and subclass
Dinosaur.prototype = Object.create(Creature.prototype);
Dinosaur.prototype.constructor = Dinosaur;

// Subclass constructor
function Human (weight, height, diet) {
    // call constructor of superclass
    Creature.call(this, weight, height, diet);
    this.species = 'Human';
}

// Setting up the prototype chain between superclass and subclass
Human.prototype = Object.create(Creature.prototype);
Human.prototype.constructor = Human;


// Create Dino Objects

const myModule = (function() {

    let dinos = [];

    async function getDinoJSON (dinoPath) {
        try {
            const response = await fetch(dinoPath);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async function createDinos () {
        const dinoJSON = await getDinoJSON('./dino.json');
        const dinoData = dinoJSON['Dinos'];
        for (let dino of dinoData) {
            dinos.push(Object.assign(new Dinosaur, dino));
        }
    }

    function createHuman () {
        const human = new Human(90,180,'omnivore');
        return human;
    }

    function init () {
        createDinos();
    }

    return {
        init: init,
        dinos: dinos,
        createHuman: createHuman
    }

})();

myModule.init();
const dinos = myModule.dinos;
const human = myModule.createHuman();
console.log(dinos);
console.log(myModule);

// Create Human Object

// Use IIFE to get human data from form


// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 

    
// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

    
// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.


// Generate Tiles for each Dino in Array
  
// Add tiles to DOM

// Remove form from screen


// On button click, prepare and display infographic
