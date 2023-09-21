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
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
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

	let tmp = { contact: firstname + lastname, phone: phonenumber, email: emailaddress, userId: userId };
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
		search: srch,
        userID: userId
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
				const tableBody = document.getElementById("tableBody");
				tableBody.innerHTML = "";
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					arr[i] = jsonObject.results[i].ID;

					if( i < jsonObject.results.length)
					{
						const tr = document.createElement("tr");
						tr.setAttribute("id", "tr");
						tr.innerHTML = `
						<td id="tableFirstName${i}">${jsonObject.results[i].firstname}</td>
						<td id="tableLastName${i}">${jsonObject.results[i].lastname}</td>
						<td id="tableEmail${i}">${jsonObject.results[i].email}</td>
						<td id="tablePhoneNumber${i}">${jsonObject.results[i].phonenumber}</td>
						<td>
							<button id="deleteButton" type="button" class="btn" onclick='deleteContact(${i});'>
								<span class="button__text"></span>
								<span class="button__icon">
									<ion-icon name="trash-outline"></ion-icon>
								</span>
							</button>

							<button id="edit-btn" type="button" class="btn" onclick='updateContact(${i});'>
								<span class="button__text"></span>
								<span class="button__icon">
									<ion-icon name="create-outline"></ion-icon>
								</span>
							</button>
						</td>
						`
						contactList += tr;
						tableBody.appendChild(tr);
					}
					
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
	let update_name = document.getElementById("updateName").value;
    let update_phonenumber = document.getElementById("updatePhone").value;
    let update_emailaddress = document.getElementById("updateEmail").value;

    let tmp = {
		newName: update_name,
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
                //loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(id)
{
	
}