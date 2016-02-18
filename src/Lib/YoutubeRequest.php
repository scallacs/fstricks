<?php

namespace App\Lib;

/**
 * Youtube Data API (mainly apis for retrieving data)
 * @version 0.1
 */
class YoutubeRequest {

    private static $instance = null;
    
    /**
     * @var string
     */
    protected $youtube_key; //pass in by constructor

    /**
     * @var array
     */
    var $APIs = array(
        'videos.list' => 'https://www.googleapis.com/youtube/v3/videos',
        'search.list' => 'https://www.googleapis.com/youtube/v3/search',
        'channels.list' => 'https://www.googleapis.com/youtube/v3/channels',
        'playlists.list' => 'https://www.googleapis.com/youtube/v3/playlists',
        'playlistItems.list' => 'https://www.googleapis.com/youtube/v3/playlistItems',
        'activities' => 'https://www.googleapis.com/youtube/v3/activities',
    );

    /**
     * @var array
     */
    var $page_info = array();
    private $videoInfo = [];

    /**
     * Upload a video to youtube
     */
    public function upload($videoPath, $title, $description, $tags, $categoryId = '22', $privacyStatus = "private") {
        $snippet = new Google_Service_YouTube_VideoSnippet();
        $snippet->setTitle($title);
        $snippet->setDescription($description);
        $snippet->setTags($tags);

        // Numeric video category. See
        // https://developers.google.com/youtube/v3/docs/videoCategories/list 
        $snippet->setCategoryId($categoryId);

        // Set the video's status to "public". Valid statuses are "public",
        // "private" and "unlisted".
        $status = new Google_Service_YouTube_VideoStatus();
        $status->privacyStatus = $privacyStatus;

        // Associate the snippet and status objects with a new video resource.
        $video = new Google_Service_YouTube_Video();
        $video->setSnippet($snippet);
        $video->setStatus($status);

        // Specify the size of each chunk of data, in bytes. Set a higher value for
        // reliable connection as fewer chunks lead to faster uploads. Set a lower
        // value for better recovery on less reliable connections.
        $chunkSizeBytes = 1 * 1024 * 1024;

        // Setting the defer flag to true tells the client to return a request which can be called
        // with ->execute(); instead of making the API call immediately.
        $client->setDefer(true);

        // Create a request for the API's videos.insert method to create and upload the video.
        $insertRequest = $youtube->videos->insert("status,snippet", $video);

        // Create a MediaFileUpload object for resumable uploads.
        $media = new Google_Http_MediaFileUpload(
                $client, $insertRequest, 'video/*', null, true, $chunkSizeBytes
        );
        $media->setFileSize(filesize($videoPath));


        // Read the media file and upload it chunk by chunk.
        $status = false;
        $handle = fopen($videoPath, "rb");
        while (!$status && !feof($handle)) {
            $chunk = fread($handle, $chunkSizeBytes);
            $status = $media->nextChunk($chunk);
        }

        fclose($handle);

        // If you want to make other calls after the file upload, set setDefer back to false
        $client->setDefer(false);
    }


    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new YoutubeRequest(array('key' => \Cake\Core\Configure::read('Youtube.key')));
        }
        return self::$instance;
    }
    
    public function exists($id){
        $youtubeInfo = $this->getVideoInfo($id);
        if (empty($youtubeInfo)) return false;
        if (!$youtubeInfo->status->embeddable) return false;
        if ($youtubeInfo->status->privacyStatus !== 'public' && $youtubeInfo->status->privacyStatus !== 'unlistead') return false;
        return true;
    }

    /**
     * Constructor
     * $youtube = new Youtube(array('key' => 'KEY HERE'))
     *
     * @param array $params
     * @throws \Exception
     */
    protected function __construct($params) {
        if (is_array($params) && array_key_exists('key', $params)) {
            $this->youtube_key = $params['key'];
        } else {
            throw new \Exception('Google API key is Required, please visit http://code.google.com/apis/console');
        }
    }

    public static function urlToId($url) {
        parse_str(parse_url($url, PHP_URL_QUERY), $vars);
        return isset($vars['v']) ? $vars['v'] : $url;
    }

    public function clearVideoInfo() {
        $this->videoInfo = [];
    }

    /**
     * @param $vId
     * @return \StdClass
     * @throws \Exception
     */
    public function getVideoInfo($vId, $parts = 'id, snippet, contentDetails, player, statistics, status') {
        if (!empty($this->videoInfo[$vId])) {
            return $this->videoInfo[$vId];
        }
        $API_URL = $this->getApi('videos.list');
        $params = array(
            'id' => $vId,
            'key' => $this->youtube_key,
            'part' => $parts
        );

        $apiData = $this->api_get($API_URL, $params);
        $this->videoInfo[$vId] = $this->decodeSingle($apiData);
        return $this->videoInfo[$vId];
    }

    public function duration($videoId) {
        $data = $this->getVideoInfo($videoId);
        if (!isset($data)) {
            return 0;
        }
        return $this->toSeconds($data->contentDetails->duration);
    }

    private function toSeconds($youtube_time) {
        preg_match_all('/(\d+)/', $youtube_time, $parts);

        // Put in zeros if we have less than 3 numbers.
        if (count($parts[0]) == 1) {
            array_unshift($parts[0], "0", "0");
        } elseif (count($parts[0]) == 2) {
            array_unshift($parts[0], "0");
        }

        $sec_init = $parts[0][2];
        $seconds = $sec_init % 60;
        $seconds_overflow = floor($sec_init / 60);

        $min_init = $parts[0][1] + $seconds_overflow;
        $minutes = ($min_init) % 60;
        $minutes_overflow = floor(($min_init) / 60);

        $hours = $parts[0][0] + $minutes_overflow;

        return ($hours * 3600) + ($minutes * 60) + $seconds;
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
            'part' => 'id, snippet',
            'maxResults' => $maxResults
        );
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
    public function searchVideos($q, $maxResults = 10, $order = null) {
        $params = array(
            'q' => $q,
            'type' => 'video',
            'part' => 'id, snippet',
            'maxResults' => $maxResults
        );
        if (!empty($order)) {
            $params['order'] = $order;
        }

        return $this->searchAdvanced($params);
    }

    /**
     * Search only videos in the channel
     *
     * @param  string $q
     * @param  string $channelId
     * @param  integer $maxResults
     * @param  string $order
     * @return object
     */
    public function searchChannelVideos($q, $channelId, $maxResults = 10, $order = null) {
        $params = array(
            'q' => $q,
            'type' => 'video',
            'channelId' => $channelId,
            'part' => 'id, snippet',
            'maxResults' => $maxResults
        );
        if (!empty($order)) {
            $params['order'] = $order;
        }

        return $this->searchAdvanced($params);
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
        $API_URL = $this->getApi('search.list');

        if (empty($params) || !isset($params['q'])) {
            throw new \InvalidArgumentException('at least the Search query must be supplied');
        }

        $apiData = $this->api_get($API_URL, $params);
        if ($pageInfo) {
            return array(
                'results' => $this->decodeList($apiData),
                'info' => $this->page_info
            );
        } else {
            return $this->decodeList($apiData);
        }
    }

    /**
     * Generic Search Paginator, use any parameters specified in
     * the API reference and pass through nextPageToken as $token if set.
     *
     * @param $params
     * @param $token
     * @return array
     */
    public function paginateResults($params, $token = null) {
        if (!is_null($token))
            $params['pageToken'] = $token;
        if (!empty($params))
            return $this->searchAdvanced($params, true);
    }

    /**
     * @param $username
     * @return \StdClass
     * @throws \Exception
     */
    public function getChannelByName($username, $optionalParams = false) {
        $API_URL = $this->getApi('channels.list');
        $params = array(
            'forUsername' => $username,
            'part' => 'id,snippet,contentDetails,statistics,invideoPromotion'
        );
        if ($optionalParams) {
            $params = array_merge($params, $optionalParams);
        }
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeSingle($apiData);
    }

    /**
     * @param $id
     * @return \StdClass
     * @throws \Exception
     */
    public function getChannelById($id, $optionalParams = false) {
        $API_URL = $this->getApi('channels.list');
        $params = array(
            'id' => $id,
            'part' => 'id,snippet,contentDetails,statistics,invideoPromotion'
        );
        if ($optionalParams) {
            $params = array_merge($params, $optionalParams);
        }
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeSingle($apiData);
    }

    /**
     * @param $channelId
     * @param array $optionalParams
     * @return array
     * @throws \Exception
     */
    public function getPlaylistsByChannelId($channelId, $optionalParams = array()) {
        $API_URL = $this->getApi('playlists.list');
        $params = array(
            'channelId' => $channelId,
            'part' => 'id, snippet, status'
        );
        if ($optionalParams) {
            $params = array_merge($params, $optionalParams);
        }
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeList($apiData);
    }

    /**
     * @param $id
     * @return \StdClass
     * @throws \Exception
     */
    public function getPlaylistById($id) {
        $API_URL = $this->getApi('playlists.list');
        $params = array(
            'id' => $id,
            'part' => 'id, snippet, status'
        );
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeSingle($apiData);
    }

    /**
     * @param $playlistId
     * @return array
     * @throws \Exception
     */
    public function getPlaylistItemsByPlaylistId($playlistId, $maxResults = 50) {
        $API_URL = $this->getApi('playlistItems.list');
        $params = array(
            'playlistId' => $playlistId,
            'part' => 'id, snippet, contentDetails, status',
            'maxResults' => $maxResults
        );
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeList($apiData);
    }

    /**
     * @param $channelId
     * @return array
     * @throws \Exception
     */
    public function getActivitiesByChannelId($channelId) {
        if (empty($channelId)) {
            throw new \InvalidArgumentException('ChannelId must be supplied');
        }
        $API_URL = $this->getApi('activities');
        $params = array(
            'channelId' => $channelId,
            'part' => 'id, snippet, contentDetails'
        );
        $apiData = $this->api_get($API_URL, $params);
        return $this->decodeList($apiData);
    }

    /**
     * Parse a youtube URL to get the youtube Vid.
     * Support both full URL (www.youtube.com) and short URL (youtu.be)
     *
     * @param  string $youtube_url
     * @throws \Exception
     * @return string Video Id
     */
    public static function parseVIdFromURL($youtube_url) {
        if (strpos($youtube_url, 'youtube.com')) {
            $params = static::_parse_url_query($youtube_url);
            return $params['v'];
        } else if (strpos($youtube_url, 'youtu.be')) {
            $path = static::_parse_url_path($youtube_url);
            $vid = substr($path, 1);
            return $vid;
        } else {
            throw new \Exception('The supplied URL does not look like a Youtube URL');
        }
    }

    /**
     * Get the channel object by supplying the URL of the channel page
     *
     * @param  string $youtube_url
     * @throws \Exception
     * @return object Channel object
     */
    public function getChannelFromURL($youtube_url) {
        if (strpos($youtube_url, 'youtube.com') === false) {
            throw new \Exception('The supplied URL does not look like a Youtube URL');
        }

        $path = static::_parse_url_path($youtube_url);
        if (strpos($path, '/channel') === 0) {
            $segments = explode('/', $path);
            $channelId = $segments[count($segments) - 1];
            $channel = $this->getChannelById($channelId);
        } else if (strpos($path, '/user') === 0) {
            $segments = explode('/', $path);
            $username = $segments[count($segments) - 1];
            $channel = $this->getChannelByName($username);
        } else {
            throw new \Exception('The supplied URL does not look like a Youtube Channel URL');
        }

        return $channel;
    }

    /*
     *  Internally used Methods, set visibility to public to enable more flexibility
     */

    /**
     * @param $name
     * @return mixed
     */
    public function getApi($name) {
        return $this->APIs[$name];
    }

    /**
     * Decode the response from youtube, extract the single resource object.
     * (Don't use this to decode the response containing list of objects)
     *
     * @param  string $apiData the api response from youtube
     * @throws \Exception
     * @return \StdClass  an Youtube resource object
     */
    public function decodeSingle(&$apiData) {
        $resObj = json_decode($apiData);
        if (isset($resObj->error)) {
            $msg = "Error " . $resObj->error->code . " " . $resObj->error->message;
            if (isset($resObj->error->errors[0])) {
                $msg .= " : " . $resObj->error->errors[0]->reason;
            }
            throw new \Exception($msg);
        } else {
            $itemsArray = $resObj->items;
            if (!is_array($itemsArray) || count($itemsArray) == 0) {
                return false;
            } else {
                return $itemsArray[0];
            }
        }
    }

    /**
     * Decode the response from youtube, extract the list of resource objects
     *
     * @param  string $apiData response string from youtube
     * @throws \Exception
     * @return array Array of StdClass objects
     */
    public function decodeList(&$apiData) {
        $resObj = json_decode($apiData);
        if (isset($resObj->error)) {
            $msg = "Error " . $resObj->error->code . " " . $resObj->error->message;
            if (isset($resObj->error->errors[0])) {
                $msg .= " : " . $resObj->error->errors[0]->reason;
            }
            throw new \Exception($msg);
        } else {
            $this->page_info = array(
                'resultsPerPage' => $resObj->pageInfo->resultsPerPage,
                'totalResults' => $resObj->pageInfo->totalResults,
                'kind' => $resObj->kind,
                'etag' => $resObj->etag,
            );
            if (isset($resObj->nextPageToken)) {
                $this->page_info['nextPageToken'] = $resObj->nextPageToken;
            }

            $itemsArray = $resObj->items;
            if (!is_array($itemsArray) || count($itemsArray) == 0) {
                return false;
            } else {
                return $itemsArray;
            }
        }
    }

    /**
     * Using CURL to issue a GET request
     *
     * @param $url
     * @param $params
     * @return mixed
     * @throws \Exception
     */
    public function api_get($url, $params) {
        //set the youtube key
        $params['key'] = $this->youtube_key;

        //boilerplates for CURL
        $tuCurl = curl_init();
        curl_setopt($tuCurl, CURLOPT_URL, $url . (strpos($url, '?') === false ? '?' : '') . http_build_query($params));
        if (strpos($url, 'https') === false) {
            curl_setopt($tuCurl, CURLOPT_PORT, 80);
        } else {
            curl_setopt($tuCurl, CURLOPT_PORT, 443);
        }
        curl_setopt($tuCurl, CURLOPT_RETURNTRANSFER, 1);
        // The next line remove ssl connection (TODO remove for deployment)
        curl_setopt($tuCurl, CURLOPT_SSL_VERIFYPEER, false);
        $tuData = curl_exec($tuCurl);
        if (curl_errno($tuCurl)) {
            throw new \Exception('Curl Error : ' . curl_error($tuCurl));
        }
        return $tuData;
    }

    /**
     * Parse the input url string and return just the path part
     *
     * @param  string $url the URL
     * @return string      the path string
     */
    public static function _parse_url_path($url) {
        $array = parse_url($url);
        return $array['path'];
    }

    /**
     * Parse the input url string and return an array of query params
     * 
     * @param  string $url the URL
     * @return array      array of query params
     */
    public static function _parse_url_query($url) {
        $array = parse_url($url);
        $query = $array['query'];

        $queryParts = explode('&', $query);

        $params = array();
        foreach ($queryParts as $param) {
            $item = explode('=', $param);
            $params[$item[0]] = empty($item[1]) ? '' : $item[1];
        }
        return $params;
    }

}
