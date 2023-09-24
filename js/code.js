const urlBase = 'http://104.131.179.180/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let tablearr = [];

let curUpdateFunction = null;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

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
					document.getElementById("loginResult").innerHTML = "User/Password incorrect";
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
		document.getElementById("loginResult").innerHTML = err.message;
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

	if (firstname == '' || lastname == '' || username == '' || password == '')
	{
		document.getElementById("signupResult").innerHTML = "All entries must be filled";
        return;
	}

	if (password.length < 8)
	{
		document.getElementById("signupResult").innerHTML = "Password must be at least 8 characters long";
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
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.ID;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				document.getElementById("signupResult").innerHTML = "User created";

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function addContact()
{
	let firstname = document.getElementById("contactFirst").value;
    let lastname = document.getElementById("contactLast").value;
    let phonenumber = document.getElementById("contactPhone").value;
    let emailaddress = document.getElementById("contactEmail").value;

	var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

	document.getElementById("contactAddResult").innerHTML = "";
	
	//First Name filled
	if (firstname == '')
	{
		document.getElementById("signupResult").innerHTML = "First Name Blank";
        return;
	}

	//Last Named Filled
	if (lastname == '')
	{
		document.getElementById("signupResult").innerHTML = "Last Name Blank";
        return;
	}

	//Valid Phone
	if (phonenumber == '')
	{
		document.getElementById("signupResult").innerHTML = "Phone Number Blank";
        return;
	}
	else {
		if (phoneRegex.test(phonenumber) == false){
			document.getElementById("signupResult").innerHTML = "Invalid Phone Number";
        	return;
		}
	}


	if (emailaddress == '')
	{
		document.getElementById("signupResult").innerHTML = "Email Blank";
        return;
	}
	else {
		if(emailRegex.test(emailaddress) == false){
			document.getElementById("signupResult").innerHTML = "Invalid Email";
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
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
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
				if (jsonObject.error === "No Records Found") {
					console.log("No contacts found!");
					return;
				}

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
						<button id="edit-btn" type="button" class="btn" data-bs-toggle="modal" data-bs-target=".edit-contact-modal">
							<span class="button__text"></span>
							<span class="button__icon">
								<ion-icon name="create-outline"></ion-icon>
							</span>
						</button>
					</td>
					<td>
						<button id="deleteButton" type="button" class="btn" onclick="deleteContact('${contactID}', '${contactFirst}', '${contactLast}');">
							<span class="button__text"></span>
							<span class="button__icon">
								<ion-icon name="trash-outline"></ion-icon>
							</span>
						</button>
					</td>
					`

					// Loads all information into the modal on click
					let editButton = tr.querySelector("#edit-btn");
					editButton.addEventListener("click", function() {
						document.getElementById("updateFirstName").value = tr.cells[0].textContent;
						document.getElementById("updateLastName").value = tr.cells[1].textContent;
						document.getElementById("updatePhone").value = tr.cells[2].textContent;
						document.getElementById("updateEmail").value = tr.cells[3].textContent;
					});

					// Sets the modal's update button to update the selected contacts information
					let updateBtn = document.getElementById("updateBtn");
					if (curUpdateFunction != null) {
						updateBtn.removeEventListener("click", curUpdateFunction);
					}
					curUpdateFunction = () => updateContact(contactID);
					document.getElementById("updateBtn").addEventListener("click", curUpdateFunction);

					//Clear spans upon return click
					let updateReturnBtn = document.getElementById("returnUpdate");
					updateReturnBtn.addEventListener("click",  function() {
						document.getElementById("contactUpdateResult").innerHTML = "";
					});
					let addReturnBtn = document.getElementById("returnAdd");
					addReturnBtn.addEventListener("click",  function() {
						document.getElementById("contactAddResult").innerHTML = "";
					});

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

	document.getElementById("contactUpdateResult").innerHTML = "";

	var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	var phoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
	
	//First Name filled
	if (update_first == '')
	{
		document.getElementById("contactUpdateResult").innerHTML = "First Name can't be blank";
        return;
	}

	//Last Named Filled
	if (update_last == '')
	{
		document.getElementById("contactUpdateResult").innerHTML = "Last Name can't be blank";
        return;
	}

	//Valid Phone
	if (update_phonenumber == '')
	{
		document.getElementById("contactUpdateResult").innerHTML = "Phone Number can't be blank";
        return;
	}
	else {
		if (phoneRegex.test(update_phonenumber) == false){
			document.getElementById("contactUpdateResult").innerHTML = "Invalid Phone Number";
        	return;
		}
	}

	if (update_emailaddress == '')
	{
		document.getElementById("signupResult").innerHTML = "Email can't be blank";
        return;
	}
	else {
		if(emailRegex.test(update_emailaddress) == false){
			document.getElementById("signupResult").innerHTML = "Invalid Email";
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
                console.log("Contact has been updated");
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
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
	// TO CHANGE : find the first name and last name of the row of the deleted contact, rather than pulling the HTML from the first + last
    let check = confirm('Confirm deletion of contact: ' + contactFirst + ' ' + contactLast);

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
                    console.log("Contact has been deleted");
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