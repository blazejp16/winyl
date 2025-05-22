document.addEventListener("DOMContentLoaded", () => {
	fetch("data/data.json")
	.then(response => {
		if (!response.ok) throw new Error(`Błąd sieci: ${response.status}`);
		return response.json();
	})
	.then(data => {
		const container = document.getElementById("collection-box");

		if (!data.collection) {
			container.textContent = "Nieprawidłowy format pliku: brak pola 'collection' jako tablicy.";
			return;
		}

		if (data.collection.length === 0) {
			container.textContent = "Pusta kolekcja.";
			return;
		}

		collection = data.collection;
		collection.forEach(item => {
			const {name, author, description, date, photo} = item;
			if (!name || !author || !description || !date || !photo) {
				console.warn("Pominięto niepoprawny obiekt: ", item);
				return;
			}

			const title = document.createElement("h2");
			title.textContent = name;

			const artist = document.createElement("h3");
			artist.textContent = author;

			const details = document.createElement("p");
			details.innerHTML = description + ". \nW kolekcji od: " + date;
			
			const desc = document.createElement("div");
			desc.className = "card-desc";
			desc.append(title, artist, details);

			const image = document.createElement("img");
			image.src = photo;
			image.alt = name + " " + author;

			const card = document.createElement("div");
			card.className = "card";
			card.append(image, desc);

			container.append(card);
		});
	})
	.catch(error => {
		const container = document.getElementById("collection-box");
		container.textContent = `Wystąpił błąd podczas ładowania danych: ${error.message}.`;
		console.error(error);
	})
});