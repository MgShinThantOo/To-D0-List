// time
setInterval(() => {
  let d = new Date();
  let time = document.querySelector(".time");
  let date = document.querySelector(".date");

  //ampm
  let ampm = d.getHours() >= 12 ? "PM" : "AM";
  // hour
  let hr;
  if (d.getHours() > 12) {
    if (d.getHours() - 12 >= 10) {
      hr = d.getHours() - 12;
    } else {
      hr = "0" + (d.getHours() - 12);
    }
  } else {
    if (d.getHours() >= 10) {
      hr = d.getHours();
    } else {
      if (d.getHours() == 0) {
        let t = 12;
        hr = t;
      } else {
        let t = d.getHours();
        hr = "0" + t;
      }
    }
  }

  // minutes
  let min = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();

  // second
  let sec = d.getSeconds() >= 10 ? d.getSeconds() : "0" + d.getSeconds();

  // day
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[d.getDay()];

  // month
  let months = [
    "January",
    "February ",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[d.getMonth()];

  // date
  let day_no = d.getDate();
  let year = d.getFullYear();

  time.innerHTML = `${hr} : ${min} : ${sec} <span style='font-size: 18px;'>${ampm}</span>`;
  date.innerHTML = `<span class='me-2'>${day},</span> ${month} ${day_no}, ${year}`;
}, 1000);

// weather
const findCurrentLocation = () => {
  let success = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    const currentWeather = async () => {
      let apiKey = "eaad4ad01a86844007802da17164bae0";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      let response = await fetch(apiUrl);
      let data = await response.json();
      document.querySelector("#weather").innerHTML = `
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h4 class="m-0">${data.main.temp} &#176</h3>
        <div class="text-end">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
          <h6 class="col-12 mt-0 pt-0">${data.weather[0].description}</h6>
        </div>
        <h5 class="col-12">${data.name}</h5>
      </div>      
      `;
    };
    currentWeather();
  };
  let error = () => {
    console.log("Error found");
  };

  navigator.geolocation.getCurrentPosition(success, error);
};

window.addEventListener("load", findCurrentLocation);

// to do list
let userInput = document.querySelector("#add_new");
let addBtn = document.querySelector("#add_new_btn");
let toDoLists = document.querySelector("#list");
let lists = JSON.parse(localStorage.getItem("to-do-list"));
if (!lists) {
  lists = [];
}
let data;
let edited = false;
let editedId;

addBtn.addEventListener("click", () => {
  let inputValue = userInput.value.trim();
  if (inputValue) {
    if (edited) {
      lists[editedId].Task = inputValue;
      edited = false;
    } else {
      data = {
        Task: userInput.value,
        Status: "pending",
      };
      lists.push(data);
    }
    localStorage.setItem("to-do-list", JSON.stringify(lists));
    userInput.value = "";
  } else {
    alert("ajfofd");
  }
  addUi((filterId = "all"));
  document.querySelector(".filter span.active").classList.remove("active");
  document.querySelector(".filter span#all").classList.add("active");
});

userInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    let inputValue = userInput.value.trim();
    if (inputValue) {
      if (edited) {
        lists[editedId].Task = inputValue;
        edited = false;
      } else {
        data = {
          Task: userInput.value,
          Status: "pending",
        };
        lists.push(data);
      }
      localStorage.setItem("to-do-list", JSON.stringify(lists));
      userInput.value = "";
    } else {
      alert("ajfofd");
    }
    addUi((filterId = "all"));
    document.querySelector(".filter span.active").classList.remove("active");
    document.querySelector(".filter span#all").classList.add("active");
  }
});
// UI
function addUi(filterId) {
  toDoLists.innerHTML = "";
  lists.forEach((task, id) => {
    let taskComplete = task.Status == "complete" ? "active" : "";
    let check = task.Status == "complete" ? "checked" : "";

    if (filterId == task.Status || filterId == "all") {
      toDoLists.innerHTML += `
      <li class="mt-3">
      <div class="d-flex justify-content-between align-items-start">
        <div class="left col-10">
          <label for="${id}" class="d-flex justify-content-start align-items-center">
              <input type="checkbox" class='checkbox col-1 text-end me-3 m-0 p-0' id="${id}" onclick='statusUpdate(this)' ${check}/>
            <div class="col-11">
              <h6 class="list-item m-0 p-0 active">${task.Task}</h6>
            </div>
          </label>
        </div>
        <div class="right text-end col-2">
          <i
            class="fa-solid fa-pen-to-square me-2"
            style="color: #3366ff"
            onclick='editTask(${id})'
          ></i>
          <i
            class="fa-solid fa-trash"
            style="color: rgb(255, 51, 51)"
            onclick='deleteTask(${id})'
          ></i>
        </div>
      </div>
    </li>
      `;
    }
  });
  if (toDoLists.innerHTML == "") {
    toDoLists.innerHTML = `<h4 class='text-danger'>there is nothing to do.</h4>`;
  }
}
addUi((filterId = "all"));

// filter
let filterSpan = document.querySelectorAll(".filter span");
filterSpan.forEach((span, i) => {
  span.addEventListener("click", () => {
    document.querySelector(".filter span.active").classList.remove("active");
    span.classList.add("active");
    addUi(span.id);
  });
});

// status
function statusUpdate(x) {
  let text = document.querySelectorAll(".list-item");
  if (x.checked) {
    lists[x.id].Status = "complete";
  } else {
    lists[x.id].Status = "pending";
  }
  localStorage.setItem("to-do-list", JSON.stringify(lists));
}

// delete
function deleteTask(y) {
  lists.splice(y, 1);
  localStorage.setItem("to-do-list", JSON.stringify(lists));
  addUi(filterId);
  document.querySelector(".filter span.active").classList.remove("active");
  document.querySelector(".filter span#all").classList.add("active");
}

// editTask
function editTask(x) {
  edited = true;
  userInput.value = lists[x].Task;
  userInput.focus();
  editedId = x;
}

// clear
document.querySelector("#clear").addEventListener("click", () => {
  lists.splice(0, lists.length);
  console.log(lists);
  localStorage.setItem("to-do-list", JSON.stringify(lists));
  addUi();
});
// localStorage.clear();
