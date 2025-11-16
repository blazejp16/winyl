const button = document.getElementById("getButton");

button.addEventListener("click", () => {
	fetch("data/data.json")
	.then(response => {
		if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
		return response.json();
	})
	.then(data => {
		const container = document.getElementById("random-box");
		container.innerHTML = "";

		if (!data.wishlist) {
			container.textContent = "Nieprawidłowy format pliku: brak pola 'collection' jako tablicy.";
			return;
		}

		if (data.wishlist.length === 0) {
			container.textContent = "Pusta kolekcja.";
			return;
		}

		wishlist = data.wishlist;
		shuffle(wishlist);
		const item = selectRandom(wishlist);

		const title = document.createElement("h2");
		title.textContent = item.name;

		const artist = document.createElement("h3");
		artist.textContent = item.author;

		const desc = document.createElement("div");
		desc.className = "card-desc";
		desc.append(title, artist);

		const image = document.createElement("img");
		image.src = item.photo;
		image.alt = item.name + " - " + item.author;

		const imgLink = document.createElement("a");
		imgLink.href = item.link;
		imgLink.append(image);

		const card = document.createElement("div");
		card.className = "card";
		card.append(imgLink, desc);

		container.append(card);
		container.style.visibility = "visible";
		container.style.width = "90%";
	})
	.catch(error => {
		const container = document.getElementById("random-box");
		container.textContent = `Wystąpił błąd podczas ładowania danych: ${error.message}.`;
		console.error(error);
	})
});

function selectRandom(items) {
	let total = 0;
	for (const item of items) {
		total += item.chance;
	}

	const random = Math.random() * total;
	let cumulative = 0;
	for (const item of items) {
		cumulative += item.chance;
		if (random < cumulative) {
			return item;
		}
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}