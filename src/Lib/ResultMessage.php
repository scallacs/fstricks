<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * TODO lighters
 */

namespace App\Lib;

/**
 * Description of ResultMessage
 *
 * @author stephane
 */
class ResultMessage {
    
    const MESSAGE_SAVED = 'Everything is saved!';
    const MESSAGE_VALIDATION_ERRORS = 'Your form has some errors, please correct required fields.';

    /**
     * True if the Json message is sent insinde a wrapper with meta data
     * @var bool 
     */
    public static $wrapper = true;

    /**
     * Feedback message displayed. If null, ?
     * @var string 
     */
    public static $message = null;

    /**
     * True if the query succeeded, false otherwise
     * @var boolean 
     */
    public static $success = false;

    /**
     * For OAuth
     * @var type 
     */
    public static $token = false;

    /**
     * Json data
     * @var array 
     */
    public static $data = array();

    /**
     * Return code
     * @var int 
     */
    public static $returnCode = 0;

    /**
     * Use setter setStepSuccess() and setStepError()
     * Exemple: 
     * array(
     *      0 => array(
     *          'type' => 'success',
     *          'message' => 'Step 1 done!'
     *      ),
     *      1 => array(
     *          'type' => 'error',
     *          'message' => 'Step 2 failed!'
     *      )
     * )
     * 
     * A JS function will display the steps. You can set the type as you want. 
     * The two default types are 'success' and 'error'. The default css for this 
     * two types is defined by the class 'message-feedback-step-TYPE'.
     * 
     * See js function buildDetailsMessage()
     * 
     * @var array 
     */
    public static $details = array();

    /**
     * Add trace (only seen for developers not on release)
     * @var array 
     */
    public static $trace = array();

    /**
     * Use for cakephp Form
     * @var array 
     */
    public static $validationErrors = array();

    /**
     * Redirect URL
     * @var array or string 
     */
    public static $redirectUrl = false;

    public static function setReturnCode($nb) {
        self::$returnCode = $nb;
    }

    public static function setValidationErrors($errors) {
        self::$validationErrors += $errors;
    }

    public static function redirectToLastPage() {
        self::$redirectUrl = null;
    }

    public static function noRedirect() {
        self::$redirectUrl = false;
    }

    public static function addValidationErrorsModel(\Cake\ORM\Entity $entity, $autoMessage = false) {
        self::$validationErrors[$entity->source()] = $entity->errors();
        if ($autoMessage){
            self::setMessage(__(self::MESSAGE_VALIDATION_ERRORS), false);
        }
    }

    public static function setRedirectUrl($url) {
        self::$redirectUrl = $url;
    }

    public static function setSuccess($value = true) {
        self::$success = $value;
    }

    public static function getSuccess() {
        return self::$success;
    }

    public static function getRedirectUrl() {
        return self::$redirectUrl;
    }

    public static function setMessage($msg, $success = null) {
        self::$message = $msg;
        if ($success !== null) {
            self::setSuccess($success);
        }
    }

    public static function addMessage($msg) {
        self::$message .= $msg;
    }

    public static function setData($key, $value) {
        self::$data[$key] = $value;
    }

    public static function setToken($value) {
        self::$data['token'] = $value;
        self::$token = $value;
    }

    public static function overwriteData($value) {
        self::$data = $value;
    }

    public static function addStepError($msg) {
        self::$details[] = array(
            'type' => 'error',
            'message' => $msg
        );
    }

    public static function addStepsError($errors) {
        foreach ($errors as $msg) {
            self::addStepError($msg);
        }
    }

    public static function addStepSuccess($msg) {
        self::$details[] = array(
            'type' => 'success',
            'message' => $msg
        );
    }

    public static function addStepsSuccess($msgs) {
        foreach ($msgs as $msg)
            self::$addStepSuccess($msg);
    }

    public static function addTrace($msg) {
        if (is_array($msg)) {
            foreach ($msg as $m)
                self::$trace[] = $m;
        } else
            self::$trace[] = $msg;
    }

    public static function reset() {
        self::$success = false;
        self::$returnCode = 0;
        self::$message = 'No message defined';
        self::$details = array();
        self::$trace = array();
        self::$data = array();
        self::$redirectUrl = array();
        self::$validationErrors = array();
        self::$token = false;
    }

    public static function toArray() {
        $data = array(
            'success' => self::$success,
            'returnCode' => self::$returnCode,
            'message' => self::$message,
            'details' => self::$details,
            'trace' => self::$trace,
            'data' => self::$data,
            'error' => self::generateErrorMsg(),
            'redirectUrl' => self::$redirectUrl,
            'validationErrors' => self::$validationErrors
        );
        if (self::$token) {
            $data['token'] = self::$token;
        }
        return $data;
    }

    public static function setWrapper($val) {
        self::$wrapper = $val;
    }

    public static function hasWrapper() {
        return self::$wrapper;
    }

    private static function generateErrorMsg() {
        if (self::$success) {
            return null;
        }
        $res = self::$message;
        if (!empty(self::$details)) {
            //$res += ' - ';
            foreach (self::$details as $msg) {
                $res .= ' - ' . $msg['message'];
            }
        }
        return $res;
    }

}
