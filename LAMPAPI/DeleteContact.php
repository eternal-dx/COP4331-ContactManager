<?php

	$inData = getRequestInfo();

  $name = $inData["Name"];
  $id = $inData["ID"];

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from Contacts where Name=? and ID=?");
    $stmt->bind_param("si", $name, $id);
    $stmt->execute();
		$stmt->close();
		$conn->close();

    returnWithInfo($name, $id);
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
 
  function returnWithInfo( $name, $id )
	{
		$retValue = '{"Name":"' . $name . '","ID":' . $id . '}';
		sendResultInfoAsJson( $retValue );
	}
    
?>