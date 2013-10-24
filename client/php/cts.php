<?php
/**
 * Cascading Tree Sheets PHP Sink.
 * Author: Ted Benson <eob@csail.mit.edu>
 *
 * The PHP Sink is going to receive a POST from the CTS Server with
 * the following location.
 *
 * Table of contents:
 *  1. report_result - Reports a result (success or error) as JSON.
 *  2. report_simple_error - Helper for error results.
 *  3. parse_request - Parses the incoming request from JSON.
 *  4. is_authenticated - Checks whether an incoming request should proceed.
 *  5. handle_incoming - The main() function.
 */


/*==========================================================================
 * IMPORTANT: Set your password here!
 *========================================================================== */

$MY_KEY = "changeme";

/* Returns a result of the form:
 *
 *     {
 *       success: BOOLEAN,
 *       changelist: [
 *         { name: file1 },
 *         { name: file2 }
 *       ],
 *       errorlist: [
 *         { message: file1 }
 *       ]
 *     }
 *
 * Assumption:
 *   The $result result object passed in is already of this form,
 *   and this function merely needs to encode it as JSON.
 */
function report_result($result) {
  header('Content-Type: application/json');
  echo json_encode($result);
}

/* Helper function for reporting a single error message.
 */
function report_simple_error($message) {
  report_result(array(
    "success" => false,
    "errorlist" => array(
      array("message" => $message)
    )
  ));
}

/* Parses the incoming request object into a PHP object.
 *
 * The incoming request should be JSON of the form.
 *
 *     {
 *       key: USER_KEY,
 *       fileOperations: [
 *         {
 *           action: STRING
 *           publicUrl: STRING,
 *           content: STRING
 *         }
 *       ]
 *    }
 *
 * With the following definitions:
 *   - action: "replace" or "create".
 *       Replace fails if the file does not exist.
 *       Create fails if the file already exists.
 *   - publicUrl: The URL that the author was editing in their browser.
 *   - content: The content of the NEW file.
 *
 * TODO:
 *   - This formulation does not enable upload of binary content.
 *
 * Returns:
 *   A tuple: [BOOL, OBJ], where BOOL is the error bit.
 *   -  If true, OBJ is an error message.
 *   -  If false, OBJ is the parsed body.
 */
function parse_request() 

  /* From Stack Overflow:
   * ====================
   *
   * http://stackoverflow.com/questions/8945879/how-to-get-body-of-a-post-in-php
   *
   * php://temp allows you to manage memory consumption because it will 
   * transparently switch to filesystem storage after a certain amount of data 
   * is stored (2M by default). This size can be manipulated in the php.ini 
   * file or by appending /maxmemory:NN, where NN is the maximum amount of data 
   * to keep in memory before using a temporary file, in bytes.
   *
   * Note that php://input is not available for requests specifying a 
   * Content-Type: multipart/form-data header (enctype="multipart/form-data" in 
   * HTML forms). This results from PHP already having parsed the form data 
   * into the $_POST supergobal.
   */
  try {
    $rawInput = fopen('php://input', 'r');
    $tempStream = fopen('php://temp', 'r+');
    stream_copy_to_stream($rawInput, $tempStream);
    rewind($tempStream);
    $body = stream_get_contents($tempStream);
  
    // Now interpret the body as a JSON object and parse to a PHP array.
    $input= json_decode( $body, TRUE ); //convert JSON into array
    return Array(false, $input);
  } catch (Exception $e) {
    return Array(true, $e->getMessage()); 
  }
}

/* Decides whether this attempted push is a valid one.
 *
 * The following criteria are used:
 * -  Is request.key equal to $MY_KEY
 *
 * Assumptions:
 *   $request is a valid PHP dictionary object that does not need to be
 *   checked for null/undefined.
 *
 * Args:
 *   A tuple: [BOOL, message], where BOOL is whether the user is authenticated.
 *   If not authenticated, message contains an error string.
 *
 */
function is_authenticated($request) {
  $authenticated = (
    array_key_exists("key", $request) and
    ($request["key"] == $MY_KEY)
  );

  if ($authenticated) {
    return Array(true);
  } else {
    return Array(false, "Not authenticated.");
  }
}

/* Replaces $file_path with the $new_contents.
 *
 * Additionally backs up the file to disk.
 *
 * Returns:
 *   A tuple: [BOOL, message], where BOOL is whether an error occured.
 *   If an error occured, message is the error message.
 */
function replace_file($file_path, $new_contents) {

}

/* Creates $file_path with the $new_contents.
 *
 * Additionally backs up the file to disk.
 *
 * Returns:
 *   A tuple: [BOOL, message], where BOOL is whether an error occured.
 *   If an error occured, message is the error message.
 */
function create_file($file_path, $new_contents) {

}

/* The main loop: handles incoming requests.
 */
function handle_incoming() {
  $requestTuple = parse_request();
  $requestError = $requestTuple[0];
  if ($requestError == true) {
    report_simple_error($requestTuple[1]);
  } else {
    $authTuple = check_authentication();
    if ($authTuple[0]) {
      $result = incorporate_changes();
      report_result($result);
    } else {
      report_simple_error($authTuple[1]);
    }
  }
}

handle_incoming();

?>
