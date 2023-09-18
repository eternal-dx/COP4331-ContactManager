<?php

	$inData = getRequestInfo();

    $newName = $inData["newName"];
    $newPhone = $inData["newPhone"];
    $newEmail = $inData["newEmail"];
    $userID = $inData["userId"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? where UserID=?");
        $stmt->bind_param("sssi", $newName, $newPhone, $newEmail, $userID);
        $stmt->execute();
		$deleted_rows = $stmt->affected_rows;
		if ( $deleted_rows == 0 )
		{
			returnWithError( "No entry with that name and userId found." );
		}
		else
		{
			returnWithInfo( $newName, $newPhone, $newEmail, $userID );
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

	function returnWithInfo( $contact, $phone, $email, $userID )
	{
		$retValue = '{"contact":"' . $contact . '","newPhone":"' . $phone . '","newEmail":"' . $email . '","userID":' . $userID . '}';
		sendResultInfoAsJson( $retValue );
	}
    
?>