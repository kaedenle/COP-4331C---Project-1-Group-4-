<?php
	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$userId = $inData["userId"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");


	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    //potential error in deleting contacts from other users?
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName like ?");


		$stmt->bind_param("s", $firstName);
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
