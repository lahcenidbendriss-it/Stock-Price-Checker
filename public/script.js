document.addEventListener('DOMContentLoaded', function() {
  // Handle form submission for single stock
  document.getElementById('testForm2').addEventListener('submit', e => {
    e.preventDefault();
    
    const stock = e.target[0].value.trim();
    const like = e.target[1].checked;
    
    if (!stock) {
      document.getElementById('jsonResult').innerText = 'Please enter a stock symbol.';
      return;
    }
    
    fetch(`/api/stock-prices/?stock=${encodeURIComponent(stock)}&like=${like}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('jsonResult').innerText = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        document.getElementById('jsonResult').innerText = 'An error occurred while fetching stock prices.';
        console.error('Error:', error);
      });
  });

  // Handle form submission for multiple stocks
  document.getElementById('testForm').addEventListener('submit', e => {
    e.preventDefault();
    
    const stock1 = e.target[0].value.trim();
    const stock2 = e.target[1].value.trim();
    const like = e.target[2].checked;
    
    if (!stock1 || !stock2) {
      document.getElementById('jsonResult').innerText = 'Please enter both stock symbols.';
      return;
    }
    
    fetch(`/api/stock-prices?stock=${encodeURIComponent(stock1)}&stock=${encodeURIComponent(stock2)}&like=${like}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('jsonResult').innerText = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        document.getElementById('jsonResult').innerText = 'An error occurred while fetching stock prices.';
        console.error('Error:', error);
      });
  });
});
