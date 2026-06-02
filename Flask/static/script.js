// static/script.js
let newsIndex = 0;
const newsLinks = [
    { text: "Yahoo Finance", url: "https://finance.yahoo.com/" },
    { text: "Investopedia", url: "https://www.investopedia.com/" },
    { text: "U.S. SEC", url: "https://www.sec.gov/" },
    { text: "MarketWatch", url: "https://www.marketwatch.com/" },
    { text: "Bloomberg", url: "https://www.bloomberg.com/" },
    { text: "Financial Times", url: "https://www.ft.com/" },
    { text: "Google Finance", url: "https://www.google.com/finance" }
];

let trendingIndex = 0;
const trendingMarketData = [
    { name: "TSLA (Tesla)", change: "+2.1%" },
    { name: "GLD (Gold)", change: "-0.5%" },
    { name: "GOOG (Alphabet)", change: "+1.2%" },
    { name: "AAPL (Apple)", change: "-0.8%" },
    { name: "AMZN (Amazon)", change: "+1.8%" },
    { name: "BTC-USD (Bitcoin)", change: "+3.5%" },
    { name: "ETH-USD (Ethereum)", change: "+2.8%" }
];

function predictStock() {
    const stockInput = document.getElementById("stockInput").value.trim();
    const loadingElement = document.getElementById("loading");
    const predictionResultsDiv = document.getElementById("predictionResults");
    
    // UI DOM Target Nodes
    const currentPriceElement = document.getElementById("currentPrice");
    const changeElement = document.getElementById("change");
    const trendElement = document.getElementById("trend");
    const twoWeekPredictionElement = document.getElementById("twoWeekPrediction");
    const suggestionElement = document.getElementById("suggestion");

    if (!stockInput) {
        alert("Please input a valid stock token signature.");
        return;
    }

    // Toggle loading indicator states
    loadingElement.style.display = "block";
    predictionResultsDiv.style.display = "none";

    // Build URL-encoded post string parameter structure
    const formData = new URLSearchParams();
    formData.append("stock_value", stockInput);

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadingElement.style.display = "none";
        predictionResultsDiv.style.display = "block";

        if (data.error) {
            currentPriceElement.innerText = `Error Flagged: ${data.error}`;
            changeElement.innerText = "";
            trendElement.innerText = "";
            twoWeekPredictionElement.innerText = "";
            suggestionElement.innerText = "";
            return;
        }

        // Apply clean outputs to UI layout blocks
        currentPriceElement.innerHTML = `<strong>Current Valuation Price:</strong> ${data.currentPrice}`;
        changeElement.innerHTML = `<strong>Session Delta Change:</strong> ${data.change} ${data.changeIcon}`;
        trendElement.innerHTML = `<strong>Active Trend Direction:</strong> ${data.trend}`;
        twoWeekPredictionElement.innerHTML = `<strong>LSTM Interval Outlook:</strong> ${data.twoWeekPrediction}`;
        
        // Output prediction calculation metric
        suggestionElement.innerHTML = `<strong>AI Model Evaluation Output:</strong> <span style="font-size: 1.25em; color: #10b981; font-weight: bold;">${data.predictedPrice}</span> <br> <strong>System Vector Recommendation:</strong> ${data.suggestionIcon} ${data.suggestion}`;
        
        // Dynamically style status values
        if (data.change && data.change.includes("-")) {
            changeElement.className = "negative";
        } else {
            changeElement.className = "positive";
        }
    })
    .catch(error => {
        loadingElement.style.display = "none";
        predictionResultsDiv.style.display = "block";
        currentPriceElement.innerText = "⚠️ critical system network exception occurred.";
        console.error("Processing pipeline failure trace:", error);
    });
}

function cycleNews() {
    const newsList = document.getElementById("newsList");
    if (newsList && newsLinks.length > 0) {
        const linkData = newsLinks[newsIndex % newsLinks.length];
        newsList.innerHTML = `<li><a href="${linkData.url}" target="_blank" style="color: #60a5fa; text-decoration: none;">${linkData.text}</a></li>`;
        newsIndex++;
    }
}

function cycleTrendingMarket() {
    const trendingMarketList = document.getElementById("trendingMarketList");
    if (trendingMarketList && trendingMarketData.length > 0) {
        const trendingItem = trendingMarketData[trendingIndex % trendingMarketData.length];
        trendingMarketList.innerHTML = `<li><div class="trending-item"><span class="trending-name">${trendingItem.name}</span><span class="trending-change ${trendingItem.change.startsWith('-') ? 'negative' : 'positive'}">${trendingItem.change}</span></div></li>`;
        trendingIndex++;
    }
}

// System triggers
window.onload = () => {
    cycleNews();
    cycleTrendingMarket();
    setInterval(cycleNews, 4000);
    setInterval(cycleTrendingMarket, 4000);
};