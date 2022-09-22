<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
    //Returns all contact in user's contact list if serach empty or doesn't exist
    $stmt = "";
    if(!array_key_exists("search" ,$inData) || $inData["search"] == ""){
      $stmt = $conn->prepare("select * from Contacts where ID=?");
      $stmt->bind_param("s", $inData["userId"]);
    }
    else{
      //added functionallity on same string first and last name serach
      $nameSplit = explode(' ', $inData["search"]);
      $firstName = $nameSplit[0];
      $lastName = "";
      
      //check if there is a last name in nameSplit
      if(count($nameSplit) > 1){
        $lastName = $nameSplit[1];
      }
      
      $stmt = $conn->prepare("select * from Contacts where (FirstName like ? AND LastName like ?) and  ID=? limit ?, 10");
      $firstName .= "%";
      $lastName .= "%";
		  $stmt->bind_param("sssi", $firstName, $lastName, $inData["userId"], $inData["offset"]);
    }
		
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"contactId" : "' . $row["ContactID"] . '", "firstName" : "' . $row["FirstName"] . '", "lastName" : "' . $row["LastName"].'", "phone" : "' . $row["Phone"].'", "email" : "' . $row["Email"].'"}';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
