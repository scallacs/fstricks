<?php

namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;

/**
 * Playlists Controller
 *
 * @property \App\Model\Table\PlaylistsTable $Playlists
 */
class PlaylistsController extends AppController {

    public function beforeFilter(\Cake\Event\Event $event) {
        parent::beforeFilter($event);
        $this->Auth->allow(['index', 'view', 'search']);
    }

    /**
     * Playlists created by the user
     *
     * @return void
     */
    public function user() {
//        $this->Paginator->config(Configure::read('Pagination.Playlists'));
        $query = $this->Playlists
                    ->find()
                    ->where(['Playlists.user_id' => $this->Auth->user('id')])
                    ->order(['Playlists.modified DESC']);
        $data = $query->all();
//        ResultMessage::setPaginateData(
//                $this->paginate($query),
//                $this->request->params['paging']['Playlists']);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($data);
    }

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $this->Paginator->config(Configure::read('Pagination.Playlists'));
        $query = $this->Playlists->findPublic()
                ->order(['Playlists.count_points DESC']);
        ResultMessage::setPaginateData(
                $this->paginate($query),
                $this->request->params['paging']['Playlists']);
    }

    /**
     * @queryType GET
     * 
     * Return a list of the most famous tag begining by the search term $term
     * @param string $term
     */
    public function search() {
        ResultMessage::setWrapper(false);
        if ($this->request->is('get') && !empty($this->request->query['q'])) {
            $data = $this->request->query;
            $query = $this->Playlists->findPublic()
                    ->select([
                        'title' => 'Playlists.title',
                        'slug' => 'Playlists.slug',
                        'count_points' => 'Playlists.count_points',
                        'order' => 'Playlists.order',
                        'id' => 'Playlists.id',
                    ])
                    ->order(['Playlists.order DESC'])
                    ->limit(10);
            \App\Model\Table\TableUtil::multipleWordSearch($query, $data['q'], 'Playlists.title');
            ResultMessage::overwriteData($query->all());
        }
    }

    /**
     * View method
     *
     * @param string|null $id Playlist id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($slug = null) {
        $query = $this->Playlists->findPublic()
                ->limit(1)
                ->where([
            'Playlists.slug' => $slug,
            'OR' => [
                ['Playlists.status' => \App\Model\Entity\Playlist::STATUS_PUBLIC],
                ['Playlists.user_id' => $this->Auth->user('id')]
            ]
        ]);
        $data = $query->first();
        ResultMessage::overwriteData($data);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add() {
        if ($this->request->is('post')) {
            $playlist = $this->Playlists->newEntity($this->request->data);
            $playlist->user_id = $this->Auth->user('id');
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setData('playlist_id', $playlist->id);
                return;
            }
            ResultMessage::addValidationErrorsModel($playlist);
        }
        ResultMessage::setMessage("Cannot create this playlist", false);
    }

    /**
     * Edit method
     *
     * @param string|null $id Playlist id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null) {
        if ($this->request->is('post')) {
            $playlist = $this->Playlists->newEntity($this->request->data);
            $playlist->user_id = $this->Auth->user('id');
            if ($this->Playlists->save($playlist)) {
                ResultMessage::setData('playlist_id', $playlist->id);
                return;
            }
            ResultMessage::addValidationErrorsModel($playlist);
        }
        ResultMessage::setMessage("Cannot save this playlist", false);
    }

    /**
     * Delete method
     *
     * @param string|null $id Playlist id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null) {
        if ($id === null || !$this->request->is('post')) {
            ResultMessage::setSuccess(false);
            return;
        }
        $success = $this->Playlists->deleteAll([
            'id' => $id,
            'user_id' => $this->Auth->user('id')
        ]);
        if ($success) {
            ResultMessage::setMessage('This playlist has beed successfully removed', $success);
        } else {
            ResultMessage::setMessage('Sorry but you are not allowed to remove it', $success);
        }
    }

}
