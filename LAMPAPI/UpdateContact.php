<?php
	$inData = getRequestInfo();

	//if the key doesn't exist in the json input, this file will ignore it
	//collaborate with front end to see if they can ignore json input if field is empty. 
	//Otherwise see what's the most convient way for them to design it
	//SUBJECT TO CHANGE

	$firstName = checkKey($inData, "firstName_updated");
	$lastName = checkKey($inData, "lastName");
	$email = checkKey($inData, "email");
	$phone = checkKey($inData, "phone");
	$queryInfo = Array($firstName, $lastName, $email, $phone);
	$columnInfo = Array("FirstName", "LastName", "Email", "Phone");

	//both keys below HAVE to be present
	//user ID (foriegn key in Contacts table)
	$userId = $inData["userId"];
	$contactId = $inData["contactId"];
 
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
  	//preparing query to be sent
  	$query = 'UPDATE Contacts set ';
  	$err = "";
  	//Set true if AT LEAST one piece of info isn't ""
  	$queryFlag = False;
  	//iterate through array
  	for($x = 0; $x < count($queryInfo); $x++){
  	  if($queryInfo[$x] != ""){
  		//if queryFlag isn't True, this is the first cycle and thus a comma shouldn't be added
  		if($queryFlag){
  		  $query .= ',';
  		}
  		
  		$queryFlag = True;
  		$query .= $columnInfo[$x] . '="'.strval($queryInfo[$x]).'"';
  	  }
  	}
    
  	if($queryFlag){
  	  
  	  $query .= ' where (ID=? AND ContactID=?)';
 		  $stmt = $conn->prepare($query);
  		$stmt->bind_param("ss", $userId, $contactId);
  		$stmt->execute();
      $stmt->close();
  	}
  	else{
  	  $err = "No information selected";
  	}
  	
  	$conn->close();
  	returnWithError($err);
	}

	//Check if key exists
	//returns "" if false returns value at key if true
	function checkKey($json, $key)
	{
	if(array_key_exists($key ,$json)){
	  return $json[$key];
	}
	return "";
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>