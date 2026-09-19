<?php

class MailHelper {
    public static $lastError = '';
    public static $smtpDebugLog = '';

    private static $defaultEmail = 'test.allysoftsolutions@gmail.com';
    private static $defaultPasskey = 'sowm fxar lzhf endf';
    private static $defaultUrl = 'https://silverapi.allysoftsolutions.com/email/email-service';
    private static $defaultFromName = 'Ally Soft Solutions';

    private static function loadEnv() {
        if (getenv('EMAIL_SERVICE_EMAIL') === false) {
            $envPath = dirname(__DIR__) . '/.env';
            if (file_exists($envPath)) {
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (empty($line) || strpos($line, '#') === 0) {
                        continue;
                    }
                    $parts = explode('=', $line, 2);
                    if (count($parts) === 2) {
                        $name = trim($parts[0]);
                        $value = trim($parts[1]);
                        putenv("{$name}={$value}");
                        $_ENV[$name] = $value;
                        $_SERVER[$name] = $value;
                    }
                }
            }
        }
    }

    public static function sendOtp($to, $otp) {
        $subject = "Your Verification Code: $otp";
        $message = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>
                <h2 style='color: #d48312;'>Password Recovery</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your Ally Soft Solutions admin panel. Use the following 4-digit code to verify your identity:</p>
                <div style='background: #111111; border: 1px solid #222222; padding: 20px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #f5a623; border-radius: 8px; margin: 20px 0;'>
                    $otp
                </div>
                <p style='color: #6B7A99; font-size: 14px;'>This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
                <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;'>
                <p style='color: #6B7A99; font-size: 12px; text-align: center;'>&copy; " . date('Y') . " Ally Soft Solutions. All rights reserved.</p>
            </div>
        ";

        return self::sendEmailApi($to, $subject, $message);
    }

    private static function getAbsoluteLogoUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        $logoPath = '/logo-white.png';
        
        try {
            $dbPath = __DIR__ . '/../database/ally.sqlite';
            if (file_exists($dbPath)) {
                $pdo = new PDO('sqlite:' . $dbPath);
                $stmt = $pdo->query("SELECT logo FROM navbar_section LIMIT 1");
                $dbLogo = $stmt ? $stmt->fetchColumn() : null;
                if (!empty($dbLogo)) {
                    $logoPath = $dbLogo;
                }
            }
        } catch (Exception $e) {}

        if (php_sapi_name() === 'cli') {
            return $protocol . $host . $logoPath;
        }
        
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        $contextDir = '';
        $pos = strpos($scriptName, '/server/public/');
        if ($pos !== false) {
            $contextDir = substr($scriptName, 0, $pos);
        } else {
            $contextDir = preg_replace('/public\/.*$/', '', $scriptName);
            $contextDir = rtrim($contextDir, '/');
        }
        
        if (strpos($logoPath, '/upload/') === 0 || strpos($logoPath, 'upload/') === 0) {
            $cleanLogoPath = '/' . ltrim($logoPath, '/');
            return $protocol . $host . $contextDir . '/server/public' . $cleanLogoPath;
        }

        return $protocol . $host . $contextDir . '/' . ltrim($logoPath, '/');
    }

    private static function getLogoHtml() {
        $logoUrl = self::getAbsoluteLogoUrl();
        return '
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                    <td>
                        <img src="' . $logoUrl . '" alt="Ally Soft Solutions Logo" style="height: 50px; width: auto; display: block; outline: none; border: none; max-width: 250px;" />
                    </td>
                </tr>
            </table>
        ';
    }

    public static function sendSubmissionNotification($to, $name, $email, $subjectField, $messageContent) {
        $subject = "New Contact Enquiry: $name ($subjectField)";
        $safeName = htmlspecialchars($name);
        $safeEmail = htmlspecialchars($email);
        $safeSubject = htmlspecialchars($subjectField);
        $safeMessage = htmlspecialchars($messageContent);

        $message = "
            <div style=\"font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f4f6fc; padding: 20px 10px; margin: 0; min-height: 100%;\">
                <div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;\">
                    <!-- Header Banner -->
                    <div style=\"background: linear-gradient(135deg, #050505 0%, #161616 100%); padding: 30px 20px; text-align: center; border-bottom: 4px solid #f5a623;\">
                        <span style=\"color: #FFFFFF; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;\">New Enquiry Received</span>
                    </div>
                    
                    <!-- Content -->
                    <div style=\"padding: 25px 20px; color: #1A1A2E; line-height: 1.7;\">
                        <h2 style=\"color: #050505; margin-top: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3;\">A new contact form request has been submitted!</h2>
                        <p style=\"font-size: 15px; color: #4B5563; margin-top: 15px; margin-bottom: 25px;\">Hello Admin,</p>
                        <p style=\"font-size: 15px; color: #4B5563; margin-bottom: 25px;\">A visitor has filled out the contact form on your website. Here are the details:</p>
                        
                        <!-- Details Ticket Card -->
                        <div style=\"background-color: #FFFDF5; border-left: 4px solid #f5a623; border-radius: 10px; padding: 16px; margin: 30px 0; border-top: 1px solid #FDF3D0; border-right: 1px solid #FDF3D0; border-bottom: 1px solid #FDF3D0;\">
                            <h4 style=\"color: #B48A00; margin: 0 0 20px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;\">Enquiry Ticket Details</h4>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #F3ECCD; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #8C7330; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Visitor Name</div>
                                <div style=\"font-size: 15px; color: #050505; font-weight: 700; word-break: break-word;\">{$safeName}</div>
                            </div>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #F3ECCD; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #8C7330; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Email Address</div>
                                <div style=\"font-size: 15px; color: #f5a623; font-weight: 600; word-break: break-all;\">
                                    <a href=\"mailto:{$safeEmail}\" style=\"color: #f5a623; text-decoration: none; word-break: break-all;\">{$safeEmail}</a>
                                </div>
                            </div>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #F3ECCD; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #8C7330; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Subject</div>
                                <div style=\"font-size: 15px; color: #050505; font-weight: 700; word-break: break-word;\">{$safeSubject}</div>
                            </div>
                            
                            <div>
                                <div style=\"font-size: 11px; color: #8C7330; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Message</div>
                                <div style=\"font-size: 14px; color: #1A1A2E; font-style: italic; line-height: 1.5; word-break: break-word;\">\"{$safeMessage}\"</div>
                            </div>
                        </div>
                        
                        <!-- Quick Response Actions -->
                        <p style=\"font-size: 14px; color: #6B7A99; margin-bottom: 15px; font-weight: 600;\">Quick Response Actions:</p>
                        <div style=\"margin-bottom: 20px;\">
                            <a href=\"mailto:{$safeEmail}\" style=\"display: block; text-align: center; background-color: #f5a623; color: #050505; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 700;\">
                                ✉️ Email Customer
                            </a>
                        </div>
                        
                        <hr style=\"border: 0; border-top: 1px solid #E2E8F0; margin: 35px 0;\" />
                        <p style=\"font-size: 12px; color: #94A3B8; text-align: center; margin: 0;\">This is an automated notification from the Ally Soft Solutions website portal.</p>
                    </div>
                </div>
            </div>
        ";

        return self::sendEmailApi($to, $subject, $message);
    }

    public static function sendSubmissionConfirmation($to, $name, $email, $subjectField, $messageContent, $ownerEmail = null) {
        $subject = "Thank you for contacting Ally Soft Solutions";
        $safeName = htmlspecialchars($name);
        $safeEmail = htmlspecialchars($email);
        $safeSubject = htmlspecialchars($subjectField);
        $safeMessage = htmlspecialchars($messageContent);
        $year = date('Y');
        
        $logoHtml = self::getLogoHtml();

        $message = "
            <div style=\"font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f4f6fc; padding: 20px 10px; margin: 0; min-height: 100%;\">
                <div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;\">
                    <!-- Header Banner -->
                    <div style=\"background: linear-gradient(135deg, #050505 0%, #161616 100%); padding: 30px 20px; text-align: center; border-bottom: 4px solid #f5a623;\">
                        {$logoHtml}
                    </div>
                    
                    <!-- Content -->
                    <div style=\"padding: 25px 20px; color: #1A1A2E; line-height: 1.7;\">
                        <h2 style=\"color: #050505; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3;\">Thank you for your enquiry!</h2>
                        <p style=\"font-size: 15px; color: #4B5563; margin-top: 15px; margin-bottom: 25px;\">Dear {$safeName},</p>
                        <p style=\"font-size: 15px; color: #4B5563; margin-bottom: 25px; text-align: justify;\">We have successfully received your enquiry. Our team is reviewing your requirements, and a dedicated solutions manager will contact you shortly to discuss how we can help bring your ideas to life.</p>
                        
                        <!-- Details Card -->
                        <div style=\"background-color: #F0F6FF; border-left: 4px solid #f5a623; border-radius: 10px; padding: 16px; margin: 30px 0;\">
                            <h4 style=\"color: #050505; margin: 0 0 20px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;\">Enquiry Details Summary</h4>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #6B7A99; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Your Name</div>
                                <div style=\"font-size: 15px; color: #050505; font-weight: 700; word-break: break-word;\">{$safeName}</div>
                            </div>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #6B7A99; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Email Address</div>
                                <div style=\"font-size: 15px; color: #4B5563; font-weight: 600; word-break: break-all;\">{$safeEmail}</div>
                            </div>
                            
                            <div style=\"margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;\">
                                <div style=\"font-size: 11px; color: #6B7A99; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Subject</div>
                                <div style=\"font-size: 15px; color: #4B5563; font-weight: 600; word-break: break-word;\">{$safeSubject}</div>
                            </div>
                            
                            <div>
                                <div style=\"font-size: 11px; color: #6B7A99; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">Message</div>
                                <div style=\"font-size: 14px; color: #4B5563; font-style: italic; line-height: 1.5; word-break: break-word;\">\"{$safeMessage}\"</div>
                            </div>
                        </div>
                        
                        <p style=\"font-size: 15px; color: #4B5563; margin-bottom: 30px; text-align: justify;\">If you have any drawings, specifications, or immediate questions you would like to share, you can reply directly to this email or contact us at hr@allysoftsolutions.com.</p>
                        
                        <hr style=\"border: 0; border-top: 1px solid #E2E8F0; margin: 35px 0;\" />
                        <p style=\"font-size: 14px; color: #6B7A99; margin: 0; line-height: 1.6;\">Best Regards,<br><strong style=\"color: #050505;\">Client Success Team</strong><br>Ally Soft Solutions</p>
                    </div>
                </div>
            </div>
        ";

        return self::sendEmailApi($to, $subject, $message, $ownerEmail);
    }

    private static function sendEmailApi($toEmail, $subject, $body, $ownerEmail = null) {
        self::loadEnv();
        self::$smtpDebugLog = '';
        self::$lastError = '';

        $apiUrl = getenv('EMAIL_SERVICE_URL') ?: self::$defaultUrl;
        $email = getenv('EMAIL_SERVICE_EMAIL') ?: self::$defaultEmail;
        $passkey = getenv('EMAIL_SERVICE_PASSKEY') ?: self::$defaultPasskey;
        
        $senderName = self::$defaultFromName;

        $postData = [
            'To' => $toEmail,
            'subject' => $subject,
            'body' => $body,
            'senderName' => $senderName,
            'from' => $email
        ];

        if (!empty($ownerEmail)) {
            $postData['replyTo'] = $ownerEmail;
            $postData['ReplyTo'] = $ownerEmail;
        }

        $headers = [
            "email: " . $email,
            "passkey: " . $passkey,
            "Content-Type: application/json"
        ];

        $headersString = implode("\r\n", $headers) . "\r\n";

        $options = [
            'http' => [
                'header'  => $headersString,
                'method'  => 'POST',
                'content' => json_encode($postData),
                'timeout' => 15.0,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ];

        $context = stream_context_create($options);
        $response = @file_get_contents($apiUrl, false, $context);
        
        $httpCode = 0;
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $header) {
                if (preg_match('/^HTTP\/\d\.\d\s+(\d+)/i', $header, $matches)) {
                    $httpCode = intval($matches[1]);
                    break;
                }
            }
        }

        if ($response === false) {
            self::$lastError = "Connection Error: Failed to perform POST stream request.";
            error_log(self::$lastError);
            return false;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            $decoded = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                if (isset($decoded['status']) && strtolower($decoded['status']) === 'error') {
                    self::$lastError = $decoded['message'] ?? 'API responded with error';
                    return false;
                }
            }
            return true;
        } else {
            self::$lastError = "API Error (HTTP " . $httpCode . "): " . $response;
            error_log(self::$lastError);
            return false;
        }
    }
}
