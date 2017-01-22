<?php

namespace App\Test\Util;

class RestApiTester {

    private $path = '';
    private $methodMap = [
        'add' => '',
        'edit' => '',
        'delete' => '',
        'view' => '', 
        'index' => ''
    ];

//    private $params;
    
    /**
     *
     * @var \App\Test\Util\MyIntegrationTestCase 
     */
    private $request;
    
    public function setPath($method, $path){
        $this->methodMap[$method] = $path;
    }

    /**
     * 
     * @var \App\Test\Util\MyIntegrationTestCase $request
     * @param string $path
     */
    public function __construct(\App\Test\Util\MyIntegrationTestCase $request, $path) {
        $this->request = $request;
        $this->path = $path;
    }

    public function url($id = '', $params = [], $method = null) {
//        $params = array_merge($this->params, $params);
        return $this->path 
                . ($method !== null ? $method.'/' : '')
                . $id . (count($params) > 0 ? '?' . http_build_query($params): '');
    }

    public function testCustom($method, $url, $data){
        $this->request->{strtolower($method)}($this->url($url, $data));
        $this->request->assertResponseOk();
        return $this->request->bodyAsJson();
    }
    public function testCustomFailure($method, $url, $data){
        $this->request->{strtolower($method)}($this->url($url, $data));
        $this->request->assertResponseFailure();
    }
    
    public function paginate($expectedFields = [], $params = [], $minRes = false, $maxRes = false) {
        $this->request->get($this->url('', $params));

        $result = $this->request->assertPaginationResult();
//        debug($result);
        $items = $result['items'];
        $this->request->assertCollection($items, $expectedFields, $minRes, $maxRes);
    }
    
    public function sync($url = '', $params = [], $options = []) {
        $this->get($url, $params, [
            'statusCode' => 200,
            'body' => [
                'type' => 'sync', 
            ] + $options
        ]);
    }

    public function testIndex($expectedFields = [], $minRes = false, $maxRes = false) {
        $this->request->get($this->url(null, null, 'index'));

        $this->request->assertResponseOk();
        $result = $this->request->bodyAsJson();
        $this->request->assertCollection($result, $expectedFields, $minRes, $maxRes);
    }

    public function testView($id, $expectedFields = []) {
        $this->request->get($this->url($id, null, 'view'));
        $this->request->assertResponseOk();
        $result = $this->request->bodyAsJson();
//        debug($result);
        $this->request->assertArrayHasKeys($expectedFields, $result);
    }

    /**
     * 
     * @param array $data
     * @param array|boolean $successOrValidationErrors
     * @param array $expectedFields
     */
    public function testAdd($data, $options) {
        \App\Lib\ResultMessage::reset();
        $this->request->post($this->url(null, null, 'add'), $data);
        $this->checkOptions($options);
    }
    
    public function testAddErrors($data, $errors, $url = ''){
        \App\Lib\ResultMessage::reset();
        $this->request->post($this->url($url, null, 'add'), $data);
        $this->checkOptions([
            'statusCode' => 400,
            'body' => [
                'type' => 'validationErrors',
                'errors' => $errors
            ]
        ]);
    }
    
    public function testValidationErrors($url, $data, $errors){
        \App\Lib\ResultMessage::reset();
        $this->request->post($this->url($url, null), $data);
        $this->checkOptions([
            'statusCode' => 400,
            'body' => [
                'type' => 'validationErrors',
                'errors' => $errors
            ]
        ]);
    }

    public function testEdit($id, $data, $success = true, $expectedFields = []) {
        $this->request->put($this->url($id), $data);
        $this->request->assertResponseOk();
        $result = $this->request->bodyAsJson();
        $this->request->assertArrayHasKeys(['success'] + $expectedFields, $result);
        $this->request->assertEquals($result['success'], $success);
    }

    public function testDelete($id, $success = true, $expectedFields = []) {
        $this->request->delete($this->url($id));
        $this->request->assertResponseOk();
        $result = $this->request->bodyAsJson();
        $this->request->assertArrayHasKeys(['success'] + $expectedFields, $result);
        $this->request->assertEquals($result['success'], $success);
    }

    
    public function post($url, $params = [], $postBody = [], $options = [], $message = ''){
        \App\Lib\ResultMessage::reset();
        $this->request->post($this->url($url,$params), $postBody);
        $this->checkOptions($options);
    }
    /**
     * 
     * @param type $url
     * @param type $parms
     * @param type $options
     */
    public function get($url, $params = [], $options = []){
        \App\Lib\ResultMessage::reset();
        $this->request->get($this->url($url,$params));
        $this->checkOptions($options);
    }
    
