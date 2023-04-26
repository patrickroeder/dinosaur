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
    let _facts = [];

    // helper functions

    function _createTileImageURL (creature) {
        return './images/' + creature.species.toLowerCase() + '.png';
    }

    function _feetAndInchesToInches (feet, inches) {
        return feet * 12 + inches;
    }

    // generate random facts

    function _generateRandomFacts () {
        for (let dino of _dinos) {
            // do not add the pigeon fact from the array
            if (!(dino.species == 'Pigeon')) {
                _facts.push(dino.fact);
            }
        }

        // randomize fact pool (destructively)
        _facts.sort(function () {
            return Math.random() - 0.5;
        });

        // check if weight property on human exists
        if ('weight' in _human) {
            // check if weight property is a number
            if (!isNaN(_human.weight)) {
                // insert at start of facts array so it is always visible
                _facts.unshift(_compareWeight());
            }
        }

        // check if height property on human exists
        if ('height' in _human) {
            // check if height property is a number
            if (!isNaN(_human.height)) {
                // insert at start of facts array so it is always visible
                _facts.unshift(_compareHeight());
            }
        }

        console.log(_facts);
    }

    // comparison functions
    
    function _findHeaviestDino () {
        // initialize an object which will contain the heaviest dino
        let heaviestDino = {
            species: '',
            weight: 0
        };
        // select the heaviest from the list of dinos
        for (let dino of _dinos) {
            if (dino.weight > heaviestDino.weight) {
                heaviestDino.weight = dino.weight;
                heaviestDino.species = dino.species;
            } 
        }
        return heaviestDino;
    }

    function _findTallestDino () {
        // initialize an object which will contain the tallest dino
        let tallestDino = {
            species: '',
            height: 0
        };
        // select the tallest from the list of dinos
        for (let dino of _dinos) {
            if (dino.height > tallestDino.height) {
                tallestDino.height = dino.height;
                tallestDino.species = dino.species;
            } 
        }
        return tallestDino;
    }

    function _compareWeight () {
        const heaviestDino = _findHeaviestDino();
        const heavier = Math.round(heaviestDino.weight / _human.weight);
        return `A ${heaviestDino.species} is ${heavier} times heavier than you!`;
    }

    function _compareHeight () {
        const tallestDino = _findTallestDino();
        const taller = Math.round(tallestDino.height / _human.height);
        return `A ${tallestDino.species} is ${taller} times taller than you!`;
    }

    function _compareX () {
        // stub
    }

    // create the dino grid 

    function _createGrid () {
        let grid = document.getElementById('grid');

        // create the dino tile grid
        let factIndex = 0;
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
            // add specific fact paragraph text for pigeon tile, else add facts from fact pool
            if (dino.species == 'Pigeon') {
                factElement.textContent = dino.fact;
            } else {
                factElement.textContent = _facts[factIndex];
            }
            gridElement.appendChild(factElement);
            // iterate over random fact array
            factIndex++;

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
        
        // add the human tile as a sibling node
        const parentElement = document.getElementById('grid');
        const referenceNode = parentElement.children[4];
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
        _generateRandomFacts();
        _createGrid();
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
