<?php

	$inData = getRequestInfo();

    $newName = $inData["newName"];
    $newPhone = $inData["newPhone"];
    $newEmail = $inData["newEmail"];
    $id = $inData["ID"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Name=? and Phone=? and Email=? where ID=?");
        $stmt->bind_param("sssi", $newName, $newPhone, $newEmail, $id);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}	
    
?>