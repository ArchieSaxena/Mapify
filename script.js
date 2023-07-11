'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// let map,mapEvent;
class Workout{
    date=new Date();
    id=(Date.now()+'').slice(-10);
    constructor(coords,distance,duration)
    {
        // this.date=...;
        // this.id=...;
        this.coords=coords;
        this.distance=distance;//km
        this.duration=duration;//min
    }
}
class Running extends Workout{
    type='running';
    constructor(coords,distance,duration,cadence)
    {
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
    }

    calcPace()
    {
        //min/km
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}
class Cycling extends Workout{
    type='cycling';
    constructor(coords,distance,duration,elevationGain)
    {
        super(coords,distance,duration);
        this.elevationGain=elevationGain;
        this.calcSpeed();
    }
    calcSpeed()
    {
        //min/km
        this.speed=this.distance/(this.duration/60);
        return this.speed;
    }
}

// const run1=new Running([48,-12],5.2,24,170);
// const cycle1=new Cycling([48,-12],5.2,24,523);
// console.log(run1,cycle1);
class App
{
    //private class fields
    #map;
    #mapEvent;
    #workouts=[];
    constructor()
    {
        
        this._getposition();
        form.addEventListener('submit',this._newWorkout.bind(this));//to make it point to the object itself
        // inputType.addEventListener('change', this._toggleElevationField);
        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getposition()
    {
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
                    alert('Could not get your location');
            });
        }
    }

    _loadMap(position)
    {
        const {latitude}=position.coords;
        const {longitude}=position.coords;
        console.log(`https://www.google.com/maps/@{latitude},{longitude},15z?entry=ttu`);
        const coords=[latitude,longitude];
        console.log(this);
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        //handling clicks on map
        this.#map.on('click',this._showform.bind(this));//it will set to the object that add event handler is attached which we dont want and so we r using bind to to bind it to the app
    }

    _showform(mapE)
    {
        this.#mapEvent=mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    // _toggleElevationField()
    // {
    //     inputElevation.closest('.form__row').classList.toggle('form__row--hidden'); //CLOSEST is like inverse query selector it will select parent rather than children
    //     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    // }
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
      }

    _newWorkout(e)
    {

        const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));        //get data from form
        const type=inputType.value;
        const distance=+inputDistance.value;
        const duration=+inputDuration.value;
        const {lat,lng}=this.#mapEvent.latlng;
        let workout;

        const allPositive=(...inputs)=>inputs.every(inp=>inp>0);
        //if workout is running
        if(type==='running')
        {
            //check if data is valid
            const cadence=+inputCadence.value;
            // if(!Number.isFinite(distance) 
            //     || !Number.isFinite(duration) 
            //     || !Number.isFinite(cadence)) 
            if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence)) return alert('Inputs have to be positive number');

            workout=new Running([lat,lng],distance,duration,cadence);
            console.log(workout);
            
        }

        //if workout is cycling
        if(type==='cycling')
        {
            const elevation=+inputElevation.value;
            if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)) return alert('Inputs have to be positive number');

            workout=new Cycling([lat,lng],distance,duration,elevation);
        }
        //add new object to workout array
        this.#workouts.push(workout);
        //render workout on map as marker
        this.renderWorkoutMarker(workout);

        e.preventDefault();
        //clear input fields
        inputDistance.value='';
        inputDuration.value='';
        inputCadence.value='';
        inputElevation.value='';
    }


    renderWorkoutMarker(workout)
    {
            // console.log(mapEvent);
            L.marker(workout.coords).addTo(this.#map)
                .bindPopup(L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:`${workout.type}-popup`,
            }))
            .setPopupContent('Workout')
            .openPopup();  
    }
}

const app=new App();


