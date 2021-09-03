import './sass/main.scss';
import debounce from 'lodash.debounce';
import { error, defaultModules } from  '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';

//переменные и общие настройки
const refs = {
    form: document.querySelector('#form'),
    input: document.querySelector('#search'),
    container: document.querySelector('.container')
}

const handlerInput = (e) => {
    e.preventDefault()
    clearCountriesContainer()
    const name = refs.input.value;
        
    //код запроса backend 
fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then(response => response.json())
    .then(data => {
                // бекенд вернул от 2-х до 10-х стран, под инпутом отображается список имен найденных стран
        if (data.length > 1 && data.length <= 10) {
            renderCountriesCollection(data);
        }
        // если бекенд вернул массив с одной страной, в интерфейсе рендерится разметка с данными о стране
        if (data.length === 1) {
            renderCollection(data);
        }
        //eсли бекенд вернул больше чем 10 стран
        if (data.length > 10) {
           
            //pnotify
defaultModules.set(PNotifyMobile, {});
error({
    text: 'Too many matches found. Please enter a more specific query.',
    delay: 1000,
    maxTextHeight: null
});  
        };
        //ввод с ошибкой
        if (data.status === 404) {
             clearContent ()
            error({
                text: "Please enter correct name of the country.",
                delay: 1000,
                maxTextHeight: null
            });
        };
        
    })    

    .catch(err => {
        clearContent()
        /* defaultModules.set(PNotifyMobile, {});
error({
    text: 'Please enter correct country name.'
}); */})
}

//рендеринг разметки
function createCountry({name, capital, population, languages, flag }) {
    const article = `<article class = "country">
    <div class = "country-information">
<h1><b>${name}</b></h1>
<p><b>Capital: </b>${capital}</p>
<p><b>Population: </b>${population}</p>
<ul><b>Languages:</b>
<li> ${languages.map(language =>language.name)}</li>
</ul>
</div>
<div class = "country-flag">
<img src = '${flag}' alt = '${name}' width = "300px"/>
</div>
</article>`
    
    //вставка формы на экран
    refs.container.insertAdjacentHTML('beforeend', article)
}

// debounce
refs.form.addEventListener('input', debounce(handlerInput, 500));

//если бекенд вернул массив с одной страной, в интерфейсе рендерится разметка с данными о стране
function renderCollection (arr) {
    arr.forEach(el => createCountry(el))
}

// бекенд вернул от 2-х до 10-х стран, под инпутом отображается список имен найденных стран
function renderCountriesCollection (arr) {
    arr.forEach(el => createCountriesCollection(el))
}

function createCountriesCollection ({name}) {
  const article = `
  <li class="countries-list">${name}</li>
  `
  refs.container.insertAdjacentHTML('beforeend', article)
}

//очистка формы после ввода
function clearCountriesContainer () {
    refs.container.innerHTML = '';
}

//очистка при вводе с ошибкой
function clearContent(){
    refs.input.value = ''; 
  }
 
