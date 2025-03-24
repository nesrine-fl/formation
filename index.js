document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput"); // Barre de recherche
    const tableRows = document.querySelectorAll("#existing-accounts tbody tr"); // Toutes les lignes du tableau

    function filterTable() {
        const searchValue = searchInput.value.toLowerCase().trim();

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchValue) ? "table-row" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterTable);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner toutes les cellules de la colonne "Status"
    document.querySelectorAll("td").forEach(cell => {
        // Vérifie si la cellule contient un statut connu
        let statusText = cell.textContent.trim().toLowerCase();

        if (["failed", "warning", "processing", "verified"].some(status => statusText.includes(status))) {
            // Ajoute une classe pour identification
            cell.classList.add("status");

            // Ajoute un événement de clic sur chaque cellule de statut
            cell.addEventListener("click", function () {
                showPopup(statusText);
            });
        }
    });
});

// Fonction pour afficher un pop-up stylisé
function showPopup(status) {
    // Définir le message et l'icône en fonction du statut
    let messages = {
        "failed": { text: "Cette formation a échoué.", icon: "❌", color: "red" },
        "warning": { text: "Attention ! Vérification nécessaire.", icon: "⚠️", color: "orange" },
        "processing": { text: "Cette formation est en cours de traitement.", icon: "⏳", color: "blue" },
        "verified": { text: "Félicitations ! Formation validée.", icon: "✅", color: "green" }
    };

    let statusKey = Object.keys(messages).find(key => status.includes(key));

    if (!statusKey) return;

    let { text, icon, color } = messages[statusKey];

    // Créer un conteneur pour le pop-up
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.border = `2px solid ${color}`;
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.2)";
    popup.style.textAlign = "center";
    popup.style.zIndex = "1000";
    popup.innerHTML = `<h3 style="color:${color}">${icon} ${text}</h3>`;

    // Ajouter un bouton de fermeture
    let closeButton = document.createElement("button");
    closeButton.textContent = "Fermer";
    closeButton.style.marginTop = "10px";
    closeButton.style.padding = "5px 10px";
    closeButton.style.border = "none";
    closeButton.style.background = color;
    closeButton.style.color = "white";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", function () {
        document.body.removeChild(popup);
    });

    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("formation-table-body");
    const addButton = document.getElementById("add-formation");

    // Fonction pour ajouter une nouvelle formation
    addButton.addEventListener("click", function () {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td class="course">
                <a href="#"><img src="default.png" alt="New Course"> Nouvelle Formation</a>
            </td>
            <td>En ligne 🎥</td>
            <td>DD-MM-YYYY</td>
            <td>Description ici</td>
            <td><button class="status processing">Processing</button></td>
            <td class="actions">
                <i class="fas fa-edit"></i>
                <i class="fas fa-trash"></i>
                <i class="fas fa-share"></i>
            </td>
        `;
        tableBody.appendChild(newRow);
        attachEventListeners(newRow);
    });

    // Fonction pour attacher les événements aux boutons d'action
    function attachEventListeners(row) {
        const editButton = row.querySelector(".fa-edit");
        const deleteButton = row.querySelector(".fa-trash");
        const shareButton = row.querySelector(".fa-share");

        // Modifier une formation
        editButton.addEventListener("click", function () {
            const cells = row.querySelectorAll("td:not(:first-child, .actions)");
            if (editButton.classList.contains("editing")) {
                // Sauvegarde
                cells.forEach(cell => {
                    const input = cell.querySelector("input");
                    if (input) {
                        cell.innerHTML = input.value;
                    }
                });
                editButton.classList.remove("editing");
            } else {
                // Passage en mode édition
                cells.forEach(cell => {
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = cell.textContent.trim();
                    cell.innerHTML = "";
                    cell.appendChild(input);
                });
                editButton.classList.add("editing");
            }
        });

        // Supprimer une formation
        deleteButton.addEventListener("click", function () {
            row.remove();
        });
    }
    

    // Attacher les événements aux formations existantes
    document.querySelectorAll("tbody tr").forEach(row => attachEventListeners(row));
});


document.querySelectorAll(".fa-share").forEach((shareIcon) => {
    shareIcon.addEventListener("click", function (event) {
        // Supprimer les anciens popups
        let existingPopup = document.querySelector(".share-popup");
        if (existingPopup) existingPopup.remove();

        let row = this.closest("tr");
        let formationName = row.querySelector(".course").innerText.trim();
        let shareText = `Découvrez cette formation : ${formationName}`;
        let shareUrl = encodeURIComponent("https://example.com"); // Remplace par ton lien réel

        // Copier le texte dans le presse-papiers
        navigator.clipboard.writeText(shareText).then(() => {
            console.log("Lien copié : ", shareText);
        });

        // Création du popup de partage
        let popup = document.createElement("div");
        popup.className = "share-popup";
        popup.innerHTML = `
            <p>Lien copié!</p>
            <div class="share-icons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="32" height="32">
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="32" height="32">
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" width="32" height="32">
                </a>
            </div>
        `;

        // Ajout du popup à l'élément parent
        this.parentElement.appendChild(popup);

        setTimeout(() => {
            popup.classList.add("show");
        }, 10);

        // Cacher le popup au clic en dehors
        document.addEventListener("click", function hidePopup(e) {
            if (!popup.contains(e.target) && e.target !== shareIcon) {
                popup.classList.remove("show");
                setTimeout(() => popup.remove(), 300);
                document.removeEventListener("click", hidePopup);
            }
        });
    });
});


// add formation button//
document.addEventListener("DOMContentLoaded", function () {
    let addButton = document.getElementById("add-formation");
    
    addButton.addEventListener("click", function () {
        let formSection = document.getElementById("formation-form"); // Assurez-vous que cet ID existe dans votre HTML
        formSection.scrollIntoView({ behavior: "smooth" });
    });
});




 // Nav barre
 function toggleNav() {
    let sidebar = document.getElementById("sidebar");
    document.getElementById("sidebar").classList.toggle("open");
    sidebar.classList.toggle("active");

}

    // Ajouter les événements pour déclencher le filtrage
    searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement de la page
    filterCourses();

    // Fonction pour gérer l'affichage de la barre de navigation
    function toggleNav() {
        document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
    }







