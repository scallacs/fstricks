<?php

namespace App\Controller;

use App\Lib\ResultMessage;
/**
 * Playlists Controller
 *
 * @property \App\Model\Table\PlaylistsTable $Playlists
 */
class PlaylistsController extends AppController {

    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $query = $this->find('all')
                ->order(['created']);
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Playlist id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null) {
        $playlist = $this->Playlists->get($id, [
            'contain' => ['Users', 'PlaylistVideoTags']
        ]);
        $this->set('playlist', $playlist);
        $this->set('_serialize', ['playlist']);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        $playlist = $this->Playlists->newEntity();
        if ($this->request->is('post')) {
            $playlist = $this->Playlists->patchEntity($playlist, $this->request->data);
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setMessage(__('The playlist has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The playlist could not be saved. Please, try again.'));
            }
        }
        $users = $this->Playlists->Users->find('list', ['limit' => 200]);
        $this->set(compact('playlist', 'users'));
        $this->set('_serialize', ['playlist']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Playlist id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        $playlist = $this->Playlists->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $playlist = $this->Playlists->patchEntity($playlist, $this->request->data);
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setMessage(__('The playlist has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                ResultMessage::setMessage(__('The playlist could not be saved. Please, try again.'));
            }
        }
        $users = $this->Playlists->Users->find('list', ['limit' => 200]);
        $this->set(compact('playlist', 'users'));
        $this->set('_serialize', ['playlist']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Playlist id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        $this->request->allowMethod(['post', 'delete']);
        $playlist = $this->Playlists->get($id);
        if ($this->Playlists->delete($playlist)) {
            ResultMessage::setMessage(__('The playlist has been deleted.'));
        } else {
            ResultMessage::setMessage(__('The playlist could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

}
