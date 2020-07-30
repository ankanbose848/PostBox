console.log("This is PostMaster");

// Utility functions
// 1. Function to get DOM element from string
function getElementFromString(string){
  let div = document.createElement('div')
  div.innerHTML = string;
  return div.firstElementChild;
}

// Initialize no of parameters
let addedParamCount = 0;

// Hide the parameters box initially
let parametersBox = document.getElementById('parametersBox')
parametersBox.style.display = 'none';

// If the user clicks on params, hide the json box
let paramsRadio = document.getElementById('paramsRadio')
paramsRadio.addEventListener('click', ()=>{
  document.getElementById('requestjsonBox').style.display = 'none';
  document.getElementById('parametersBox').style.display = 'block';
})

// If the user clicks on json, hide the params box
let jsonRadio = document.getElementById('jsonRadio')
jsonRadio.addEventListener('click', ()=>{
  document.getElementById('parametersBox').style.display = 'none';
  document.getElementById('requestjsonBox').style.display = 'block';
})


// If the user clicks on + button, add more parameters
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', ()=>{
  let params = document.getElementById('params');
  string = `
  <div class="form-row my-2">
    <label for="parametersBox" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
    <div class="col-md-4">
      <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Enter parameter ${addedParamCount + 2} Key">
    </div>
    <div class="col-md-4">
      <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Enter parameter ${addedParamCount + 2} Value">
    </div>
    <button class="btn btn-primary deleteParam bg-danger"> - </button>
  </div>
  `

  // Conver the string to DOM
  let paramElement = getElementFromString(string)
  params.appendChild(paramElement)
  // Add event addEventListener for - button
  let deleteParam = document.getElementsByClassName('deleteParam')
  for (item of deleteParam){
    item.addEventListener('click', (e)=>{
      e.target.parentElement.remove();
    })
  }
  addedParamCount++;
})

// On clicking submit button
let submit = document.getElementById('submit')
submit.addEventListener('click', ()=>{
  document.getElementById('responsePrism').value= "Fetching response, Please wait... "

  // Fetch all the values user has entered
  let url = document.getElementById('urlField').value;
  let requestType = document.querySelector("input[name='requestType']:checked").value;
  let contentType = document.querySelector("input[name='contentType']:checked").value;


  // If user has selected params options, collect all the parameters in an object
  if (contentType == 'params'){
    data = {};
    for (i=0; i < addedParamCount+1; i++){
      if (document.getElementById('parameterKey' + (i+1)) != undefined){
        let key = document.getElementById('parameterKey' + (i+1)).value;
        let value = document.getElementById('parameterValue' + (i+1)).value;
        data[key] = value;
      }
    }
    data = JSON.stringify(data);
  }
  else{
    data = document.getElementById('requestJsonText').value;
  }

  // Log all the values in console for debugging
  console.log("url is ", url);
  console.log("requestType is ", requestType);
  console.log("contentType is ", contentType);
  console.log("data is ", data);

  // If the requestType is GET, invoke fetch api to create a GET request
  if (requestType == 'GET'){
    fetch(url, {
      method: 'GET',
    })
    .then(response => response.text())
    .then((text)=>{
      // document.getElementById('responsePrism').value = text;
      document.getElementById('responsePrism').innerHTML = text;
      Prism.highlightAll();
    });
  }
  else{
    fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.text())
    .then((text)=>{
      // document.getElementById('responsePrism').value = text;
      document.getElementById('responsePrism').innerHTML = text;
      Prism.highlightAll();
    });
  }
});
