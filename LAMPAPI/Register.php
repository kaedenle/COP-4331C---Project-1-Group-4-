<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
    
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();
        
        // User with this login name already exists
		if ($result->fetch_assoc())
		{
            returnWithError("Login name is unavailable");
		}
		else
		{
            $stmt = $conn->prepare("INSERT into Users(FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		    $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);

		    $stmt->execute();

            $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login=? AND Password=?");
		    $stmt->bind_param("ss", $inData["login"], $inData["password"]);
		    $stmt->execute();
            $result = $stmt->get_result();
            
            if($row = $result->fetch_assoc())
		    {
			    returnWithInfo($row["FirstName"], $row["LastName"], $row["ID"]);
		    }
		    else
		    {
			    returnWithError("Unable to add user to database");
		    }
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($firstName, $lastName, $id)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson($retValue);
	}
	
?>
