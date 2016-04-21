<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Lib;

/**
 * Description of R
 *
 * @author stephane
 */
class R {
    
    private static $result = [];
    private static $data = [];

    /**
     * True if the Json message is sent insinde a wrapper with meta data
     * @var bool 
     */
    public static $wrapper = false;
    
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
    private static function setPaginateData($results, $paginateInfo) {
        self::$wrapper = false;
        self::$data['total'] = $paginateInfo['count'];
        self::$data['perPage'] = $paginateInfo['perPage'];
        self::$data['items'] = $results;
    }
    public static function paginate($query, $context) {
        self::setPaginateData($context->Paginator->paginate($query), 
                current($context->request->params['paging']));
    }

    public static function setPaginateExtra($key, $value) {
        if (!isset(self::$data['extra'])) {
            self::$data['extra'] = [];
        }
        self::$data['extra'][$key] = $value;
    }
    

    /**
     * 
     * @param \Cake\ORM\Entity $entity
     * @param \Cake\Controller\Controller $controller
     */
    public static function addValidationErrorsModel(\Cake\ORM\Entity $entity, $controller) {
        if (!isset(self::$result['validationErrors'])) {
            self::$result['validationErrors'] = [];
        }
        self::$result['validationErrors'][$entity->source()] = $entity->errors();
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

    public static function appendMessage($msg) {
        self::$result['message'] .= $msg;
    }

    public static function setData($key, $value) {
        self::$data[$key] = $value;
    }

    public static function setToken($value) {
    }

    public static function overwriteData($value) {
        self::$data = $value;
    }


    public static function reset() {
        self::$wrapper = true;
        self::$result = [];
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


}
