const btnPanier = document.querySelector('#btn-panier');
const btnShop = document.querySelector('#btn-shop');

btnShop.addEventListener('click', showProducts);
btnPanier.addEventListener('click', afficheLePanier);

const produits = [

    { id: 1, nom: "Paquet de chips", prix: 4, image: "chips.png" },
    { id: 2, nom: "Jambonneau", prix: 30, image: "jambon.png" },
    { id: 3, nom: "Pack de bières", prix: 15, image: "bieres.png" },
    { id: 4, nom: "Paquet de bonbon", prix: 7, image: "bonbons.png" },
    { id: 5, nom: "Cacahuettes", prix: 2, image: "cacahuettes.png" }

]

function fabriqueUneCard(produit) {
    let uneCard =
                `<div class="col-3 p-2">
                <div class="card" style="width: 18rem;">
                <img src="img/${produit.image}" class="card-img-top" alt="${produit.image}">
                <div class="card-body">
                <h5 class="new-card-title">${produit.nom}</h5>
                <p class="new-card-text">${produit.prix} €<p>
                    <div class="ajouter-au-panier">
                        <button class="btn-moins btn btn-secondary"><strong>-</strong></button>
                        <input class="compteur" readonly value="0" type="text">
                        <button class="btn btn-plus btn-secondary"><strong>+</strong></button>
                        <a href="#" id="${produit.id}" class="ajout-panier btn btn-success disabled">Ajouter au panier</a>
                    </div>
                    </div>
                </div>
                </div>`;
    return uneCard;
}

function generateCardsFromArray(monTableau) {
    let toutesLesCards = "";
    monTableau.forEach(produit => {
        toutesLesCards += fabriqueUneCard(produit);
    })
    return toutesLesCards;
}

function showProducts() {
    cardBox.innerHTML = generateCardsFromArray(produits);

    const divsAjouters = document.querySelectorAll(".ajouter-au-panier");

    divsAjouters.forEach(div => {

        let compteur = div.querySelector(".compteur");
        let btnMoins = div.querySelector(".btn-moins");
        let btnPlus = div.querySelector(".btn-plus");
        let ajouter = div.querySelector(".ajout-panier");

        btnMoins.addEventListener('click', () => {
            moins(compteur, ajouter);
        })

        btnPlus.addEventListener('click', () => {
            plus(compteur, ajouter);
        })

        ajouter.addEventListener('click', () => {
            let idProduit = ajouter.id;
            let quantity = compteur.value;
            ajouterAuPanier(idProduit, quantity);
        })

    })

}

showProducts();


function ajouterAuPanier(idProduit, quantite) {
    quantite = parseInt(quantite);
    let found = panier.find(x => x.id == idProduit);
    if (found) {
        found.quantity += quantite;
        btnPanier.innerHTML = "Panier (" + nbArticles(panier) + ")";
        console.log(panier);
    } else {
        idProduit = parseInt(idProduit);
        panier.push({ id: idProduit, quantity: quantite });
        btnPanier.innerHTML = "Panier (" + nbArticles(panier) + ")";
        console.log(panier);
    }
}

const panier = [];

function creeUneLigne(produit, quantity) {
    let sousTotal = produit.prix * quantity;
    let ligne = `
    <tr class="align-items-center">
    <td>${produit.nom}</td>
    <td>${produit.prix} €</td>
    <td class="quantite" data-produit="${produit.id}">
        <button class="btn-moins btn btn-secondary"><strong>-</strong></button> 
        ${quantity}
        <button class="btn btn-plus btn-secondary"><strong>+</strong></button></td>
    </td>
    <td>${sousTotal} €</td>
    <td><button id="${produit.id}" class="btn delete btn-danger"> X </button></td>
    </tr>`;
    return ligne;
}

function creeLesLignes(panier) {
    let lignes = "";
    panier.forEach(element => {
        let produit = produits.find(x => x.id == element.id);
        let quantity = element.quantity;
        lignes += creeUneLigne(produit, quantity);
    })
    return lignes;
}

function calculTotal(panier) {
    let total = 0;
    panier.forEach(element => {
        let produit = produits.find(x => x.id == element.id);
        let quantity = element.quantity;
        let prixLigne = produit.prix * quantity;
        total += prixLigne;
    })
    return total;
}

function afficheLePanier() {

    let table = `
    <table class="table table-striped">
    
    <thead>
    <tr>
    <th scope="col">Produit</th>
    <th scope="col">Prix</th>
    <th scope="col">Quantité</th>
    <th scope="col">Sous total</th>
    <th scope="col"> </th>
    </tr>
    </thead>
    
    <tbody>
    
    `+ creeLesLignes(panier) + `
    
    </tbody>
    
    <tfoot>
    <tr>
    <td></td>
    <td></td>
    <td>Total : </td>
    <td>`+ calculTotal(panier) + ` €</td>
    <td><button class="btn btn-success">Payer</button></td>
    </tr>
    </tfoot>
    </table>`;

    cardBox.innerHTML = table;

    const btnsDelete = document.querySelectorAll(".delete");
    btnsDelete.forEach(btn => {
        btn.addEventListener('click', () => {
            let idProduit = parseInt(btn.id);
            deleteLigne(idProduit);
        })
    })

    const tdsQuantite = document.querySelectorAll(".quantite");

    tdsQuantite.forEach(td => {
        const dataProduit = td.getAttribute('data-produit');
        const moins = td.querySelector('.btn-moins');
        const plus = td.querySelector('.btn-plus');

        moins.addEventListener('click', ()=> {
            removePanier(dataProduit);
        })

        plus.addEventListener('click', ()=> {
            addPanier(dataProduit);
        })

    })
}

function removePanier(dataProduit){
    let found = panier.find(x => x.id == dataProduit);

    if (found.quantity > 0) {
        found.quantity--;
        afficheLePanier();
        btnPanier.innerHTML = "Panier (" + nbArticles(panier) + ")";
    } else if (found.quantity == 0) {
        deleteLigne(dataProduit);
    }
}

function addPanier(dataProduit){
    let found = panier.find(x => x.id == dataProduit);
    found.quantity++;
    afficheLePanier();
    btnPanier.innerHTML = "Panier (" + nbArticles(panier) + ")";
}

function deleteLigne(idProduit) {
    let index = panier.findIndex(element => element.id == idProduit);
    panier.splice(index, 1);
    afficheLePanier();
    btnPanier.innerHTML = "Panier (" + nbArticles(panier) + ")";
}

function nbArticles(panier) {
    let total = 0;
    panier.forEach(element => {
        total += element.quantity;
    })
    return total;
}

function moins(inputCompteur, btnAjouter) {
    if (inputCompteur.value > 1) {
        inputCompteur.value--;
    } else if (inputCompteur.value == 1) {
        inputCompteur.value--;
        btnAjouter.classList.add("disabled");
    }
}

function plus(inputCompteur, btnAjouter) {
    inputCompteur.value++;
    if (inputCompteur.value > 0) {
        btnAjouter.classList.remove("disabled");
    }
}