const urlBase = 'http://104.131.179.180/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";



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

	if (firstN == '' || lastN == '' || userN == '' || pass == '')
	{
		document.getElementById("signupResult").innerHTML = "All entries must be filled";
        return;
	}

	if (pass.length < 8)
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

	document.getElementById("contactAddResult").innerHTML = "";

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
	
	let contactList = "";

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
				console.log(jsonObject);
				console.log(xhr.responseText);
				const tableBody = document.getElementById("tableBody");
				tableBody.innerHTML = "";
				let resultNum = jsonObject.firstName.length;
				for( let i=0; i<resultNum; i++ )
				{
					const tr = document.createElement("tr");
					tr.setAttribute("id", "tr");
					tr.innerHTML = `
					<td id="tableFirstName">${jsonObject.FirstName[i]}</td>
					<td id="tableLastName">${jsonObject.lastName[i]}</td>
					<td id="tableEmail">${jsonObject.email[i]}</td>
					<td id="tablePhoneNumber">${jsonObject.phone[i]}</td>
					<td>
						<button id="deleteButton" type="button" class="btn" onclick="deleteContact(${jsonObject.ID[i]})">
							<span class="button__text"></span>
							<span class="button__icon">
								<ion-icon name="trash-outline"></ion-icon>
							</span>
						</button>

						<button id="edit-btn" type="button" class="btn" data-bs-toggle="modal" data-bs-target=".edit-contact-modal">
							<span class="button__text"></span>
							<span class="button__icon">
								<ion-icon name="create-outline"></ion-icon>
							</span>
						</button>
					</td>

					<div class="modal fade .edit-contact-modal" tabindex="-1" role="dialog">
						<div class="modal-dialog modal-dialog-centered">
							<div class="modal-content">
								<form>
									<h1 class="header-text mb-4">Edit Contact</h1>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="updateFirstName" placeholder="First Name" value="${jsonObject.FirstName[i]}">
										<label for="contactTextFirst">First Name</label>
									</div>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="updateLastName" placeholder="Last Name" value="${jsonObject.lastName[i]}">
										<label for="contactTextLast">Last Name</label>
									</div>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="updatePhone" placeholder="Phone #" value="${jsonObject.email[i]}">
										<label for="contactTextPhone">Phone #</label>
									</div>
									<div class="form-floating mb-4">
										<input type="text" class="form-control" id="updateEmail" placeholder="Email" value="${jsonObject.phone[i]}">
										<label for="contactTextEmail">Email</label>
									</div>
									<span id="contactUpdateResult"></span>
									<div class="button-handler">
										<button type="button" class="btn btn-primary" onclick="(updateContact(${jsonObject.phone[i]});">Update</button>
										<button type="reset" class="btn btn-secondary" data-bs-dismiss="modal">Return</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					`
					contactList += tr;
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

    let tmp = {
		firstName: update_first,
		lastName: update_last,
        newPhone: update_phonenumber,
        newEmail: update_emailaddress,
        userID: id
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been added";
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(id)
{
	let firstName = document.getElementById("tableFirstName").innerHTML;
	let lastName = document.getElementById("tableLastName").innerHTML;
    let check = confirm('Confirm deletion of contact: ' + firstName + ' ' + lastName);
    if (check === true) {
        //document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: firstName,
			lastName: lastName,
            userId: id
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
					searchContact();

                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };
}