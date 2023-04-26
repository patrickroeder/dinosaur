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

    // helper functions

    function _createTileImageURL (creature) {
        return './images/' + creature.species.toLowerCase() + '.png';
    }

    function _feetAndInchesToInches (feet, inches) {
        return feet * 12 + inches;
    }

    function _getRandomElement (array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    // comparison functions

    function _compareWeight (dino) {
        const heavier = Math.round(dino.weight / _human.weight);
        return `A ${dino.species} is ${heavier} times heavier than you!`;
    }

    function _compareHeight (dino) {
        const taller = Math.round(dino.height / _human.height);
        return `A ${dino.species} is ${taller} times taller than you!`;
    }

    function _compareX () {
        // stub
    }

    function _generateRandomFact(dino) {
        let fact = '';
        // add specific fact paragraph text for pigeon tile, else add random facts
        if (dino.species == 'Pigeon') {
            fact = dino.fact;
        } else {
            const keys = ['weight', 'height', 'diet', 'where', 'when', 'fact'];
            
            // check if weight property exists on human
            if ('weight' in _human) {
                // check if weight property is a number
                if (!isNaN(_human.weight)) {
                    keys.push('human_weight');
                }
            }
            // check if height property exists on human
            if ('height' in _human) {
                // check if height property is a number
                if (!isNaN(_human.height)) {
                    keys.push('human_height');
                }
            }

            // randomize keys
            const key = _getRandomElement(keys);
            console.log(key);

            switch (key) {
                case 'weight':
                    fact = `${dino.species} weighs ${dino.weight} lbs.`;
                    break;
                
                case 'height':
                    fact = `${dino.species} is ${dino.height} feet tall.`;
                    break;
                
                case 'diet':
                    fact = `${dino.species} is a ${dino.diet}.`;
                    break;

                case 'where':
                    fact = `${dino.species} lives in ${dino.where}.`;
                    break;

                case 'when':
                    fact = `${dino.species} lived in the ${dino.when} time period.`;
                    break;
                
                case 'fact':
                    fact = dino.fact;
                    break;

                case 'human_height':
                    fact = _compareHeight(dino);
                    break;

                case 'human_weight':
                    fact = _compareWeight(dino);
                    break;
            
                default:
                    break;
            }
        }
        return fact;
    }

    // create the dino grid 

    function _createDinoGrid () {
        let grid = document.getElementById('grid');

        // create the dino tile grid
        for (let dino of _dinos) {
            const gridElement = document.createElement('div');
            gridElement.className = 'grid-item';

            // add headline with species name
            const headlineElement = document.createElement('h3');
            headlineElement.textContent = dino.species;
            gridElement.appendChild(headlineElement);

            // add image
            const tileImage = document.createElement('img');
            tileImage.src = _createTileImageURL(dino);
            gridElement.appendChild(tileImage);

            // add fact paragraph 
            const factElement = document.createElement('p');
            factElement.textContent = _generateRandomFact(dino);
            gridElement.appendChild(factElement);

            grid.appendChild(gridElement);
        }
    }

    // create the human tile

    function _addHumanTile () {
        const humanTile = document.createElement('div');
        humanTile.className = 'grid-item';

        // add headline with human name
        const headlineElement = document.createElement('h3');
        headlineElement.textContent = _human.name || _human.species;
        humanTile.appendChild(headlineElement);
        
        // add the human tile as a sibling node in the middle
        const parentElement = document.getElementById('grid');
        const middle = _dinos.length / 2;
        const referenceNode = parentElement.children[middle];
        parentElement.insertBefore(humanTile, referenceNode);

        // add image
        const tileImage = document.createElement('img');
        tileImage.src = _createTileImageURL(_human);
        humanTile.appendChild(tileImage);
    }

    //  handler for the submit button

    function _onSubmit () {
        let form = document.getElementById('dino-compare');

        // get form data
        let name = document.getElementById('name').value;
        let weight = parseInt(document.getElementById('weight').value);
        let diet = document.getElementById('diet').value;

        // get height data, convert feet and inches into inches
        let feet = parseInt(document.getElementById('feet').value);
        let inches = parseInt(document.getElementById('inches').value);
        let height = _feetAndInchesToInches(feet, inches);

        // using a constructor function instead of Object.create() in order to initialize the object with properties
        _human = Object.assign(new Human(), { name: name, weight: weight, height: height, diet: diet });
        // console.log(_human);

        form.remove();
        _createDinoGrid();
        _addHumanTile();
    }

    // submit button callback

    function init () {
        let submitButton = document.getElementById('btn');
        submitButton.addEventListener('click', _onSubmit);
    }

    // add the dino data

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
