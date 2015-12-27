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
        $this->Auth->allow(['view', 'search']);
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
        $video = $this->Videos->get($id, [
            'contain' => [
                'VideoTags' => function($q){
                    return $q->where(['VideoTags.status' => 'validated'])
                            ->contain(['Tags' => function($q){
                            return $q
                                    ->select([
                                        'category_name' => 'Categories.name',
                                        'sport_name' => 'Sports.name',
                                        'tag_name' => 'Tags.name',
                                    ])
                                    ->contain(['Sports', 'Categories']);
                        }
                    ]);
                }
            ]
        ]);

        ResultMessage::overwriteData($video);
    }

    public function search() {
        ResultMessage::setWrapper(false);
        if ($this->request->is('get')) {
            $data = $this->request->query;
            if (!empty($data['video_url']) || !empty($data['provider_id'])) {
                return;
            }
            $video = $this->Videos->search($data['video_url'], $data['provider_id']);
            ResultMessage::overwriteData($video->first());
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
                    ResultMessage::setMessage(__('The video has been saved.'), true);
                    ResultMessage::overwriteData([
                        'video_url' => $video->video_url,
                        'id' => $video->id,
                        'provider' => $video->provider_id
                    ]);
                } else {
                    ResultMessage::setMessage(__('The video could not be saved. Please, try again.'), false);
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
            if (empty($data['video_url']) || empty($data['provider_id'])){
                return $this->add();
            }
            $video = $this->Videos->search($data['video_url'], $data['provider_id'])->first();
            if (empty($video)){
                return $this->add();
            }
            ResultMessage::overwriteData($video);
            ResultMessage::setMessage("The video is already existing", true);
        }
    }

}
