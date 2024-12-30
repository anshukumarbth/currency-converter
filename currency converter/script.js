const BASE_URL = "https://api.exchangerate-api.com/v4/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Initialize dropdowns with currency options
dropdowns.forEach(select => {
    Object.entries(countryList).forEach(([currCode]) => {
        const newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        
        // Set default selections
        if ((select.name === "from" && currCode === "USD") || 
            (select.name === "to" && currCode === "INR")) {
            newOption.selected = true;
        }
        select.append(newOption);
    });

    // Update flag when currency selection changes
    select.addEventListener("change", (evt) => updateFlag(evt.target));
});

// Fetch and update exchange rate
const updateExchangeRate = async () => {
    const amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    // Ensure valid amount
    if (!amtVal || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        const response = await fetch(`${BASE_URL}/${fromCurr.value}`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const rate = data.rates[toCurr.value];
        const convertedAmount = (amtVal * rate).toFixed(2);
        
        msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rates. Please try again.";
        console.error("Exchange rate error:", error);
    }
};

// Update flag image for selected currency
const updateFlag = (element) => {
    const countryCode = countryList[element.value];
    const flagImg = element.parentElement.querySelector("img");
    if (flagImg) {
        flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
};

// Handle form submission
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Initialize exchange rate on page load
window.addEventListener("load", updateExchangeRate);