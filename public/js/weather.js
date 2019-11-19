const $weater = document.querySelector('.weather');

let weathers = {};

const promiseGetWeather = () => axios.get('http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=96e89700e66c96b74824ca79ab7e64f8');

const ajaxWeather = async () => {
  try {
  weathers = await promiseGetWeather();
  renderWeather();
  } catch(e) {
    console.log(new Error('Error'));
  }
};

const renderWeather = () => {
  let html = '';
  html = `
  <div class="image"><img src="http://openweathermap.org/img/w/${weathers.data.weather[0].icon}.png"></div>
  <div class="description">
    <p class="country">${weathers.data.sys.country} - <span class="country-name">${weathers.data.name}</span></p>
    <h3 class="now-weather">${weathers.data.weather[0].main}</h3>
  </div>
  `
  $weater.innerHTML = html;
  // console.log('현재 날씨' + weathers.data.weather[0].main);
  // console.log('아이콘' + weathers.data.weather[0].icon);
  // console.log('상세 날씨 설명' + weathers.data.weather[0].description);
  // console.log('나라' + weathers.data.sys.country);
  // console.log('도시이름' + weathers.data.name);
};

window.addEventListener('load', () => {
  ajaxWeather();
});