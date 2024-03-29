<?php

namespace App\Controller\Admin;

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
    }

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->VideoTags->initFilters('admin');
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
            $query = $this->VideoTags->find('search', $this->VideoTags->filterParams($this->request->query));
            $query = $this->VideoTags->findAndJoin($query)
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


                    ResultMessage::paginate($query, $this);
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
            public function view($id = null) {
                $videoTag = $this->VideoTags->findAndJoin()
                        ->where(['VideoTags.id' => $id])
                        ->limit(1)
                        ->first();
                ResultMessage::overwriteData($videoTag);
                ResultMessage::setWrapper(false);
            }

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
//        try {
                $videoTag = $this->VideoTags->get($id);
                if ($this->request->is(['patch', 'post', 'put'])) {
                    $data = $this->request->data;
                    $videoTag = $this->VideoTags->saveWithTag($videoTag, null,
                            $data, ['rider_id', 'begin', 'end', 'tag_id', 'tag', 'status']);

                    if ($this->VideoTags->save($videoTag)) {
                        ResultMessage::setMessage(__('The video tag has been saved.'), true);
                    } else {
                        ResultMessage::setMessage(__('The video tag could not be saved. Please, try again.'), false);
                        ResultMessage::addValidationErrorsModel($videoTag);
                    }
                }
//        } catch (\Cake\Datasource\Exception\RecordNotFoundException $ex) {
//            throw new \Cake\Network\Exception\NotFoundException();
//        }
            }

            /**
             * Add method
             *
             */
            public function add() {
                if ($this->request->is(['patch', 'post'])) {

                    $data = $this->request->data;
                    $videoTag = $this->VideoTags->saveWithTag(null, $this->Auth->user('id'), $data, ['rider_id', 'begin', 'end', 'tag_id', 'tag', 'video_id']);
                    $videoTag->user_id = $this->Auth->user('id');

                    if ($this->VideoTags->save($videoTag)) {
                        ResultMessage::setMessage(__('The video tag has been added.'), true);
                    } else {
                        ResultMessage::setMessage(__('The video tag could not be added. Please, try again.'), false);
                        ResultMessage::addValidationErrorsModel($videoTag);
                    }
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

            public function updateSlug($id = null) {
                $entity = $this->VideoTags->updateSlug($id);
                if (empty($entity->errors())) {
                    ResultMessage::setMessage("Slug updated!", true);
                    ResultMessage::setData('slug', $entity->slug);
                } else {
                    ResultMessage::setMessage("Cannot update slug", false);
//            ResultMessage::addValidationErrorsModel($entity)
                }
            }

        }
        