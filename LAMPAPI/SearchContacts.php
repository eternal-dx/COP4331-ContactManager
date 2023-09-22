<?php

	$inData = getRequestInfo();
	
	$firstNameResults = "";
	$lastNameResults = "";
	$phoneResults = "";
	$emailResults = "";
	$idResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Test", "TestUser", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select ID, FirstName, LastName, Phone, Email from Contacts where (FirstName like ? or LastName like ?) and UserID=?");
		$contactFirstName = "%" . $inData["firstName"] . "%";
		$contactLastName = "%" . $inData["lastName"] . "%";
		$stmt->bind_param("sss", $contactFirstName, $contactLastName, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$firstNameResults .= ",";
				$lastNameResults .= ",";
				$phoneResults .= ",";
				$emailResults .= ",";
				$idResults .= ",";
			}
			$searchCount++;
			$firstNameResults .= '"' . $row["FirstName"] . '"';
			$lastNameResults .= '"' . $row["LastName"] . '"';
			$phoneResults .= '"' . $row["Phone"] . '"';
			$emailResults .= '"' . $row["Email"] . '"';
			$idResults .= '"' . $row["ID"] . '"';

		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $firstNameResults, $lastNameResults, $phoneResults, $emailResults );
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstNameResults, $lastNameResults, $phoneResults, $emailResults )
	{
		$retValue = '{"name":[' . $firstNameResults . '], "lastName":[' . $lastNameResults . '], "phone":[' . $phoneResults . '], "email":[' . $emailResults . '], "ID":[' . $idResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>