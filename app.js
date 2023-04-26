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
function Human (weight, height, diet, name) {
    // call constructor of superclass
    Creature.call(this, weight, height, diet);
    this.species = 'Human';
    this.name = name;
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
            dinos.push(Object.assign(new Dinosaur(), dino));
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

const UIHandler = (function() {

    let _dinos = [];
    let _human = {};

    function _createGrid () {
        let grid = document.getElementById('grid');

        // prepare the array (human in the middle)
        // determine the midpoint of the array
        const middle = _dinos.length / 2;
        // insert human in the middle
        _dinos.splice(middle, 0, _human);

        // create the tiles
        for (let tile of _dinos) {
            const gridElement = document.createElement('div');
            gridElement.textContent = tile.species;
            gridElement.className = 'grid-item';

            // add image
            const tileImage = document.createElement('img');
            const imgURL = './images/' + tile.species.toLowerCase() + '.png';
            tileImage.src = imgURL;
            gridElement.appendChild(tileImage);

            grid.appendChild(gridElement);
        }
    }

    function _feetAndInchesToInches(feet, inches) {
        return feet * 12 + inches;
    }

    function onSubmit () {
        let form = document.getElementById('dino-compare');
        let name = document.getElementById('name').value;
        let weight = parseInt(document.getElementById('weight').value);

        // convert feet and inches into inches
        let feet = parseInt(document.getElementById('feet').value);
        let inches = parseInt(document.getElementById('inches').value);
        let height = _feetAndInchesToInches(feet, inches);

        _human = Object.assign(new Human(), { name: name, weight: weight, height: height });
        console.log(_human);
        form.remove();
        _createGrid(dinos);
    }

    function init () {
        let submitButton = document.getElementById('btn');
        submitButton.addEventListener('click', onSubmit);
    }

    function setDinos (dinos) {
        _dinos = dinos;
    }

    return {
        init: init,
        setDinos: setDinos
    }

})();

UIHandler.setDinos(dinos);
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
