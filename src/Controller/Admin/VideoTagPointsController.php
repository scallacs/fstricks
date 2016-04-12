<?php

namespace App\Controller\Admin;

use App\Lib\ResultMessage;

/**
 * VideoTagPoints Controller
 *
 * @property \App\Model\Table\VideoTagPointsTable $VideoTagPoints
 */
class VideoTagPointsController extends AppController {

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $query = $this->VideoTagPoints->find('all');
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Video Tag Point id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $videoTagPoint = $this->VideoTagPoints->get($id, [
            'contain' => ['Users', 'VideoTags']
        ]);
        $this->set('videoTagPoint', $videoTagPoint);
        $this->set('_serialize', ['videoTagPoint']);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        $videoTagPoint = $this->VideoTagPoints->newEntity();
        if ($this->request->is('post')) {
            $videoTagPoint = $this->VideoTagPoints->patchEntity($videoTagPoint, $this->request->data);
            if ($this->VideoTagPoints->save($videoTagPoint)) {
                ResultMessage::setMessage(__('The video tag point has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The video tag point could not be saved. Please, try again.'));
            }
        }
        $users = $this->VideoTagPoints->Users->find('list', ['limit' => 200]);
        $videoTags = $this->VideoTagPoints->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('videoTagPoint', 'users', 'videoTags'));
        $this->set('_serialize', ['videoTagPoint']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Video Tag Point id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        $videoTagPoint = $this->VideoTagPoints->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $videoTagPoint = $this->VideoTagPoints->patchEntity($videoTagPoint, $this->request->data);
            if ($this->VideoTagPoints->save($videoTagPoint)) {
                ResultMessage::setMessage(__('The video tag point has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The video tag point could not be saved. Please, try again.'));
            }
        }
        $users = $this->VideoTagPoints->Users->find('list', ['limit' => 200]);
        $videoTags = $this->VideoTagPoints->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('videoTagPoint', 'users', 'videoTags'));
        $this->set('_serialize', ['videoTagPoint']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Video Tag Point id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $videoTagPoint = $this->VideoTagPoints->get($id);
        if ($this->VideoTagPoints->delete($videoTagPoint)) {
            ResultMessage::setMessage(__('The video tag point has been deleted.'));
        } else {
            ResultMessage::setMessage(__('The video tag point could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

}
