<?php

	$inData = getRequestInfo();

    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
    $newPhone = $inData["newPhone"];
    $newEmail = $inData["newEmail"];
    $userID = $inData["userId"];
	$ID = $inData["ID"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? where UserID=? and ID=?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $newPhone, $newEmail, $userID, $ID);
        $stmt->execute();
		$stmt->close();
		$conn->close();

        returnWithInfo($firstName, $lastName, $newPhone, $newEmail, $userID);
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

	function returnWithInfo( $firstName, $lastName, $phone, $email, $userID )
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","newPhone":"' . $phone . '","newEmail":"' . $email . '","userID":' . $userID . '}';
		sendResultInfoAsJson( $retValue );
	}
    
?>