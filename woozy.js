window.onload = () => {
	const loadscreen = document.querySelector("#loadscreen");
	const woozy = document.querySelector("#woozy");
	const woozyCount = document.querySelector("#woozies");
	const clickBoost = document.querySelector("#clickboost");
	const boost = document.querySelector("#boost");
	const shop = document.querySelector("#shop");

	const sounds = {
		"woozy": "stuff/sounds/woozy.wav",
		"boost": "stuff/sounds/boost.wav"
	}

	const shopItems = [{"name": "Boost", "id": "boost", "pincrease": 1.2, "img": "stuff/powerups/boost.png"}, {"name": "Clickboost", "id": "clickBoost", "pincrease": 1.7, "img": "stuff/powerups/mouse.png"}]

	if(!localStorage.getItem("woozies") || !localStorage.getItem("boost") || !localStorage.getItem("clickBoost") || !localStorage.getItem("boostPrice") || !localStorage.getItem("clickBoostPrice")) {
		localStorage.setItem("woozies", "0");
		localStorage.setItem("boost", "0");
		localStorage.setItem("clickBoost", "0");
		localStorage.setItem("boostPrice", "100");
		localStorage.setItem("clickBoostPrice", "200");
	}

	function intFromLS(item) {
		return parseInt(localStorage.getItem(item));
	}
	function playSound(url) {
		const ael = document.createElement("audio");
		ael.innerHTML = '<source src="' + url + '" type="audio/wav">'
		ael.play();
	}

	function refreshInfo() {
		const woozies = localStorage.getItem("woozies");
		woozyCount.innerHTML = woozies
		clickBoost.innerHTML = localStorage.getItem("clickBoost");
		boost.innerHTML = localStorage.getItem("boost");
		document.title = woozies + " w - Woozy Clicker"
	}
	function updateWoozies(amount, set = false) {
		var update;
		if(set) {
			update = amount
		} else {
			update = intFromLS("woozies") + amount
		}
		localStorage.setItem("woozies", update.toString());
		refreshInfo();
	}
	function updateBoost(type, amount, pIncrease) {
		if(isNaN(amount) || amount < 1) {
			alert("what")
		} else {
			const price = intFromLS(type + "Price")
			if(price * amount > intFromLS("woozies")) {
				alert("Get some money first");
				return undefined;
			} else {
				const update = intFromLS(type) + amount;
				const priceUpdate = (price * amount * pIncrease).toFixed();
				localStorage.setItem(type, update.toString());
				localStorage.setItem(type + "Price", priceUpdate.toString());
				updateWoozies(price * -1);
				refreshInfo();
				playSound(sounds.boost);
				return priceUpdate;
			}
		}
	}
	
	[].forEach.call(shopItems, sItem => {
		const itemDiv = document.createElement("div")
		itemDiv.classList.add("shopitem");
		itemDiv.innerHTML = `
			<div class="shopi-left">
				<img src="` + sItem.img + `">
			</div>
			<div class="shopi-right">
				<span class="itemname">` + sItem.name + `</span>
				<input type="number" min="1" value="1" class="buyamount">
				<span class="ip-c">Price: <span class="itemprice">` + localStorage.getItem(sItem.id + "Price") + `</span> w</span>
				<button class="buybtn">Buy</button>
			</div>
		`
		shop.appendChild(itemDiv);
		itemDiv.querySelector(".buybtn").addEventListener("click", () => {
			const pup = updateBoost(sItem.id, parseInt(itemDiv.querySelector(".buyamount").value), sItem.pincrease);
			if(pup !== undefined) {
				itemDiv.querySelector(".itemprice").innerHTML = pup
			}
		})
	})

	refreshInfo();

	woozy.addEventListener("click", () => {
		updateWoozies(1 + intFromLS("clickBoost"));
		playSound(sounds.woozy)
	});

	

	setInterval(() => updateWoozies(intFromLS("boost")), 1000)

	loadscreen.style.display = "none";
}
