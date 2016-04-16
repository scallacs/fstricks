<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * Videos Controller
 *
 * @property \App\Model\Table\VideosTable $Videos
 */
class VideosController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['view', 'search', 'report_dead_link']);
    }

    /**
     * View method
     *
     * @param string|null $id Video id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        ResultMessage::setWrapper(false);
        try {
            $video = $this->Videos->get($id, [
                'conditions' => [
                    'Videos.status' => \App\Model\Entity\Video::STATUS_PUBLIC
                ],
                'contain' => [
                    'VideoTags' => function($q) {
                return $q
                                ->where(['VideoTags.status' => 'validated'])
                                ->order(['VideoTags.begin ASC'])
                                ->contain(['Tags' => function($q) {
                                return $q
                                        // TODO check if usefull or not ???
                                        ->select([
                                            'category_name' => 'Categories.name',
                                            'sport_name' => 'Sports.name',
                                            'tag_name' => 'Tags.name',
                                        ])
                                        ->contain(['Categories' => ['Sports']]);
                            }
                ]);
            }
                ]
            ]);
        } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
            throw new \Cake\Network\Exception\NotFoundException();
        }

        ResultMessage::overwriteData($video);
    }

    public function search() {
        ResultMessage::setWrapper(false);
        if ($this->request->is('get')) {
            $data = $this->request->query;
            if (empty($data['video_url']) || empty($data['provider_id'])) {
                return;
            }
            $query = $this->Videos->search($data['video_url'], $data['provider_id']);
            $video = $query->first();
            if (!empty($video)) {
                ResultMessage::overwriteData($video);
            }
        }
    }

    /**
     * 
     * Add a video in the db
     * Video id is validated before beging saved.
     * 
     * @queryType POST
     * @param String required videoId
     * @param String required provider
     *
     * @return ResultMessage 
     *      - data: Videos.id, Videos.video_url, Videos.provider_id
     * 
     * @success: 
     *      - Valid video id and added to database
     *      - video id is already in database 
     * @errors:
     *      - Invalid provider
     *      - Invalid vidoe id
     */
    public function add() {
        ResultMessage::setWrapper(true);
        try {
            $video = $this->Videos->newEntity();
            if ($this->request->is('post')) {
                $video = $this->Videos->patchEntity($video, $this->request->data);
                $video->user_id = $this->Auth->user('id');
                if ($this->Videos->save($video)) {
                    ResultMessage::setMessage(__('This video has been added, thanks!'), true);
                    ResultMessage::overwriteData([
                        'video_url' => $video->video_url,
                        'id' => $video->id,
                        'provider' => $video->provider_id,
                        'duration' => $video->duration
                    ]);
                } else {
                    ResultMessage::setMessage(__('This video could not added. Are you sure it\'s a valid one ?'), false);
                    ResultMessage::addValidationErrorsModel($video);
                }
            }
        } catch (Exception $ex) {
            ResultMessage::setMessage(_('We cannot reach the video provider for now. Please try again later.'), false);
        }
    }

    public function addOrGet() {

        if ($this->request->is('post')) {

            $data = $this->request->data;
            if (empty($data['video_url']) || empty($data['provider_id'])) {
                return $this->add();
            }
            $video = $this->Videos->search($data['video_url'], $data['provider_id'])->first();
            if (empty($video)) {
                return $this->add();
            }
            ResultMessage::overwriteData($video);
            ResultMessage::setMessage(__('This video has been added, thanks!'), true);
        }
    }

    /**
     * 
     * TODO add test and change to POST method 
     * @param type $videoUrl
     * @param type $provider
     * @return type
     */
    public function report_dead_link() {
        $this->request->allowMethod(['post']);
        ResultMessage::setWrapper(false);
        $provider = \App\Lib\DataUtil::getString($this->request->data, 'provider');
        $videoUrl = \App\Lib\DataUtil::getString($this->request->data, 'video_url');
        switch ($provider) {
            case 'youtube':
                $exists = \App\Lib\YoutubeRequest::instance()->exists($videoUrl);
                if (!$exists) {
                    $this->Videos->updateAll([
                        'status' => \App\Model\Entity\Video::STATUS_PRIVATE
                            ], [
                        'video_url' => $videoUrl,
                        'provider_id' => $provider
                    ]);
                    \Cake\Log\Log::write('info', 'Removing video ' . $videoUrl . ' from ' . $provider);
                }
                break;
            case 'vimeo': 
                // TODO add report dead link for vimeo video
                    \Cake\Log\Log::write('info', 'Removing video ' . $videoUrl . ' from ' . $provider);
                break;
        }
        ResultMessage::overwriteData(['success' => true]);
    }

}
