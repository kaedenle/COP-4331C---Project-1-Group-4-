
const urlBase = 'http://contacts4u.info/LAMPAPI';
const extension = 'php';

// Gets specific id of user who is logged in.
let userId = 0;
let firstName = "";
let lastName = "";
// Gets specific id of contact who is searched/edit/deleted.
let contactId = null;
// Is used to capture contactID and change it.
let flag;

// Logs user in,
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//Hashes password.
	var hash = md5( password );

	// Outputs login result
	document.getElementById("loginResult").innerHTML = "";

	// let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};

	// Creates json and opens post request
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
				let jsonObject = JSON.parse( xhr.responseText);
				// Sets userID to the user who logged in.
				userId = jsonObject.id;
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				// Sets user info for later use.
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				// Saves info in to the browser.
				saveCookie();
				// After logged in, sends user to edit contact page.
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Update Contact
function updateContact()
{
	console.log("Updating contact id: " + flag);
	// Captures all the new Information that needs to be updated and stored.
	let contactFirst = document.getElementById("contactFirst").value;
	let contactLast = document.getElementById("contactLast").value;
	let contactEmail = document.getElementById("contactEmail").value;
	let contactNumber = document.getElementById("contactNumber").value;

	// Checks if any of the fields are empty.
	if(contactFirst == "" || contactLast == "" || contactEmail == "" || contactNumber == "")
	{
		console.log("Update Field Empty");
		document.getElementById("addContact").style.visibility = "visible";
		document.getElementById("addContact").innerHTML = "You have an Empty Field";
		return;
	}
	else
	{
		let updatedContact =
		{
			firstName:contactFirst,
			lastName:contactLast,
			email:contactEmail,
			phone:contactNumber,
			contactId: flag
		};
		// Sends post request of the updated contact info to the database.
		let jsonPayload = JSON.stringify(updatedContact);
		let url = urlBase + '/UpdateContact.' + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if(this.readyState == 4 && this.status == 200)
				{
					let jsonObject = JSON.parse( xhr.responseText );
				}
			};
			xhr.send(jsonPayload);

		}
		catch(err)
		{
			console.log(err.message);
		}
	}

	// Resets all the fields to empty
	resetAddBox();
	// Outputs the succession of the updated contact.
	document.getElementById("addContact").style.visibility = "visible";
	document.getElementById("addContact").innerHTML = "Contact Updated!";
}

//Add Contact
function addContact()
{
	console.log('Adding new contact..');
	// Captures all the new Information that needs to be added and stored.
	let contactFirst = document.getElementById("contactFirst").value;
	let contactLast = document.getElementById("contactLast").value;
	let contactEmail = document.getElementById("contactEmail").value;
	let contactNumber = document.getElementById("contactNumber").value;

	// Cheks if any input fields are empty.
	if(contactFirst == "" || contactLast == "" || contactEmail == "" || contactNumber == "")
	{
		console.log("Empty");
		document.getElementById("addContact").style.visibility = "visible";
		document.getElementById("addContact").innerHTML = "You have an Empty Field";
		return;
	}
	else
	{
		let newContact =
		{
			firstName:contactFirst,
			lastName:contactLast,
			email:contactEmail,
			phone:contactNumber,
			userId: userId
		};
		// Sends post request of the inputted contact info to the database.
		let jsonPayload = JSON.stringify(newContact);
		let url = urlBase + '/AddContact.' + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if(this.readyState == 4 && this.status == 200)
				{
					let jsonObject = JSON.parse( xhr.responseText );
				}
			};
			xhr.send(jsonPayload);

		}
		catch(err)
		{
			console.log(err.message);
		}

		// Resets all the fields to empty.
		resetAddBox();
		// Outputs the succession of the added contact.
		document.getElementById("addContact").style.visibility = "visible";
		document.getElementById("addContact").innerHTML = "Contact Added";
	}

}

// Creates new user in database.
function registerUser()
{
	console.log('Running..');
	// Captures all the new information that needs to be created and assigned to new user.
	let createFirstName = document.getElementById("createFirstName").value;
	let createLastName = document.getElementById("createLastName").value;
	let createLogin = document.getElementById("createLogin").value;
	let createPassword = document.getElementById("createPassword").value;
	var hash = md5(createPassword);

	// Cheks if any input fields are empty.
	if(createFirstName == "" || createLastName == "" || createLogin == "" || createPassword == "")
	{
		console.log("Empty");
		document.getElementById("register-text").innerHTML = "You have an Empty Field";
		return;
	}
	else
	{
		let createUser =
		{
			firstName: createFirstName,
			lastName: createLastName,
			login: createLogin,
			password: hash

		};

		// Sends post request of the inputted information and creates user in database.
		let jsonPayload = JSON.stringify(createUser);
		let url = urlBase + '/Register.' + extension;
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
						if(jsonObject['error'] == "")
						{
							// If there is no error, then send user back to home page.
							document.getElementById("register-bar").style.visibility = "visible";
							document.getElementById("register-text").innerHTML = "Account Registered";
							document.getElementById('createFirstName').value = "";
							document.getElementById('createLastName').value = "";
							document.getElementById('createLogin').value = "";
							document.getElementById('createPassword').value = "";
							window.location.href = 'http://contacts4u.info';
						}
						else
						{
							// Output specific error
							document.getElementById("register-bar").style.visibility = "visible";
							document.getElementById("register-text").innerHTML = `${jsonObject['error']}`;

						}

					}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			console.log(err.message);
		}
	}


}

