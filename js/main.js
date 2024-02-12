/********************************************************************************
* WEB422 – Assignment 2
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
* Name: Maria Sofia Andrino Student ID: 130773187 Date: February 2, 2024
*
********************************************************************************/

let page = 1;
const perPage = 10;
let searchName = null; 

function loadListingsData() {
    let url = searchName
    ? `https://listings-and-reviews.onrender.com/api/listings?page=${page}&perPage=${perPage}&search=${searchName}` 
    : `https://listings-and-reviews.onrender.com/api/listings?page=${page}&perPage=${perPage}`;

    fetch(url)
    .then(res => {
    return res.ok ? res.json() : Promise.reject(res.status);
    })
    .then(data => {
    if(data.length){
        let rows = data.map(row => {
            let summary_info = row.summary || ''; 

            if (row.accommodates) summary_info += `<br><br><strong>Accommodates:</strong> ${row.accommodates}`;
            if (row.review_scores && row.review_scores.review_scores_rating) summary_info += `<br><strong>Rating:</strong> ${row.review_scores.review_scores_rating}`;
            if (row.number_of_reviews)summary_info += ` (${row.number_of_reviews} Reviews)`;

            return `<tr data-id="${row._id}">
                <td>${row.name}</td>
                <td>${row.room_type}</td>
                <td>${row.address.street}</td>
                <td>${summary_info}</td>
            </tr>`;
        }).join('');
      document.querySelector("#listingsTable tbody").innerHTML = rows;
    }
    else{
        if(page > 1) page--;
        else{
            let row = `<tr><td colspan="4"><strong>No data available</td></tr>`
            document.querySelector("#listingsTable tbody").innerHTML = row;
        }
    }

    document.getElementById("current-page").textContent = page;

    }).catch(err => {
        console.log(err);
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    loadListingsData();
    document.getElementById('previous-page').addEventListener('click', event => {
        event.preventDefault(); 
        if (page > 1) {
            page--;
            loadListingsData();
        }
    });

    document.getElementById('next-page').addEventListener('click', event => {
        event.preventDefault(); 
        page++; 
        loadListingsData();
    });

    document.getElementById('searchForm').addEventListener('submit', event => {
        event.preventDefault(); 
        const searchInput = document.getElementById('name');
        searchName = searchInput.value; 
        page = 1; 
        loadListingsData();
    });

    document.getElementById('clearForm').addEventListener('click', event => {
        document.getElementById('name').value = ""; 
        searchName = null; 
        loadListingsData();
    });

    document.querySelector("#listingsTable tbody").addEventListener('click', event => {
      
      let clickedTR = event.target.closest("tr");
      let listingID = clickedTR.getAttribute("data-id")
  
      fetch(`https://listings-and-reviews.onrender.com/api/listings/${listingID}`)
        .then(res=>res.json())

        .then(data=>{
            
            const imageUrl = data.images?.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available';
            
            let modalBody = `<img id="photo" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${imageUrl}"><br><br>
                ${data.neighborhood_overview}<br><br>
                <strong>Price:</strong> $${parseFloat(data.price).toFixed(2)}<br>
                <strong>Room:</strong> ${data.room_type}<br>
                <strong>Bed:</strong> ${data.bed_type} (${data.beds})<br><br>`;
        
        document.querySelector("#detailsModal .modal-body").innerHTML = modalBody;
  
        let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
          backdrop: 'static',
          keyboard: false,
          focus: true, 
        });
        
        myModal.show();
      });
    });
});