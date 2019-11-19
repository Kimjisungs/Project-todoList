const $weater = document.querySelector('.weather');
const $wrapper = document.querySelector('.wrapper');

let weathers = {};

const promiseGetWeather = () => axios.get('http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=96e89700e66c96b74824ca79ab7e64f8');

const ajaxWeather = async () => {
  try {
    weathers = await promiseGetWeather();
    renderWeather();
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const renderWeather = () => {

  const dataWeather = {
    nowWeather: weathers.data.weather[0].main,
    icon: weathers.data.weather[0].icon,
    country: weathers.data.sys.country,
    cityName: weathers.data.name
  };

  const {
    nowWeather, icon, country, cityName
  } = dataWeather;


  let html = '';
  html = `
  <div class="image"><img src="http://openweathermap.org/img/w/${icon}.png"></div>
  <div class="description">
    <p class="country">${country} - <span class="country-name">${cityName}</span></p>
    <h3 class="now-weather">${nowWeather}</h3>
  </div>
  `;
  $weater.innerHTML = html;
  // console.log('현재 날씨' + weathers.data.weather[0].main);
  // console.log('아이콘' + weathers.data.weather[0].icon);
  // console.log('상세 날씨 설명' + weathers.data.weather[0].description);
  // console.log('나라' + weathers.data.sys.country);
  // console.log('도시이름' + weathers.data.name);

  weatherBackground(nowWeather);
};

const weatherBackground = (nowWeather) => {
  const wrapperBg = $wrapper.style;
  switch (nowWeather) {
    case 'Clear':
      wrapperBg.backgroundImage = 'url("https://user-images.githubusercontent.com/33679192/69144269-41d2c080-0b0e-11ea-98c2-017b4739d299.jpg")';
      break;
    default:
      wrapperBg.backgroundColor = 'white';
      break;
  }
};

window.addEventListener('load', () => {
  ajaxWeather();
});
