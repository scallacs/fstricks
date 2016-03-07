<?php

namespace App\Controller\Admin;

use App\Controller\AppController;
use App\Lib\ResultMessage;
use Cake\Core\Configure;
/**
 * VideoTags Controller
 *
 * @property \App\Model\Table\VideoTagsTable $VideoTags
 */
class VideoTagsController extends AppController {

    
    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
    }
    
    /**
     * Video tags to validate
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function index() {
        $this->Paginator->config(Configure::read('Pagination.VideoTags'));
        ResultMessage::setWrapper(false);
        try {
            $query = $this->VideoTags->findAndJoin()
                    ->select([
                        'modified' => 'VideoTags.modified',
                        'count_fake' => 'VideoTags.count_fake',
                        'count_accurate' => 'VideoTags.count_accurate',
                    ])
                    ->contain([
                        'Users' => function ($q) {
                            return $q->select([
                                    'username' => 'Users.username',
                                    'user_id' => 'Users.id'
                                ]);
                        }
                    ]);
                        
            $searchHelper = new \App\Lib\SearchHelper($this->request->query, $query);
            $searchHelper
                        ->optional('status', 'VideoTags.status', [
//                            'rule' => 'number',
                            'split' => ',',
                        ])
                        ->optional('user_id', 'VideoTags.user_id', [
//                            'rule' => 'number',
                            'condition' => '='
                        ])
                        ->optional('sports', 'Tags.sport_id', [
//                            'rule' => 'number',
                            'split' => ',',
                        ])
                        ->orders('order', [
                            'modified' => ['VideoTags.modified DESC'],
                            'created' => ['VideoTags.created DESC'],
                            'best' => ['VideoTags.count_points DESC']
                        ]);
//            debug($query->sql());
//            die();

            ResultMessage::setPaginateData(
                    $this->paginate($query), 
                    $this->request->params['paging']['VideoTags']);
        } catch (NotFoundException $e) {
            ResultMessage::overwriteData([]);
        }
    }
    

    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
//    public function view($id = null) {
//        $videoTag = $this->VideoTags->get($id, [
//            'contain' => ['Videos', 'Tags', 'Users', 'VideoTagPoints']
//        ]);
//        $this->set('videoTag', $videoTag);
//        $this->set('_serialize', ['videoTag']);
//    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
//    public function add() {
//        $videoTag = $this->VideoTags->newEntity();
//        if ($this->request->is('post')) {
//            $videoTag = $this->VideoTags->patchEntity($videoTag, $this->request->data);
//            $videoTag->user_id = $this->Auth->user('id');
//
//            if ($this->VideoTags->save($videoTag)) {
//                ResultMessage::setMessage(__(ResultMessage::MESSAGE_SAVED));
//            } else {
//                ResultMessage::addValidationErrorsModel($videoTag, true);
//            }
//        }
//    }

    /**
     * Edit method
     *
     * @param string|null $id Video Tag id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        try {
            $videoTag = $this->VideoTags->get($id);
            if ($this->request->is(['patch', 'post', 'put'])) {
                
                $videoTag = $this->VideoTags->patchEntity($videoTag, $this->request->data, 
                    ['accessibleFields' => ['status' => true]]);
                
                if ($this->VideoTags->save($videoTag)) {
                    ResultMessage::setMessage(__('The video tag has been saved.'), true);
                } else {
                    ResultMessage::setMessage(__('The video tag could not be saved. Please, try again.'), false);
                }
            }
        } 
        catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
            throw new \Cake\Network\Exception\NotFoundException();
        }
    }

    /**
     * Delete method
     *
     * @param string|null $id Video Tag id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $videoTag = $this->VideoTags->get($id);
        if ($this->VideoTags->delete($videoTag)) {
            ResultMessage::setMessage(__('The video tag has been deleted.'), true);
        } else {
            ResultMessage::setMessage(__('The video tag could not be deleted. Please, try again.'), false);
        }
    }

}
