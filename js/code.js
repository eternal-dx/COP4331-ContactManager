const urlBase = 'http://104.131.179.180/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let tablearr = [];

let curUpdateFunction = null;

function sendAlert(elementID, alert) {
	let element = document.getElementById(elementID);
	element.style = "display: block";
	element.innerHTML = alert;
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	let resultID = "loginResult";

	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					sendAlert(resultID, "User/Password Incorrect!");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		sendAlert(resultID, err.message);
	}
}

function saveCookie()
{
	// If rememberMe is active, store cookie for an entire month
	let minutes = document.getElementById("rememberMe").checked ? 43800 : 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		if (window.location.pathname.split("/").slice(-1) != "index.html") window.location.href = "index.html";
	}
	else
	{
		if (window.location.pathname.split("/").slice(-1) != "contact.html") window.location.href = "contact.html";
		document.getElementById("welcomeText").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doSignUp()
{
	let firstname = document.getElementById("firstName").value;
    let lastname = document.getElementById("lastName").value;
	let username = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;
	let resultID = "signupResult";

	if (firstname == '' || lastname == '' || username == '' || password == '')
	{
		sendAlert(resultID, "All Entries must be Filled!");
        return;
	}

	if (password.length < 8)
	{
		sendAlert(resultID, "Password must be at Least 8 Characters Long!");
		return;
	}

	var hashPass = md5(password);

	const userInfo = 
	{
		firstName: firstname,
		lastName: lastname,
		login: username,
		password: hashPass
	};

	let jsonPayload = JSON.stringify(userInfo);
	
	let url = urlBase + '/AddLogin.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
            if (this.status == 409) {
				sendAlert(resultID, "User already exists");
                return;
            }

			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		sendAlert(resultID, err.message);
	}

}

function clearAdd() {
	document.getElementById("contactFirst").value = "";
	document.getElementById("contactLast").value = "";
	document.getElementById("contactPhone").value = "";
	document.getElementById("contactEmail").value = "";
	document.getElementById("contactAddFail").style = "display: none";
	document.getElementById("contactAddSuccess").style = "display: none";
}

