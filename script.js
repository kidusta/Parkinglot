var parkingData = [];
    var idCounter = 1;

    // Check-in form submission handler
    $('#parkingForm').submit(function(event) {
      event.preventDefault();
      var name = $('#name').val();
      var phone = $('#phone').val();
      var licensePlate = $('#licensePlate').val();
      var timeIn = new Date();

      var entry = {
        id: idCounter++,
        name: name,
        phone: phone,
        licensePlate: licensePlate,
        timeIn: timeIn,
        money: 0
      };

      parkingData.push(entry);
      $('#parkingForm')[0].reset();
      displayEntry(entry);
    });
  
    $('#checkoutForm').submit(function(event) {
        event.preventDefault();
        var licensePlate = $('#licensePlateOut').val();
      
        var foundEntry = parkingData.find(function(entry) {
          return entry.licensePlate === licensePlate;
        });
      
        if (foundEntry && !foundEntry.checkedOut) {
          var timeIn = foundEntry.timeIn;
          var timeOut = new Date();
          var durationInMinutes = Math.ceil((timeOut - timeIn) / 60000); // Calculate duration in minutes
      
          foundEntry.money = calculateMoney(durationInMinutes);
          foundEntry.checkedOut = true; // Mark entry as checked out
      
          var timeInFormatted = formatDate(timeIn);
          var timeOutFormatted = formatDate(timeOut);
      
          var resultHtml = '<h4>Check-Out Details:</h4>';
          resultHtml += '<p><b>ID:</b> ' + foundEntry.id + '</p>';
          resultHtml += '<p><b>Name:</b> ' + foundEntry.name + '</p>';
          resultHtml += '<p><b>Phone:</b> ' + foundEntry.phone + '</p>';
          resultHtml += '<p><b>License Plate:</b> ' + foundEntry.licensePlate + '</p>';
          resultHtml += '<p><b>Time In:</b> ' + timeInFormatted + '</p>';
          resultHtml += '<p><b>Time Out:</b> ' + timeOutFormatted + '</p>';
          resultHtml += '<p><b>Duration:</b> ' + durationInMinutes + ' minutes</p>';
          resultHtml += '<p><b>Money:</b> $' + foundEntry.money.toFixed(2) + ' Birr </p>';
          resultHtml += '<button onclick="downloadDetails()" class = "downloadBtn" >Download Details</button>';
      
          $('#result').html(resultHtml);
          $('#parkingTable tbody').empty();
          displayParkingData();
        } else {
          $('#result').html('<p>Entry not found or already checked out.</p>');
        }
      
        $('#checkoutForm')[0].reset();
      });
      
    
  
  function formatDate(date) {
    var options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('en-US', options);
  }
  
  
  function downloadDetails() {
    var result = $('#result').html();
    var cleanResult = result.replace(/<[^>]*>/g, '');
    var filename = 'checkout_details.txt';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cleanResult));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  
    var removeButton = document.getElementById('removeButton');
    if (!removeButton) {
      removeButton = document.createElement('button');
      removeButton.setAttribute('id', 'removeButton');
      removeButton.innerHTML = 'Remove';
      removeButton.addEventListener('click', function() {
        $('#result').empty();
        removeButton.remove();
      });
  
      $('#result').append(removeButton);
  }}
  
  

    
    function calculateMoney(durationInMinutes) {
      var baseCharge = 5; 
      var additionalCharge = 0.1; 
      var totalCharge = baseCharge;

      if (durationInMinutes > 1) {
        totalCharge += (durationInMinutes - 1) * additionalCharge;
      }

      return totalCharge;
    }
   
function removeUser(id) {
    var index = parkingData.findIndex(function(entry) {
      return entry.id === id;
    });
  
    if (index !== -1) {
      parkingData.splice(index, 1);
      $('#parkingTable tbody').empty();
      displayParkingData();
    }
  }
  

   
   function displayEntry(entry) {
    var timeIn = entry.timeIn.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    var rowHtml = '<tr>';
    rowHtml += '<td>' + entry.id + '</td>';
    rowHtml += '<td>' + entry.name + '</td>';
    rowHtml += '<td>' + entry.phone + '</td>';
    rowHtml += '<td>' + entry.licensePlate + '</td>';
    rowHtml += '<td>' + timeIn + '</td>';
    rowHtml += '<td>$' + entry.money.toFixed(2) + '</td>';
    rowHtml += '<td><button class="btn btn-danger btn-sm" onclick="removeUser(' + entry.id + ')">Remove</button></td>';
    rowHtml += '</tr>';
  
    $('#parkingTable tbody').append(rowHtml);
  }
  

    function displayParkingData() {
      parkingData.forEach(function(entry) {
        displayEntry(entry);
      });
    }

    displayParkingData();