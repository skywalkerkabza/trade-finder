// public/app.js
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const city = document.getElementById('city').value;
    const serviceType = document.getElementById('serviceType').value;
    
    fetch(`/api/services?city=${encodeURIComponent(city)}&type=${encodeURIComponent(serviceType)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        if (data.length === 0) {
          resultsDiv.innerHTML = '<p>No services found.</p>';
        } else {
          data.forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.className = 'service';
            serviceDiv.innerHTML = `<h3>${service.name}</h3><p>Type: ${service.type}</p><p>City: ${service.city}</p>`;
            resultsDiv.appendChild(serviceDiv);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  });
  