function addContact()
{
	let firstname = document.getElementById("contactFirst").value;
    let lastname = document.getElementById("contactLast").value;
    let phonenumber = document.getElementById("contactPhone").value;
    let emailaddress = document.getElementById("contactEmail").value;
	let resultIDFail = "contactAddFail";
	let resultIDSuccess = "contactAddSuccess";

	var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
	
	//First Name filled
	if (firstname == '')
	{
		sendAlert(resultIDFail, "First Name Blank!");
        return;
	}

	//Last Named Filled
	if (lastname == '')
	{
		sendAlert(resultIDFail, "Last Name Blank!");
        return;
	}

	//Valid Phone
	if (phonenumber == '')
	{
		sendAlert(resultIDFail, "Phone Number Blank!");
        return;
	}
	else {
		if (phoneRegex.test(phonenumber) == false) {
			sendAlert(resultIDFail, "Invalid Phone Number!");
        	return;
		}
	}

	if (emailaddress == '')
	{
		sendAlert(resultIDFail, "Email Blank!");
        return;
	}
	else {
		if (emailRegex.test(emailaddress) == false) {
			sendAlert(resultIDFail, "Invalid Email!");
			return;
		}
	}

	let tmp = { 
			firstName: firstname,
			lastName: lastname,
			phone: phonenumber,
			email: emailaddress,
			userId: userId 
	};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById(resultIDFail).style = "display: none";
				sendAlert(resultIDSuccess, "Contact has been added");
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		sendAlert(resultIDFail, err.message);
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;

	document.getElementById("contactSearchResult").innerHTML = "";
	
	let tmp = {
		firstName: srch,
		lastName: srch,
        userId: userId
    };
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				const tableBody = document.getElementById("tableBody");
				tableBody.innerHTML = "";

				// Check to determine if there were no records found from this search
				if (jsonObject.error === "No Records Found") return;

				console.log(jsonObject);
				console.log(xhr.responseText);

				let resultNum = jsonObject.FirstName.length;
				for( let i=0; i<resultNum; i++ )
				{
					// Contact Values
					let contactFirst = jsonObject.FirstName[i];
					let contactLast = jsonObject.lastName[i];
					let contactPhone = jsonObject.phone[i];
					let contactEmail = jsonObject.email[i];
					let contactID = jsonObject.ID[i];

					const tr = document.createElement("tr");
					tr.setAttribute("id", "tr");

					tr.innerHTML =
					`
					<td id="tableFirstName">${contactFirst}</td>
					<td id="tableLastName">${contactLast}</td>
					<td id="tableEmail">${contactPhone}</td>
					<td id="tablePhoneNumber">${contactEmail}</td>
					<td>
						<div id="contactButtons">
							<button id="edit-btn" type="button" class="btn" data-bs-toggle="modal" data-bs-target=".edit-contact-modal">
								<span class="button__text"></span>
								<span class="button__icon">
									<ion-icon name="create-outline"></ion-icon>
								</span>
							</button>
							<button id="deleteButton" type="button" class="btn" onclick="deleteContact('${contactID}', '${contactFirst}', '${contactLast}');">
								<span class="button__text"></span>
								<span class="button__icon">
									<ion-icon name="trash-outline"></ion-icon>
								</span>
							</button>
						</div>
					</td>
					`

					// Loads all information into the modal on click
					let editButton = tr.querySelector("#edit-btn");
					editButton.addEventListener("click", function() {
						document.getElementById("updateFirstName").value = tr.cells[0].textContent;
						document.getElementById("updateLastName").value = tr.cells[1].textContent;
						document.getElementById("updatePhone").value = tr.cells[2].textContent;
						document.getElementById("updateEmail").value = tr.cells[3].textContent;
						document.getElementById("contactUpdateFail").style = "display: none";
						document.getElementById("contactUpdateSuccess").style = "display: none";
					});

					// Sets the modal's update button to update the selected contacts information
					let updateBtn = document.getElementById("updateBtn");
					if (curUpdateFunction != null) {
						updateBtn.removeEventListener("click", curUpdateFunction);
					}
					curUpdateFunction = () => updateContact(contactID);
					document.getElementById("updateBtn").addEventListener("click", curUpdateFunction);

					tableBody.appendChild(tr);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Search error");
	}
	
}

function updateContact(id)
{
	let update_first = document.getElementById("updateFirstName").value;
	let update_last = document.getElementById("updateLastName").value;
    let update_phonenumber = document.getElementById("updatePhone").value;
    let update_emailaddress = document.getElementById("updateEmail").value;
	let resultIDFail = "contactUpdateFail";
	let resultIDSuccess = "contactUpdateSuccess";

	var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
	
	//First Name filled
	if (update_first == '')
	{
		sendAlert(resultIDFail, "First Name Can't be Blank!");
        return;
	}

	//Last Named Filled
	if (update_last == '')
	{
		sendAlert(resultIDFail, "Last Name Can't be Blank!");
        return;
	}

	//Valid Phone
	if (update_phonenumber == '')
	{
		sendAlert(resultIDFail, "Phone Number Can't be Blank!");
        return;
	}
	else {
		if (phoneRegex.test(update_phonenumber) == false) {
			sendAlert(resultIDFail, "Invalid Phone Number!");
        	return;
		}
	}

	if (update_emailaddress == '')
	{
		sendAlert(resultIDFail, "Email Can't be Blank!");
        return;
	}
	else {
		if (emailRegex.test(update_emailaddress) == false) {
			sendAlert(resultIDFail, "Invalid Email!");
			return;
		}
	}

    let tmp = {
		firstName: update_first,
		lastName: update_last,
        newPhone: update_phonenumber,
        newEmail: update_emailaddress,
        userId: userId,
		ID: id
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
				document.getElementById(resultIDFail).style = "display: none";
				sendAlert(resultIDSuccess, "Contact has been Updated!");
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(id, contactFirst, contactLast)
{
    let check = confirm('Confirm Deletion of Contact: ' + contactFirst + ' ' + contactLast);

    if (check === true) {
        let tmp = {
            ID: id,
            userId: userId
        };
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
					// document.getElementById("searchText").innerHTML = ""; //refresh the search? or table.
					searchContact();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }
    };
}