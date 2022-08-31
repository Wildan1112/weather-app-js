const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // Jika User masukkan & enter input
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser not Support Geolocation API");
  }
});

function onError(error) {
  infoTxt.innerHTML = error.message;
  infoTxt.classList.add("error");
}
function onSuccess(position) {
  const { latitude, longitude } = position.coords; //getting lan & lon of user device from coords object
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=edb20820b03f68f10b99510d67fd3420`;
  fetchData();
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=edb20820b03f68f10b99510d67fd3420`;
  fetchData();
}

function fetchData() {
  infoTxt.innerHTML = "Geting Weather Details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerHTML = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // Dynamic IMG
    if (id == 800) {
      wIcon.src = "icon/800-clear-sky.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icon/clouds.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icon/720-haze.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icon/600-snow.png";
    } else if (id >= 500 && id <= 531) {
      wIcon.src = "icon/500-rain.png";
    } else if (id >= 300 && id <= 321) {
      wIcon.src = "icon/300-drizzle.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icon/200-strom.png";
    }

    // kirim ke element html
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
  console.log(info);
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
