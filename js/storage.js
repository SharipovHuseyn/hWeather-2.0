let weatherHistoryArray = JSON.parse(localStorage.getItem("weatherHistory")) || [];

function addingToStorage(place) {
    console.log(!weatherHistoryArray.includes(place))
    if (!weatherHistoryArray.includes(place)) {
        weatherHistoryArray.push(place);
        localStorage.setItem("weatherHistory", JSON.stringify(weatherHistoryArray));
    }
}
