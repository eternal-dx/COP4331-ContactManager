<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userID = $inData["userId"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithInfo($firstName, $lastName, $phone, $email, $userID);
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
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userId":' . $userID . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
