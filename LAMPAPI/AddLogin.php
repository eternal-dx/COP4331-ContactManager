<?php
	$inData = getRequestInfo();
	
	$firstname = $inData["firstname"];
	$lastname = $inData["lastname"];
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
		$stmt->close();

		$stmt = $conn->prepare("SELECT ID from Users where Login=$login and Password=$password ORDER BY ID DESC LIMIT 1");
		$newID = $stmt->execute();

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
		$retValue = '{"newID":"' . $newID . '","firstname":"' . $firstname . '","lastname":"' . $lastname . '","login":"' . $login . '","password":"' . $password . '","error":""}';
		# $retValue = '{"firstname":"' . $firstname . '","lastname":"' . $lastname . '","login":"' . $login . '","password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
