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

    public static $result = [
        'success' => false,
        'message' => null
    ];
    public static $data = [];

    /**
     * True if the Json message is sent insinde a wrapper with meta data
     * @var bool 
     */
    public static $wrapper = true;

    public static function setReturnCode($nb) {
        self::$result['returnCode'] = $nb;
    }

    public static function setValidationErrors($errors) {
        self::$result['validationErrors'] = $errors;
    }

    public static function addValidationErrorsModel(\Cake\ORM\Entity $entity, $autoMessage = false) {
        if (!isset(self::$result['validationErrors'])) {
            self::$result['validationErrors'] = [];
        }
        self::$result['validationErrors'][$entity->source()] = $entity->errors();
        if ($autoMessage) {
            self::setMessage(__(self::MESSAGE_VALIDATION_ERRORS), false);
        }
    }

    /**
    $paginateInfo = [
      'VideoTags' =>  [
          'finder' =>  'all',
          'page' =>  (int) 1,
          'current' =>  (int) 5,
          'count' =>  (int) 30,
          'perPage' =>  (int) 5,
          'prevPage' =>  false,
          'nextPage' =>  true,
          'pageCount' =>  (int) 6,
          'sort' =>  null,
          'direction' =>  false,
          'limit' =>  null,
          'sortDefault' =>  false,
          'directionDefault' =>  false
        ]
      ] 
     */
    public static function setPaginateData($results, $paginateInfo) {
        self::$wrapper = false;
        self::$data = [
            'total' => $paginateInfo['count'],
            'perPage' => $paginateInfo['perPage'],
            'items' => $results,
        ];
    }
    
    public static function setPaginateExtra($key, $value){
        if (!isset(self::$data['extra'])){
            self::$data['extra'] = [];
        }
        self::$data['extra'][$key] = $value;
    }

    public static function setSuccess($value = true) {
        self::$result['success'] = (bool) $value;
    }

    public static function setMessage($msg, $success = null) {
        self::$result['message'] = $msg;
        if ($success !== null) {
            self::setSuccess($success);
        }
    }

    public static function setData($key, $value) {
        self::$data[$key] = $value;
    }

    public static function setToken($value) {
        self::$data['token'] = $value;
//        self::$result['token'] = $value;
    }

    public static function overwriteData($value) {
        self::$data = $value;
    }

    public static function addStepError($msg) {
        if (!isset(self::$result['details'])) {
            self::$result['details'] = [];
        }
        self::$result['details'][] = array(
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
        if (!isset(self::$result['details'])) {
            self::$result['details'] = [];
        }
        self::$result['details'][] = array(
            'type' => 'success',
            'message' => $msg
        );
    }

    public static function addStepsSuccess($msgs) {
        foreach ($msgs as $msg) {
            self::addStepSuccess($msg);
        }
    }

    public static function reset() {
        self::$wrapper = true;
        self::$result = [
            'success' => false,
            'message' => null
        ];
        self::$data = [];
    }

    public static function render() {
        if (self::$wrapper) {
            if (count(self::$data) > 0) {
                self::$result['data'] = self::$data;
            }
            return self::$result;
        } else {
            return self::$data;
        }
    }

    public static function setWrapper($val) {
        self::$wrapper = $val;
    }

    public static function hasWrapper() {
        return self::$wrapper;
    }

    public static function hasMessage() {
        return isset(self::$result['message']) && self::$result['message'] !== null;
    }

}
