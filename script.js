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

let map,mapEvent;
class App
{
    //private class fields
    #map;
    #mapEvent;
    constructor()
    {
        this._getposition();
        form.addEventListener('submit',this._newWorkout.bind(this));//to make it point to the object itself

        inputType.addEventListener('change',this.__toggleElevationField);
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

    _toggleElevationField()
    {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden'); //CLOSEST is like inverse query selector it will select parent rather than children
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e)
    {
        e.preventDefault();
        //clear input fields
        inputDistance.value='';
        inputDuration.value='';
        inputCadence.value='';
        inputElevation.value='';
            // console.log(mapEvent);

            const {lat,lng}=this.#mapEvent.latlng;

            L.marker([lat,lng]).addTo(this.#map)
                .bindPopup(L.popup({
                maxWidth:250,
                minWidth:100,
                autoClose:false,
                closeOnClick:false,
                className:'running-popup',
            }))
            .setPopupContent('Workout')
            .openPopup();  
    }
}

const app=new App();


