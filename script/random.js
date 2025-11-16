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
		image.addEventListener('click', function(e) {
				e.stopPropagation();

				// remove previous
				const existing = document.getElementById('album-detail-box');
				if (existing) existing.remove();

				// create box
				const box = document.createElement("div");
				box.id = 'album-detail-box';
				box.style.visibility = 'hidden';
				box.style.left = (e.clientX + window.scrollX) + 'px';
				box.style.top = (e.clientY + window.scrollY) + 'px';
				box.style.position = 'absolute';
				box.style.zIndex = 9999;
				box.style.backgroundColor = '#FFFFFF';
				box.style.padding = '20px';
				box.style.borderRadius = '5px';
				box.style.color = '#000040';
				document.body.appendChild(box);

				const bw = box.offsetWidth;
				const bh = box.offsetHeight;
				const padding = 8;

				let left = e.clientX + window.scrollX;
				let top  = e.clientY + window.scrollY;

				const viewportLeft = window.scrollX + padding;
				const viewportTop  = window.scrollY + padding;
				const viewportRight = window.scrollX + window.innerWidth - padding;
				const viewportBottom = window.scrollY + window.innerHeight - padding;

				if (left + bw > viewportRight) left = viewportRight - bw;
				if (top + bh > viewportBottom) top = viewportBottom - bh;
				if (left < viewportLeft) left = viewportLeft;
				if (top < viewportTop) top = viewportTop;

				// content
				item.versions.forEach(item => {
					const p = document.createElement("p");
					p.textContent = item.desc;
					p.style.fontWeight = "bold";
					box.appendChild(p);

					Object.keys(item).forEach(key => {
						if (key !== "desc") {
							const a = document.createElement("a");
							a.textContent = key;
							a.href = item[key];
							a.target = "_blank";

							box.appendChild(a);
							box.appendChild(document.createElement("br"));
						}
					});

					box.appendChild(document.createElement("hr"));
				});

				box.style.left = left + 'px';
				box.style.top  = top  + 'px';
				box.style.visibility = 'visible';

				document.addEventListener('click', function hideBoxHandler() {
					const b = document.getElementById('album-detail-box');
					if (b) b.remove();
				}, {once: true});
			});

		const card = document.createElement("div");
		card.className = "card";
		card.append(image, desc);

		container.append(card);
		container.style.visibility = "visible";
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