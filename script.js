const search = document.querySelector("#search");
const bottoni = document.querySelectorAll(".bottone")
if (search) {
    const drinkContainer = document.querySelector("#drinkContainer");
    const caricamento = document.querySelector("#caricamento");
    let url;

    let debounceTimer;
    let abortController;

    // Evento keyup con debounce
    search.addEventListener("keyup", (event) => {
        url = "https://www.thecocktaildb.com/api/json/v1/1/" +
        (search.value !== "" ? ("search.php?s=" + search.value) : "filter.php?a=Alcoholic");
        nuovaChiamata(url)
    });

    // URL iniziale per i drink alcolici
    url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";

    // Chiamata iniziale
    chiamata(url);
    bottoni.forEach(bottone => {
        bottone.addEventListener("click", (event)=>{
            nuovaChiamata("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a="+bottone.value)
        })
    });
}



function nuovaChiamata(url) {
    // Mostra il caricamento
    caricamento.style.display = "block";

    // Rimuovi le card esistenti
    const carte = document.querySelectorAll(".card");
    carte.forEach(carta => carta.remove());

    // Annulla la richiesta precedente
    if (abortController) {
        abortController.abort();
    }

    chiamata(url); // Esegui la chiamata solo dopo il debounce
}


// Funzione per effettuare la fetch e aggiornare la UI
function chiamata(url) {
    // Crea un nuovo AbortController
    abortController = new AbortController();
    const signal = abortController.signal;

    fetch(url, { signal })
        .then(response => response.json())
        .then(cocktail => {
            // Nascondi il caricamento
            caricamento.style.display = "none";

            if (!cocktail.drinks) {
                // Mostra un messaggio se non ci sono risultati
                const card = document.createElement("div");
                card.classList = "card not-found";
                const titolo = document.createElement("h3");
                titolo.style.textAlign = "center";
                titolo.textContent = "Nessun risultato trovato.";
                card.appendChild(titolo);
                drinkContainer.appendChild(card);
                return;
            }

            const drinks = cocktail.drinks;
            drinks.forEach(drink => {
                const card = document.createElement("a");
                card.href = "/drink.html?name=" + drink.idDrink;
                card.classList = "card";

                const titolo = document.createElement("h3");
                titolo.style.textAlign = "center";

                const immagine = document.createElement("img");
                immagine.src = drink.strDrinkThumb;
                immagine.style.width = "200px";

                titolo.textContent = drink.strDrink;

                card.appendChild(titolo);
                card.appendChild(immagine);

                drinkContainer.appendChild(card);

            });
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Richiesta annullata.");
            } else {
                console.error("Errore nella fetch:", error);
            }
        });
}

const drink = document.querySelector("#drink")

if (drink) {
    const url = new URL(document.URL);
    const params = url.searchParams;
    const APIurl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + params.get("name")
    fetch(APIurl)
        .then(response => response.json())
        .then(drinks => drinks.drinks[0])
        .then((cocktail) => {
            console.log(cocktail)
            const titolo = document.createElement("h1")
            titolo.textContent = cocktail.strDrink
            titolo.style.textAlign = "center"

            const boxDescrizione = document.createElement("div")
            boxDescrizione.id = "box-descrizione"

            const immagine = document.createElement("img");
            immagine.src = cocktail.strDrinkThumb;
            immagine.style.width = "400px";

            drink.appendChild(titolo)
            drink.appendChild(boxDescrizione)
            boxDescrizione.appendChild(immagine)

            const descrizione = document.createElement("div")
            descrizione.id = "descrizione"
            const boxIngredienti = document.createElement("div")
            boxIngredienti.id = "box-ingredienti"
            descrizione.appendChild(boxIngredienti)
            boxDescrizione.appendChild(descrizione)

            for (let i = 1; i <= 15; i++) {
                let ing = "strIngredient" + i
                if (cocktail[ing] != null) {
                    const boxIngrediente = document.createElement("a")
                    boxIngrediente.href = "/ingrediente.html?name=" + cocktail[ing]
                    boxIngrediente.classList = "box-ingrediente"
                    const ingredienti = document.createElement("img")
                    const nomeIngredienti = document.createElement("p")
                    nomeIngredienti.innerHTML = cocktail[ing] + "<br>" + cocktail["strMeasure" + i]
                    ingredienti.src = "https://www.thecocktaildb.com/images/ingredients/" + cocktail[ing] + "-Small.png"
                    boxIngrediente.appendChild(ingredienti)
                    boxIngrediente.appendChild(nomeIngredienti)
                    boxIngredienti.appendChild(boxIngrediente)
                }
            }

            const procedimento = document.createElement("p")
            procedimento.textContent = cocktail.strInstructionsIT
            descrizione.appendChild(procedimento)





        })
}