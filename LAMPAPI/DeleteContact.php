<?php

	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userID = $inData["userId"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from Contacts where FirstName=? and LastName=? and UserID=?");
		$stmt->bind_param("ssi", $firstName, $lastName, $userID);
		$stmt->execute();
		if ( $stmt->affected_rows == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $firstName, $lastName, $userID );
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
 
  	function returnWithInfo( $firstName, $lastName, $userID )
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","userId":' . $userID . '}';
		sendResultInfoAsJson( $retValue );
	}
    
?>