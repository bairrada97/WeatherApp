var APP = APP || {}

APP.weatherapp = function(el) {
  $('.weather').each(function(index, element) {
    const weather = {

      init: function() {
        this.module = $('.weather');
        this.variables();
        this.events();
        this.cityLocation();
        this.geolocation();

      },
      variables: function() {
        this.temp = this.module.find('h1');
        this.name = this.module.find('.name');
        this.tempMax = this.module.find('.tempMax');
        this.tempMin = this.module.find('.tempMin');
        this.icon = this.module.find('figure img')
        this.input = this.module.find('#citiesLocation');
        this.place;
        this.lat;
        this.long;
        this.address;
      },
      events: function() {
        var view = this;


      },
      cityLocation: function() {
        const view = this;
        const city = document.getElementById('citiesLocation')
        const autocomplete = new google.maps.places.Autocomplete(city);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          view.place = autocomplete.getPlace();
          view.address = view.place.formatted_address;
          view.lat = view.place.geometry.location.lat()
          view.long = view.place.geometry.location.lng()
          view.getWeatherData();
        });


      },
      serviceWorker: function() {
        if ('serviceWorker' in navigator) {
          try {
            navigator.serviceWorker.register('sw.js');
          } catch (error) {

          }
        }
      },
      getWeatherData: function(el) {
        const view = this;
        const inputVal = view.input.val();
        $.ajax({
          dataType: 'json',
          type: "GET",
          url: `http://api.openweathermap.org/data/2.5/weather?lat=${view.lat}&lon=${view.long}&units=metric&appid=c882d3af194a8d34e8016dc4e3ecc005`,
          success: function success(result) {
            view.temp.text("Temperatura Atual " + result.main.temp + "ºC");
            view.tempMax.text("Temperatura Minima" + result.main.temp_max + "ºC");
            view.tempMin.text("Temperatura Máxima" + result.main.temp_min + "ºC");
            view.icon.attr('src', `https://openweathermap.org/img/w/${result.weather[0].icon}.png`);

            if (inputVal != "") {
              view.name.text(view.address);
            } else {
              view.name.text(result.name)
            }

          },
          error: function error(xhr, status, _error) {
            console.log('tente outra vez');
          }
        });
      },
      geolocation: function() {
        const view = this
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            view.lat = position.coords.latitude
            view.long = position.coords.longitude;
            view.getWeatherData();
            console.log(position);


          });
        } else {
          console.log("geolocation dont work");
        }
      }
    }
    weather.init();
  });

}

$(document).ready(function() {
  var el = $('.weather');
  if (el.length) {

  }
});
