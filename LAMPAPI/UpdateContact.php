<?php
	$inData = getRequestInfo();

  //fields needed
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$contactId = $inData["contactId"];
 
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
    //update query needing 5 inputs (4 attributes, 1 primary key)
    $stmt = $conn->prepare('UPDATE Contacts set FirstName = ?, LastName = ?, Email = ?, Phone = ? where ContactID = ?');
 		$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $contactId);
 		$stmt->execute();
    $stmt->close();
  	$conn->close();
  	returnWithError("");
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