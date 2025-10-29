<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['config'])) {
        $configData = json_decode($_POST['config'], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $file = 'configurations.json';
            $currentData = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
            $currentData[] = $configData;
            file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));
            echo 'Configuration saved successfully!';
        } else {
            echo 'Error decoding configuration data.';
        }
    } elseif (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
        $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

        // In a real application, you would send an email here.
        // mail($to, $subject, $body, $headers);

        echo "Thank you for your message, {$name}. We will get back to you shortly.";

    } else {
        echo 'Invalid request.';
    }
} else {
    echo 'Invalid request method.';
}
?>