document.addEventListener("DOMContentLoaded", () => {
	fetch("data/data.json")
	.then(response => {
		if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
		return response.json();
	})
	.then(data => {
		const favouritesContainer = document.getElementById("favourites-box");

		if (!data.favourites) {
			favouritesContainer.textContent = "Nieprawidłowy format pliku: brak pola 'favourites' jako tablicy.";
			return;
		}

		if (data.favourites.length === 0) {
			favouritesContainer.textContent = "Pusta lista.";
			return;
		}

		favourites = data.favourites;
		shuffle(favourites);
		favourites.forEach(item => {
			const {name, author, description, link, photo} = item;
			if (!name || !author || !description || !link || !photo) {
				console.warn("Pominięto niepoprawny obiekt: ", item);
				return;
			}

			const title = document.createElement("h2");
			title.textContent = name;

			const artist = document.createElement("h3");
			artist.textContent = author;

			const details = document.createElement("p");
			details.innerHTML = description;

			const desc = document.createElement("div");
			desc.className = "card-desc";
			desc.append(title, artist, details);
			
			const image = document.createElement("img");
			image.src = photo;
			image.alt = name + " - " + author;

			const imgLink = document.createElement("a");
			imgLink.href = link;
			imgLink.append(image);

			const card = document.createElement("div");
			card.className = "card";
			card.append(imgLink, desc);

			favouritesContainer.append(card);
		});

		const wishlistContainer = document.getElementById("wishlist-box");

		if (!data.wishlist) {
			wishlistContainer.textContent = "Nieprawidłowy format pliku: brak pola 'wishlist' jako tablicy.";
			return;
		}

		if (data.wishlist.length === 0) {
			wishlistContainer.textContent = "Pusta lista.";
			return;
		}

		wishlist = data.wishlist;
		shuffle(wishlist);
		wishlist.forEach(item => {
			const {name, author, description, link, photo} = item;
			if (!name || !author || !description || !link || !photo) {
				console.warn("Pominięto niepoprawny obiekt: ", item);
				return;
			}

			const title = document.createElement("h2");
			title.textContent = name;

			const artist = document.createElement("h3");
			artist.textContent = author;

			const details = document.createElement("p");
			details.innerHTML = description;

			const desc = document.createElement("div");
			desc.className = "card-desc";
			desc.append(title, artist, details);
			
			const image = document.createElement("img");
			image.src = photo;
			image.alt = name + " - " + author;

			const imgLink = document.createElement("a");
			imgLink.href = link;
			imgLink.append(image);

			const card = document.createElement("div");
			card.className = "card";
			card.append(imgLink, desc);

			wishlistContainer.append(card);
		});
	})
	.catch(error => {
		const container = document.getElementById("favourites-box");
		container.textContent = `Wystąpił błąd podczas ładowania danych: ${error.message}.`;
		console.error(error);
	})
});

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