    private function checkOptions($options){
        if (isset($options['statusCode'])){
            $code = $options['statusCode'];
        }
        else{
            $code = 200;
        }
            
        $result = $this->request->bodyAsJson();
        if ($code < 200){
            // Nothing
        }
        else if ($code < 400){
            $this->request->assertResponseSuccess();
        }
        else if ($code < 500){
            if ($this->request->getResponse()->statusCode() == 400){
//                debug($result);
            }
            $this->request->assertResponseError();
        }
        else if ($code < 600){
            $this->request->assertResponseFailure();
        }
        $this->request->assertResponseCode($code);
        
        
        if (!empty($options['debug'])){
            debug($result);
        }
        if (isset($options['body'])){
            $bodyOptions = $options['body'];
            if (isset($bodyOptions['type'])){
                switch ($bodyOptions['type']){
                    case 'array':
                        break;
                    case 'object';
                        break;
                    case 'sync';
                        if (!empty($bodyOptions['extra'])){
                            self::compare($this->request, $result['extra'], $bodyOptions['extra']);
                        }
                        $result = $result['items'];
                        break;
                    case 'paginate':
                        $this->request->assertPaginationResult();
                        $result = $result['items'];
                        break;
                    case 'validationErrors':
                        $this->request->assertResponseCode(400);
                        $this->request->assertArrayHasKeys(['validationErrors'], $result);
                        $this->request->assertTrue(is_array($result['validationErrors']), 'Field validationErrors should be an array not: '.  print_r($result['validationErrors'], true));
                        self::compareFormErrors($this->request, $result['validationErrors'], $bodyOptions['errors']);
                        break;
                }
            }
            if (isset($bodyOptions['size'])){
                $this->request->assertCount($bodyOptions['size'], $result, 'Response: ' . print_r($result, true));
            }
            if (isset($bodyOptions['compare'])){
                self::compare($this->request, $result, $bodyOptions['compare']);
            }
            if (isset($bodyOptions['eachRow'])){
                foreach ($result as $row){
                    self::compare($this->request, $row, $bodyOptions['eachRow']);
                }
            }
        }
    }
    
    
    // =========================================================================
    
//    public function addParam($name, $value){
//        $this->params[$name] = $value;
//    }
    
    public static function compare(\Cake\TestSuite\TestCase $test, $data, array $fields, $message = '') {
        self::compareArray($test, $data, $fields, $message);
    }
    
    /**
     * [
     *      'A', // means field a require
     *      '!A', // means we must not have the field have
     *      'A' => 'value', // means we must not have the field A equals to
     *      'A' => function($field, $value){} // custom function
     * ]
     * @param \Cake\TestSuite\TestCase $test
     * @param array $data
     * @param array $fields
     * @param type $message
     */
    private static function compareArray(\Cake\TestSuite\TestCase $test, array $data, array $fields, $message = '') {
//        $responseMsg = 'Response: ' . print_r($test->bodyAsJson(), true);
        $responseMsg = '';
        foreach ($fields as $keyOrField => $fieldOrValue){
            //debug($keyOrField . ' => ' . $fieldOrValue);
            $newMessage = $message.'[' . $keyOrField . ']';
            if (is_array($fieldOrValue)){
                self::compare($test, $data[$keyOrField], $fieldOrValue, $newMessage);
            }
            else if (is_numeric($keyOrField)){
                $newMessage = $message.'[' . $fieldOrValue . ']';
                $test->assertTrue(is_array($data), $newMessage . ' but data is not an array. ' . $responseMsg);
                if (strpos($fieldOrValue, '!') === 0){
                    $fieldOrValue = substr($fieldOrValue, 1);
                    $test->assertArrayNotHasKey($fieldOrValue, $data, $newMessage . $responseMsg);
                }
                else{
                    $test->assertArrayHasKey($fieldOrValue, $data, $newMessage . $responseMsg);
                }
            }
            else if (is_callable($fieldOrValue)){
                $test->assertTrue($fieldOrValue($data[$keyOrField], $keyOrField, $data), $newMessage . ' value "'.$data[$keyOrField].'" not passing function test');
            }
            else{
                $test->assertEquals($fieldOrValue, $data[$keyOrField], $newMessage . '  "' . $data[$keyOrField] . '" != "' . $fieldOrValue .'"');
            }
        }
    }
    
    
    public static function compareFormErrors(\Cake\TestSuite\TestCase $test, array $data, array $fields, $message = ''){
        $test->assertArrayHasKeys($fields, $data, $message . '  Response: ' . print_r($data, true));
//        foreach ($fields as $keyOrField => $fieldOrArray){
//            if (is_array($fieldOrArray)){
//                self::compareFormErrors($test, $data[$keyOrField], $fieldOrArray, $message.'['.$keyOrField.']');
//            }
//            else{
//                $test->assertArrayHasKey($fieldOrArray, $data);
//            }
//        }
    }
}

