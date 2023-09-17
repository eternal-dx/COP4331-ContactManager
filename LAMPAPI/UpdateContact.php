<?php

	$inData = getRequestInfo();

    $newName = $inData["newName"];
    $newPhone = $inData["newPhone"];
    $newEmail = $inData["newEmail"];
    $userID = $inData["userID"];

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
		$stmt->close();
		$conn->close();

        returnWithInfo($newName, $newPhone, $newEmail, $userID);
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