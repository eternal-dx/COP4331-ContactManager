<?php
	$inData = getRequestInfo();
	
	$firstname = $inData["firstName"];
	$lastname = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss",$firstname,$lastname,$login,$password);
		$stmt->execute();
		$newID = $conn->insert_id;
		$stmt->close();
		$conn->close();
		returnWithInfo($newID, $firstname, $lastname, $login, $password);
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
 
  function returnWithInfo( $newID, $firstname, $lastname, $login, $password )
	{
		$retValue = '{"ID":' . $newID . ',"firstName":"' . $firstname . '","lastName":"' . $lastname . '","login":"' . $login . '","password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