// Delets specific contactID, and removes them from list.
function deleteContact(id, listItem)
{
	console.log("Delete called at: "+ id);

	// When user clicks delete button, they are alerted to make sure they want to delete.
	if (confirm("Are your sure you want to delete this contact?"))
	{
    console.log("About to delete contactid: "+id);
		// user who needs to be deleted is passed through id from which list item is clicked.
		let deleteUser =
		{
			contactId:id
		};
		// Gets ol list in html that will hold all our contacts returned from search.
		let listy = document.getElementById("contactList");

		// Sends post request of the contact that needs to be deleted from database.
		let jsonPayload = JSON.stringify(deleteUser);
		let url = urlBase + '/DeleteContact.' + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if(this.readyState == 4 && this.status == 200)
				{
					let jsonObject = JSON.parse( xhr.responseText );
				}
			};
			xhr.send(jsonPayload);
			// Removes deleted contact from the contact list in html.
			listy.removeChild(listItem);
			// Resets all the fields to empty.
			resetAddBox();
		}
		catch(err)
		{
			console.log(err.message);
		}

  }
	else
	{
		// User decided not to delete user.
    console.log("Cancelled");
  }

}

// Edit Contact
function editContact(userId,contactId,firstName, lastName, phone, email)
{
	// Changes add-contact container so that it is ready to update user.
	document.getElementById('change-info').innerHTML = "Edit Contact Information";
	// Fills the input fields with the current information that wants to be edited.
	document.getElementById("contactFirst").value = firstName;
	document.getElementById("contactLast").value = lastName;
	document.getElementById("contactNumber").value = phone;
	document.getElementById("contactEmail").value = email;
	// Shows update contact btn and hides the add-contact btn.
	document.getElementById("updateContact-btn").style.visibility = "visible";
	document.getElementById("updateContact-bar").style.visibility = "visible";
	document.getElementById("addContact").style.visibility = "hidden";
	document.getElementById("addContact-bar").style.visibility = "hidden";
	document.getElementById("addContact-btn").style.visibility = "hidden";

	console.log("userId: " + userId + " wants to edit: "+contactId);
	// Updates flag to hold whichever contact we are going to use and update later.
	flag = contactId;
	console.log("flag: "+flag);
}

// Saves cookies for the user. Written By: Rick Leinicker
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// Gets the user information from cookies. Written By: Rick Leinicker
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	console.log(splits);
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		console.log(tokens);
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
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome " + firstName + " " + lastName;
	}
}

// Logs user out, Written By: Rick Leinicker.
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Empties the add contact cotainer, also resest the container to original form.
function resetAddBox()
{
	console.log('clearing...');
	document.getElementById("updateContact-btn").style.visibility = "hidden";
	document.getElementById("contactFirst").value = "";
	document.getElementById("contactLast").value = "";
	document.getElementById("contactNumber").value = "";
	document.getElementById("contactEmail").value = "";
	document.getElementById("addContact").style.visibility = "hidden";
	document.getElementById("addContact-bar").style.visibility = "hidden";
	document.getElementById("addContact-btn").style.visibility = "visible";
	document.getElementById("updateContact-bar").style.visibility = "hidden";
	document.getElementById('change-info').innerHTML = "Add Contact Information";
}

// Search for contacts that is in users address book.
function searchContact()
{
	console.log('Searching...');
	// Resets all the fields to empty.
	resetAddBox();
	// Captures the search string inputted by user.
	let srch = document.getElementById("searchText").value;
	// After user searches, then the edit and delete button will be visible.
	document.getElementById('contactList').style.visibility = "visible";
	document.getElementById('contactList').innerHTML = "";
	document.getElementById("addContact-btn").style.visibility = "visible";

	console.log(userId);
	console.log(srch);

	// Sends post request of the contact that needs to be searched from database.
	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
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
				// Gets the list element from Html, that will contain all our returned contacts.
				let contactList = document.getElementById('contactList');
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					// Create list element to put into contact list.
					let item = document.createElement("li");
					// Create edit btn that will be put into list element.
					let btn1 = document.createElement("button");
					contactId = jsonObject.results[i].contactId;
					// Sets new edit btn to have show "Edit".
					btn1.innerHTML = "Edit";
					// Sets new edit btn to have same class as the other buttons in the page.
					btn1.className = "btn-hover";
					// Sets new edit btn to have a distinct id that can be used for later.
					btn1.setAttribute("id" , "editContact-btn");
					// Add event listener to new btn, whenever clicked it will call edit contact with the given parameters listed below.
					btn1.addEventListener('click', function()
					{
						// When called the edit function will have the infor of the contact that wants to be edited.
    				editContact(userId,jsonObject.results[i].contactId, jsonObject.results[i].firstName, jsonObject.results[i].lastName, jsonObject.results[i].phone, jsonObject.results[i].email);
					});
					// Create delete btn that will be put into list element.
					let btn2 = document.createElement("button");
					// Sets new edit btn to have show "Edit".
					btn2.innerHTML = "Delete";
					// Sets new edit btn to have same class as the other buttons in the page.
					btn2.className = "btn-hover";
					// Sets new edit btn to have a distinct id that can be used for later.
					btn2.setAttribute("id" , "deleteContact-btn");
					// Add event listener to new btn, whenever clicked it will call edit contact with the given parameters listed below.
					btn2.addEventListener('click', function()
					{
						// When called the specific contactID and list element will be passed to delete.
    				deleteContact(jsonObject.results[i].contactId, item);
					});
					// Sets the newly created list item to display their first and lastName. And some extra space at the end before the buttons.
					item.innerHTML = jsonObject.results[i].firstName + " " + jsonObject.results[i].lastName + "&emsp; &emsp; &emsp;&emsp; &emsp;";
					// Adds edit and delete buttons to list element.
					item.appendChild(btn1);
					item.appendChild(btn2);
					console.log("List item: " + item);
					// Adds the list element to the contact list in the html.
					contactList.appendChild(item);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	document.getElementById('searchText').value = "";

}
