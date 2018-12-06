var APP = APP || {}

APP.weatherapp = function(el) {
  $('.weather').each(function(index, element) {
    const $MODULE = $(element),
      $tempContainer = $MODULE.find('.weather__dailyContainer'),
      $weekContainer = $MODULE.find('.weather__weekContainer'),
      $tabs = $MODULE.find('.weather__item'),
      $detailsContainer = $MODULE.find('.weather__dailyDetails'),
      $temp = $MODULE.find('.weather__degrees'),
      $date = $MODULE.find('.weather__date'),
      $name = $MODULE.find('.weather__location'),
      $tempMax = $MODULE.find('.weather__tempMax'),
      $tempMin = $MODULE.find('.weather__tempMin'),
      $wind = $detailsContainer.find('.wind'),
      $humidity = $detailsContainer.find('.humidity'),
      $precipitation = $detailsContainer.find('.precipitation'),
      $icon = $MODULE.find('.weather__icon'),
      $input = $MODULE.find('.citiesLocation'),
      currentDate = new Date(),
      iconPath = "../images/weather",
      weatherIcons = {
        sunny: {
          name: "clear-day",
          icon: `${iconPath}/sunny.svg`,
          background: `linear-gradient(#309DCC, #73E4EB)`
        },
        night: {
          name: "clear-night",
          icon: `${iconPath}/moon.svg`,
          background: `linear-gradient(#002445, #005988)`
        },
        cloudy: {
          name: "cloudy",
          icon: `${iconPath}/cloudy.svg`,
          background: `linear-gradient(#365360, #879396)`
        },
        cloudySunny: {
          name: "partly-cloudy-day",
          icon: `${iconPath}/cloudy-sunny.svg`,
          background: `linear-gradient(#004C6D, #3EB3D8)`
        },
        cloudyNight: {
          name: "partly-cloudy-night",
          icon: `${iconPath}/cloudy-sunny.svg`,
          background: `linear-gradient(#002445, #005988)`
        },
        rainy: {
          name: "Rain",
          icon: `${iconPath}/cloudy-rainy.svg`,
          background: `linear-gradient(#285569, #76A0AD)`
        },
        snow: {
          name: "Snow",
          icon: `${iconPath}/snow.svg`,
          background: `linear-gradient(#48819B, #A4CFDB)`
        },
        storm: {
          name: "Storm",
          icon: `${iconPath}/storm.svg`,
          background: `linear-gradient(#309DCC, #73E4EB)`
        },
        stormRainy: {
          name: "StormRainy",
          icon: `${iconPath}/storm-rainy.svg`,
          background: `linear-gradient(#309DCC, #73E4EB)`
        },
        sunnyRainy: {
          name: "SunnyRainy",
          icon: `${iconPath}/sunny-rainy.svg`,
          background: `linear-gradient(#309DCC, #73E4EB)`
        }
      }
    let place,
      lat,
      long,
      address,
      next5Days = [];

    const init = () => {
      serviceWorker();
      events();
      cityLocation();
    };

    const events = () => {
      $tabs.on('click', (event) => {
        const target = event.currentTarget,
          dailyTab = $tabs['data-tab'];
        $tabs.removeClass('active');
        $(target).addClass('active');

        if ($('li[data-tab="daily"]').hasClass('active')) {
          $tempContainer.show();
          $weekContainer.hide();
        } else {
          $tempContainer.hide();
          $weekContainer.show();
        }
      });
      $weekContainer.on('click', '.weather__weeklyItem', (event) => {
        const target = event.currentTarget,
          $targetDetail = $(target).find('.weather__weekDetail'),
          $weekDetail = $weekContainer.find('.weather__weekDetail');

        if ($targetDetail.is(":visible")) {
          $MODULE.find('.js-arrowUp').hide();
          $(target).find('.js-arrowDown').show();
          $targetDetail.slideUp();
        } else {
          $MODULE.find('.js-arrowUp').hide();
          $MODULE.find('.js-arrowDown').show();
          $(target).find('.js-arrowUp').show();
          $(target).find('.js-arrowDown').hide();
          $weekDetail.slideUp()
          $targetDetail.slideDown()
        }
      })

    };
    const addDays = (dateObj, numDays) => {
      dateObj.setDate(dateObj.getDate() + numDays);
      return dateObj;
    };
    const getFiveDays = (result) => {
      const weekDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        dayOfWeek = [],
        dailyResult = result.daily.data,
        dateNow = new Date(),
        getdayOfTheWeek = dateNow.getDay(),
        getdayOfTheMonth = dateNow.getDate(),
        getMonth = dateNow.getMonth(),
        geyYear = dateNow.getFullYear(),
        day = $date.find('.js-dayWeek'),
        monthDay = $date.find('.js-day'),
        month = $date.find('.js-month'),
        year = $date.find('.js-year');
      let nextIconElement = 0;

      $weekContainer.find('.weather__weeklyItem').remove();

      //get next 5 days in ex: Sat Nov 10 2018 19:33:38 GMT+0000
      for (var i = 1; i < 6; i++) {
        let now = new Date();
        let next5Dayss = addDays(now, i);
        dayOfWeek.push(next5Dayss.getDay());
        now = "";
      }

      for (var j = 1; j < dailyResult.length - 2; j++) { // start with index 1 because index 0 It's currently time and we want loop start next day, result gives us 8 results and we want only next 5 days;
        const tempMin = Math.round(dailyResult[j].temperatureMin),
          tempMax = Math.round(dailyResult[j].temperatureMax),
          rainProbability = Math.round(dailyResult[j].precipProbability * 100),
          windSpeed = Math.round(dailyResult[j].windSpeed),
          humidity = Math.round(dailyResult[j].humidity * 100),
          templateFiveDays = `<li class="weather__weeklyItem">
                        <span class="weather__weeklyName">${weekDay[dayOfWeek[j - 1]]}</span>
                        <img class="weather__weeklyIcon" src=""/>
                        <div class="weather__weeklyTemperatureContainer">
                          <div class="weather__weeklyTemperatureContainer--status">
                            <img src="images/weather/arrow-down.svg" alt="arrow down">
                            <small class="weather__weeklyMin">Min: ${tempMin} <sup>º</sup></small>
                          </div>
                          <div class="weather__weeklyTemperatureContainer--status">
                            <img src="images/weather/arrow-up.svg" alt="arrow up">
                            <small class="weather__weeklyMax">Max: ${tempMax} <sup>º</sup></small>
                          </div>
                          <img class="js-arrowDown" src="images/weather/arrow-expand-down.svg" alt="arrow expand down">
                          <img class="js-arrowUp" src="images/weather/arrow-expand-up.svg" alt="arrow expand up">
                        </div>
                        <div class="weather__weekDetail">
                          <small class="weather__weeklyMax weekRain">Precipitation: ${rainProbability}%</small>
                          <small class="weather__weeklyMax weekWind">Wind: ${windSpeed}km/h</small>
                          <small class="weather__weeklyMax weekHumidity">Humidty: ${humidity}%</small>
                        </div>
                    </li>`

        $weekContainer.find('.weather__weekList').append(templateFiveDays);

        for (let i in weatherIcons) {
          if (dailyResult[j].icon === weatherIcons[i].name) {
            $MODULE.find('.weather__weeklyIcon').eq(nextIconElement).attr('src', weatherIcons[i].icon);
            nextIconElement++;
            break;
          }

        }
      }

      day.text(weekDay[getdayOfTheWeek] + ', ');
      monthDay.text(getdayOfTheMonth);
      month.text(monthList[getMonth]);
      year.text(geyYear);

    };
    const displayWeather = (result) => {
      const currentResult = result.currently,
        dailyResult = result.daily.data[0],
        temp = Math.round(currentResult.temperature),
        tempMax = Math.round(dailyResult.temperatureMax),
        tempMin = Math.round(dailyResult.temperatureMin),
        windSpeed = Math.round(currentResult.windSpeed),
        humidity = Math.round(currentResult.humidity * 100),
        rainProbability = Math.round(currentResult.precipProbability * 100);

      for (let i in weatherIcons) {
        if (dailyResult.icon === weatherIcons[i].name) {
          $icon.attr('src', weatherIcons[i].icon);
          $MODULE.css('background-image', weatherIcons[i].background)
        }
      }
      $temp.html(temp + '<sup>º</sup>');
      $tempMax.html('Max: ' + tempMax + '<sup>º</sup>');
      $tempMin.html('Min: ' + tempMin + '<sup>º</sup>');
      $wind.html(windSpeed);
      $humidity.html(humidity);
      $precipitation.html(rainProbability);
      getFiveDays(result)

    };
    const cityLocation = () => {
      const city = $MODULE.find('.citiesLocation'),
        autocomplete = new google.maps.places.Autocomplete(city[0]);

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        place = autocomplete.getPlace();
        address = place.formatted_address;
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
        $name.text(address);
        getDailyWeatherData();

      });

    };
    const serviceWorker = () => {
      if ('serviceWorker' in navigator) {
        try {
          navigator.serviceWorker.register('sw.js')
        } catch (error) {

        }
      }
    }
    const getDailyWeatherData = () => {
      const inputVal = $input.val();
      $.ajax({
        dataType: 'json',
        type: "GET",
        url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/a681679cfc444c12c6ea11865f6216b7/${lat},${long}?units=si`,
        success: function success(result) {
          displayWeather(result);
          if ($('li[data-tab="week"]').hasClass('active')) {
            $weekContainer.show();
          } else {
            $MODULE.find('nav').show();
            $tempContainer.show();
            $date.show();
            $name.show();
            $weekContainer.hide();
          }
        },
        error: function error(xhr, status, _error) {}
      });
    }

    init();
  });

}
