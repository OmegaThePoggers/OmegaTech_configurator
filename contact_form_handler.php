<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $subject = htmlspecialchars(trim($_POST["subject"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo "Please fill in all fields.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid email format.";
        exit;
    }

    // In a real application, you would send an email here.
    // For demonstration, we'll just log it or return a success message.
    $to = "your_email@example.com"; // Replace with your actual email address
    $email_subject = "New Contact Form Submission: $subject";
    $email_body = "Name: $name
";
    $email_body .= "Email: $email
";
    $email_body .= "Message: $message
";
    $headers = "From: $email
";
    $headers .= "Reply-To: $email
";

    // Uncomment the line below to actually send the email
    // mail($to, $email_subject, $email_body, $headers);

    http_response_code(200);
    echo "Your message has been sent successfully!";

} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
