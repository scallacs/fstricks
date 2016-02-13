<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * VideoTags Controller
 *
 * @property \App\Model\Table\VideoTagsTable $VideoTags
 */
class VideoTagsController extends AppController {

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $this->paginate = [
            'contain' => ['Videos', 'Tags', 'Users']
        ];
        $this->set('videoTags', $this->paginate($this->VideoTags));
        $this->set('_serialize', ['videoTags']);
    }

    /**
     * View method
     *
     * @param string|null $id Video Tag id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $videoTag = $this->VideoTags->get($id, [
            'contain' => ['Videos', 'Tags', 'Users', 'VideoTagPoints']
        ]);
        $this->set('videoTag', $videoTag);
        $this->set('_serialize', ['videoTag']);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        $videoTag = $this->VideoTags->newEntity();
        if ($this->request->is('post')) {
            $videoTag = $this->VideoTags->patchEntity($videoTag, $this->request->data);
            $videoTag->user_id = $this->Auth->user('id');

            if ($this->VideoTags->save($videoTag)) {
                ResultMessage::setMessage(__('The video tag has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The video tag could not be saved. Please, try again.'), false);
            }
        }
    }

    /**
     * Edit method
     *
     * @param string|null $id Video Tag id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        try {
            $videoTag = $this->VideoTags->get($id, [
                'contain' => []
            ]);
            if ($this->request->is(['patch', 'post', 'put'])) {
                $videoTag = $this->VideoTags->patchEntity($videoTag, $this->request->data);
                if ($this->VideoTags->save($videoTag)) {
                    $this->Flash->success(__('The video tag has been saved.'));
                    return $this->redirect(['action' => 'index']);
                } else {
                    $this->Flash->error(__('The video tag could not be saved. Please, try again.'));
                }
            }
            $videos = $this->VideoTags->Videos->find('list', ['limit' => 200]);
            $tags = $this->VideoTags->Tags->find('list', ['limit' => 200]);
            $users = $this->VideoTags->Users->find('list', ['limit' => 200]);
            $this->set(compact('videoTag', 'videos', 'tags', 'users'));
            $this->set('_serialize', ['videoTag']);
        } catch (Cake\Datasource\Exception\RecordNotFoundException $ex) {
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
            $this->Flash->success(__('The video tag has been deleted.'));
        } else {
            $this->Flash->error(__('The video tag could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

}
