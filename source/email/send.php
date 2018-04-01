<?php
    // Require configuration.
    require_once("./email-config.php");
    
    // Require libraries.
    require_once("./includes/PHPMailerAutoload.php");
    

    // Sanitize inputs.
    header('Content-Type: application/json');
    $response = array(
        'success' => true,
        'errors' => array()
    );
    
    // Parse parameters.
    $name =     trim($_POST["name"]);
    $email =    trim($_POST["email"]);
    $message =  trim($_POST["message"]);

    // Check semantically correct.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = "Email failed validation.";
        $response['success'] = false;
    }

    // Check for lengths.
    if (strlen($name) < 2) {
        $response['errors']['name'] = "Name is too short (try your full name?)";
        $response['success'] = false;
    }
    if (strlen($name) > 30) {
        $response['errors']['name'] = "Name is too long (try a nickname?)";
        $response['success'] = false;
    }

    if (strlen($message) < 5) {
        $response['errors']['message'] = "Message is too short (give me something to work with!)";
        $response['success'] = false;
    }
    if (strlen($name) > 2000) {
        $response['errors']['message'] = "Message is too long (2000 max)";
        $response['success'] = false;
    }

    // Check for nullity.
    if (empty($name)) {
        $response['errors']['name'] = "Name cannot be blank (who are you?)";
        $response['success'] = false;
    }
    if (empty($email) || trim($email) == '') {
        $response['errors']['email'] = "Email cannot be blank (I want to respond!)";
        $response['success'] = false;
    }
    if (empty($message)) {
        $response['errors']['message'] = "Message cannot be blank (don't be shy!)";
        $response['success'] = false;
    }

    if (!$response['success']) {
        echo json_encode($response);
        die;
    }

    // Set up forwarder settings.
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = "ssl";
    $mail->Host = "smtp.gmail.com";
    $mail->Port = "465";
    
    // Details.
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->SetFrom($username);
    $mail->Subject = "Jargonify Contact - $name";
    $mail->Body = "From: $email, Name: $name\rMessage: \n$message";
    $mail->AddAddress($forwarding_address);
    
    $mail->Send();

    echo json_encode($response);
?>