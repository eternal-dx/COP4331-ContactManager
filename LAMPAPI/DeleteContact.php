<?php

	$inData = getRequestInfo();

	$name = $inData["Name"];
	$userID = $inData["userId"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from Contacts where Name=? and UserID=?");
		$stmt->bind_param("si", $name, $userID);
		$stmt->execute();
		$deleted_rows = $stmt->affected_rows;
		if ($deleted_rows == 0)
		{
			returnWithError("No entry with that name and userId found.");
		}
		else
		{
			returnWithInfo($name, $userID);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
 
  	function returnWithInfo( $name, $userID )
	{
		$retValue = '{"Name":"' . $name . '","userId":' . $userID . '}';
		sendResultInfoAsJson( $retValue );
	}
    
?>