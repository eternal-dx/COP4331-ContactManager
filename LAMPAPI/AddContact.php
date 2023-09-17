<?php
	$inData = getRequestInfo();
	
	$contact = $inData["contact"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userID = $inData["userID"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (Name, Phone, Email, UserID) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $contact, $phone, $email, $userID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithInfo($contact, $phone, $email, $userID);
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
		$retValue = '{"contact":"' . $contact . '","phone":"' . $phone . '","email":"' . $email . '","userId":"' . $userID . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
