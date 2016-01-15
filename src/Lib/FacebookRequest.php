<?php

namespace App\Lib;

/**
 * Youtube Data API (mainly apis for retrieving data)
 * @version 0.1
 */
class FacebookRequest {

    /**
     * @var string
     */
    protected $key; //pass in by constructor
    protected $id; //pass in by constructor
    protected $access_token; //pass in by constructor

    /**
     * http://stackoverflow.com/questions/2263287/does-facebook-have-a-public-search-api-yet
     * @var array
     */
    var $APIs = array(
        'search' => 'https://graph.facebook.com/search',
    );

    /**
     * Constructor
     * $youtube = new Youtube(array('key' => 'KEY HERE'))
     *
     * @param array $params
     * @throws \Exception
     */
    public function __construct($params) {
        if (is_array($params) && array_key_exists('key', $params) && array_key_exists('id', $params)) {
            $this->key = $params['key'];
            $this->id = $params['id'];
            if (array_key_exists('token', $params)) {
                $this->access_token = $params['token'];
            }
        } else {
            throw new \Exception('Facebook API key is Required');
        }
    }

    /**
     * Simple search interface, this search all stuffs
     * and order by relevance
     *
     * @param $q
     * @param int $maxResults
     * @return array
     */
    public function search($q, $maxResults = 10) {
        $params = array(
            'q' => $q,
            'maxResults' => $maxResults
        );
        $params['access_token'] = $this->access_token;
        return $this->searchAdvanced($params);
    }

    /**
     * Search only videos
     *
     * @param  string $q Query
     * @param  integer $maxResults number of results to return
     * @param  string $order Order by
     * @return \StdClass  API results
     */
    public function searchPeople($q, $fields = ['id','name','picture', 'is_verified']) {
        $params = array(
            'q' => $q,
            'type' => 'user',
            'fields' => implode(',',$fields)
        );
        $params['access_token'] = $this->access_token;

        return $this->searchAdvanced($params);
    }

    /**
     * @param $name
     * @return mixed
     */
    public function getApi($name)
    {
        return $this->APIs[$name];
    }

    /**
     * Generic Search interface, use any parameters specified in
     * the API reference
     *
     * @param $params
     * @param $pageInfo
     * @return array
     * @throws \Exception
     */
    public function searchAdvanced($params, $pageInfo = false) {
        $API_URL = $this->getApi('search');
        if (empty($params) || !isset($params['q'])) {
            throw new \InvalidArgumentException('at least the Search query must be supplied');
        }
        $apiData = $this->api_get($API_URL, $params);
        return $apiData;
//        if ($pageInfo) {
//            return array(                
//                'results' => $this->decodeList($apiData),
//                'info'    => $this->page_info
//            );
//        } else {
//            return $this->decodeList($apiData);
//        }
    }

    /**
     * Generic Search Paginator, use any parameters specified in
     * the API reference and pass through nextPageToken as $token if set.
     *
     * @param $params
     * @param $token
     * @return array
     */
//    public function paginateResults($params, $token = null) {
//        if (!is_null($token))
//            $params['pageToken'] = $token;
//        if (!empty($params))
//            return $this->searchAdvanced($params, true);
//    }

    /**
     * Using CURL to issue a GET request
     *
     * @param $url
     * @param $params
     * @return mixed
     * @throws \Exception
     */
    public function api_get($url, $params) {
        $httpClient = new \Cake\Network\Http\Client();
        $data = $httpClient->get(
                $url, 
                $params, [ 
                    'type' => 'json'
                ]
            );
        if ($data->isOk()){
            return $data->json;
        }
        return false;
    }

}
