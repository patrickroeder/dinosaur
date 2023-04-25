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

const dinoFactory = (function() {

    let dinos = [];

    async function _getDinoJSON (dinoPath) {
        try {
            const response = await fetch(dinoPath);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async function _createDinos () {
        const dinoJSON = await _getDinoJSON('./dino.json');
        const dinoData = dinoJSON['Dinos'];
        for (let dino of dinoData) {
            dinos.push(Object.assign(Object.create(Dinosaur.prototype), dino));
        }
    }

    function getDinos () {
        return dinos;
    }

    function init () {
        _createDinos();
    }

    return {
        init: init,
        getDinos: getDinos
    }

})();

dinoFactory.init();
const dinos = dinoFactory.getDinos();
console.log(dinos);

const UIHandler = (function() {

    let human = {};

    function createGrid (dinos) {
        let grid = document.getElementById('grid');
    }

    function onSubmit () {
        let form = document.getElementById('dino-compare');
        let name = document.getElementById('name').value;
        let weight = parseInt(document.getElementById('weight').value);
        // alternative object creation: new Human(weight, height, diet)
        human = Object.assign(Object.create(Human.prototype), { name: name, weight: weight });
        console.log(human);
    }

    function init () {
        let submitButton = document.getElementById('btn');
        submitButton.addEventListener('click', onSubmit);
    }

    return {
        init: init
    }

})();

document.addEventListener('DOMContentLoaded', UIHandler.init);



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
